import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import FolderTree from './components/FolderTree';
import BreadcrumbNavigation from './components/BreadcrumbNavigation';
import FolderGrid from './components/FolderGrid';
import ContextMenu from './components/ContextMenu';
import FolderToolbar from './components/FolderToolbar';
import CreateFolderDialog from './components/CreateFolderDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const FolderManagementInterface = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root', 'documents']));
  
  // Dialog States
  const [createFolderDialog, setCreateFolderDialog] = useState({ isOpen: false, parentId: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, items: [] });
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState({ isVisible: false, position: { x: 0, y: 0 } });
  
  // Current Navigation State
  const [currentPath, setCurrentPath] = useState('/');
  const [currentFolder, setCurrentFolder] = useState(null);

  // Mock Data
  const [folderStructure, setFolderStructure] = useState([
    {
      id: 'root',
      name: 'I miei file',
      type: 'folder',
      path: '/',
      parentId: null,
      itemCount: 8,
      modifiedAt: new Date('2025-08-10T10:30:00'),
      children: [
        {
          id: 'documents',
          name: 'Documenti',
          type: 'folder',
          path: '/Documenti',
          parentId: 'root',
          itemCount: 5,
          modifiedAt: new Date('2025-08-12T14:20:00'),
          children: [
            {
              id: 'work',
              name: 'Lavoro',
              type: 'folder',
              path: '/Documenti/Lavoro',
              parentId: 'documents',
              itemCount: 3,
              modifiedAt: new Date('2025-08-14T09:15:00'),
              children: []
            },
            {
              id: 'personal',
              name: 'Personale',
              type: 'folder',
              path: '/Documenti/Personale',
              parentId: 'documents',
              itemCount: 2,
              modifiedAt: new Date('2025-08-13T16:45:00'),
              children: []
            }
          ]
        },
        {
          id: 'downloads',
          name: 'Download',
          type: 'folder',
          path: '/Download',
          parentId: 'root',
          itemCount: 12,
          modifiedAt: new Date('2025-08-15T08:30:00'),
          children: []
        },
        {
          id: 'images',
          name: 'Immagini',
          type: 'folder',
          path: '/Immagini',
          parentId: 'root',
          itemCount: 24,
          modifiedAt: new Date('2025-08-11T12:00:00'),
          children: []
        },
        {
          id: 'videos',
          name: 'Video',
          type: 'folder',
          path: '/Video',
          parentId: 'root',
          itemCount: 8,
          modifiedAt: new Date('2025-08-09T18:20:00'),
          children: []
        },
        {
          id: 'music',
          name: 'Musica',
          type: 'folder',
          path: '/Musica',
          parentId: 'root',
          itemCount: 156,
          modifiedAt: new Date('2025-08-08T20:15:00'),
          children: []
        }
      ]
    }
  ]);

  const [mockFiles] = useState([
    {
      id: 'file1',
      name: 'Relazione_Progetto.pdf',
      type: 'file',
      size: 2048576,
      modifiedAt: new Date('2025-08-14T15:30:00'),
      folderId: 'root'
    },
    {
      id: 'file2',
      name: 'Setup_Applicazione.exe',
      type: 'file',
      size: 15728640,
      modifiedAt: new Date('2025-08-13T11:20:00'),
      folderId: 'root'
    },
    {
      id: 'file3',
      name: 'Log_Sistema.log',
      type: 'file',
      size: 524288,
      modifiedAt: new Date('2025-08-15T09:45:00'),
      folderId: 'root'
    },
    {
      id: 'file4',
      name: 'Note_Riunione.txt',
      type: 'file',
      size: 8192,
      modifiedAt: new Date('2025-08-12T16:10:00'),
      folderId: 'documents'
    },
    {
      id: 'file5',
      name: 'Presentazione.mp4',
      type: 'file',
      size: 104857600,
      modifiedAt: new Date('2025-08-11T14:25:00'),
      folderId: 'videos'
    },
    {
      id: 'file6',
      name: 'Colonna_Sonora.mp3',
      type: 'file',
      size: 5242880,
      modifiedAt: new Date('2025-08-10T19:30:00'),
      folderId: 'music'
    }
  ]);

  // Get current folder and its contents
  const getCurrentFolderContents = useCallback(() => {
    const findFolderById = (folders, id) => {
      for (const folder of folders) {
        if (folder?.id === id) return folder;
        if (folder?.children) {
          const found = findFolderById(folder?.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const findFolderByPath = (folders, path) => {
      if (path === '/') return folders?.[0];
      
      const pathSegments = path?.split('/')?.filter(segment => segment !== '');
      let current = folders?.[0];
      
      for (const segment of pathSegments) {
        if (!current?.children) return null;
        current = current?.children?.find(child => child?.name === segment);
        if (!current) return null;
      }
      
      return current;
    };

    const folder = findFolderByPath(folderStructure, currentPath);
    const subFolders = folder?.children || [];
    const files = mockFiles?.filter(file => file?.folderId === folder?.id);
    
    return { folder, subFolders, files };
  }, [currentPath, folderStructure, mockFiles]);

  // Handle folder navigation
  const handleFolderSelect = (folder) => {
    setCurrentPath(folder?.path);
    setCurrentFolder(folder);
    setSelectedItems(new Set());
  };

  const handleNavigate = (path) => {
    setCurrentPath(path);
    setSelectedItems(new Set());
  };

  const handleGoUp = () => {
    const pathSegments = currentPath?.split('/')?.filter(segment => segment !== '');
    if (pathSegments?.length > 0) {
      pathSegments?.pop();
      const newPath = pathSegments?.length > 0 ? '/' + pathSegments?.join('/') : '/';
      setCurrentPath(newPath);
      setSelectedItems(new Set());
    }
  };

  // Handle folder tree expansion
  const handleToggleExpand = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded?.has(folderId)) {
      newExpanded?.delete(folderId);
    } else {
      newExpanded?.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Handle item selection
  const handleItemSelect = (item, event) => {
    const newSelected = new Set(selectedItems);
    
    if (event?.ctrlKey || event?.metaKey) {
      if (newSelected?.has(item?.id)) {
        newSelected?.delete(item?.id);
      } else {
        newSelected?.add(item?.id);
      }
    } else if (event?.shiftKey && selectedItems?.size > 0) {
      // Implement shift selection logic here
      newSelected?.add(item?.id);
    } else {
      newSelected?.clear();
      newSelected?.add(item?.id);
    }
    
    setSelectedItems(newSelected);
  };

  const handleItemDoubleClick = (item) => {
    if (item?.type === 'folder') {
      handleFolderSelect(item);
    } else {
      // Open file preview
      navigate('/file-preview-modal', { state: { file: item } });
    }
  };

  // Handle context menu
  const handleContextMenu = (event, item) => {
    event?.preventDefault();
    
    if (!selectedItems?.has(item?.id)) {
      setSelectedItems(new Set([item.id]));
    }
    
    setContextMenu({
      isVisible: true,
      position: { x: event?.clientX, y: event?.clientY }
    });
  };

  const handleContextAction = (action) => {
    const selectedItemsArray = Array.from(selectedItems);
    
    switch (action) {
      case 'open':
        if (selectedItemsArray?.length === 1) {
          const { folder, files } = getCurrentFolderContents();
          const allItems = [...(folder?.children || []), ...files];
          const item = allItems?.find(item => item?.id === selectedItemsArray?.[0]);
          if (item) {
            handleItemDoubleClick(item);
          }
        }
        break;
      case 'rename':
        // Implement rename functionality
        console.log('Rename:', selectedItemsArray);
        break;
      case 'delete':
        const { folder, files } = getCurrentFolderContents();
        const allItems = [...(folder?.children || []), ...files];
        const itemsToDelete = allItems?.filter(item => selectedItems?.has(item?.id));
        setDeleteDialog({ isOpen: true, items: itemsToDelete });
        break;
      case 'newFolder':
        setCreateFolderDialog({ isOpen: true, parentId: currentFolder?.id || 'root' });
        break;
      case 'properties':
        if (selectedItemsArray?.length === 1) {
          navigate('/file-properties-dialog', { state: { itemId: selectedItemsArray?.[0] } });
        }
        break;
      default:
        console.log('Action:', action, selectedItemsArray);
    }
  };

  // Handle drag and drop
  const handleDragStart = (event, item) => {
    event?.dataTransfer?.setData('text/plain', JSON.stringify(item));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event) => {
    event?.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event, targetFolder) => {
    event?.preventDefault();
    const draggedItem = JSON.parse(event?.dataTransfer?.getData('text/plain'));
    console.log('Move item:', draggedItem, 'to folder:', targetFolder);
    // Implement move functionality
  };

  // Handle folder operations
  const handleCreateFolder = (name) => {
    const newFolder = {
      id: `folder_${Date.now()}`,
      name,
      type: 'folder',
      path: currentPath === '/' ? `/${name}` : `${currentPath}/${name}`,
      parentId: currentFolder?.id || 'root',
      itemCount: 0,
      modifiedAt: new Date(),
      children: []
    };
    
    console.log('Create folder:', newFolder);
    // Implement folder creation logic
  };

  const handleDeleteItems = (items) => {
    console.log('Delete items:', items);
    // Implement delete functionality
    setSelectedItems(new Set());
  };

  // Handle toolbar actions
  const handleSelectAll = () => {
    const { folder, files } = getCurrentFolderContents();
    const allItems = [...(folder?.children || []), ...files];
    setSelectedItems(new Set(allItems.map(item => item.id)));
  };

  const handleClearSelection = () => {
    setSelectedItems(new Set());
  };

  const handleRefresh = () => {
    // Implement refresh functionality
    console.log('Refresh folder contents');
  };

  // Get current folder contents
  const { folder: currentFolderData, subFolders, files } = getCurrentFolderContents();

  // Sort items
  const sortItems = (items) => {
    return [...items]?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name, 'it');
        case 'size':
          return (b?.size || 0) - (a?.size || 0);
        case 'type':
          if (a?.type !== b?.type) {
            return a?.type === 'folder' ? -1 : 1;
          }
          return a?.name?.localeCompare(b?.name, 'it');
        case 'modified':
          return new Date(b.modifiedAt) - new Date(a.modifiedAt);
        default:
          return 0;
      }
    });
  };

  const sortedFolders = sortItems(subFolders);
  const sortedFiles = sortItems(files);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-all duration-200 pt-16 ${
        sidebarCollapsed ? 'ml-12' : 'ml-64'
      }`}>
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Left Panel - Folder Tree */}
          <div className="w-80 bg-surface border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Struttura cartelle
              </h2>
              <Button
                variant="outline"
                onClick={() => setCreateFolderDialog({ isOpen: true, parentId: 'root' })}
                iconName="FolderPlus"
                iconPosition="left"
                className="w-full text-sm"
              >
                Nuova cartella
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <FolderTree
                folders={folderStructure}
                selectedFolder={currentFolderData}
                onFolderSelect={handleFolderSelect}
                onFolderCreate={(parentId) => setCreateFolderDialog({ isOpen: true, parentId })}
                onFolderRename={(folderId, newName) => console.log('Rename folder:', folderId, newName)}
                onFolderDelete={(folderId) => console.log('Delete folder:', folderId)}
                expandedFolders={expandedFolders}
                onToggleExpand={handleToggleExpand}
              />
            </div>
          </div>

          {/* Right Panel - Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Breadcrumb Navigation */}
            <div className="p-4 border-b border-border">
              <BreadcrumbNavigation
                path={currentPath}
                onNavigate={handleNavigate}
                onGoUp={handleGoUp}
              />
            </div>

            {/* Toolbar */}
            <div className="p-4">
              <FolderToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedCount={selectedItems?.size}
                onNewFolder={() => setCreateFolderDialog({ isOpen: true, parentId: currentFolderData?.id || 'root' })}
                onRefresh={handleRefresh}
                onSelectAll={handleSelectAll}
                onClearSelection={handleClearSelection}
              />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {sortedFolders?.length === 0 && sortedFiles?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Icon name="FolderOpen" size={48} className="text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Cartella vuota
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Questa cartella non contiene file o sottocartelle.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setCreateFolderDialog({ isOpen: true, parentId: currentFolderData?.id || 'root' })}
                    iconName="FolderPlus"
                    iconPosition="left"
                  >
                    Crea nuova cartella
                  </Button>
                </div>
              ) : (
                <FolderGrid
                  folders={sortedFolders}
                  files={sortedFiles}
                  viewMode={viewMode}
                  selectedItems={selectedItems}
                  onItemSelect={handleItemSelect}
                  onItemDoubleClick={handleItemDoubleClick}
                  onContextMenu={handleContextMenu}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              )}
            </div>

            {/* Status Bar */}
            <div className="border-t border-border bg-surface px-4 py-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {sortedFolders?.length + sortedFiles?.length} elementi
                  {selectedItems?.size > 0 && ` • ${selectedItems?.size} selezionati`}
                </span>
                <span>
                  {currentFolderData?.name || 'I miei file'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Context Menu */}
      <ContextMenu
        isVisible={contextMenu?.isVisible}
        position={contextMenu?.position}
        onClose={() => setContextMenu({ isVisible: false, position: { x: 0, y: 0 } })}
        selectedItems={selectedItems}
        onAction={handleContextAction}
      />
      {/* Create Folder Dialog */}
      <CreateFolderDialog
        isOpen={createFolderDialog?.isOpen}
        onClose={() => setCreateFolderDialog({ isOpen: false, parentId: null })}
        onConfirm={handleCreateFolder}
        parentFolder={currentFolderData}
      />
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog?.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, items: [] })}
        onConfirm={handleDeleteItems}
        items={deleteDialog?.items}
      />
    </div>
  );
};

export default FolderManagementInterface;