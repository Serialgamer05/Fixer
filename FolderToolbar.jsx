import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FolderToolbar = ({ 
  viewMode, 
  onViewModeChange, 
  sortBy, 
  onSortChange, 
  selectedCount, 
  onNewFolder, 
  onRefresh,
  onSelectAll,
  onClearSelection 
}) => {
  const viewModeOptions = [
    { value: 'grid', label: 'Griglia' },
    { value: 'list', label: 'Elenco' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'size', label: 'Dimensione' },
    { value: 'type', label: 'Tipo' },
    { value: 'modified', label: 'Data modifica' }
  ];

  return (
    <div className="flex items-center justify-between bg-surface border border-border rounded-lg p-3 mb-4">
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          onClick={onNewFolder}
          iconName="FolderPlus"
          iconPosition="left"
          className="text-sm"
        >
          Nuova cartella
        </Button>

        <div className="h-6 w-px bg-border" />

        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          title="Aggiorna"
        >
          <Icon name="RefreshCw" size={16} />
        </Button>

        {selectedCount > 0 && (
          <>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm text-muted-foreground">
              {selectedCount} elementi selezionati
            </span>
            <Button
              variant="ghost"
              onClick={onClearSelection}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Deseleziona tutto
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          onClick={onSelectAll}
          className="text-sm"
        >
          Seleziona tutto
        </Button>

        <div className="h-6 w-px bg-border" />

        <Select
          options={sortOptions}
          value={sortBy}
          onChange={onSortChange}
          placeholder="Ordina per"
          className="w-32"
        />

        <div className="flex items-center bg-background border border-border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('grid')}
            className="rounded-r-none border-r border-border"
          >
            <Icon name="Grid3X3" size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('list')}
            className="rounded-l-none"
          >
            <Icon name="List" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FolderToolbar;