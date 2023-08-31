import React, { useState, useEffect } from "react";
import "./SearchDropdown.css";

function SearchableDropdown({
  options = [],
  onSelect = () => {},
  placeholder = "",
  label = "",
  description = "",
  showDropdownOnFocus = false,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showDropdown = () => {
    setIsOpen(true);
  };

  const hideDropdown = () => {
    setIsOpen(false);
  };

  // Handle selecting an item from the dropdown
  const handleSelect = (item) => {
    setSelectedItem(item);
    hideDropdown();
    onSelect(item);
  };

  const handleOnFocus = () => {
    if (showDropdownOnFocus) {
      showDropdown();
    }
  };

  const handleOnBlur = () => {
    hideDropdown();
  };

  const renderDropDown = () => {
    return (
      isOpen && (
        <div className="dropdown">
          {options
            // Filtering options based on search query
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
            ))}
        </div>
      )
    );
  };

  return (
    <div className="searchable-dropdown">
      <div>{label}</div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        disabled={disabled}
      />
      {renderDropDown()}
      <div>{description}</div>
    </div>
  );
}

export default SearchableDropdown;
