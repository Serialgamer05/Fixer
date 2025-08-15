import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll, resultCount }) => {
  const getFilterChips = () => {
    const chips = [];

    // File type chips
    filters?.fileTypes?.forEach(typeId => {
      const typeLabels = {
        document: 'Documenti',
        image: 'Immagini', 
        video: 'Video',
        audio: 'Audio',
        archive: 'Archivi',
        executable: 'Eseguibili'
      };
      
      chips?.push({
        id: `fileType-${typeId}`,
        label: typeLabels?.[typeId] || typeId,
        type: 'fileType',
        value: typeId,
        icon: 'FileType'
      });
    });

    // Size range chips
    filters?.sizeRanges?.forEach(sizeId => {
      const sizeLabels = {
        tiny: 'Molto piccoli',
        small: 'Piccoli',
        medium: 'Medi', 
        large: 'Grandi',
        huge: 'Molto grandi'
      };
      
      chips?.push({
        id: `size-${sizeId}`,
        label: sizeLabels?.[sizeId] || sizeId,
        type: 'sizeRange',
        value: sizeId,
        icon: 'HardDrive'
      });
    });

    // Date range chips
    filters?.dateRanges?.forEach(dateId => {
      const dateLabels = {
        today: 'Oggi',
        week: 'Questa settimana',
        month: 'Questo mese',
        year: 'Quest\'anno',
        custom: 'Personalizzato'
      };
      
      chips?.push({
        id: `date-${dateId}`,
        label: dateLabels?.[dateId] || dateId,
        type: 'dateRange',
        value: dateId,
        icon: 'Calendar'
      });
    });

    // Tag chips
    filters?.tags?.forEach((tag, index) => {
      chips?.push({
        id: `tag-${index}`,
        label: tag,
        type: 'tag',
        value: tag,
        icon: 'Tag'
      });
    });

    return chips;
  };

  const filterChips = getFilterChips();
  const hasActiveFilters = filterChips?.length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filtri attivi</span>
          {resultCount !== null && (
            <span className="text-sm text-muted-foreground">
              ({resultCount} risultati)
            </span>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="X" size={14} className="mr-1" />
          Cancella tutto
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {filterChips?.map((chip) => (
          <div
            key={chip?.id}
            className="inline-flex items-center space-x-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1.5 text-sm group hover:bg-primary/20 transition-colors duration-150"
          >
            <Icon name={chip?.icon} size={12} />
            <span className="font-medium">{chip?.label}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveFilter(chip?.type, chip?.value)}
              className="h-4 w-4 p-0 ml-1 text-primary hover:text-primary-foreground hover:bg-primary rounded-full opacity-70 group-hover:opacity-100"
            >
              <Icon name="X" size={10} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveFilters;