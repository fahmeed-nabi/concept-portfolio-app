import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [creativeFields, setCreativeFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [fieldSearch, setFieldSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/creative-fields/')
      .then(res => setCreativeFields(Array.isArray(res.data) ? res.data : res.data.results || []))
      .catch(err => console.error('Error fetching fields', err));
  }, []);

  const toggleField = (fieldId) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleSearchClick = () => {
    onSearch({ search: searchText, fields: selectedFields });
  };

  const filteredFieldOptions = creativeFields.filter(field =>
    field.name.toLowerCase().includes(fieldSearch.toLowerCase()) &&
    !selectedFields.includes(field.id)
  );

  return (
    <div className="search-bar-wrapper">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="search-input"
      />

      {selectedFields.length > 0 && (
          <div className="selected-fields">
            {selectedFields.map(id => {
              const field = creativeFields.find(f => f.id === id);
              return (
                <span key={id} className="field-bubble">
                  {field?.name}
                  <button
                    className="remove-bubble"
                    onClick={() => toggleField(id)}
                    type="button"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}

      <button type="button" className="toggle-fields-btn" onClick={() => setShowDropdown(!showDropdown)}>
        {showDropdown ? 'Hide Creative Fields' : 'Add Creative Fields'}
      </button>

      {showDropdown && (
        <div className="field-dropdown-wrapper">
          <input
            className="field-search-input"
            type="text"
            placeholder="Search creative fields..."
            value={fieldSearch}
            onChange={(e) => setFieldSearch(e.target.value)}
          />
          <div className="dropdown-field-list">
            {filteredFieldOptions.map(field => (
              <div
                key={field.id}
                className="dropdown-option"
                onClick={() => toggleField(field.id)}
              >
                {field.name}
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleSearchClick} className="search-btn">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
