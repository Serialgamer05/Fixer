import React from 'react';
import Icon from '../../../components/AppIcon';

const DetailsTab = ({ file }) => {
  const getFileDetails = (file) => {
    const baseDetails = [
      { label: 'Nome completo', value: file?.name },
      { label: 'Estensione', value: `.${file?.type}` },
      { label: 'Dimensione su disco', value: formatFileSize(file?.size + 1024) },
      { label: 'Checksum MD5', value: generateMockChecksum(file?.id) },
    ];

    // Add type-specific details
    switch (file?.type?.toLowerCase()) {
      case 'mp3':
        return [
          ...baseDetails,
          { label: 'Durata', value: '3:45' },
          { label: 'Bitrate', value: '320 kbps' },
          { label: 'Frequenza', value: '44.1 kHz' },
          { label: 'Canali', value: 'Stereo' },
          { label: 'Artista', value: 'Artista Sconosciuto' },
          { label: 'Album', value: 'Album Sconosciuto' },
          { label: 'Anno', value: '2023' },
          { label: 'Genere', value: 'Musica' }
        ];
      
      case 'mp4':
        return [
          ...baseDetails,
          { label: 'Durata', value: '2:30:15' },
          { label: 'Risoluzione', value: '1920x1080' },
          { label: 'Frame rate', value: '30 fps' },
          { label: 'Codec video', value: 'H.264' },
          { label: 'Codec audio', value: 'AAC' },
          { label: 'Bitrate video', value: '5000 kbps' },
          { label: 'Bitrate audio', value: '128 kbps' }
        ];
      
      case 'pdf':
        return [
          ...baseDetails,
          { label: 'Pagine', value: '24' },
          { label: 'Versione PDF', value: '1.7' },
          { label: 'Autore', value: 'Utente' },
          { label: 'Creatore', value: 'Microsoft Word' },
          { label: 'Produttore', value: 'Microsoft Print to PDF' },
          { label: 'Soggetto', value: 'Documento importante' },
          { label: 'Parole chiave', value: 'business, report, 2024' }
        ];
      
      case 'exe':
        return [
          ...baseDetails,
          { label: 'Versione file', value: '1.0.0.0' },
          { label: 'Versione prodotto', value: '1.0.0' },
          { label: 'Descrizione', value: 'Applicazione Windows' },
          { label: 'Copyright', value: '© 2024 Sviluppatore' },
          { label: 'Azienda', value: 'Nome Azienda' },
          { label: 'Architettura', value: 'x64' },
          { label: 'Sottosistema', value: 'Windows GUI' }
        ];
      
      case 'txt': case'log':
        return [
          ...baseDetails,
          { label: 'Righe', value: '1,247' },
          { label: 'Parole', value: '8,934' },
          { label: 'Caratteri', value: '52,108' },
          { label: 'Codifica', value: 'UTF-8' },
          { label: 'Terminatori di riga', value: 'CRLF (Windows)' },
          { label: 'Lingua', value: 'Italiano' }
        ];
      
      case 'jpg': case'jpeg': case'png': case'gif':
        return [
          ...baseDetails,
          { label: 'Dimensioni', value: '1920 x 1080 pixel' },
          { label: 'Profondità colore', value: '24 bit' },
          { label: 'DPI', value: '96 x 96' },
          { label: 'Spazio colore', value: 'sRGB' },
          { label: 'Compressione', value: file?.type?.toUpperCase() },
          { label: 'Orientamento', value: 'Orizzontale' },
          { label: 'Fotocamera', value: 'Canon EOS R5' },
          { label: 'Data scatto', value: '15/08/2024 14:30:15' }
        ];
      
      default:
        return baseDetails;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const generateMockChecksum = (id) => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars?.[Math.floor((id + i) % chars?.length)];
    }
    return result;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  const details = getFileDetails(file);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {details?.map((detail, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">{detail?.label}</label>
            </div>
            <div className="flex items-center space-x-2 flex-1 justify-end">
              <span className="text-sm text-foreground text-right break-all">{detail?.value}</span>
              <button
                onClick={() => copyToClipboard(detail?.value)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-hover-light rounded"
                title="Copia negli appunti"
              >
                <Icon name="Copy" size={12} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Technical Information Section */}
      <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Info" size={16} className="text-primary" />
          <h4 className="text-sm font-medium text-foreground">Informazioni tecniche</h4>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>• ID file interno: {file?.id}</p>
          <p>• Percorso assoluto: {file?.path}</p>
          <p>• Tipo MIME: {getMimeType(file?.type)}</p>
          <p>• Ultima scansione antivirus: 15/08/2024 11:30:15</p>
          <p>• Stato sicurezza: Sicuro ✓</p>
        </div>
      </div>
      {/* File History Section */}
      <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="History" size={16} className="text-primary" />
          <h4 className="text-sm font-medium text-foreground">Cronologia modifiche</h4>
        </div>
        <div className="space-y-2">
          {[
            { action: 'File creato', date: file?.createdAt, user: 'Sistema' },
            { action: 'Ultima modifica', date: file?.modifiedAt, user: 'Utente' },
            { action: 'Ultimo accesso', date: file?.accessedAt, user: 'Utente' }
          ]?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{entry?.action}</span>
              <div className="text-right">
                <div className="text-foreground">{new Date(entry.date)?.toLocaleDateString('it-IT')}</div>
                <div className="text-muted-foreground">{entry?.user}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  function getMimeType(extension) {
    const mimeTypes = {
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'log': 'text/plain',
      'exe': 'application/x-msdownload',
      'mp3': 'audio/mpeg',
      'mp4': 'video/mp4',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif'
    };
    return mimeTypes?.[extension?.toLowerCase()] || 'application/octet-stream';
  }
};

export default DetailsTab;