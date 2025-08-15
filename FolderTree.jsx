import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FolderTree = ({ 
  folders, 
  selectedFolder, 
  onFolderSelect, 
  onFolderCreate, 
  onFolderRename, 
  onFolderDelete,
  expandedFolders,
  onToggleExpand 
}) => {
  const [editingFolder, setEditingFolder] = useState(null);
  const [editName, setEditName] = useState('');

  const handleRename = (folder) => {
    setEditingFolder(folder?.id);
    setEditName(folder?.name);
  };

  const handleRenameSubmit = (folderId) => {
    if (editName?.trim()) {
      onFolderRename(folderId, editName?.trim());
    }
    setEditingFolder(null);
    setEditName('');
  };

  const handleRenameCancel = () => {
    setEditingFolder(null);
    setEditName('');
  };

  const renderFolder = (folder, level = 0) => {
    const isExpanded = expandedFolders?.has(folder?.id);
    const hasChildren = folder?.children && folder?.children?.length > 0;
    const isSelected = selectedFolder?.id === folder?.id;
    const isEditing = editingFolder === folder?.id;

    return (
      <div key={folder?.id} className="select-none">
        <div 
          className={`flex items-center group hover:bg-hover-light rounded-md transition-colors duration-200 ${
            isSelected ? 'bg-primary/10 border border-primary/20' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleExpand(folder?.id)}
              className="h-6 w-6 p-0 mr-1 flex-shrink-0"
            >
              <Icon 
                name={isExpanded ? 'ChevronDown' : 'ChevronRight'} 
                size={12} 
                className="text-muted-foreground"
              />
            </Button>
          )}
          
          <div 
            className="flex items-center flex-1 min-w-0 py-1.5 px-2 cursor-pointer"
            onClick={() => onFolderSelect(folder)}
          >
            <Icon 
              name={folder?.type === 'folder' ? 'Folder' : 'FolderOpen'} 
              size={16} 
              className={`mr-2 flex-shrink-0 ${
                isSelected ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
            
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e?.target?.value)}
                onBlur={() => handleRenameSubmit(folder?.id)}
                onKeyDown={(e) => {
                  if (e?.key === 'Enter') handleRenameSubmit(folder?.id);
                  if (e?.key === 'Escape') handleRenameCancel();
                }}
                className="flex-1 bg-background border border-border rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            ) : (
              <span className={`flex-1 text-sm truncate ${
                isSelected ? 'text-primary font-medium' : 'text-foreground'
              }`}>
                {folder?.name}
              </span>
            )}
            
            {folder?.itemCount !== undefined && !isEditing && (
              <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                {folder?.itemCount}
              </span>
            )}
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center mr-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e?.stopPropagation();
                onFolderCreate(folder?.id);
              }}
              className="h-6 w-6 p-0"
              title="Crea nuova cartella"
            >
              <Icon name="FolderPlus" size={12} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e?.stopPropagation();
                handleRename(folder);
              }}
              className="h-6 w-6 p-0"
              title="Rinomina cartella"
            >
              <Icon name="Edit2" size={12} />
            </Button>
            
            {folder?.id !== 'root' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e?.stopPropagation();
                  onFolderDelete(folder?.id);
                }}
                className="h-6 w-6 p-0 text-error hover:text-error"
                title="Elimina cartella"
              >
                <Icon name="Trash2" size={12} />
              </Button>
            )}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {folder?.children?.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {folders?.map(folder => renderFolder(folder))}
    </div>
  );
};

export default FolderTree;