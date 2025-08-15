import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UploadZone from './components/UploadZone';
import UploadQueue from './components/UploadQueue';
import FileValidation from './components/FileValidation';
import UploadSettings from './components/UploadSettings';

const FileUploadInterface = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [uploadStats, setUploadStats] = useState({
    totalFiles: 0,
    completedFiles: 0,
    totalSize: 0,
    uploadedSize: 0,
    startTime: null,
    estimatedTime: null,
  });

  const [uploadSettings, setUploadSettings] = useState({
    targetFolder: 'root',
    overwriteExisting: false,
    createBackup: true,
    compressImages: false,
    imageQuality: 'original',
    autoRename: true,
    preserveStructure: false,
    maxFileSize: 100,
    allowedTypes: ['pdf', 'txt', 'log', 'exe', 'mp3', 'mp4', 'jpg', 'jpeg', 'png', 'gif'],
  });

  // Get current folder from URL params
  const getCurrentFolder = () => {
    const params = new URLSearchParams(location.search);
    return params?.get('folder') || uploadSettings?.targetFolder;
  };

  // Breadcrumb navigation
  const getBreadcrumbs = () => {
    const currentFolder = getCurrentFolder();
    const parts = currentFolder?.split('/');
    const breadcrumbs = [{ label: 'I Miei File', path: '/file-manager-dashboard' }];
    
    let currentPath = '';
    parts?.forEach((part, index) => {
      if (part && part !== 'root') {
        currentPath += (currentPath ? '/' : '') + part;
        const folderNames = {
          documents: 'Documenti',
          downloads: 'Download',
          images: 'Immagini',
          videos: 'Video',
          music: 'Musica',
          work: 'Lavoro',
          personal: 'Personale',
        };
        breadcrumbs?.push({
          label: folderNames?.[part] || part,
          path: `/file-manager-dashboard?folder=${currentPath}`
        });
      }
    });

    breadcrumbs?.push({ label: 'Carica File', path: '/file-upload-interface', current: true });
    return breadcrumbs;
  };

  // File validation
  const validateFiles = useCallback((files) => {
    const errors = [];
    const { maxFileSize, allowedTypes } = uploadSettings;

    files?.forEach((file) => {
      // Size validation
      const fileSizeMB = file?.size / (1024 * 1024);
      if (fileSizeMB > maxFileSize) {
        errors?.push({
          type: 'size',
          fileName: file?.name,
          fileSize: fileSizeMB?.toFixed(2) + ' MB',
          maxSize: maxFileSize + ' MB',
          fileId: file?.name + file?.size,
        });
      }

      // Type validation
      const extension = file?.name?.split('.')?.pop()?.toLowerCase();
      if (extension && !allowedTypes?.includes(extension)) {
        errors?.push({
          type: 'type',
          fileName: file?.name,
          fileType: extension,
          allowedTypes: allowedTypes,
          fileId: file?.name + file?.size,
        });
      }

      // Duplicate validation (simulate checking existing files)
      const existingFiles = ['document.pdf', 'image.jpg', 'video.mp4'];
      if (existingFiles?.includes(file?.name)) {
        errors?.push({
          type: 'duplicate',
          fileName: file?.name,
          fileId: file?.name + file?.size,
        });
      }
    });

    return errors;
  }, [uploadSettings]);

  // Handle file selection
  const handleFilesSelected = useCallback((files) => {
    const errors = validateFiles(files);
    
    if (errors?.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const newFiles = files?.map((file, index) => ({
      id: `${file?.name}-${file?.size}-${Date.now()}-${index}`,
      name: file?.name,
      size: file?.size,
      type: file?.type,
      status: 'pending',
      progress: 0,
      file: file,
      error: null,
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);
    
    // Auto-start upload
    setTimeout(() => {
      startUpload(newFiles);
    }, 500);
  }, [validateFiles]);

  // Simulate file upload
  const startUpload = useCallback((filesToUpload) => {
    setIsUploading(true);
    setUploadStats(prev => ({
      ...prev,
      startTime: Date.now(),
      totalFiles: prev?.totalFiles + filesToUpload?.length,
      totalSize: prev?.totalSize + filesToUpload?.reduce((sum, f) => sum + f?.size, 0),
    }));

    filesToUpload?.forEach((file, index) => {
      // Simulate upload progress
      const uploadDuration = Math.random() * 3000 + 2000; // 2-5 seconds
      const updateInterval = 100;
      const totalUpdates = uploadDuration / updateInterval;
      let currentUpdate = 0;

      // Set status to uploading
      setUploadFiles(prev => prev?.map(f => 
        f?.id === file?.id ? { ...f, status: 'uploading' } : f
      ));

      const progressInterval = setInterval(() => {
        currentUpdate++;
        const progress = Math.min((currentUpdate / totalUpdates) * 100, 100);

        setUploadFiles(prev => prev?.map(f => 
          f?.id === file?.id ? { ...f, progress: Math.round(progress) } : f
        ));

        if (currentUpdate >= totalUpdates) {
          clearInterval(progressInterval);
          
          // Simulate occasional errors
          const hasError = Math.random() < 0.1; // 10% chance of error
          
          setUploadFiles(prev => prev?.map(f => 
            f?.id === file?.id ? {
              ...f,
              status: hasError ? 'error' : 'completed',
              progress: hasError ? f?.progress : 100,
              error: hasError ? 'Errore di rete durante il caricamento' : null,
            } : f
          ));

          if (!hasError) {
            setUploadStats(prev => ({
              ...prev,
              completedFiles: prev?.completedFiles + 1,
              uploadedSize: prev?.uploadedSize + file?.size,
            }));
          }
        }
      }, updateInterval);
    });

    // Check if all uploads are complete
    setTimeout(() => {
      setIsUploading(false);
    }, Math.max(...filesToUpload?.map(() => Math.random() * 3000 + 2000)) + 500);
  }, []);

  // Remove file from queue
  const handleRemoveFile = useCallback((fileId) => {
    setUploadFiles(prev => prev?.filter(f => f?.id !== fileId));
  }, []);

  // Clear all files
  const handleClearAll = useCallback(() => {
    setUploadFiles([]);
    setValidationErrors([]);
    setUploadStats({
      totalFiles: 0,
      completedFiles: 0,
      totalSize: 0,
      uploadedSize: 0,
      startTime: null,
      estimatedTime: null,
    });
  }, []);

  // Retry file upload
  const handleRetryFile = useCallback((fileId, action = 'retry') => {
    const file = uploadFiles?.find(f => f?.id === fileId);
    if (!file) return;

    if (action === 'retry') {
      setUploadFiles(prev => prev?.map(f => 
        f?.id === fileId ? { ...f, status: 'pending', progress: 0, error: null } : f
      ));
      setTimeout(() => startUpload([file]), 500);
    } else if (action === 'rename') {
      const newName = `${file?.name?.split('.')?.[0]}_copy.${file?.name?.split('.')?.pop()}`;
      setUploadFiles(prev => prev?.map(f => 
        f?.id === fileId ? { ...f, name: newName, status: 'pending', progress: 0, error: null } : f
      ));
      setTimeout(() => startUpload([{ ...file, name: newName }]), 500);
    } else if (action === 'replace') {
      setUploadFiles(prev => prev?.map(f => 
        f?.id === fileId ? { ...f, status: 'pending', progress: 0, error: null } : f
      ));
      setTimeout(() => startUpload([file]), 500);
    }
  }, [uploadFiles, startUpload]);

  // Dismiss validation error
  const handleDismissError = useCallback((errorIndex) => {
    setValidationErrors(prev => prev?.filter((_, index) => index !== errorIndex));
  }, []);

  // Handle settings change
  const handleSettingsChange = useCallback((newSettings) => {
    setUploadSettings(newSettings);
  }, []);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  // Calculate upload speed and ETA
  const getUploadStats = () => {
    if (!uploadStats?.startTime || uploadStats?.uploadedSize === 0) return null;
    
    const elapsedTime = (Date.now() - uploadStats?.startTime) / 1000; // seconds
    const uploadSpeed = uploadStats?.uploadedSize / elapsedTime; // bytes per second
    const remainingSize = uploadStats?.totalSize - uploadStats?.uploadedSize;
    const eta = remainingSize / uploadSpeed; // seconds

    return {
      speed: formatFileSize(uploadSpeed) + '/s',
      eta: eta > 0 ? Math.ceil(eta) + 's' : '0s',
    };
  };

  const stats = getUploadStats();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <main className={`transition-all duration-200 pt-16 ${
        isSidebarCollapsed ? 'ml-12' : 'ml-64'
      }`}>
        <div className="p-6 space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm">
            {getBreadcrumbs()?.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                )}
                {crumb?.current ? (
                  <span className="text-foreground font-medium">{crumb?.label}</span>
                ) : (
                  <button
                    onClick={() => navigate(crumb?.path)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb?.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Carica File</h1>
              <p className="text-muted-foreground mt-1">
                Carica i tuoi file nella cartella: {getCurrentFolder() === 'root' ? 'Principale' : getCurrentFolder()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => navigate('/file-manager-dashboard')}
              >
                Torna al Dashboard
              </Button>
            </div>
          </div>

          {/* Upload Statistics */}
          {(uploadFiles?.length > 0 || stats) && (
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{uploadStats?.totalFiles}</div>
                  <div className="text-sm text-muted-foreground">File Totali</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{uploadStats?.completedFiles}</div>
                  <div className="text-sm text-muted-foreground">Completati</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {formatFileSize(uploadStats?.totalSize)}
                  </div>
                  <div className="text-sm text-muted-foreground">Dimensione Totale</div>
                </div>
                {stats && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats?.speed}</div>
                    <div className="text-sm text-muted-foreground">Velocità • ETA: {stats?.eta}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload Settings */}
          <UploadSettings
            settings={uploadSettings}
            onSettingsChange={handleSettingsChange}
            isVisible={showSettings}
            onToggle={() => setShowSettings(!showSettings)}
          />

          {/* File Validation Errors */}
          <FileValidation
            validationErrors={validationErrors}
            onDismissError={handleDismissError}
            onRetryFile={handleRetryFile}
          />

          {/* Upload Zone */}
          <UploadZone
            onFilesSelected={handleFilesSelected}
            isUploading={isUploading}
            acceptedTypes={uploadSettings?.allowedTypes?.map(type => `.${type}`)}
          />

          {/* Upload Queue */}
          <UploadQueue
            files={uploadFiles}
            onRemoveFile={handleRemoveFile}
            onClearAll={handleClearAll}
            onRetryFile={handleRetryFile}
          />

          {/* Quick Actions */}
          {uploadFiles?.length === 0 && validationErrors?.length === 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Azioni Rapide</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  iconName="FolderOpen"
                  onClick={() => navigate('/folder-management-interface')}
                >
                  <span>Gestisci Cartelle</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  iconName="Search"
                  onClick={() => navigate('/search-and-filter-interface')}
                >
                  <span>Cerca File</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  iconName="Eye"
                  onClick={() => navigate('/file-preview-modal')}
                >
                  <span>Anteprima File</span>
                </Button>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="HelpCircle" size={20} className="text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">Suggerimenti per il Caricamento</h4>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Trascina più file contemporaneamente per il caricamento batch</li>
                  <li>• Usa le impostazioni per personalizzare il comportamento di caricamento</li>
                  <li>• I file duplicati verranno automaticamente rinominati se abilitato</li>
                  <li>• Dimensione massima file: {uploadSettings?.maxFileSize} MB</li>
                  <li>• Tipi supportati: {uploadSettings?.allowedTypes?.join(', ')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FileUploadInterface;