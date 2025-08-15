import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmDialog = ({ isVisible, files, onClose, onConfirm }) => {
  if (!isVisible || !files || files?.length === 0) return null;

  const isMultiple = files?.length > 1;
  const fileName = isMultiple ? `${files?.length} elementi` : files?.[0]?.name;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-subtle flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-strong max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
              <Icon name="Trash2" size={24} className="text-error" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Conferma eliminazione</h3>
              <p className="text-sm text-muted-foreground">Questa azione non può essere annullata</p>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-4 mb-6">
            <p className="text-foreground">
              {isMultiple 
                ? `Sei sicuro di voler eliminare ${files?.length} elementi selezionati?`
                : `Sei sicuro di voler eliminare "${fileName}"?`
              }
            </p>
            
            {isMultiple && (
              <div className="mt-3 space-y-1">
                {files?.slice(0, 3)?.map((file) => (
                  <div key={file?.id} className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name={file?.type === 'folder' ? 'Folder' : 'File'} size={14} />
                    <span className="truncate">{file?.name}</span>
                  </div>
                ))}
                {files?.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    e altri {files?.length - 3} elementi...
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={() => {
              onConfirm(files);
              onClose();
            }}>
              <Icon name="Trash2" size={16} className="mr-2" />
              Elimina {isMultiple ? 'elementi' : 'elemento'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;