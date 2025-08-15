import React, { useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';


const ContextMenu = ({ 
  isVisible, 
  position, 
  onClose, 
  selectedItems, 
  onAction 
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef?.current && !menuRef?.current?.contains(event?.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const hasSelection = selectedItems?.size > 0;
  const isMultipleSelection = selectedItems?.size > 1;
  const selectedItem = hasSelection ? Array.from(selectedItems)?.[0] : null;

  const menuItems = [
    {
      id: 'open',
      label: 'Apri',
      icon: 'FolderOpen',
      action: () => onAction('open'),
      disabled: !hasSelection || isMultipleSelection,
      separator: true
    },
    {
      id: 'cut',
      label: 'Taglia',
      icon: 'Scissors',
      action: () => onAction('cut'),
      disabled: !hasSelection,
      shortcut: 'Ctrl+X'
    },
    {
      id: 'copy',
      label: 'Copia',
      icon: 'Copy',
      action: () => onAction('copy'),
      disabled: !hasSelection,
      shortcut: 'Ctrl+C'
    },
    {
      id: 'paste',
      label: 'Incolla',
      icon: 'Clipboard',
      action: () => onAction('paste'),
      shortcut: 'Ctrl+V',
      separator: true
    },
    {
      id: 'rename',
      label: 'Rinomina',
      icon: 'Edit2',
      action: () => onAction('rename'),
      disabled: !hasSelection || isMultipleSelection,
      shortcut: 'F2'
    },
    {
      id: 'delete',
      label: 'Elimina',
      icon: 'Trash2',
      action: () => onAction('delete'),
      disabled: !hasSelection,
      shortcut: 'Canc',
      separator: true
    },
    {
      id: 'newFolder',
      label: 'Nuova cartella',
      icon: 'FolderPlus',
      action: () => onAction('newFolder'),
      shortcut: 'Ctrl+Shift+N'
    },
    {
      id: 'properties',
      label: 'Proprietà',
      icon: 'Info',
      action: () => onAction('properties'),
      disabled: !hasSelection || isMultipleSelection
    }
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-popover border border-border rounded-lg shadow-strong py-1 min-w-[180px]"
      style={{
        left: position?.x,
        top: position?.y,
      }}
    >
      {menuItems?.map((item, index) => (
        <React.Fragment key={item?.id}>
          <button
            onClick={() => {
              if (!item?.disabled) {
                item?.action();
                onClose();
              }
            }}
            disabled={item?.disabled}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-hover-light transition-colors duration-200 ${
              item?.disabled ? 'text-muted-foreground cursor-not-allowed' : 'text-foreground cursor-pointer'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon 
                name={item?.icon} 
                size={14} 
                className={item?.disabled ? 'text-muted-foreground' : 'text-muted-foreground'}
              />
              <span>{item?.label}</span>
            </div>
            {item?.shortcut && (
              <span className="text-xs text-muted-foreground ml-4">
                {item?.shortcut}
              </span>
            )}
          </button>
          {item?.separator && index < menuItems?.length - 1 && (
            <div className="border-t border-border my-1" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ContextMenu;