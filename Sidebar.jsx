import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root', 'documents']));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const quickAccessItems = [
    { id: 'recent', label: 'Recent Files', icon: 'Clock', path: '/file-manager-dashboard?filter=recent' },
    { id: 'favorites', label: 'Favorites', icon: 'Star', path: '/file-manager-dashboard?filter=favorites' },
    { id: 'shared', label: 'Shared with me', icon: 'Users', path: '/file-manager-dashboard?filter=shared' },
    { id: 'trash', label: 'Trash', icon: 'Trash2', path: '/file-manager-dashboard?filter=trash' },
  ];

  const folderStructure = [
    {
      id: 'root',
      label: 'My Files',
      icon: 'HardDrive',
      path: '/file-manager-dashboard',
      children: [
        {
          id: 'documents',
          label: 'Documents',
          icon: 'FileText',
          path: '/file-manager-dashboard?folder=documents',
          children: [
            { id: 'work', label: 'Work', icon: 'Briefcase', path: '/file-manager-dashboard?folder=documents/work' },
            { id: 'personal', label: 'Personal', icon: 'User', path: '/file-manager-dashboard?folder=documents/personal' },
          ]
        },
        { id: 'downloads', label: 'Downloads', icon: 'Download', path: '/file-manager-dashboard?folder=downloads' },
        { id: 'images', label: 'Images', icon: 'Image', path: '/file-manager-dashboard?folder=images' },
        { id: 'videos', label: 'Videos', icon: 'Video', path: '/file-manager-dashboard?folder=videos' },
        { id: 'music', label: 'Music', icon: 'Music', path: '/file-manager-dashboard?folder=music' },
      ]
    }
  ];

  const storageInfo = {
    used: 45.2,
    total: 100,
    unit: 'GB'
  };

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded?.has(folderId)) {
      newExpanded?.delete(folderId);
    } else {
      newExpanded?.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderTree = (folders, level = 0) => {
    return folders?.map((folder) => {
      const isExpanded = expandedFolders?.has(folder?.id);
      const hasChildren = folder?.children && folder?.children?.length > 0;
      const isActive = location?.pathname + location?.search === folder?.path;

      return (
        <div key={folder?.id}>
          <div className="flex items-center group">
            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFolder(folder?.id)}
                className={`h-6 w-6 p-0 mr-1 ${isCollapsed ? 'hidden' : ''}`}
              >
                <Icon 
                  name={isExpanded ? 'ChevronDown' : 'ChevronRight'} 
                  size={12} 
                  className="text-muted-foreground"
                />
              </Button>
            )}
            
            <Link
              to={folder?.path}
              className={`flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm transition-colors duration-200 flex-1 min-w-0 ${
                level > 0 ? `ml-${level * 4}` : ''
              } ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-hover-light group-hover:bg-hover-light'
              }`}
              title={isCollapsed ? folder?.label : ''}
            >
              <Icon 
                name={folder?.icon} 
                size={16} 
                className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
              />
              {!isCollapsed && (
                <span className="truncate">{folder?.label}</span>
              )}
            </Link>
          </div>
          {hasChildren && isExpanded && !isCollapsed && (
            <div className="ml-4 mt-1">
              {renderFolderTree(folder?.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 z-10 bg-black/20 backdrop-blur-subtle md:hidden"
          onClick={onToggleCollapse}
        />
      )}
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 bottom-0 z-10 bg-surface border-r border-border transition-all duration-200 ease-smooth
        ${isCollapsed ? 'w-12' : 'w-64'}
        ${isMobile && isCollapsed ? '-translate-x-full' : 'translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Toggle Button */}
          <div className="flex items-center justify-between p-3 border-b border-border">
            {!isCollapsed && (
              <span className="text-sm font-medium text-muted-foreground">Navigation</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="h-8 w-8"
            >
              <Icon 
                name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} 
                size={16} 
              />
            </Button>
          </div>

          {/* Quick Access */}
          <div className="p-3">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Quick Access
              </h3>
            )}
            <div className="space-y-1">
              {quickAccessItems?.map((item) => {
                const isActive = location?.pathname + location?.search === item?.path;
                return (
                  <Link
                    key={item?.id}
                    to={item?.path}
                    className={`flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-hover-light'
                    }`}
                    title={isCollapsed ? item?.label : ''}
                  >
                    <Icon 
                      name={item?.icon} 
                      size={16} 
                      className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
                    />
                    {!isCollapsed && (
                      <span className="truncate">{item?.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Folder Tree */}
          <div className="flex-1 p-3 overflow-y-auto">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Folders
              </h3>
            )}
            <div className="space-y-1">
              {renderFolderTree(folderStructure)}
            </div>
          </div>

          {/* Storage Info */}
          {!isCollapsed && (
            <div className="p-3 border-t border-border">
              <div className="bg-card rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Storage</span>
                  <Icon name="HardDrive" size={12} className="text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground">{storageInfo?.used} {storageInfo?.unit} used</span>
                    <span className="text-muted-foreground">{storageInfo?.total} {storageInfo?.unit}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(storageInfo?.used / storageInfo?.total) * 100}%` }}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Icon name="Plus" size={12} className="mr-1" />
                    Upgrade Storage
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;