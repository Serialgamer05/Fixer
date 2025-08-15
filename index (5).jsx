import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import PreviewHeader from './components/PreviewHeader';
import ImagePreview from './components/ImagePreview';
import TextPreview from './components/TextPreview';
import VideoPreview from './components/VideoPreview';
import AudioPreview from './components/AudioPreview';
import PDFPreview from './components/PDFPreview';
import UnsupportedPreview from './components/UnsupportedPreview';
import ThumbnailStrip from './components/ThumbnailStrip';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';



const FilePreviewModal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  // Mock files data - in a real app, this would come from props or context
  const mockFiles = [
    {
      id: 1,
      name: 'Presentazione_Progetto.pdf',
      type: 'application/pdf',
      size: 2048576,
      url: 'https://example.com/presentation.pdf',
      lastModified: Date.now() - 86400000,
      thumbnail: null
    },
    {
      id: 2,
      name: 'Paesaggio_Montano.jpg',
      type: 'image/jpeg',
      size: 1536000,
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      lastModified: Date.now() - 172800000,
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200'
    },
    {
      id: 3,
      name: 'Documentazione_API.txt',
      type: 'text/plain',
      size: 45678,
      url: 'https://example.com/api-docs.txt',
      lastModified: Date.now() - 259200000,
      thumbnail: null
    },
    {
      id: 4,
      name: 'Video_Tutorial.mp4',
      type: 'video/mp4',
      size: 15728640,
      url: 'https://example.com/tutorial.mp4',
      lastModified: Date.now() - 345600000,
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200'
    },
    {
      id: 5,
      name: 'Musica_Rilassante.mp3',
      type: 'audio/mpeg',
      size: 5242880,
      url: 'https://example.com/relaxing-music.mp3',
      lastModified: Date.now() - 432000000,
      thumbnail: null
    },
    {
      id: 6,
      name: 'Applicazione_Setup.exe',
      type: 'application/x-msdownload',
      size: 25165824,
      url: 'https://example.com/setup.exe',
      lastModified: Date.now() - 518400000,
      thumbnail: null
    },
    {
      id: 7,
      name: 'Sistema_Log.log',
      type: 'text/plain',
      size: 123456,
      url: 'https://example.com/system.log',
      lastModified: Date.now() - 604800000,
      thumbnail: null
    },
    {
      id: 8,
      name: 'Tramonto_Mare.jpg',
      type: 'image/jpeg',
      size: 1843200,
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      lastModified: Date.now() - 691200000,
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200'
    }
  ];

  const currentFile = mockFiles?.[currentIndex];

  useEffect(() => {
    const fileId = searchParams?.get('fileId');
    if (fileId) {
      const fileIndex = mockFiles?.findIndex(f => f?.id?.toString() === fileId);
      if (fileIndex !== -1) {
        setCurrentIndex(fileIndex);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e?.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < mockFiles?.length - 1) {
            setCurrentIndex(currentIndex + 1);
          }
          break;
        case 'Delete':
          setShowDeleteConfirm(true);
          break;
        case 'F2':
          handleRename();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, mockFiles?.length]);

  const handleClose = () => {
    navigate('/file-manager-dashboard');
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < mockFiles?.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDownload = () => {
    // Mock download functionality
    const link = document.createElement('a');
    link.href = currentFile?.url;
    link.download = currentFile?.name;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    console.log('Downloading:', currentFile?.name);
  };

  const handleRename = () => {
    setNewFileName(currentFile?.name);
    setShowRenameDialog(true);
  };

  const handleRenameConfirm = () => {
    if (newFileName?.trim() && newFileName !== currentFile?.name) {
      console.log('Renaming file from', currentFile?.name, 'to', newFileName);
      // In a real app, this would update the file in the backend
    }
    setShowRenameDialog(false);
    setNewFileName('');
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    console.log('Deleting file:', currentFile?.name);
    // In a real app, this would delete the file from the backend
    setShowDeleteConfirm(false);
    
    // Navigate to next file or close if this was the last file
    if (mockFiles?.length > 1) {
      if (currentIndex === mockFiles?.length - 1) {
        setCurrentIndex(currentIndex - 1);
      }
    } else {
      handleClose();
    }
  };

  const handleFileSelect = (index) => {
    setCurrentIndex(index);
  };

  const renderPreviewContent = () => {
    const fileType = currentFile?.type;

    if (fileType?.startsWith('image/')) {
      return (
        <ImagePreview
          file={currentFile}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={currentIndex > 0}
          hasNext={currentIndex < mockFiles?.length - 1}
        />
      );
    }

    if (fileType?.startsWith('text/') || currentFile?.name?.endsWith('.log')) {
      return <TextPreview file={currentFile} />;
    }

    if (fileType?.startsWith('video/')) {
      return <VideoPreview file={currentFile} />;
    }

    if (fileType?.startsWith('audio/')) {
      return <AudioPreview file={currentFile} />;
    }

    if (fileType === 'application/pdf') {
      return <PDFPreview file={currentFile} />;
    }

    return (
      <UnsupportedPreview 
        file={currentFile} 
        onDownload={handleDownload}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Modal Overlay */}
      <div className="fixed inset-0 top-16 z-50 bg-black/50 backdrop-blur-sm">
        <div className="h-full flex flex-col">
          {/* Preview Header */}
          <PreviewHeader
            file={currentFile}
            onClose={handleClose}
            onDownload={handleDownload}
            onRename={handleRename}
            onDelete={handleDelete}
            currentIndex={currentIndex}
            totalFiles={mockFiles?.length}
          />

          {/* Preview Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {renderPreviewContent()}
          </div>

          {/* Thumbnail Strip */}
          <ThumbnailStrip
            files={mockFiles}
            currentIndex={currentIndex}
            onFileSelect={handleFileSelect}
          />
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-strong max-w-md w-full p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="Trash2" size={20} className="text-error" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Elimina File
                </h3>
                <p className="text-muted-foreground mb-4">
                  Sei sicuro di voler eliminare "{currentFile?.name}"? Questa azione non può essere annullata.
                </p>
                <div className="flex space-x-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Annulla
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                  >
                    Elimina
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Rename Dialog */}
      {showRenameDialog && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-strong max-w-md w-full p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Edit" size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Rinomina File
                </h3>
                <p className="text-muted-foreground mb-4">
                  Inserisci il nuovo nome per il file:
                </p>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e?.key === 'Enter') {
                      handleRenameConfirm();
                    } else if (e?.key === 'Escape') {
                      setShowRenameDialog(false);
                    }
                  }}
                />
                <div className="flex space-x-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowRenameDialog(false)}
                  >
                    Annulla
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleRenameConfirm}
                    disabled={!newFileName?.trim() || newFileName === currentFile?.name}
                  >
                    Rinomina
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilePreviewModal;