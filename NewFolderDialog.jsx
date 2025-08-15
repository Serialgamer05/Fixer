import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const NewFolderDialog = ({ isVisible, onClose, onCreateFolder }) => {
  const [folderName, setFolderName] = useState('Nuova cartella');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      setFolderName('Nuova cartella');
      setError('');
      setTimeout(() => {
        if (inputRef?.current) {
          inputRef?.current?.focus();
          inputRef?.current?.select();
        }
      }, 100);
    }
  }, [isVisible]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!folderName?.trim()) {
      setError('Il nome della cartella non può essere vuoto');
      return;
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars?.test(folderName)) {
      setError('Il nome contiene caratteri non validi');
      return;
    }

    onCreateFolder(folderName?.trim());
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-subtle flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-strong max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Icon name="FolderPlus" size={24} className="text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Nuova cartella</h3>
              <p className="text-sm text-muted-foreground">Crea una nuova cartella</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                ref={inputRef}
                label="Nome cartella"
                type="text"
                value={folderName}
                onChange={(e) => {
                  setFolderName(e?.target?.value);
                  setError('');
                }}
                onKeyDown={handleKeyDown}
                error={error}
                placeholder="Inserisci il nome della cartella"
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Annulla
              </Button>
              <Button type="submit" variant="default">
                <Icon name="FolderPlus" size={16} className="mr-2" />
                Crea cartella
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewFolderDialog;