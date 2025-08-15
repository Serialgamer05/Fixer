import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusBar = ({ selectedCount, totalFiles, totalSize, storageUsed, storageTotal }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const storagePercentage = (storageUsed / storageTotal) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-4 py-2 z-10">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {/* Left Section - Selection Info */}
        <div className="flex items-center space-x-6">
          {selectedCount > 0 ? (
            <div className="flex items-center space-x-2">
              <Icon name="CheckSquare" size={14} />
              <span>{selectedCount} elementi selezionati</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Icon name="Files" size={14} />
              <span>{totalFiles} elementi</span>
            </div>
          )}

          {totalSize > 0 && (
            <div className="flex items-center space-x-2">
              <Icon name="HardDrive" size={14} />
              <span>{formatFileSize(totalSize)}</span>
            </div>
          )}
        </div>

        {/* Right Section - Storage Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span>Spazio utilizzato: {formatFileSize(storageUsed)} di {formatFileSize(storageTotal)}</span>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  storagePercentage > 90 ? 'bg-error' : 
                  storagePercentage > 75 ? 'bg-warning' : 'bg-primary'
                }`}
                style={{ width: `${Math.min(storagePercentage, 100)}%` }}
              />
            </div>
            <span className="text-xs">{storagePercentage?.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;