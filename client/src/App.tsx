import "./App.css";
import AddressSearch from "./components/AddressSearch";

function App() {
  return (
    <>
      <h1>Address Search</h1>
      <div className="card">
        <AddressSearch />
        <ul className="tip">
          <li>
            <span>Type 3 characters to get suggestions.</span>
          </li>
          <li>
            <span>
              Use <b>Up/Down</b> keys to navigate and <b>Enter</b> to select a suggestion.
            </span>
          </li>
          <li>
            <span>Use <b>Esc</b> key to clear the input.</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default App;
