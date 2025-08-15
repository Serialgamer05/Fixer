import React, { useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';


const ContextMenu = ({ 
  isVisible, 
  position, 
  file, 
  onClose, 
  onRename, 
  onDelete, 
  onCopy, 
  onMove, 
  onProperties,
  onPreview,
  onDownload 
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

  if (!isVisible || !file) return null;

  const menuItems = [
    {
      label: 'Apri',
      icon: 'FolderOpen',
      action: () => {
        onPreview(file);
        onClose();
      },
      show: file?.type !== 'folder'
    },
    {
      label: 'Anteprima',
      icon: 'Eye',
      action: () => {
        onPreview(file);
        onClose();
      },
      show: file?.type !== 'folder' && ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt']?.includes(file?.name?.split('.')?.pop()?.toLowerCase())
    },
    {
      label: 'Scarica',
      icon: 'Download',
      action: () => {
        onDownload(file);
        onClose();
      },
      show: file?.type !== 'folder'
    },
    { separator: true },
    {
      label: 'Rinomina',
      icon: 'Edit',
      action: () => {
        onRename(file);
        onClose();
      },
      show: true
    },
    {
      label: 'Copia',
      icon: 'Copy',
      action: () => {
        onCopy(file);
        onClose();
      },
      show: true
    },
    {
      label: 'Sposta',
      icon: 'Move',
      action: () => {
        onMove(file);
        onClose();
      },
      show: true
    },
    { separator: true },
    {
      label: 'Elimina',
      icon: 'Trash2',
      action: () => {
        onDelete(file);
        onClose();
      },
      show: true,
      destructive: true
    },
    { separator: true },
    {
      label: 'Proprietà',
      icon: 'Info',
      action: () => {
        onProperties(file);
        onClose();
      },
      show: true
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50" />
      {/* Context Menu */}
      <div
        ref={menuRef}
        className="fixed z-50 bg-popover border border-border rounded-lg shadow-strong py-1 min-w-48"
        style={{
          left: position?.x,
          top: position?.y,
          transform: 'translate(0, 0)'
        }}
      >
        {menuItems?.map((item, index) => {
          if (item?.separator) {
            return <div key={index} className="border-t border-border my-1" />;
          }

          if (!item?.show) return null;

          return (
            <button
              key={index}
              onClick={item?.action}
              className={`flex items-center space-x-3 px-4 py-2 text-sm hover:bg-hover-light w-full text-left transition-colors duration-200 ${
                item?.destructive ? 'text-error hover:bg-error/10' : 'text-foreground'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ContextMenu;