import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PreviewHeader = ({ 
  file, 
  onClose, 
  onDownload, 
  onRename, 
  onDelete, 
  currentIndex, 
  totalFiles 
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileTypeIcon = (type) => {
    if (type?.startsWith('image/')) return 'Image';
    if (type?.startsWith('video/')) return 'Video';
    if (type?.startsWith('audio/')) return 'Music';
    if (type === 'application/pdf') return 'FileText';
    if (type?.startsWith('text/')) return 'FileText';
    return 'File';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-surface/80 backdrop-blur-md border-b border-border">
      {/* File Info */}
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div className="flex-shrink-0">
          <Icon 
            name={getFileTypeIcon(file?.type)} 
            size={20} 
            className="text-primary" 
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground truncate">
            {file?.name}
          </h2>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{formatFileSize(file?.size)}</span>
            <span>{file?.type}</span>
            {totalFiles > 1 && (
              <span>{currentIndex + 1} di {totalFiles}</span>
            )}
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDownload}
          className="h-9 w-9"
        >
          <Icon name="Download" size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onRename}
          className="h-9 w-9"
        >
          <Icon name="Edit" size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-9 w-9 text-error hover:text-error"
        >
          <Icon name="Trash2" size={16} />
        </Button>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-9 w-9"
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default PreviewHeader;