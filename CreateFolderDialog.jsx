import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateFolderDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  parentFolder 
}) => {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFolderName('Nuova cartella');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!folderName?.trim()) {
      setError('Il nome della cartella è obbligatorio');
      return;
    }

    if (folderName?.trim()?.length > 255) {
      setError('Il nome della cartella è troppo lungo');
      return;
    }

    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars?.test(folderName?.trim())) {
      setError('Il nome contiene caratteri non validi');
      return;
    }

    onConfirm(folderName?.trim());
    onClose();
  };

  const handleCancel = () => {
    setFolderName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-subtle"
        onClick={handleCancel}
      />
      <div className="relative bg-background border border-border rounded-lg shadow-strong w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="FolderPlus" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Crea nuova cartella
              </h2>
              <p className="text-sm text-muted-foreground">
                {parentFolder ? `in ${parentFolder?.name}` : 'nella cartella corrente'}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input
            label="Nome cartella"
            type="text"
            value={folderName}
            onChange={(e) => {
              setFolderName(e?.target?.value);
              setError('');
            }}
            error={error}
            placeholder="Inserisci il nome della cartella"
            required
            autoFocus
            className="w-full"
          />

          <div className="bg-surface border border-border rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Regole per il nome:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Non può contenere: &lt; &gt; : " / \ | ? *</li>
                  <li>• Massimo 255 caratteri</li>
                  <li>• Non può essere vuoto</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Annulla
            </Button>
            
            <Button
              type="submit"
              variant="default"
              iconName="FolderPlus"
              iconPosition="left"
            >
              Crea cartella
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderDialog;