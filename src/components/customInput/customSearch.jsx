/**
 * SearchFilter Component
 *
 * This component renders a search input field that allows users to filter results based on a search term.
 * It notifies the parent component of changes to the search term through a callback function.
 *
 * @component
 * @example
 * return (
 *   <SearchFilter onSearch={handleSearch} searchTerm={currentSearchTerm} />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 *
 * @props
 * - {function} onSearch: Callback function to handle changes in the search term.
 * - {string} searchTerm: The current value of the search input field.
 *
 * @methods
 * - handleSearch: Handles input changes and invokes the onSearch callback with the new search term.
 *
 * @returns {JSX.Element} The rendered SearchFilter component containing the search input field.
 */



// SearchFilter.jsx
import React from 'react';

const SearchFilter = ({ onSearch, searchTerm }) => {
  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchFilter;