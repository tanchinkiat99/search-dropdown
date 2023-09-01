import React from "react";
import "./App.css";
import SearchDropdown from "./components/SearchDropdown/SearchDropdown";
import currencyData from "./data/currencies.json";

function App() {
  return (
    <div className="App">
      <div className="box">
        <SearchDropdown
          label="Async search"
          placeholder="Type to begin searching"
          description="With description and custom results display"
          options={currencyData.map((item) => item.text)}
        />
        <SearchDropdown
          label="Sync search"
          placeholder="Type to begin searching"
          description="With default display and search on focus"
          showDropdownOnFocus={true}
          options={currencyData.map((item) => item.text)}
          asyncSearch={false}
        />
      </div>
    </div>
  );
}

export default App;
