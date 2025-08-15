import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import FileGrid from './components/FileGrid';
import Toolbar from './components/Toolbar';
import StatusBar from './components/StatusBar';
import ContextMenu from './components/ContextMenu';
import UploadZone from './components/UploadZone';
import RenameDialog from './components/RenameDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import NewFolderDialog from './components/NewFolderDialog';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';



const FileManagerDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // Dialog States
  const [contextMenu, setContextMenu] = useState({ visible: false, position: { x: 0, y: 0 }, file: null });
  const [uploadZoneVisible, setUploadZoneVisible] = useState(false);
  const [renameDialog, setRenameDialog] = useState({ visible: false, file: null });
  const [deleteDialog, setDeleteDialog] = useState({ visible: false, files: [] });
  const [newFolderDialog, setNewFolderDialog] = useState(false);

  // File System State
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('');

  // Mock file data
  const mockFiles = [
    {
      id: 1,
      name: 'Documenti',
      type: 'folder',
      size: 0,
      modifiedAt: new Date('2024-12-10T10:30:00'),
      path: 'documents'
    },
    {
      id: 2,
      name: 'Download',
      type: 'folder',
      size: 0,
      modifiedAt: new Date('2024-12-09T15:45:00'),
      path: 'downloads'
    },
    {
      id: 3,
      name: 'Immagini',
      type: 'folder',
      size: 0,
      modifiedAt: new Date('2024-12-08T09:20:00'),
      path: 'images'
    },
    {
      id: 4,
      name: 'Relazione_Progetto.pdf',
      type: 'file',
      size: 2547892,
      modifiedAt: new Date('2024-12-15T14:22:00'),
      path: ''
    },
    {
      id: 5,
      name: 'Presentazione_Vendite.pptx',
      type: 'file',
      size: 8934567,
      modifiedAt: new Date('2024-12-14T11:15:00'),
      path: ''
    },
    {
      id: 6,
      name: 'Database_Clienti.xlsx',
      type: 'file',
      size: 1234567,
      modifiedAt: new Date('2024-12-13T16:30:00'),
      path: ''
    },
    {
      id: 7,
      name: 'Video_Tutorial.mp4',
      type: 'file',
      size: 45678901,
      modifiedAt: new Date('2024-12-12T13:45:00'),
      path: ''
    },
    {
      id: 8,
      name: 'Musica_Rilassante.mp3',
      type: 'file',
      size: 5678901,
      modifiedAt: new Date('2024-12-11T08:30:00'),
      path: ''
    },
    {
      id: 9,
      name: 'Setup_Applicazione.exe',
      type: 'file',
      size: 12345678,
      modifiedAt: new Date('2024-12-10T17:20:00'),
      path: ''
    },
    {
      id: 10,
      name: 'Log_Sistema.log',
      type: 'file',
      size: 234567,
      modifiedAt: new Date('2024-12-15T09:10:00'),
      path: ''
    }
  ];

  // Initialize files from localStorage or use mock data
  useEffect(() => {
    const savedFiles = localStorage.getItem('fileManager_files');
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        setFiles(parsedFiles?.map(file => ({
          ...file,
          modifiedAt: new Date(file.modifiedAt)
        })));
      } catch (error) {
        console.error('Error parsing saved files:', error);
        setFiles(mockFiles);
      }
    } else {
      setFiles(mockFiles);
    }
  }, []);

  // Save files to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem('fileManager_files', JSON.stringify(files));
  }, [files]);

  // Update current path from URL params
  useEffect(() => {
    const folder = searchParams?.get('folder') || '';
    setCurrentPath(folder);
  }, [searchParams]);

  // Filter and sort files
  const filteredAndSortedFiles = React.useMemo(() => {
    let filtered = files?.filter(file => {
      // Filter by current path
      if (currentPath) {
        return file?.path === currentPath;
      } else {
        return file?.path === '' || file?.path === '/';
      }
    });

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(file =>
        file?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name, 'it');
        case 'size':
          if (a?.type === 'folder' && b?.type !== 'folder') return -1;
          if (a?.type !== 'folder' && b?.type === 'folder') return 1;
          return a?.size - b?.size;
        case 'type':
          if (a?.type !== b?.type) {
            return a?.type === 'folder' ? -1 : 1;
          }
          const aExt = a?.name?.split('.')?.pop()?.toLowerCase();
          const bExt = b?.name?.split('.')?.pop()?.toLowerCase();
          return aExt?.localeCompare(bExt);
        case 'modified':
          return new Date(b.modifiedAt) - new Date(a.modifiedAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [files, currentPath, searchQuery, sortBy]);

  // Calculate storage info
  const storageInfo = React.useMemo(() => {
    const totalSize = files?.reduce((sum, file) => sum + (file?.size || 0), 0);
    return {
      used: totalSize,
      total: 107374182400, // 100GB in bytes
      fileCount: files?.length
    };
  }, [files]);

  // File selection handlers
  const handleFileSelect = useCallback((fileId, event) => {
    if (event?.ctrlKey || event?.metaKey) {
      setSelectedFiles(prev => 
        prev?.includes(fileId) 
          ? prev?.filter(id => id !== fileId)
          : [...prev, fileId]
      );
    } else if (event?.shiftKey && selectedFiles?.length > 0) {
      const lastSelected = selectedFiles?.[selectedFiles?.length - 1];
      const lastIndex = filteredAndSortedFiles?.findIndex(f => f?.id === lastSelected);
      const currentIndex = filteredAndSortedFiles?.findIndex(f => f?.id === fileId);
      
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      const rangeIds = filteredAndSortedFiles?.slice(start, end + 1)?.map(f => f?.id);
      
      setSelectedFiles(prev => [...new Set([...prev, ...rangeIds])]);
    } else {
      setSelectedFiles([fileId]);
    }
  }, [selectedFiles, filteredAndSortedFiles]);

  const handleFileDoubleClick = useCallback((file) => {
    if (file?.type === 'folder') {
      const newPath = currentPath ? `${currentPath}/${file?.path}` : file?.path;
      navigate(`/file-manager-dashboard?folder=${newPath}`);
    } else {
      // Open file preview
      navigate('/file-preview-modal', { state: { file } });
    }
  }, [currentPath, navigate]);

  // Context menu handlers
  const handleContextMenu = useCallback((event, file) => {
    event?.preventDefault();
    setContextMenu({
      visible: true,
      position: { x: event?.clientX, y: event?.clientY },
      file
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu({ visible: false, position: { x: 0, y: 0 }, file: null });
  }, []);

  // File operations
  const handleUpload = useCallback(() => {
    setUploadZoneVisible(true);
  }, []);

  const handleFilesUpload = useCallback((uploadedFiles) => {
    const newFiles = uploadedFiles?.map(file => ({
      ...file,
      path: currentPath
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, [currentPath]);

  const handleNewFolder = useCallback(() => {
    setNewFolderDialog(true);
  }, []);

  const handleCreateFolder = useCallback((folderName) => {
    const newFolder = {
      id: Date.now(),
      name: folderName,
      type: 'folder',
      size: 0,
      modifiedAt: new Date(),
      path: currentPath
    };
    setFiles(prev => [...prev, newFolder]);
  }, [currentPath]);

  const handleRename = useCallback((file) => {
    setRenameDialog({ visible: true, file });
  }, []);

  const handleRenameConfirm = useCallback((fileId, newName) => {
    setFiles(prev => prev?.map(file => 
      file?.id === fileId 
        ? { ...file, name: newName, modifiedAt: new Date() }
        : file
    ));
  }, []);

  const handleDelete = useCallback((file) => {
    const filesToDelete = selectedFiles?.includes(file?.id) 
      ? files?.filter(f => selectedFiles?.includes(f?.id))
      : [file];
    setDeleteDialog({ visible: true, files: filesToDelete });
  }, [selectedFiles, files]);

  const handleDeleteConfirm = useCallback((filesToDelete) => {
    const idsToDelete = filesToDelete?.map(f => f?.id);
    setFiles(prev => prev?.filter(file => !idsToDelete?.includes(file?.id)));
    setSelectedFiles([]);
  }, []);

  const handleCopy = useCallback((file) => {
    // Store in localStorage for copy operation
    const filesToCopy = selectedFiles?.includes(file?.id) 
      ? files?.filter(f => selectedFiles?.includes(f?.id))
      : [file];
    localStorage.setItem('fileManager_clipboard', JSON.stringify({
      operation: 'copy',
      files: filesToCopy
    }));
  }, [selectedFiles, files]);

  const handleMove = useCallback((file) => {
    // Store in localStorage for move operation
    const filesToMove = selectedFiles?.includes(file?.id) 
      ? files?.filter(f => selectedFiles?.includes(f?.id))
      : [file];
    localStorage.setItem('fileManager_clipboard', JSON.stringify({
      operation: 'move',
      files: filesToMove
    }));
  }, [selectedFiles, files]);

  const handleProperties = useCallback((file) => {
    navigate('/file-properties-dialog', { state: { file } });
  }, [navigate]);

  const handlePreview = useCallback((file) => {
    navigate('/file-preview-modal', { state: { file } });
  }, [navigate]);

  const handleDownload = useCallback((file) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#';
    link.download = file?.name;
    link?.click();
  }, []);

  // Drag and drop handlers
  const handleDragStart = useCallback((event, file) => {
    event?.dataTransfer?.setData('text/plain', JSON.stringify(file));
  }, []);

  const handleDrop = useCallback((event, targetFile) => {
    event?.preventDefault();
    try {
      const draggedFile = JSON.parse(event?.dataTransfer?.getData('text/plain'));
      if (targetFile && targetFile?.type === 'folder' && draggedFile?.id !== targetFile?.id) {
        // Move file to folder
        setFiles(prev => prev?.map(file => 
          file?.id === draggedFile?.id 
            ? { ...file, path: targetFile?.path ? `${targetFile?.path}/${targetFile?.name}` : targetFile?.name }
            : file
        ));
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event?.preventDefault();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <main className={`flex-1 transition-all duration-200 ${
          sidebarCollapsed ? 'ml-12' : 'ml-64'
        } pb-12`}>
          <Toolbar
            currentPath={currentPath}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCount={selectedFiles?.length}
            onNewFolder={handleNewFolder}
            onUpload={handleUpload}
            onDelete={() => {
              if (selectedFiles?.length > 0) {
                const filesToDelete = files?.filter(f => selectedFiles?.includes(f?.id));
                setDeleteDialog({ visible: true, files: filesToDelete });
              }
            }}
            onCopy={() => {
              if (selectedFiles?.length > 0) {
                const filesToCopy = files?.filter(f => selectedFiles?.includes(f?.id));
                localStorage.setItem('fileManager_clipboard', JSON.stringify({
                  operation: 'copy',
                  files: filesToCopy
                }));
              }
            }}
            onMove={() => {
              if (selectedFiles?.length > 0) {
                const filesToMove = files?.filter(f => selectedFiles?.includes(f?.id));
                localStorage.setItem('fileManager_clipboard', JSON.stringify({
                  operation: 'move',
                  files: filesToMove
                }));
              }
            }}
          />
          
          <div className="p-6">
            {filteredAndSortedFiles?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="FolderOpen" size={48} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {searchQuery ? 'Nessun risultato trovato' : 'Cartella vuota'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? `Nessun file corrisponde alla ricerca "${searchQuery}"`
                    : 'Inizia caricando alcuni file o creando una nuova cartella'
                  }
                </p>
                {!searchQuery && (
                  <div className="flex items-center justify-center space-x-4">
                    <Button variant="default" onClick={handleUpload}>
                      Carica file
                    </Button>
                    <Button variant="outline" onClick={handleNewFolder}>
                      Nuova cartella
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <FileGrid
                files={filteredAndSortedFiles}
                viewMode={viewMode}
                selectedFiles={selectedFiles}
                onFileSelect={handleFileSelect}
                onFileDoubleClick={handleFileDoubleClick}
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              />
            )}
          </div>
        </main>
      </div>
      <StatusBar
        selectedCount={selectedFiles?.length}
        totalFiles={filteredAndSortedFiles?.length}
        totalSize={filteredAndSortedFiles?.reduce((sum, file) => sum + (file?.size || 0), 0)}
        storageUsed={storageInfo?.used}
        storageTotal={storageInfo?.total}
      />
      {/* Dialogs and Modals */}
      <ContextMenu
        isVisible={contextMenu?.visible}
        position={contextMenu?.position}
        file={contextMenu?.file}
        onClose={closeContextMenu}
        onRename={handleRename}
        onDelete={handleDelete}
        onCopy={handleCopy}
        onMove={handleMove}
        onProperties={handleProperties}
        onPreview={handlePreview}
        onDownload={handleDownload}
      />
      <UploadZone
        isVisible={uploadZoneVisible}
        onClose={() => setUploadZoneVisible(false)}
        onFilesUpload={handleFilesUpload}
      />
      <RenameDialog
        isVisible={renameDialog?.visible}
        file={renameDialog?.file}
        onClose={() => setRenameDialog({ visible: false, file: null })}
        onRename={handleRenameConfirm}
      />
      <DeleteConfirmDialog
        isVisible={deleteDialog?.visible}
        files={deleteDialog?.files}
        onClose={() => setDeleteDialog({ visible: false, files: [] })}
        onConfirm={handleDeleteConfirm}
      />
      <NewFolderDialog
        isVisible={newFolderDialog}
        onClose={() => setNewFolderDialog(false)}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
};

export default FileManagerDashboard;