import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SavedSearches = ({ savedSearches, onLoadSearch, onSaveSearch, onDeleteSearch, currentSearch }) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [showSavedList, setShowSavedList] = useState(false);

  const handleSaveSearch = () => {
    if (searchName?.trim() && currentSearch?.query) {
      onSaveSearch({
        id: Date.now()?.toString(),
        name: searchName?.trim(),
        query: currentSearch?.query,
        filters: currentSearch?.filters,
        createdAt: new Date()?.toISOString()
      });
      setSearchName('');
      setShowSaveDialog(false);
    }
  };

  const handleLoadSearch = (search) => {
    onLoadSearch(search);
    setShowSavedList(false);
  };

  const canSaveCurrentSearch = currentSearch?.query || 
    currentSearch?.filters?.fileTypes?.length > 0 || 
    currentSearch?.filters?.sizeRanges?.length > 0 || 
    currentSearch?.filters?.dateRanges?.length > 0 || 
    currentSearch?.filters?.tags?.length > 0;

  return (
    <div className="relative">
      {/* Save/Load Buttons */}
      <div className="flex items-center space-x-2">
        {canSaveCurrentSearch && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center space-x-2"
          >
            <Icon name="Bookmark" size={14} />
            <span>Salva ricerca</span>
          </Button>
        )}

        {savedSearches?.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSavedList(!showSavedList)}
            className="flex items-center space-x-2"
          >
            <Icon name="BookmarkCheck" size={14} />
            <span>Ricerche salvate</span>
            <Icon 
              name={showSavedList ? 'ChevronUp' : 'ChevronDown'} 
              size={14} 
            />
          </Button>
        )}
      </div>
      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-medium z-50 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Salva ricerca</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSaveDialog(false)}
                className="h-6 w-6"
              >
                <Icon name="X" size={14} />
              </Button>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Nome della ricerca"
                value={searchName}
                onChange={(e) => setSearchName(e?.target?.value)}
                onKeyDown={(e) => {
                  if (e?.key === 'Enter') {
                    handleSaveSearch();
                  } else if (e?.key === 'Escape') {
                    setShowSaveDialog(false);
                  }
                }}
                className="text-sm"
                autoFocus
              />
            </div>

            {/* Search Preview */}
            <div className="bg-muted rounded-lg p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Anteprima:</p>
              {currentSearch?.query && (
                <div className="flex items-center space-x-2">
                  <Icon name="Search" size={12} className="text-muted-foreground" />
                  <span className="text-xs text-foreground">"{currentSearch?.query}"</span>
                </div>
              )}
              {(currentSearch?.filters?.fileTypes?.length > 0 || 
                currentSearch?.filters?.sizeRanges?.length > 0 || 
                currentSearch?.filters?.dateRanges?.length > 0 || 
                currentSearch?.filters?.tags?.length > 0) && (
                <div className="flex items-center space-x-2">
                  <Icon name="Filter" size={12} className="text-muted-foreground" />
                  <span className="text-xs text-foreground">
                    {currentSearch?.filters?.fileTypes?.length + 
                     currentSearch?.filters?.sizeRanges?.length + 
                     currentSearch?.filters?.dateRanges?.length + 
                     currentSearch?.filters?.tags?.length} filtri attivi
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSaveDialog(false)}
              >
                Annulla
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveSearch}
                disabled={!searchName?.trim()}
              >
                Salva
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Saved Searches List */}
      {showSavedList && savedSearches?.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-popover border border-border rounded-lg shadow-medium z-50 max-h-80 overflow-y-auto">
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Ricerche salvate</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSavedList(false)}
                className="h-6 w-6"
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
          </div>

          <div className="p-2">
            {savedSearches?.map((search) => (
              <div
                key={search?.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-hover-light group"
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleLoadSearch(search)}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name="BookmarkCheck" size={14} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">{search?.name}</span>
                  </div>
                  
                  <div className="space-y-1">
                    {search?.query && (
                      <div className="flex items-center space-x-2">
                        <Icon name="Search" size={10} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">"{search?.query}"</span>
                      </div>
                    )}
                    
                    {(search?.filters?.fileTypes?.length > 0 || 
                      search?.filters?.sizeRanges?.length > 0 || 
                      search?.filters?.dateRanges?.length > 0 || 
                      search?.filters?.tags?.length > 0) && (
                      <div className="flex items-center space-x-2">
                        <Icon name="Filter" size={10} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {search?.filters?.fileTypes?.length + 
                           search?.filters?.sizeRanges?.length + 
                           search?.filters?.dateRanges?.length + 
                           search?.filters?.tags?.length} filtri
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Icon name="Calendar" size={10} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat('it-IT', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })?.format(new Date(search.createdAt))}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onDeleteSearch(search?.id);
                  }}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-error"
                >
                  <Icon name="Trash2" size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Backdrop */}
      {(showSaveDialog || showSavedList) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowSaveDialog(false);
            setShowSavedList(false);
          }}
        />
      )}
    </div>
  );
};

export default SavedSearches;