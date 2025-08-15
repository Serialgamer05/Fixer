import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileValidation = ({ validationErrors, onDismissError, onRetryFile }) => {
  if (!validationErrors || validationErrors?.length === 0) return null;

  const getErrorIcon = (errorType) => {
    switch (errorType) {
      case 'size':
        return 'AlertTriangle';
      case 'type':
        return 'FileX';
      case 'duplicate':
        return 'Copy';
      default:
        return 'AlertCircle';
    }
  };

  const getErrorTitle = (errorType) => {
    switch (errorType) {
      case 'size':
        return 'File Troppo Grande';
      case 'type':
        return 'Tipo File Non Supportato';
      case 'duplicate':
        return 'File Duplicato';
      default:
        return 'Errore di Validazione';
    }
  };

  const getErrorDescription = (error) => {
    switch (error?.type) {
      case 'size':
        return `Il file "${error?.fileName}" supera la dimensione massima consentita di ${error?.maxSize}.`;
      case 'type':
        return `Il tipo di file "${error?.fileType}" non è supportato. Tipi consentiti: ${error?.allowedTypes?.join(', ')}.`;
      case 'duplicate':
        return `Il file "${error?.fileName}" esiste già nella cartella di destinazione.`;
      default:
        return error?.message || 'Si è verificato un errore durante la validazione del file.';
    }
  };

  const getSuggestion = (errorType) => {
    switch (errorType) {
      case 'size':
        return 'Prova a comprimere il file o scegli un file più piccolo.';
      case 'type':
        return 'Converti il file in un formato supportato prima di caricarlo.';
      case 'duplicate':
        return 'Rinomina il file o scegli di sostituire quello esistente.';
      default:
        return 'Controlla il file e riprova.';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Icon name="AlertTriangle" size={20} className="text-warning" />
        <h3 className="text-lg font-semibold text-foreground">Errori di Validazione</h3>
        <span className="text-sm text-muted-foreground">
          ({validationErrors?.length} {validationErrors?.length === 1 ? 'errore' : 'errori'})
        </span>
      </div>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {validationErrors?.map((error, index) => (
          <div
            key={`${error?.fileName}-${index}`}
            className="bg-surface border border-border rounded-lg p-3 space-y-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2 flex-1">
                <Icon
                  name={getErrorIcon(error?.type)}
                  size={16}
                  className="text-error mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground">
                    {getErrorTitle(error?.type)}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getErrorDescription(error)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    {getSuggestion(error?.type)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDismissError(index)}
                className="h-6 w-6 flex-shrink-0"
              >
                <Icon name="X" size={12} />
              </Button>
            </div>

            {/* Action Buttons for specific error types */}
            {error?.type === 'duplicate' && (
              <div className="flex items-center space-x-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Copy"
                  iconPosition="left"
                  onClick={() => onRetryFile?.(error?.fileId, 'rename')}
                >
                  Rinomina
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={() => onRetryFile?.(error?.fileId, 'replace')}
                >
                  Sostituisci
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Risolvi questi errori per continuare con il caricamento
        </p>
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          onClick={() => validationErrors?.forEach((_, index) => onDismissError(index))}
        >
          Dismissi Tutti
        </Button>
      </div>
    </div>
  );
};

export default FileValidation;