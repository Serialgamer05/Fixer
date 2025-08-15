import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadQueue = ({ files, onRemoveFile, onClearAll, onRetryFile }) => {
  if (files?.length === 0) return null;

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    const iconMap = {
      pdf: 'FileText',
      txt: 'FileText',
      log: 'FileText',
      exe: 'Settings',
      mp3: 'Music',
      mp4: 'Video',
      jpg: 'Image',
      jpeg: 'Image',
      png: 'Image',
      gif: 'Image',
      zip: 'Archive',
      rar: 'Archive',
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'uploading':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      case 'uploading':
        return 'Loader2';
      default:
        return 'Clock';
    }
  };

  const totalFiles = files?.length;
  const completedFiles = files?.filter(f => f?.status === 'completed')?.length;
  const errorFiles = files?.filter(f => f?.status === 'error')?.length;
  const uploadingFiles = files?.filter(f => f?.status === 'uploading')?.length;

  const overallProgress = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Upload" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Coda di Caricamento</h3>
          <span className="text-sm text-muted-foreground">
            ({completedFiles}/{totalFiles} completati)
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {errorFiles > 0 && (
            <Button
              variant="outline"
              size="sm"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={() => files?.filter(f => f?.status === 'error')?.forEach(f => onRetryFile(f?.id))}
            >
              Riprova Errori
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClearAll}
          >
            Cancella Tutto
          </Button>
        </div>
      </div>
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-foreground font-medium">Progresso Totale</span>
          <span className="text-muted-foreground">{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{uploadingFiles} caricamento</span>
          <span>{errorFiles} errori</span>
        </div>
      </div>
      {/* File List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {files?.map((file) => (
          <div
            key={file?.id}
            className="flex items-center space-x-3 p-3 bg-surface rounded-lg border border-border"
          >
            {/* File Icon */}
            <div className="flex-shrink-0">
              <Icon
                name={getFileIcon(file?.name)}
                size={20}
                className="text-muted-foreground"
              />
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {file?.name}
                </p>
                <div className="flex items-center space-x-2">
                  <Icon
                    name={getStatusIcon(file?.status)}
                    size={16}
                    className={`${getStatusColor(file?.status)} ${
                      file?.status === 'uploading' ? 'animate-spin' : ''
                    }`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveFile(file?.id)}
                    className="h-6 w-6"
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{formatFileSize(file?.size)}</span>
                <span>
                  {file?.status === 'uploading' && `${file?.progress}%`}
                  {file?.status === 'completed' && 'Completato'}
                  {file?.status === 'error' && 'Errore'}
                  {file?.status === 'pending' && 'In attesa'}
                </span>
              </div>

              {/* Progress Bar */}
              {(file?.status === 'uploading' || file?.status === 'completed') && (
                <div className="w-full bg-muted rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      file?.status === 'completed' ? 'bg-success' : 'bg-primary'
                    }`}
                    style={{ width: `${file?.progress}%` }}
                  />
                </div>
              )}

              {/* Error Message */}
              {file?.status === 'error' && file?.error && (
                <p className="text-xs text-error mt-1">{file?.error}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Upload Stats */}
      <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
        <span>{totalFiles} file totali</span>
        <span>
          {uploadingFiles > 0 && `${uploadingFiles} in caricamento • `}
          {completedFiles} completati
          {errorFiles > 0 && ` • ${errorFiles} errori`}
        </span>
      </div>
    </div>
  );
};

export default UploadQueue;