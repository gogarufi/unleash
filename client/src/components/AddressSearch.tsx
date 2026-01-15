import { useRef, useState, useEffect, useMemo } from "react";
import styles from "./AddressSearch.module.css";
import { fetchSuggestions } from "../services/api";
import { debounce } from "../utils";

export default function AddressSearch() {
  const [search, setSearch] = useState<string>();
  
  const [activeSuggestion, setActiveSuggestion] = useState<{id: string, index: number}>();
  const [suggestions, setSuggestions] = useState<{ id: string, value: string }[]>([]);
  const suggestionRefs = useRef<Record<string, HTMLLIElement>>({});

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestion((prev) => {
          if (!prev) {
            return { id: suggestions[0].id, index: 0 };
          } else {
            const index = prev.index < suggestions.length - 1 ? prev.index + 1 : prev.index;
            return { id: suggestions[index].id, index };
          }
        });
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestion((prev) => {
          if (prev) {
            return prev.index > 0 ? { id: suggestions[prev.index - 1].id, index: prev.index - 1 } : undefined;
          }
          return undefined;
        });
        break;

      case "Enter":
        if (activeSuggestion) {
          e.preventDefault();
          setSearch(suggestions[activeSuggestion.index].value);
          updateSuggestions();
        }
        break;
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    updateSuggestions(e.target.value);
  };

  const fetchSuggestionsDebounced = useMemo(
    () =>
      debounce(async (query: string) => {
        const result = await fetchSuggestions(query);
        if (result.success) {
          setSuggestions(
            result.data.map(
              (item) => {
                const value = `${item.street} ${item.postNumber} ${item.city}`;
                return {
                  value,
                  id: btoa(value)
                }
              },
            ),
          );
        } else {
          // In this case showing error message in the UI seems unnecessary
          console.error(
            "Error fetching suggestions: ",
            result.status,
            result.error,
          );
        }
        setActiveSuggestion(undefined);
      }, 300),
    [],
  );

  const updateSuggestions = (query?: string) => {
    if (!query?.trim() || query.trim().length < 3) {
      setSuggestions([]);
      setActiveSuggestion(undefined);
      return;
    }

    fetchSuggestionsDebounced(query);
  };

  const selectSuggestion = (value: string) => {
    setSearch(value);
    updateSuggestions();
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

  useEffect(() => {
    return () => {
      fetchSuggestionsDebounced.cancel();
    };
  }, [fetchSuggestionsDebounced]);

  return (
    <div
      className={styles.searchContainer}
      onBlur={(e) =>
        e.relatedTarget?.parentElement?.id !== "suggestions" &&
        updateSuggestions()
      }
      // A11y
      role="combobox"
      aria-activedescendant={activeSuggestion && `suggestion-${activeSuggestion.index}`}
    >
      <input
        className={styles.searchInput}
        onChange={handleInput}
        onFocus={handleInput}
        onKeyDown={handleInputKeyDown}
        value={activeSuggestion ? suggestions[activeSuggestion.index].value : search}
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

      {suggestions.length > 0 && (
        <ul
          className={styles.searchSuggestions}
          // A11y
          id="suggestions"
          role="listbox"
          // Cypress
          data-cy-test-id="suggestions-ul-list"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              ref={(el) => {
                if (el) {
                  suggestionRefs.current[s.id] = el;
                } else {
                  delete suggestionRefs.current[s.id];
                }
              }}
              onClick={() => selectSuggestion(s.value)}
              tabIndex={-1}
              // A11y
              id={`suggestion-${i}`}
              role="option"
              aria-selected={i === activeSuggestion?.index}
            >
              {s.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
