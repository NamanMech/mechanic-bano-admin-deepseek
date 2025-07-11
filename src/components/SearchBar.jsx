import React, { useState, useEffect } from 'react';

const SearchBar = ({ placeholder, value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);
  
  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(inputValue);
    }, 300);
    
    return () => clearTimeout(handler);
  }, [inputValue, onChange]);
  
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;
