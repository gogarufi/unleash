import "./App.css";
import AddressSearch from "./components/AddressSearch";

function App() {
  return (
    <>
      <h1>Address Search</h1>
      <div className="card">
        <AddressSearch />
        <ul className="tip">
          <li>Type 3 characters to get suggestions.</li>
          <li>
            Use <b>Up/Down</b> keys to navigate and <b>Enter</b> to select a
            suggestion.
          </li>
          <li>
            Use <b>Esc</b> key to clear the input.
          </li>
        </ul>
      </div>
    </>
  );
}

export default App;
