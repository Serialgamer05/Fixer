import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import GeneralTab from './components/GeneralTab';
import DetailsTab from './components/DetailsTab';
import PermissionsTab from './components/PermissionsTab';
import ActionButtons from './components/ActionButtons';
import BreadcrumbNavigation from './components/BreadcrumbNavigation';

const FilePropertiesDialog = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);

  // Mock file data - in a real app, this would come from props or API
  const mockFiles = [
    {
      id: 1,
      name: 'Documento_Importante.pdf',
      type: 'pdf',
      size: 2048576,
      path: '/Documenti/Lavoro/Documento_Importante.pdf',
      createdAt: new Date('2024-08-10T09:30:00'),
      modifiedAt: new Date('2024-08-15T11:30:15'),
      accessedAt: new Date('2024-08-15T11:30:15'),
      attributes: ['Archivio'],
      description: 'Documento contenente informazioni importanti per il progetto corrente.',
      thumbnail: null
    },
    {
      id: 2,
      name: 'Presentazione_Progetto.mp4',
      type: 'mp4',
      size: 52428800,
      path: '/Video/Presentazioni/Presentazione_Progetto.mp4',
      createdAt: new Date('2024-08-12T14:20:00'),
      modifiedAt: new Date('2024-08-14T16:45:30'),
      accessedAt: new Date('2024-08-15T10:15:22'),
      attributes: ['Archivio'],
      description: 'Video di presentazione del progetto per il cliente.',
      thumbnail: 'https://picsum.photos/64/64?random=2'
    },
    {
      id: 3,
      name: 'Musica_Rilassante.mp3',
      type: 'mp3',
      size: 4194304,
      path: '/Musica/Relax/Musica_Rilassante.mp3',
      createdAt: new Date('2024-08-05T18:00:00'),
      modifiedAt: new Date('2024-08-05T18:00:00'),
      accessedAt: new Date('2024-08-15T08:30:45'),
      attributes: ['Archivio'],
      description: 'Brano musicale per momenti di relax e concentrazione.',
      thumbnail: null
    },
    {
      id: 4,
      name: 'Immagine_Vacanze.jpg',
      type: 'jpg',
      size: 1572864,
      path: '/Immagini/Vacanze/Immagine_Vacanze.jpg',
      createdAt: new Date('2024-07-20T12:30:00'),
      modifiedAt: new Date('2024-07-20T12:30:00'),
      accessedAt: new Date('2024-08-14T20:15:10'),
      attributes: ['Archivio'],
      description: 'Foto scattata durante le vacanze estive.',
      thumbnail: 'https://picsum.photos/64/64?random=4'
    }
  ];

  useEffect(() => {
    const fileId = searchParams?.get('fileId');
    const multiSelect = searchParams?.get('multiSelect');
    
    if (multiSelect) {
      const fileIds = multiSelect?.split(',')?.map(id => parseInt(id));
      const files = mockFiles?.filter(file => fileIds?.includes(file?.id));
      setSelectedFiles(files);
      setCurrentFile(files?.[0]);
    } else if (fileId) {
      const file = mockFiles?.find(f => f?.id === parseInt(fileId));
      if (file) {
        setCurrentFile(file);
        setSelectedFiles([file]);
      }
    } else {
      // Default to first file if no ID specified
      setCurrentFile(mockFiles?.[0]);
      setSelectedFiles([mockFiles?.[0]]);
    }
  }, [searchParams]);

  const handleClose = () => {
    navigate('/file-manager-dashboard');
  };

  const handleUpdateFile = (updatedFile) => {
    setCurrentFile(updatedFile);
    // In a real app, this would update the file in the backend
    console.log('File aggiornato:', updatedFile);
  };

  const handleAction = (actionType, file) => {
    console.log(`Azione ${actionType} su file:`, file);
    
    switch (actionType) {
      case 'rename':
        // Handle rename logic
        break;
      case 'move':
        // Handle move logic
        break;
      case 'copy':
        // Handle copy logic
        break;
      case 'delete':
        // Handle delete logic
        handleClose();
        break;
      default:
        break;
    }
  };

  const handleNavigate = (path) => {
    navigate(`/file-manager-dashboard?path=${encodeURIComponent(path)}`);
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') {
      handleClose();
    } else if (e?.key === 'F2') {
      setActiveTab('general');
    } else if (e?.key === 'F3') {
      setActiveTab('details');
    } else if (e?.key === 'F4') {
      setActiveTab('permissions');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const tabs = [
    { id: 'general', label: 'Generale', icon: 'Info' },
    { id: 'details', label: 'Dettagli', icon: 'FileText' },
    { id: 'permissions', label: 'Permessi', icon: 'Shield' }
  ];

  if (!currentFile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex pt-16">
          <Sidebar 
            isCollapsed={sidebarCollapsed} 
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
          <main className={`flex-1 transition-all duration-200 ${sidebarCollapsed ? 'ml-12' : 'ml-64'}`}>
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-medium text-foreground mb-2">File non trovato</h2>
                <p className="text-muted-foreground mb-4">Il file richiesto non è stato trovato.</p>
                <Button onClick={handleClose}>
                  Torna al File Manager
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Modal Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-subtle pt-16">
        <div className="flex items-center justify-center min-h-full p-4">
          <div className="bg-background rounded-lg shadow-strong border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="FileText" size={20} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Proprietà file</h1>
                  {selectedFiles?.length > 1 ? (
                    <p className="text-sm text-muted-foreground">
                      {selectedFiles?.length} file selezionati
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground truncate max-w-md">
                      {currentFile?.name}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-8 w-8"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            </div>

            {/* Dialog Content */}
            <div className="flex flex-col h-[calc(90vh-80px)]">
              {/* Breadcrumb Navigation */}
              <div className="p-6 border-b border-border">
                <BreadcrumbNavigation 
                  file={currentFile} 
                  onNavigate={handleNavigate}
                />
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-border">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab?.id
                        ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-hover-light'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'general' && (
                  <GeneralTab 
                    file={currentFile} 
                    onUpdateFile={handleUpdateFile}
                    onClose={handleClose}
                  />
                )}
                {activeTab === 'details' && (
                  <DetailsTab file={currentFile} />
                )}
                {activeTab === 'permissions' && (
                  <PermissionsTab 
                    file={currentFile} 
                    onUpdateFile={handleUpdateFile}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-border bg-surface/50">
                <ActionButtons 
                  file={currentFile}
                  onAction={handleAction}
                  onClose={handleClose}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 right-4 z-60">
        <div className="bg-popover border border-border rounded-lg p-3 shadow-medium">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <span>Chiudi</span>
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">Esc</kbd>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span>Generale</span>
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">F2</kbd>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span>Dettagli</span>
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">F3</kbd>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span>Permessi</span>
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">F4</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePropertiesDialog;