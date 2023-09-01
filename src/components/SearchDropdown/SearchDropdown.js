import React, { useState, useEffect, useRef } from "react";
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
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [matchedOptions, setMatchedOptions] = useState(
    options.map((option) => false)
  );
  const [selected, setSelected] = useState(options.map((option) => false));
  const [arrowSelected, setArrowSelected] = useState(-1);
  const { updatedValue: debouncedSearchQuery, isLoading } = useDebounce(
    searchInput,
    1000
  );
  const currOptionRef = useRef(null);

  const getNextOptionIdx = (curr) => {
    if (curr < 0 || curr >= options.length - 1) {
      return 0;
    } else {
      return curr + 1;
    }
  };

  const getPrevOptionIdx = (curr) => {
    if (curr <= 0 || curr > options.length - 1) {
      return options.length - 1;
    } else {
      return curr - 1;
    }
  };

  const handleArrowDown = () => {
    let nextIdx = getNextOptionIdx(arrowSelected);
    while (!matchedOptions[nextIdx]) {
      nextIdx = getNextOptionIdx(nextIdx);
    }
    setArrowSelected(nextIdx);
  };

  const handleArrowUp = () => {
    let nextIdx = getPrevOptionIdx(arrowSelected);
    while (!matchedOptions[nextIdx]) {
      nextIdx = getPrevOptionIdx(nextIdx);
    }
    setArrowSelected(nextIdx);
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

  // Handles selecting an item from the dropdown
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
    setSearchInput(e.target.value);
  };

  // Renders a spinning loading indicator for async search
  const renderLoadingIndicator = () => {
    return (
      isLoading &&
      asyncSearch && (
        <ReactLoading type="spin" color="#000000" height={20} width={20} />
      )
    );
  };

  // Renders the dropdown component
  const renderDropDown = () => {
    const searchResults = options.map(
      (item, index) =>
        matchedOptions[index] && (
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
    );
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

  // Updates the searchQuery state with either the current input query
  // or debounced query based on the asyncSearch prop
  useEffect(() => {
    if (asyncSearch) {
      setSearchQuery(debouncedSearchQuery);
    } else {
      setSearchQuery(searchInput);
    }
  }, [asyncSearch, debouncedSearchQuery, searchInput]);

  // Updates the list keeping track of options matching the current query
  useEffect(() => {
    setMatchedOptions(
      options.map((option) =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, options]);

  // Scrolls selected option into view when navigating with arrow keys
  useEffect(() => {
    if (
      arrowSelected >= 0 &&
      arrowSelected < options.length &&
      currOptionRef &&
      currOptionRef.current
    ) {
      currOptionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [arrowSelected, options.length]);

  // Toggle dropdown view based on focus
  useEffect(() => {
    if (focused && (showDropdownOnFocus || searchQuery.length > 0)) {
      showDropdown();
    } else if (!focused || searchQuery.length === 0) {
      hideDropdown();
    }
  }, [focused, showDropdownOnFocus, asyncSearch, searchQuery]);

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
          value={searchInput}
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
