import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "./SearchDropdown.css";

function SearchableDropdown({
  options = [],
  onSelect = () => {},
  placeholder = "",
  label = "",
  description = "",
  showDropdownOnFocus = false,
  disabled = false,
  width = 300,
  height = 30,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const showDropdown = () => {
    setIsOpen(true);
  };

  const hideDropdown = () => {
    setIsOpen(false);
  };

  // Handle selecting an item from the dropdown
  const handleSelect = (item) => {
    setSelectedItem(item);
    onSelect(item);
  };

  const handleOnFocus = () => {
    setFocused(true);
  };

  const handleOnBlur = () => {
    setFocused(false);
  };

  const handleOnTextInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      showDropdown();
    }
  };

  const renderDropDown = () => {
    return (
      isOpen && (
        <div className="dropdown" style={{ width: width }}>
          {options
            // Filtering options based on search query
            .filter((item) =>
              item.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => {
                  console.log(item);
                  handleSelect(item);
                }}
              >
                {item}
              </div>
            ))}
        </div>
      )
    );
  };

  useEffect(() => {
    if (showDropdownOnFocus && focused) {
      showDropdown();
    } else if (!focused) {
      hideDropdown();
    }
  });

  return (
    <div className="search-wrapper">
      <div className="text">{label}</div>
      <div
        className="input-wrapper"
        style={
          focused
            ? { border: "2px solid blue", width: width, height: height }
            : { border: "2px solid transparent", width: width, height: height }
        }
        tabIndex={0}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      >
        <AiOutlineSearch className="icon" size={25} />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleOnTextInputChange}
          onFocus={handleOnFocus}
          // onBlur={handleOnBlur}
          disabled={disabled}
          className="input"
        />
        {renderDropDown()}
      </div>
      <div className="text">{description}</div>
    </div>
  );
}

export default SearchableDropdown;
