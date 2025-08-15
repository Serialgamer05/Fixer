import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  items 
}) => {
  if (!isOpen || !items || items?.length === 0) return null;

  const isMultiple = items?.length > 1;
  const hasFolder = items?.some(item => item?.type === 'folder');

  const getTitle = () => {
    if (isMultiple) {
      return `Elimina ${items?.length} elementi`;
    }
    return items?.[0]?.type === 'folder' ? 'Elimina cartella' : 'Elimina file';
  };

  const getMessage = () => {
    if (isMultiple) {
      const folderCount = items?.filter(item => item?.type === 'folder')?.length;
      const fileCount = items?.filter(item => item?.type === 'file')?.length;
      
      let message = `Sei sicuro di voler eliminare ${items?.length} elementi?`;
      if (folderCount > 0 && fileCount > 0) {
        message += `\n\nInclude ${folderCount} cartella${folderCount > 1 ? 'e' : ''} e ${fileCount} file.`;
      } else if (folderCount > 0) {
        message += `\n\nInclude ${folderCount} cartella${folderCount > 1 ? 'e' : ''}.`;
      } else {
        message += `\n\nInclude ${fileCount} file.`;
      }
      
      if (hasFolder) {
        message += '\n\nLe cartelle e tutto il loro contenuto verranno eliminati definitivamente.';
      }
      
      return message;
    }

    const item = items?.[0];
    if (item?.type === 'folder') {
      return `Sei sicuro di voler eliminare la cartella "${item?.name}"?\n\nLa cartella e tutto il suo contenuto verranno eliminati definitivamente.`;
    }
    
    return `Sei sicuro di voler eliminare il file "${item?.name}"?\n\nIl file verrà eliminato definitivamente.`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-subtle"
        onClick={onClose}
      />
      
      <div className="relative bg-background border border-border rounded-lg shadow-strong w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-error/10 rounded-lg">
              <Icon name="Trash2" size={20} className="text-error" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {getTitle()}
            </h2>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-foreground whitespace-pre-line">
              {getMessage()}
            </p>

            {hasFolder && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-warning">
                    <p className="font-medium">Attenzione!</p>
                    <p className="mt-1">Questa azione non può essere annullata.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Annulla
            </Button>
            
            <Button
              variant="destructive"
              onClick={() => {
                onConfirm(items);
                onClose();
              }}
              iconName="Trash2"
              iconPosition="left"
            >
              {isMultiple ? 'Elimina tutto' : 'Elimina'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;