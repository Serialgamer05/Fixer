import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const Header = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const primaryNavItems = [
    { path: '/file-manager-dashboard', label: 'Dashboard', icon: 'FolderOpen' },
    { path: '/file-upload-interface', label: 'Upload', icon: 'Upload' },
    { path: '/search-and-filter-interface', label: 'Search', icon: 'Search' },
    { path: '/folder-management-interface', label: 'Folders', icon: 'Folder' },
  ];

  const secondaryNavItems = [
    { path: '/file-properties-dialog', label: 'Properties', icon: 'Settings' },
    { path: '/file-preview-modal', label: 'Preview', icon: 'Eye' },
  ];

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      console.log('Search query:', searchQuery);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setIsSearchExpanded(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-background border-b border-border">
      <div className="flex items-center h-16 px-4">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/file-manager-dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="HardDrive" size={20} color="white" />
            </div>
            <span className="text-lg font-semibold text-foreground font-system">
              Fixer File Manager
            </span>
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="hidden md:flex items-center ml-8 space-x-1">
          {primaryNavItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                location?.pathname === item?.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-hover-light'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className={`relative transition-all duration-200 ${
              isSearchExpanded ? 'w-full' : 'w-64'
            }`}>
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <Input
                type="search"
                placeholder="Search files and folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="pl-10 pr-4 py-2 w-full bg-surface border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                >
                  <Icon name="X" size={14} />
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* View Toggle */}
          <Button variant="ghost" size="icon" className="hidden lg:flex">
            <Icon name="Grid3X3" size={16} />
          </Button>

          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="md:hidden"
            >
              <Icon name="Menu" size={16} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="hidden md:flex"
            >
              <Icon name="MoreHorizontal" size={16} />
            </Button>

            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-medium z-102">
                <div className="py-1">
                  {/* Mobile Navigation */}
                  <div className="md:hidden">
                    {primaryNavItems?.map((item) => (
                      <Link
                        key={item?.path}
                        to={item?.path}
                        onClick={() => setShowMoreMenu(false)}
                        className={`flex items-center space-x-3 px-4 py-2 text-sm hover:bg-hover-light ${
                          location?.pathname === item?.path
                            ? 'text-primary font-medium' :'text-foreground'
                        }`}
                      >
                        <Icon name={item?.icon} size={16} />
                        <span>{item?.label}</span>
                      </Link>
                    ))}
                    <div className="border-t border-border my-1"></div>
                  </div>

                  {/* Secondary Navigation */}
                  {secondaryNavItems?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      onClick={() => setShowMoreMenu(false)}
                      className={`flex items-center space-x-3 px-4 py-2 text-sm hover:bg-hover-light ${
                        location?.pathname === item?.path
                          ? 'text-primary font-medium' :'text-foreground'
                      }`}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </Link>
                  ))}

                  <div className="border-t border-border my-1"></div>

                  {/* Additional Actions */}
                  <button className="flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-hover-light w-full text-left">
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>

                  <button className="flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-hover-light w-full text-left">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon">
            <Icon name="Sun" size={16} className="dark:hidden" />
            <Icon name="Moon" size={16} className="hidden dark:block" />
          </Button>
        </div>
      </div>
      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            type="search"
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="pl-10 pr-4 py-2 w-full bg-surface border-border rounded-lg text-sm"
          />
        </form>
      </div>
      {/* Backdrop for mobile menu */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 z-10 bg-black/20 backdrop-blur-subtle md:hidden"
          onClick={() => setShowMoreMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;