import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadZone = ({ onFilesUpload, isVisible, onClose }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  const handleDragOver = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    if (files?.length > 0) {
      handleFileUpload(files);
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e?.target?.files);
    if (files?.length > 0) {
      handleFileUpload(files);
    }
  }, []);

  const handleFileUpload = async (files) => {
    setUploadProgress(0);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }
    
    // Process files
    const processedFiles = files?.map(file => ({
      id: Date.now() + Math.random(),
      name: file?.name,
      size: file?.size,
      type: 'file',
      modifiedAt: new Date(),
      file: file
    }));
    
    onFilesUpload(processedFiles);
    setUploadProgress(null);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-subtle flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-strong max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Carica file</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={16} />
            </Button>
          </div>

          {uploadProgress !== null ? (
            <div className="space-y-4">
              <div className="text-center">
                <Icon name="Upload" size={48} className="text-primary mx-auto mb-2" />
                <p className="text-foreground">Caricamento in corso...</p>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-center text-sm text-muted-foreground">{uploadProgress}%</p>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                isDragOver 
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Icon 
                name="Upload" 
                size={48} 
                className={`mx-auto mb-4 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} 
              />
              <h4 className="text-lg font-medium text-foreground mb-2">
                Trascina i file qui
              </h4>
              <p className="text-muted-foreground mb-4">
                oppure clicca per selezionare i file
              </p>
              
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept=".exe,.pdf,.log,.txt,.mp3,.mp4,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.zip,.rar"
              />
              
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Seleziona file
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                Formati supportati: EXE, PDF, LOG, TXT, MP3, MP4, JPG, PNG, DOC, XLS, ZIP
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadZone;