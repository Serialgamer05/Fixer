import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TextPreview = ({ file }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);

  useEffect(() => {
    const loadTextContent = async () => {
      setIsLoading(true);
      try {
        // Simulate loading text content
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock text content based on file type
        let mockContent = '';
        if (file?.name?.endsWith('.txt')) {
          mockContent = `Questo è un file di testo di esempio.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sezione 1: Introduzione
- Punto importante 1
- Punto importante 2
- Punto importante 3

Sezione 2: Dettagli
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`;
        } else if (file?.name?.endsWith('.log')) {
          mockContent = `[2025-08-15 11:32:52] INFO: Applicazione avviata
[2025-08-15 11:32:53] DEBUG: Caricamento configurazione da config.json
[2025-08-15 11:32:54] INFO: Database connesso con successo
[2025-08-15 11:32:55] WARN: Cache non trovata, inizializzazione in corso
[2025-08-15 11:32:56] INFO: Cache inizializzata con 0 elementi
[2025-08-15 11:33:01] INFO: Utente 'admin' ha effettuato il login
[2025-08-15 11:33:05] DEBUG: Richiesta GET /api/files ricevuta
[2025-08-15 11:33:06] INFO: Restituiti 25 file nella risposta
[2025-08-15 11:33:10] WARN: Tentativo di accesso a file non autorizzato: /restricted/secret.txt
[2025-08-15 11:33:15] ERROR: Errore di connessione al database: timeout dopo 30s
[2025-08-15 11:33:16] INFO: Tentativo di riconnessione al database
[2025-08-15 11:33:18] INFO: Database riconnesso con successo
[2025-08-15 11:33:20] DEBUG: Operazione di backup completata
[2025-08-15 11:33:25] INFO: Sistema in esecuzione normalmente`;
        } else {
          mockContent = `Contenuto del file: ${file?.name}

Questo è un esempio di contenuto per il file selezionato.
Il sistema di anteprima supporta diversi formati di testo.

Caratteristiche:
• Visualizzazione con sintassi evidenziata
• Controlli per dimensione del testo
• Opzioni di formattazione
• Ricerca nel contenuto

Data di modifica: ${new Date()?.toLocaleDateString('it-IT')}
Dimensione: ${(file?.size / 1024)?.toFixed(2)} KB`;
        }
        
        setContent(mockContent);
      } catch (error) {
        setContent('Errore nel caricamento del contenuto del file.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTextContent();
  }, [file]);

  const handleFontSizeIncrease = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const handleFontSizeDecrease = () => {
    setFontSize(prev => Math.max(prev - 2, 10));
  };

  const handleResetFontSize = () => {
    setFontSize(14);
  };

  const getLanguageFromExtension = (filename) => {
    const ext = filename?.split('.')?.pop()?.toLowerCase();
    const languageMap = {
      'txt': 'text',
      'log': 'log',
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'css': 'css',
      'html': 'html',
      'json': 'json',
      'xml': 'xml',
      'md': 'markdown'
    };
    return languageMap?.[ext] || 'text';
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">Caricamento contenuto...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Text Controls */}
      <div className="flex items-center justify-between p-4 bg-surface/50 border-b border-border">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">
            Tipo: {getLanguageFromExtension(file?.name)?.toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 bg-card rounded-lg p-2 shadow-subtle">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFontSizeDecrease}
            className="h-8 w-8"
          >
            <Icon name="Minus" size={14} />
          </Button>
          
          <span className="text-sm font-medium text-foreground min-w-[40px] text-center">
            {fontSize}px
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFontSizeIncrease}
            className="h-8 w-8"
          >
            <Icon name="Plus" size={14} />
          </Button>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetFontSize}
            className="h-8 w-8"
          >
            <Icon name="RotateCcw" size={14} />
          </Button>
          
          <Button
            variant={wordWrap ? "default" : "ghost"}
            size="icon"
            onClick={() => setWordWrap(!wordWrap)}
            className="h-8 w-8"
          >
            <Icon name="WrapText" size={14} />
          </Button>
        </div>
      </div>
      {/* Text Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-none">
          <pre
            className={`font-mono text-foreground leading-relaxed ${
              wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'
            }`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {content}
          </pre>
        </div>
      </div>
      {/* Text Info */}
      <div className="p-4 bg-surface/50 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Righe: {content?.split('\n')?.length}</span>
          <span>Caratteri: {content?.length}</span>
          <span>Parole: {content?.split(/\s+/)?.filter(word => word?.length > 0)?.length}</span>
        </div>
      </div>
    </div>
  );
};

export default TextPreview;