import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Checkbox from "@mui/material/Checkbox";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState(options.map((option) => false));

  const showDropdown = () => {
    setIsOpen(true);
  };

  const hideDropdown = () => {
    setIsOpen(false);
  };

  // Handle selecting an item from the dropdown
  const handleSelect = (index) => {
    const updatedSelected = [...selected];
    updatedSelected[index] = !updatedSelected[index];
    setSelected(updatedSelected);
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
          {options.map(
            (item, index) =>
              item.toLowerCase().includes(searchQuery.toLowerCase()) && (
                <div
                  key={index}
                  className="dropdown-item"
                  label={item}
                  onClick={() => {
                    handleSelect(index);
                  }}
                >
                  <p>{item}</p>
                  <Checkbox
                    checked={selected[index]}
                    onChange={() => handleSelect(index)}
                  />
                </div>
              )
          )}
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
