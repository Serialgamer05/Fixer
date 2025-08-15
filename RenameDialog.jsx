import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const RenameDialog = ({ isVisible, file, onClose, onRename }) => {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isVisible && file) {
      setNewName(file?.name);
      setError('');
      setTimeout(() => {
        if (inputRef?.current) {
          inputRef?.current?.focus();
          // Select filename without extension
          const dotIndex = file?.name?.lastIndexOf('.');
          if (dotIndex > 0) {
            inputRef?.current?.setSelectionRange(0, dotIndex);
          } else {
            inputRef?.current?.select();
          }
        }
      }, 100);
    }
  }, [isVisible, file]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!newName?.trim()) {
      setError('Il nome del file non può essere vuoto');
      return;
    }

    if (newName === file?.name) {
      onClose();
      return;
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars?.test(newName)) {
      setError('Il nome contiene caratteri non validi');
      return;
    }

    onRename(file?.id, newName?.trim());
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') {
      onClose();
    }
  };

  if (!isVisible || !file) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-subtle flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-strong max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Icon name="Edit" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Rinomina elemento</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                ref={inputRef}
                label="Nuovo nome"
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e?.target?.value);
                  setError('');
                }}
                onKeyDown={handleKeyDown}
                error={error}
                placeholder="Inserisci il nuovo nome"
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Annulla
              </Button>
              <Button type="submit" variant="default">
                Rinomina
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RenameDialog;