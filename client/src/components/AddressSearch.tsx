import { useRef, useState, useEffect, useMemo } from "react";
import styles from "./AddressSearch.module.css";
import { fetchSuggestions } from "../services/api";
import { debounce } from "../utils";

export interface Suggestion {
  id: string,
  value: string
};

export interface Suggestions {
  data: Suggestion[];
  query: string;
};

export default function AddressSearch() {
  const [search, setSearch] = useState<string>("");
  const [activeSuggestion, setActiveSuggestion] = useState<Suggestion & { index: number }>();
  const [suggestions, setSuggestions] = useState<Suggestions>({ query: "", data: [] });
  const suggestionRefs = useRef<Record<string, HTMLLIElement>>({});

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.data.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestion((prev) => {
          if (!prev) {
            return { ...suggestions.data[0], index: 0 };
          } else {
            const index = prev.index < suggestions.data.length - 1 ? prev.index + 1 : prev.index;
            return { ...suggestions.data[index], index };
          }
        });
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestion((prev) => {
          if (prev && prev.index > 0) {
            const index = prev.index - 1
            return { ...suggestions.data[index], index };
          }
          return;
        });
        break;

      case "Enter":
        if (activeSuggestion) {
          e.preventDefault();
          selectSuggestion(suggestions.data[activeSuggestion.index].value);
        }
        break;
    }
  };
  
  const handleInputEvent = (e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    const search = e.target.value

    setSearch(search);
    
    if (search.trim().length < 3) {
      resetSuggestions();
    }
    
    const query = search.trim();
    
    if (query.length < 3 || query === suggestions.query) return;
    
    fetchSuggestionsDebounced(query);
  };

  const handleSuggestionRef = (id: string) => (e: HTMLLIElement | null) => {
    if (e) {
      suggestionRefs.current[id] = e;
    } else {
      delete suggestionRefs.current[id];
    }
  };

  // React's compiler struggles reconciling this - the warning can be ignored
  // NOTE: It is better to use 'useDebounced' from the external hooks library
  const fetchSuggestionsDebounced = useMemo(() =>
    debounce(async (query: string) => {
      const result = await fetchSuggestions(query);
      if (result.success) {
        const data = result.data.map((s) => ({
          value: `${s.street} ${s.postNumber} ${s.city}`,
          id: s.$tsid
        }));
        setSuggestions({ data, query });
      } else {
        // In this case showing error message in the UI seems unnecessary
        console.error("Error fetching suggestions: ", result.status, result.error);
      };
      setActiveSuggestion(undefined);
    }, 250),
    [],
  );
  
  const resetSuggestions = () => {
    setSuggestions({ data: [], query: "" });
    setActiveSuggestion(undefined);
  };

  const selectSuggestion = (value: string) => {
    setSearch(value);
    resetSuggestions();
  };

  useEffect(() => {
    if (activeSuggestion) {
      const ref = suggestionRefs.current[activeSuggestion.id];
      if (ref) {
        ref.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [activeSuggestion, suggestionRefs]);

  useEffect(() =>
    () => fetchSuggestionsDebounced.cancel(),
    [fetchSuggestionsDebounced]
  );

  return (
    <div
      className={styles.searchContainer}
      onBlur={(e) =>
        e.relatedTarget?.parentElement?.id !== "suggestions" &&
        resetSuggestions()
      }
      // A11y
      role="combobox"
      aria-activedescendant={activeSuggestion && `suggestion-${activeSuggestion.id}`}
    >
      <input
        className={styles.searchInput}
        onChange={handleInputEvent}
        onFocus={handleInputEvent}
        onKeyDown={handleInputKeyDown}
        value={activeSuggestion ? activeSuggestion.value : search}
        type="search"
        name="address-search"
        autoComplete="off"
        placeholder="street name, postal code, city"
        tabIndex={0}
        // A11y
        // NOTE: input with type="search" has a "searchbox" role - "textbox" by extension
        aria-controls="suggestions"
        // Cypress
        data-cy-test-id="address-search-query-input"
      />

      {suggestions.data.length > 0 && (
        <ul
          className={styles.searchSuggestions}
          // A11y
          id="suggestions"
          role="listbox"
          // Cypress
          data-cy-test-id="suggestions-ul-list"
        >
          {suggestions.data.map((s) => (
            <li
              key={s.id}
              ref={handleSuggestionRef(s.id)}
              onClick={() => selectSuggestion(s.value)}
              tabIndex={-1}
              // A11y
              id={`suggestion-${s.id}`}
              role="option"
              aria-selected={s.id === activeSuggestion?.id}
            >
              {s.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
