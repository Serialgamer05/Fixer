import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const Toolbar = ({ 
  currentPath, 
  viewMode, 
  onViewModeChange, 
  sortBy, 
  onSortChange,
  searchQuery,
  onSearchChange,
  selectedCount,
  onNewFolder,
  onUpload,
  onDelete,
  onCopy,
  onMove
}) => {
  const navigate = useNavigate();
  const [showSortMenu, setShowSortMenu] = useState(false);

  const breadcrumbs = currentPath?.split('/')?.filter(Boolean);

  const sortOptions = [
    { value: 'name', label: 'Nome', icon: 'Type' },
    { value: 'size', label: 'Dimensione', icon: 'HardDrive' },
    { value: 'type', label: 'Tipo', icon: 'Tag' },
    { value: 'modified', label: 'Data modifica', icon: 'Calendar' }
  ];

  const handleBreadcrumbClick = (index) => {
    const newPath = breadcrumbs?.slice(0, index + 1)?.join('/');
    navigate(`/file-manager-dashboard?folder=${newPath}`);
  };

  return (
    <div className="bg-surface border-b border-border">
      {/* Main Toolbar */}
      <div className="flex items-center justify-between p-4">
        {/* Left Section - Navigation & Actions */}
        <div className="flex items-center space-x-4">
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon">
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="ChevronRight" size={16} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="RotateCcw" size={16} />
            </Button>
          </div>

          <div className="w-px h-6 bg-border"></div>

          {/* Primary Actions */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="default" 
              iconName="Upload" 
              iconPosition="left"
              onClick={onUpload}
            >
              Carica
            </Button>
            <Button 
              variant="outline" 
              iconName="FolderPlus" 
              iconPosition="left"
              onClick={onNewFolder}
            >
              Nuova cartella
            </Button>
            
            {selectedCount > 0 && (
              <>
                <div className="w-px h-6 bg-border"></div>
                <Button 
                  variant="outline" 
                  iconName="Copy" 
                  iconPosition="left"
                  onClick={onCopy}
                >
                  Copia
                </Button>
                <Button 
                  variant="outline" 
                  iconName="Move" 
                  iconPosition="left"
                  onClick={onMove}
                >
                  Sposta
                </Button>
                <Button 
                  variant="destructive" 
                  iconName="Trash2" 
                  iconPosition="left"
                  onClick={onDelete}
                >
                  Elimina ({selectedCount})
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Right Section - View & Search */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative w-64">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              type="search"
              placeholder="Cerca file e cartelle..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10"
            />
          </div>

          <div className="w-px h-6 bg-border"></div>

          {/* Sort Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              iconName="ArrowUpDown"
              iconPosition="left"
              onClick={() => setShowSortMenu(!showSortMenu)}
            >
              Ordina
            </Button>
            
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-medium z-50">
                <div className="py-1">
                  {sortOptions?.map((option) => (
                    <button
                      key={option?.value}
                      onClick={() => {
                        onSortChange(option?.value);
                        setShowSortMenu(false);
                      }}
                      className={`flex items-center space-x-3 px-4 py-2 text-sm hover:bg-hover-light w-full text-left ${
                        sortBy === option?.value ? 'text-primary font-medium' : 'text-foreground'
                      }`}
                    >
                      <Icon name={option?.icon} size={16} />
                      <span>{option?.label}</span>
                      {sortBy === option?.value && (
                        <Icon name="Check" size={14} className="ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('grid')}
              className="h-8 w-8"
            >
              <Icon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('list')}
              className="h-8 w-8"
            >
              <Icon name="List" size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center px-4 pb-3">
        <div className="flex items-center space-x-1 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/file-manager-dashboard')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="Home" size={14} className="mr-1" />
            I miei file
          </Button>
          
          {breadcrumbs?.map((crumb, index) => (
            <React.Fragment key={index}>
              <Icon name="ChevronRight" size={12} className="text-muted-foreground" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBreadcrumbClick(index)}
                className={`text-muted-foreground hover:text-foreground ${
                  index === breadcrumbs?.length - 1 ? 'text-foreground font-medium' : ''
                }`}
              >
                {crumb}
              </Button>
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Backdrop for sort menu */}
      {showSortMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowSortMenu(false)}
        />
      )}
    </div>
  );
};

export default Toolbar;