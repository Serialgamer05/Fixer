import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const SearchResults = ({ results, searchQuery, viewMode, onViewModeChange, sortBy, onSortChange, onFileSelect, selectedFiles }) => {
  const [hoveredFile, setHoveredFile] = useState(null);

  const sortOptions = [
    { value: 'relevance', label: 'Rilevanza', icon: 'Target' },
    { value: 'name', label: 'Nome', icon: 'AlphabeticalSort' },
    { value: 'size', label: 'Dimensione', icon: 'HardDrive' },
    { value: 'modified', label: 'Data modifica', icon: 'Calendar' },
    { value: 'type', label: 'Tipo', icon: 'FileType' },
  ];

  const getFileIcon = (file) => {
    const extension = file?.name?.split('.')?.pop()?.toLowerCase();
    const iconMap = {
      pdf: 'FileText',
      doc: 'FileText',
      docx: 'FileText',
      txt: 'FileText',
      jpg: 'Image',
      jpeg: 'Image',
      png: 'Image',
      gif: 'Image',
      svg: 'Image',
      mp4: 'Video',
      avi: 'Video',
      mov: 'Video',
      mkv: 'Video',
      mp3: 'Music',
      wav: 'Music',
      flac: 'Music',
      aac: 'Music',
      zip: 'Archive',
      rar: 'Archive',
      '7z': 'Archive',
      tar: 'Archive',
      exe: 'Zap',
      msi: 'Zap',
      app: 'Zap',
      deb: 'Zap',
    };
    return iconMap?.[extension] || 'File';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(1)) + ' ' + sizes?.[i];
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(date));
  };

  const highlightSearchTerm = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text?.split(regex);
    
    return parts?.map((part, index) => 
      regex?.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const handleFileClick = (file, event) => {
    if (event?.ctrlKey || event?.metaKey) {
      // Multi-select with Ctrl/Cmd
      onFileSelect(file, true);
    } else {
      // Single select
      onFileSelect(file, false);
    }
  };

  const isFileSelected = (file) => {
    return selectedFiles?.some(selected => selected?.id === file?.id);
  };

  if (results?.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <Icon name="Search" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nessun risultato trovato
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? `Non sono stati trovati file corrispondenti a "${searchQuery}"`
              : 'Prova a modificare i filtri di ricerca o inserisci un termine diverso'
            }
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Suggerimenti:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Controlla l'ortografia</li>
              <li>Usa termini più generali</li>
              <li>Rimuovi alcuni filtri</li>
              <li>Cerca in cartelle diverse</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      {/* Results Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-foreground">
            {results?.length} risultati
            {searchQuery && (
              <span className="text-muted-foreground"> per "{searchQuery}"</span>
            )}
          </span>
          
          {selectedFiles?.length > 0 && (
            <span className="text-sm text-primary">
              {selectedFiles?.length} selezionati
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Ordina per:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e?.target?.value)}
              className="text-sm bg-background border border-border rounded px-2 py-1 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {sortOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-none border-0"
            >
              <Icon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-none border-0"
            >
              <Icon name="List" size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Results Content */}
      <div className="p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {results?.map((file) => (
              <div
                key={file?.id}
                onClick={(e) => handleFileClick(file, e)}
                onMouseEnter={() => setHoveredFile(file?.id)}
                onMouseLeave={() => setHoveredFile(null)}
                className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 group ${
                  isFileSelected(file)
                    ? 'border-primary bg-primary/5' :'border-transparent hover:border-border hover:bg-hover-light'
                }`}
              >
                {/* Selection Checkbox */}
                <div className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  isFileSelected(file)
                    ? 'bg-primary border-primary' :'border-border bg-background opacity-0 group-hover:opacity-100'
                }`}>
                  {isFileSelected(file) && (
                    <Icon name="Check" size={12} className="text-primary-foreground" />
                  )}
                </div>

                {/* File Icon/Thumbnail */}
                <div className="flex flex-col items-center space-y-2">
                  {file?.thumbnail ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={file?.thumbnail}
                        alt={file?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      <Icon name={getFileIcon(file)} size={32} className="text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="text-center min-w-0 w-full">
                    <p className="text-xs font-medium text-foreground truncate" title={file?.name}>
                      {highlightSearchTerm(file?.name, searchQuery)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file?.size)}
                    </p>
                  </div>
                </div>

                {/* Hover Actions */}
                {hoveredFile === file?.id && (
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 bg-background/80 backdrop-blur-sm hover:bg-background"
                    >
                      <Icon name="Eye" size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 bg-background/80 backdrop-blur-sm hover:bg-background"
                    >
                      <Icon name="MoreHorizontal" size={12} />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {/* List Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
              <div className="col-span-1"></div>
              <div className="col-span-5">Nome</div>
              <div className="col-span-2">Dimensione</div>
              <div className="col-span-2">Tipo</div>
              <div className="col-span-2">Modificato</div>
            </div>

            {/* List Items */}
            {results?.map((file) => (
              <div
                key={file?.id}
                onClick={(e) => handleFileClick(file, e)}
                onMouseEnter={() => setHoveredFile(file?.id)}
                onMouseLeave={() => setHoveredFile(null)}
                className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                  isFileSelected(file)
                    ? 'bg-primary/5 border border-primary/20' :'hover:bg-hover-light'
                }`}
              >
                {/* Selection Checkbox */}
                <div className="col-span-1 flex items-center">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    isFileSelected(file)
                      ? 'bg-primary border-primary' :'border-border bg-background opacity-0 group-hover:opacity-100'
                  }`}>
                    {isFileSelected(file) && (
                      <Icon name="Check" size={12} className="text-primary-foreground" />
                    )}
                  </div>
                </div>

                {/* File Name */}
                <div className="col-span-5 flex items-center space-x-3 min-w-0">
                  {file?.thumbnail ? (
                    <div className="w-8 h-8 rounded overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={file?.thumbnail}
                        alt={file?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <Icon name={getFileIcon(file)} size={20} className="text-muted-foreground flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium text-foreground truncate" title={file?.name}>
                    {highlightSearchTerm(file?.name, searchQuery)}
                  </span>
                </div>

                {/* File Size */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-muted-foreground">
                    {formatFileSize(file?.size)}
                  </span>
                </div>

                {/* File Type */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-muted-foreground">
                    {file?.type}
                  </span>
                </div>

                {/* Modified Date */}
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(file?.modified)}
                  </span>
                  
                  {/* Actions */}
                  {hoveredFile === file?.id && (
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                      >
                        <Icon name="Eye" size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                      >
                        <Icon name="MoreHorizontal" size={12} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;