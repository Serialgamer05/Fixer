import React, { useState, useRef, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadZone = ({ onFilesSelected, isUploading, acceptedTypes = [] }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!e?.currentTarget?.contains(e?.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e?.dataTransfer?.files);
    if (files?.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileInputChange = useCallback((e) => {
    const files = Array.from(e?.target?.files || []);
    if (files?.length > 0) {
      onFilesSelected(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [onFilesSelected]);

  const handleBrowseClick = () => {
    fileInputRef?.current?.click();
  };

  const acceptString = acceptedTypes?.length > 0 ? acceptedTypes?.join(',') : '*/*';

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
        isDragOver
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : isUploading
          ? 'border-muted-foreground/30 bg-muted/20'
          : 'border-muted-foreground/40 bg-surface hover:border-primary/60 hover:bg-primary/5'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptString}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />
      <div className="flex flex-col items-center space-y-4">
        <div className={`p-4 rounded-full transition-colors duration-200 ${
          isDragOver ? 'bg-primary/10' : 'bg-muted/50'
        }`}>
          <Icon 
            name={isDragOver ? 'Download' : 'Upload'} 
            size={48} 
            className={`transition-colors duration-200 ${
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            }`}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {isDragOver ? 'Rilascia i file qui' : 'Carica i tuoi file'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {isDragOver 
              ? 'Rilascia i file per iniziare il caricamento' :'Trascina e rilascia i file qui o fai clic per sfogliare'
            }
          </p>
        </div>

        {!isUploading && (
          <Button
            variant="outline"
            onClick={handleBrowseClick}
            iconName="FolderOpen"
            iconPosition="left"
            className="mt-4"
          >
            Sfoglia File
          </Button>
        )}

        {acceptedTypes?.length > 0 && (
          <div className="text-xs text-muted-foreground mt-4">
            <p>Tipi di file supportati:</p>
            <p className="font-mono">{acceptedTypes?.join(', ')}</p>
          </div>
        )}
      </div>
      {isUploading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin">
              <Icon name="Loader2" size={20} className="text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Caricamento in corso...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;