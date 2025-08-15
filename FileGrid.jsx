import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';


const FileGrid = ({ 
  files, 
  viewMode, 
  selectedFiles, 
  onFileSelect, 
  onFileDoubleClick, 
  onContextMenu,
  onDragStart,
  onDrop,
  onDragOver 
}) => {
  const [draggedOver, setDraggedOver] = useState(null);

  const getFileIcon = (file) => {
    const extension = file?.name?.split('.')?.pop()?.toLowerCase();
    const iconMap = {
      'exe': 'Settings',
      'pdf': 'FileText',
      'log': 'FileText',
      'txt': 'FileText',
      'mp3': 'Music',
      'mp4': 'Video',
      'jpg': 'Image',
      'jpeg': 'Image',
      'png': 'Image',
      'gif': 'Image',
      'doc': 'FileText',
      'docx': 'FileText',
      'xls': 'FileText',
      'xlsx': 'FileText',
      'zip': 'Archive',
      'rar': 'Archive',
      'folder': 'Folder'
    };
    return iconMap?.[extension] || 'File';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
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

  const handleDragOver = useCallback((e, fileId) => {
    e?.preventDefault();
    setDraggedOver(fileId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDraggedOver(null);
  }, []);

  const handleDrop = useCallback((e, targetId) => {
    e?.preventDefault();
    setDraggedOver(null);
    onDrop(e, targetId);
  }, [onDrop]);

  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 p-3 bg-surface border-b border-border text-sm font-medium text-muted-foreground">
          <div className="col-span-1"></div>
          <div className="col-span-5">Nome</div>
          <div className="col-span-2">Dimensione</div>
          <div className="col-span-2">Tipo</div>
          <div className="col-span-2">Modificato</div>
        </div>
        {/* List Items */}
        <div className="divide-y divide-border">
          {files?.map((file) => (
            <div
              key={file?.id}
              className={`grid grid-cols-12 gap-4 p-3 hover:bg-hover-light cursor-pointer transition-colors duration-200 ${
                selectedFiles?.includes(file?.id) ? 'bg-primary/10 border-l-2 border-l-primary' : ''
              } ${draggedOver === file?.id ? 'bg-accent/20' : ''}`}
              onClick={(e) => onFileSelect(file?.id, e)}
              onDoubleClick={() => onFileDoubleClick(file)}
              onContextMenu={(e) => onContextMenu(e, file)}
              draggable={file?.type !== 'folder'}
              onDragStart={(e) => onDragStart(e, file)}
              onDragOver={(e) => handleDragOver(e, file?.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, file?.id)}
            >
              {/* Checkbox */}
              <div className="col-span-1 flex items-center">
                <div className={`w-4 h-4 border border-border rounded transition-all duration-200 ${
                  selectedFiles?.includes(file?.id) 
                    ? 'bg-primary border-primary' :'hover:border-primary/50'
                }`}>
                  {selectedFiles?.includes(file?.id) && (
                    <Icon name="Check" size={12} className="text-primary-foreground m-0.5" />
                  )}
                </div>
              </div>

              {/* Name with Icon */}
              <div className="col-span-5 flex items-center space-x-3 min-w-0">
                <Icon 
                  name={getFileIcon(file)} 
                  size={20} 
                  className={file?.type === 'folder' ? 'text-accent' : 'text-muted-foreground'} 
                />
                <span className="truncate text-foreground">{file?.name}</span>
              </div>

              {/* Size */}
              <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                {file?.type === 'folder' ? '-' : formatFileSize(file?.size)}
              </div>

              {/* Type */}
              <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                {file?.type === 'folder' ? 'Cartella' : file?.name?.split('.')?.pop()?.toUpperCase()}
              </div>

              {/* Modified Date */}
              <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                {formatDate(file?.modifiedAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {files?.map((file) => (
        <div
          key={file?.id}
          className={`group relative bg-card border border-border rounded-lg p-4 hover:bg-hover-light cursor-pointer transition-all duration-200 ${
            selectedFiles?.includes(file?.id) ? 'ring-2 ring-primary bg-primary/5' : ''
          } ${draggedOver === file?.id ? 'ring-2 ring-accent bg-accent/10' : ''}`}
          onClick={(e) => onFileSelect(file?.id, e)}
          onDoubleClick={() => onFileDoubleClick(file)}
          onContextMenu={(e) => onContextMenu(e, file)}
          draggable={file?.type !== 'folder'}
          onDragStart={(e) => onDragStart(e, file)}
          onDragOver={(e) => handleDragOver(e, file?.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, file?.id)}
        >
          {/* Selection Checkbox */}
          <div className={`absolute top-2 left-2 w-4 h-4 border border-border rounded transition-all duration-200 ${
            selectedFiles?.includes(file?.id) || draggedOver === file?.id
              ? 'opacity-100' :'opacity-0 group-hover:opacity-100'
          } ${selectedFiles?.includes(file?.id) ? 'bg-primary border-primary' : 'bg-background'}`}>
            {selectedFiles?.includes(file?.id) && (
              <Icon name="Check" size={12} className="text-primary-foreground m-0.5" />
            )}
          </div>

          {/* File Icon */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <Icon 
                name={getFileIcon(file)} 
                size={32} 
                className={file?.type === 'folder' ? 'text-accent' : 'text-muted-foreground'} 
              />
            </div>

            {/* File Name */}
            <div className="text-center">
              <p className="text-sm font-medium text-foreground truncate w-full" title={file?.name}>
                {file?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {file?.type === 'folder' ? 'Cartella' : formatFileSize(file?.size)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGrid;