import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ searchQuery, onSearchChange, onSearchSubmit, suggestions, recentQueries, showSuggestions, onSuggestionSelect }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef?.current && !suggestionsRef?.current?.contains(event?.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter') {
      e?.preventDefault();
      onSearchSubmit();
      setIsFocused(false);
    } else if (e?.key === 'Escape') {
      setIsFocused(false);
      inputRef?.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSuggestionSelect(suggestion);
    setIsFocused(false);
  };

  const clearSearch = () => {
    onSearchChange('');
    inputRef?.current?.focus();
  };

  return (
    <div className="relative flex-1 max-w-2xl" ref={suggestionsRef}>
      <div className="relative">
        <Icon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
        />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Cerca file e cartelle..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e?.target?.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-12 py-3 w-full bg-background border-2 border-border rounded-lg text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-hover-light"
          >
            <Icon name="X" size={16} />
          </Button>
        )}
      </div>
      {/* Search Suggestions Dropdown */}
      {isFocused && (showSuggestions || recentQueries?.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-medium z-50 max-h-80 overflow-y-auto">
          {/* Recent Queries */}
          {recentQueries?.length > 0 && (
            <div className="p-2 border-b border-border">
              <div className="flex items-center space-x-2 px-2 py-1 text-xs font-medium text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>Ricerche recenti</span>
              </div>
              {recentQueries?.slice(0, 5)?.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(query)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-hover-light rounded-md transition-colors duration-150"
                >
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="flex-1 text-left truncate">{query}</span>
                  <Icon name="ArrowUpLeft" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}

          {/* Search Suggestions */}
          {suggestions?.length > 0 && (
            <div className="p-2">
              <div className="flex items-center space-x-2 px-2 py-1 text-xs font-medium text-muted-foreground">
                <Icon name="Lightbulb" size={14} />
                <span>Suggerimenti</span>
              </div>
              {suggestions?.slice(0, 8)?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion?.name)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-hover-light rounded-md transition-colors duration-150 group"
                >
                  <Icon name={suggestion?.icon} size={16} className="text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <div className="truncate">{suggestion?.name}</div>
                    {suggestion?.path && (
                      <div className="text-xs text-muted-foreground truncate">{suggestion?.path}</div>
                    )}
                  </div>
                  <Icon name="ArrowUpLeft" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchQuery && suggestions?.length === 0 && recentQueries?.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              <Icon name="Search" size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nessun suggerimento trovato</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;