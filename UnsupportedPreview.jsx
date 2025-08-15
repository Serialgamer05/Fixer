import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UnsupportedPreview = ({ file, onDownload }) => {
  const getFileTypeIcon = (type) => {
    if (type === 'application/x-msdownload' || file?.name?.endsWith('.exe')) return 'Settings';
    if (type?.startsWith('application/')) return 'FileText';
    if (type?.startsWith('text/')) return 'FileText';
    return 'File';
  };

  const getFileTypeDescription = (type, name) => {
    if (type === 'application/x-msdownload' || name?.endsWith('.exe')) {
      return 'File Eseguibile Windows';
    }
    if (type?.startsWith('application/zip') || name?.endsWith('.zip')) {
      return 'Archivio Compresso';
    }
    if (type?.startsWith('application/')) {
      return 'File Applicazione';
    }
    return 'Tipo di File Non Riconosciuto';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getSuggestions = (type, name) => {
    if (type === 'application/x-msdownload' || name?.endsWith('.exe')) {
      return [
        'Questo file può essere eseguito solo su sistemi Windows',
        'Assicurati che il file provenga da una fonte attendibile',
        'Scansiona il file con un antivirus prima dell\'esecuzione'
      ];
    }
    if (name?.endsWith('.zip') || name?.endsWith('.rar')) {
      return [
        'Usa un programma di estrazione come WinRAR o 7-Zip',
        'Il contenuto dell\'archivio sarà visibile dopo l\'estrazione',
        'Controlla la dimensione dell\'archivio prima dell\'estrazione'
      ];
    }
    return [
      'Questo tipo di file non supporta l\'anteprima nel browser',
      'Scarica il file per aprirlo con l\'applicazione appropriata',
      'Verifica di avere il software necessario per aprire questo file'
    ];
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md space-y-6">
          {/* File Icon */}
          <div className="w-24 h-24 mx-auto bg-muted/30 rounded-2xl flex items-center justify-center">
            <Icon 
              name={getFileTypeIcon(file?.type)} 
              size={48} 
              className="text-muted-foreground" 
            />
          </div>

          {/* File Info */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {file?.name}
            </h3>
            <p className="text-muted-foreground">
              {getFileTypeDescription(file?.type, file?.name)}
            </p>
            <p className="text-sm text-muted-foreground">
              Dimensione: {formatFileSize(file?.size)}
            </p>
          </div>

          {/* Message */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium text-foreground mb-2">
                  Anteprima Non Disponibile
                </h4>
                <p className="text-sm text-muted-foreground">
                  Questo tipo di file non può essere visualizzato direttamente nel browser. 
                  Scarica il file per aprirlo con l'applicazione appropriata.
                </p>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-surface/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center">
              <Icon name="Lightbulb" size={16} className="mr-2 text-warning" />
              Suggerimenti
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              {getSuggestions(file?.type, file?.name)?.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="default"
              onClick={onDownload}
              className="flex items-center space-x-2"
            >
              <Icon name="Download" size={16} />
              <span>Scarica File</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                // Mock opening in external app
                console.log('Opening in external app:', file?.name);
              }}
              className="flex items-center space-x-2"
            >
              <Icon name="ExternalLink" size={16} />
              <span>Apri Esternamente</span>
            </Button>
          </div>
        </div>
      </div>
      {/* File Details */}
      <div className="p-4 bg-surface/50 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Tipo:</span>
            <p className="font-medium text-foreground">{file?.type || 'Sconosciuto'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Dimensione:</span>
            <p className="font-medium text-foreground">{formatFileSize(file?.size)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Modificato:</span>
            <p className="font-medium text-foreground">
              {new Date(file.lastModified || Date.now())?.toLocaleDateString('it-IT')}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Estensione:</span>
            <p className="font-medium text-foreground">
              {file?.name?.split('.')?.pop()?.toUpperCase() || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnsupportedPreview;