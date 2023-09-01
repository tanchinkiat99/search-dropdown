import React, { useState, useEffect, useCallback, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Checkbox from "@mui/material/Checkbox";
import useDebounce from "../../hooks/useDebounce";
import useKeyDown from "../../hooks/useKeyDown";
import ReactLoading from "react-loading";
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
  const [arrowSelected, setArrowSelected] = useState(-1);
  const { updatedValue: debouncedSearchQuery, isLoading } = useDebounce(
    searchQuery,
    1000
  );
  const getSearchQuery = useCallback(() => {
    return asyncSearch ? debouncedSearchQuery : searchQuery;
  }, [asyncSearch, debouncedSearchQuery, searchQuery]);

  const currOptionRef = useRef(null);

  useEffect(() => {
    if (arrowSelected >= 0 && arrowSelected < options.length) {
      currOptionRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [arrowSelected, options.length]);

  const handleArrowDown = () => {
    if (arrowSelected < 0 || arrowSelected >= options.length - 1) {
      setArrowSelected(0);
    } else {
      setArrowSelected(arrowSelected + 1);
    }
  };

  const handleArrowUp = () => {
    if (arrowSelected <= 0 || arrowSelected > options.length - 1) {
      setArrowSelected(options.length - 1);
    } else {
      setArrowSelected(arrowSelected - 1);
    }
  };

  const handleEnter = () => {
    if (arrowSelected >= 0 && arrowSelected < options.length) {
      handleSelect(arrowSelected);
    }
  };

  useKeyDown(40, () => {
    focused && handleArrowDown();
  });

  useKeyDown(38, () => {
    focused && handleArrowUp();
  });

  useKeyDown(13, () => {
    focused && handleEnter();
  });

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

  const renderLoadingIndicator = () => {
    return (
      isLoading &&
      asyncSearch && (
        <ReactLoading type="spin" color="#000000" height={20} width={20} />
      )
    );
  };

  const renderDropDown = () => {
    const newSearchQuery = getSearchQuery();
    const searchResults = options
      .map(
        (item, index) =>
          item.toLowerCase().includes(newSearchQuery.toLowerCase()) && (
            <div
              key={index}
              className="dropdown-item"
              label={item}
              onMouseOver={() => {
                setArrowSelected(index);
              }}
              onClick={() => {
                handleSelect(index);
              }}
              style={
                index === arrowSelected ? { backgroundColor: "#d4dbf6" } : {}
              }
              ref={index === arrowSelected ? currOptionRef : null}
            >
              <p>{item}</p>
              <Checkbox
                checked={selected[index]}
                onChange={() => handleSelect(index)}
              />
            </div>
          )
      )
      .filter((item) => item);
    if (searchResults.length === 0) {
      searchResults.push(
        <div className="dropdown-no-result">
          <p>No results to show</p>
        </div>
      );
    }
    return (
      isOpen && (
        <div className="dropdown" style={{ width: width }}>
          {searchResults}
        </div>
      )
    );
  };

  useEffect(() => {
    const newSearchQuery = getSearchQuery();
    if (focused && (showDropdownOnFocus || newSearchQuery.length > 0)) {
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
        {renderLoadingIndicator()}
        {renderDropDown()}
      </div>
      <div className="text">{description}</div>
    </div>
  );
}

export default SearchableDropdown;
