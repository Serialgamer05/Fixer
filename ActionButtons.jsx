import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ file, onAction, onClose }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (actionType) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      onAction(actionType, file);
      
      if (actionType === 'delete') {
        onClose();
      }
    } catch (error) {
      console.error('Errore durante l\'operazione:', error);
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    handleAction('delete');
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (showDeleteConfirm) {
    return (
      <div className="flex flex-col space-y-4 p-4 bg-error/5 border border-error/20 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-error" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-foreground">Conferma eliminazione</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Sei sicuro di voler eliminare "{file?.name}"? Questa azione non può essere annullata.
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteCancel}
            disabled={isProcessing}
          >
            Annulla
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteConfirm}
            loading={isProcessing}
          >
            <Icon name="Trash2" size={14} className="mr-1" />
            Elimina
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction('rename')}
        disabled={isProcessing}
        className="flex items-center justify-center"
      >
        <Icon name="Edit2" size={14} className="mr-1" />
        Rinomina
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction('move')}
        disabled={isProcessing}
        className="flex items-center justify-center"
      >
        <Icon name="FolderOpen" size={14} className="mr-1" />
        Sposta
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction('copy')}
        disabled={isProcessing}
        className="flex items-center justify-center"
      >
        <Icon name="Copy" size={14} className="mr-1" />
        Copia
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={handleDeleteClick}
        disabled={isProcessing}
        className="flex items-center justify-center"
      >
        <Icon name="Trash2" size={14} className="mr-1" />
        Elimina
      </Button>
    </div>
  );
};

export default ActionButtons;