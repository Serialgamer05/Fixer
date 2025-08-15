import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const FolderGrid = ({ 
  folders, 
  files, 
  viewMode, 
  selectedItems, 
  onItemSelect, 
  onItemDoubleClick, 
  onContextMenu,
  onDragStart,
  onDragOver,
  onDrop 
}) => {
  const [dragOverItem, setDragOverItem] = useState(null);

  const handleDragOver = (e, item) => {
    e?.preventDefault();
    if (item?.type === 'folder') {
      setDragOverItem(item?.id);
    }
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e, item) => {
    e?.preventDefault();
    setDragOverItem(null);
    if (item?.type === 'folder') {
      onDrop(e, item);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (file) => {
    const extension = file?.name?.split('.')?.pop()?.toLowerCase();
    const iconMap = {
      'pdf': 'FileText',
      'txt': 'FileText',
      'log': 'FileText',
      'exe': 'Settings',
      'mp3': 'Music',
      'mp4': 'Video',
      'jpg': 'Image',
      'jpeg': 'Image',
      'png': 'Image',
      'gif': 'Image'
    };
    return iconMap?.[extension] || 'File';
  };

  const allItems = [...folders, ...files];

  if (viewMode === 'list') {
    return (
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-3 bg-surface border-b border-border text-sm font-medium text-muted-foreground">
          <div className="col-span-5">Nome</div>
          <div className="col-span-2">Dimensione</div>
          <div className="col-span-2">Tipo</div>
          <div className="col-span-3">Data modifica</div>
        </div>
        <div className="divide-y divide-border">
          {allItems?.map((item) => (
            <div
              key={item?.id}
              className={`grid grid-cols-12 gap-4 p-3 hover:bg-hover-light cursor-pointer transition-colors duration-200 ${
                selectedItems?.has(item?.id) ? 'bg-primary/10 border-l-2 border-l-primary' : ''
              } ${
                dragOverItem === item?.id ? 'bg-primary/20' : ''
              }`}
              onClick={(e) => onItemSelect(item, e)}
              onDoubleClick={() => onItemDoubleClick(item)}
              onContextMenu={(e) => onContextMenu(e, item)}
              draggable={item?.type === 'file'}
              onDragStart={(e) => onDragStart(e, item)}
              onDragOver={(e) => handleDragOver(e, item)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item)}
            >
              <div className="col-span-5 flex items-center space-x-3 min-w-0">
                <Icon 
                  name={item?.type === 'folder' ? 'Folder' : getFileIcon(item)} 
                  size={16} 
                  className="text-muted-foreground flex-shrink-0"
                />
                <span className="truncate text-sm text-foreground">{item?.name}</span>
              </div>
              
              <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                {item?.type === 'folder' ? `${item?.itemCount || 0} elementi` : formatFileSize(item?.size)}
              </div>
              
              <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                {item?.type === 'folder' ? 'Cartella' : item?.name?.split('.')?.pop()?.toUpperCase()}
              </div>
              
              <div className="col-span-3 flex items-center text-sm text-muted-foreground">
                {formatDate(item?.modifiedAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {allItems?.map((item) => (
        <div
          key={item?.id}
          className={`group relative bg-background border border-border rounded-lg p-4 hover:bg-hover-light cursor-pointer transition-all duration-200 ${
            selectedItems?.has(item?.id) ? 'ring-2 ring-primary bg-primary/5' : ''
          } ${
            dragOverItem === item?.id ? 'ring-2 ring-primary bg-primary/10' : ''
          }`}
          onClick={(e) => onItemSelect(item, e)}
          onDoubleClick={() => onItemDoubleClick(item)}
          onContextMenu={(e) => onContextMenu(e, item)}
          draggable={item?.type === 'file'}
          onDragStart={(e) => onDragStart(e, item)}
          onDragOver={(e) => handleDragOver(e, item)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, item)}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <Icon 
                name={item?.type === 'folder' ? 'Folder' : getFileIcon(item)} 
                size={32} 
                className="text-muted-foreground group-hover:text-foreground transition-colors duration-200"
              />
              {item?.type === 'folder' && item?.itemCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item?.itemCount}
                </div>
              )}
            </div>
            
            <div className="text-center min-w-0 w-full">
              <p className="text-sm text-foreground truncate font-medium">
                {item?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {item?.type === 'folder' 
                  ? `${item?.itemCount || 0} elementi`
                  : formatFileSize(item?.size)
                }
              </p>
            </div>
          </div>

          {selectedItems?.has(item?.id) && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center">
              <Icon name="Check" size={12} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FolderGrid;