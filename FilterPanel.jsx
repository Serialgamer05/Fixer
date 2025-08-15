import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ isExpanded, onToggle, filters, onFiltersChange, resultCount }) => {
  const [sizeRange, setSizeRange] = useState([0, 1000]);
  const [customTags, setCustomTags] = useState('');

  const fileTypes = [
    { id: 'document', label: 'Documenti', icon: 'FileText', extensions: ['.pdf', '.doc', '.docx', '.txt'] },
    { id: 'image', label: 'Immagini', icon: 'Image', extensions: ['.jpg', '.png', '.gif', '.svg'] },
    { id: 'video', label: 'Video', icon: 'Video', extensions: ['.mp4', '.avi', '.mov', '.mkv'] },
    { id: 'audio', label: 'Audio', icon: 'Music', extensions: ['.mp3', '.wav', '.flac', '.aac'] },
    { id: 'archive', label: 'Archivi', icon: 'Archive', extensions: ['.zip', '.rar', '.7z', '.tar'] },
    { id: 'executable', label: 'Eseguibili', icon: 'Zap', extensions: ['.exe', '.msi', '.app', '.deb'] },
  ];

  const sizeOptions = [
    { id: 'tiny', label: 'Molto piccoli', range: [0, 1], icon: 'Minus' },
    { id: 'small', label: 'Piccoli', range: [1, 10], icon: 'Circle' },
    { id: 'medium', label: 'Medi', range: [10, 100], icon: 'Square' },
    { id: 'large', label: 'Grandi', range: [100, 500], icon: 'Hexagon' },
    { id: 'huge', label: 'Molto grandi', range: [500, 1000], icon: 'Octagon' },
  ];

  const dateRanges = [
    { id: 'today', label: 'Oggi', icon: 'Calendar' },
    { id: 'week', label: 'Questa settimana', icon: 'Calendar' },
    { id: 'month', label: 'Questo mese', icon: 'Calendar' },
    { id: 'year', label: 'Quest\'anno', icon: 'Calendar' },
    { id: 'custom', label: 'Personalizzato', icon: 'CalendarRange' },
  ];

  const handleFileTypeChange = (typeId, checked) => {
    const newTypes = checked 
      ? [...filters?.fileTypes, typeId]
      : filters?.fileTypes?.filter(id => id !== typeId);
    
    onFiltersChange({ ...filters, fileTypes: newTypes });
  };

  const handleSizeOptionChange = (optionId, checked) => {
    const newSizes = checked 
      ? [...filters?.sizeRanges, optionId]
      : filters?.sizeRanges?.filter(id => id !== optionId);
    
    onFiltersChange({ ...filters, sizeRanges: newSizes });
  };

  const handleDateRangeChange = (rangeId, checked) => {
    const newRanges = checked 
      ? [...filters?.dateRanges, rangeId]
      : filters?.dateRanges?.filter(id => id !== rangeId);
    
    onFiltersChange({ ...filters, dateRanges: newRanges });
  };

  const handleTagsChange = (e) => {
    const tags = e?.target?.value?.split(',')?.map(tag => tag?.trim())?.filter(tag => tag);
    onFiltersChange({ ...filters, tags });
    setCustomTags(e?.target?.value);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      fileTypes: [],
      sizeRanges: [],
      dateRanges: [],
      tags: []
    });
    setCustomTags('');
  };

  const activeFilterCount = filters?.fileTypes?.length + filters?.sizeRanges?.length + filters?.dateRanges?.length + filters?.tags?.length;

  return (
    <div className="bg-surface border-b border-border">
      {/* Filter Toggle Header */}
      <div className="flex items-center justify-between px-6 py-3">
        <Button
          variant="ghost"
          onClick={onToggle}
          className="flex items-center space-x-2 text-foreground hover:bg-hover-light"
        >
          <Icon name="Filter" size={16} />
          <span className="font-medium">Filtri avanzati</span>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
          <Icon 
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
            className="transition-transform duration-200"
          />
        </Button>

        <div className="flex items-center space-x-4">
          {resultCount !== null && (
            <span className="text-sm text-muted-foreground">
              {resultCount} risultati trovati
            </span>
          )}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={14} className="mr-1" />
              Cancella tutto
            </Button>
          )}
        </div>
      </div>
      {/* Expandable Filter Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-border bg-background">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-6">
            {/* File Types */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center space-x-2">
                <Icon name="FileType" size={16} />
                <span>Tipo di file</span>
              </h3>
              <div className="space-y-2">
                {fileTypes?.map((type) => (
                  <Checkbox
                    key={type?.id}
                    checked={filters?.fileTypes?.includes(type?.id)}
                    onChange={(e) => handleFileTypeChange(type?.id, e?.target?.checked)}
                    label={
                      <div className="flex items-center space-x-2">
                        <Icon name={type?.icon} size={16} className="text-muted-foreground" />
                        <span className="text-sm">{type?.label}</span>
                      </div>
                    }
                  />
                ))}
              </div>
            </div>

            {/* File Size */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center space-x-2">
                <Icon name="HardDrive" size={16} />
                <span>Dimensione</span>
              </h3>
              <div className="space-y-2">
                {sizeOptions?.map((option) => (
                  <Checkbox
                    key={option?.id}
                    checked={filters?.sizeRanges?.includes(option?.id)}
                    onChange={(e) => handleSizeOptionChange(option?.id, e?.target?.checked)}
                    label={
                      <div className="flex items-center space-x-2">
                        <Icon name={option?.icon} size={16} className="text-muted-foreground" />
                        <span className="text-sm">{option?.label}</span>
                        <span className="text-xs text-muted-foreground">
                          ({option?.range?.[0]}-{option?.range?.[1]} MB)
                        </span>
                      </div>
                    }
                  />
                ))}
              </div>
            </div>

            {/* Date Modified */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center space-x-2">
                <Icon name="Calendar" size={16} />
                <span>Data modifica</span>
              </h3>
              <div className="space-y-2">
                {dateRanges?.map((range) => (
                  <Checkbox
                    key={range?.id}
                    checked={filters?.dateRanges?.includes(range?.id)}
                    onChange={(e) => handleDateRangeChange(range?.id, e?.target?.checked)}
                    label={
                      <div className="flex items-center space-x-2">
                        <Icon name={range?.icon} size={16} className="text-muted-foreground" />
                        <span className="text-sm">{range?.label}</span>
                      </div>
                    }
                  />
                ))}
              </div>
            </div>

            {/* Custom Tags */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center space-x-2">
                <Icon name="Tag" size={16} />
                <span>Tag personalizzati</span>
              </h3>
              <Input
                type="text"
                placeholder="Inserisci tag separati da virgola"
                value={customTags}
                onChange={handleTagsChange}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Esempio: lavoro, importante, progetto
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;