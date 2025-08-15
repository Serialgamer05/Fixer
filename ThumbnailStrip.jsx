import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ThumbnailStrip = ({ files, currentIndex, onFileSelect }) => {
  if (!files || files?.length <= 1) return null;

  const getFileTypeIcon = (type) => {
    if (type?.startsWith('image/')) return 'Image';
    if (type?.startsWith('video/')) return 'Video';
    if (type?.startsWith('audio/')) return 'Music';
    if (type === 'application/pdf') return 'FileText';
    if (type?.startsWith('text/')) return 'FileText';
    return 'File';
  };

  const getThumbnailUrl = (file) => {
    if (file?.type?.startsWith('image/')) {
      return file?.url;
    }
    return null;
  };

  return (
    <div className="bg-surface/80 backdrop-blur-md border-t border-border p-4">
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-thin">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap mr-4">
          File correlati:
        </span>
        
        <div className="flex space-x-2">
          {files?.map((file, index) => {
            const isActive = index === currentIndex;
            const thumbnailUrl = getThumbnailUrl(file);
            
            return (
              <Button
                key={index}
                variant={isActive ? "default" : "ghost"}
                onClick={() => onFileSelect(index)}
                className={`flex-shrink-0 h-16 w-16 p-1 ${
                  isActive ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
              >
                <div className="w-full h-full rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={file?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon 
                      name={getFileTypeIcon(file?.type)} 
                      size={20} 
                      className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
                    />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThumbnailStrip;