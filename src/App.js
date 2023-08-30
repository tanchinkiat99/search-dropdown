import React from "react";
import "./App.css";
import SearchDropdown from "./SearchDropdown/SearchDropdown";

function App() {
  return (
    <div className="App">
      <div className="box">
        <div>Async search</div>
        <SearchDropdown />
        <div>With description and custom results display</div>
        <div>Sync search</div>
        <SearchDropdown />
        <div>With default display and search on focus</div>
      </div>
    </div>
  );
}

export default App;
