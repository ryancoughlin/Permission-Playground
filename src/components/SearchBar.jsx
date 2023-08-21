import React from 'react';

function SearchBar({ onSearch }) {
  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search..."
        onChange={e => onSearch(e.target.value)}
        className="border p-2"
      />
    </div>
  );
}

export default SearchBar;
