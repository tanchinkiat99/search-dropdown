import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Checkbox from "@mui/material/Checkbox";
import useDebounce from "../../hooks/useDebounce";
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
  asyncSearch = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState(options.map((option) => false));
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const getSearchQuery = useCallback(() => {
    return asyncSearch ? debouncedSearchQuery : searchQuery;
  }, [asyncSearch, debouncedSearchQuery, searchQuery]);

  const showDropdown = () => {
    setIsOpen(true);
  };

  const hideDropdown = () => {
    setIsOpen(false);
  };

  // Handle selecting an item from the dropdown
  const handleSelect = (index) => {
    onSelect();
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
  };

  const renderDropDown = () => {
    const newSearchQuery = getSearchQuery();
    return (
      isOpen && (
        <div className="dropdown" style={{ width: width }}>
          {options.map(
            (item, index) =>
              item.toLowerCase().includes(newSearchQuery.toLowerCase()) && (
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
    const newSearchQuery = getSearchQuery();
    if ((showDropdownOnFocus && focused) || newSearchQuery.length > 0) {
      showDropdown();
    } else if (!focused || newSearchQuery.length === 0) {
      hideDropdown();
    }
  }, [focused, getSearchQuery, showDropdownOnFocus, asyncSearch]);

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
