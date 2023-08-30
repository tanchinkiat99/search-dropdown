import React, { useState, useEffect } from "react";
import "./SearchDropdown.css";

function SearchableDropdown({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle selecting an item from the dropdown
  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
    onSelect(item);
  };

  // Use useEffect to close the dropdown when clicking outside it
  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && !event.target.closest(".searchable-dropdown")) {
        setIsOpen(false);
      }
    }
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="searchable-dropdown">
      {/* Render the input for searching */}
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClick={() => setIsOpen(true)}
      />

      {/* Render the dropdown when it's open */}
      {isOpen && (
        <div className="dropdown">
          {/* Render filtered options based on searchQuery */}
          {/* {options
            .filter((item) =>
              item.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => handleSelect(item)}
              >
                {item}
              </div>
            ))} */}
        </div>
      )}
    </div>
  );
}

export default SearchableDropdown;
