import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const GeneralTab = ({ file, onUpdateFile, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(file?.name);

  const handleSaveEdit = () => {
    if (editedName?.trim() && editedName !== file?.name) {
      onUpdateFile({ ...file, name: editedName?.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(file?.name);
    setIsEditing(false);
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

  const getFileIcon = (type) => {
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
    return iconMap?.[type?.toLowerCase()] || 'File';
  };

  const isImageFile = (type) => {
    return ['jpg', 'jpeg', 'png', 'gif']?.includes(type?.toLowerCase());
  };

  return (
    <div className="space-y-6">
      {/* File Icon/Thumbnail and Name */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {isImageFile(file?.type) ? (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface border border-border">
              <Image
                src={file?.thumbnail || `https://picsum.photos/64/64?random=${file?.id}`}
                alt={file?.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name={getFileIcon(file?.type)} size={32} className="text-primary" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e?.target?.value)}
                className="text-lg font-medium"
                onKeyDown={(e) => {
                  if (e?.key === 'Enter') handleSaveEdit();
                  if (e?.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleSaveEdit}>
                  <Icon name="Check" size={14} className="mr-1" />
                  Salva
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  <Icon name="X" size={14} className="mr-1" />
                  Annulla
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-foreground truncate">{file?.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6"
                >
                  <Icon name="Edit2" size={14} />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">File {file?.type?.toUpperCase()}</p>
            </div>
          )}
        </div>
      </div>
      {/* File Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tipo</label>
            <p className="text-sm text-foreground mt-1">File {file?.type?.toUpperCase()}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Dimensione</label>
            <p className="text-sm text-foreground mt-1">{formatFileSize(file?.size)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Posizione</label>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-sm text-foreground truncate">{file?.path}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigator.clipboard?.writeText(file?.path)}
                className="h-6 w-6"
              >
                <Icon name="Copy" size={12} />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Creato</label>
            <p className="text-sm text-foreground mt-1">{formatDate(file?.createdAt)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Modificato</label>
            <p className="text-sm text-foreground mt-1">{formatDate(file?.modifiedAt)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Ultimo accesso</label>
            <p className="text-sm text-foreground mt-1">{formatDate(file?.accessedAt)}</p>
          </div>
        </div>
      </div>
      {/* File Attributes */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">Attributi</label>
        <div className="flex flex-wrap gap-2">
          {file?.attributes?.map((attr, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-surface text-foreground border border-border"
            >
              {attr}
            </span>
          ))}
        </div>
      </div>
      {/* Description */}
      {file?.description && (
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Descrizione</label>
          <p className="text-sm text-foreground bg-surface rounded-lg p-3 border border-border">
            {file?.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default GeneralTab;