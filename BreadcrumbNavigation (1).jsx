import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BreadcrumbNavigation = ({ file, onNavigate }) => {
  const pathParts = file?.path?.split('/')?.filter(part => part !== '');
  
  const breadcrumbs = [
    { name: 'File Manager', path: '/', icon: 'HardDrive' },
    ...pathParts?.map((part, index) => ({
      name: part,
      path: '/' + pathParts?.slice(0, index + 1)?.join('/'),
      icon: index === pathParts?.length - 1 ? 'File' : 'Folder'
    }))
  ];

  const handlePathEdit = () => {
    const newPath = prompt('Modifica percorso:', file?.path);
    if (newPath && newPath !== file?.path) {
      onNavigate(newPath);
    }
  };

  const handleParentFolder = () => {
    const parentPath = file?.path?.substring(0, file?.path?.lastIndexOf('/')) || '/';
    onNavigate(parentPath);
  };

  return (
    <div className="space-y-3">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-1 text-sm">
        {breadcrumbs?.map((crumb, index) => (
          <React.Fragment key={crumb?.path}>
            {index > 0 && (
              <Icon name="ChevronRight" size={12} className="text-muted-foreground" />
            )}
            <Link
              to={`/file-manager-dashboard?path=${encodeURIComponent(crumb?.path)}`}
              className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-hover-light transition-colors"
            >
              <Icon name={crumb?.icon} size={14} className="text-muted-foreground" />
              <span className={`${
                index === breadcrumbs?.length - 1 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}>
                {crumb?.name}
              </span>
            </Link>
          </React.Fragment>
        ))}
      </div>
      {/* Path Actions */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 flex items-center space-x-2 bg-surface border border-border rounded-lg px-3 py-2">
          <Icon name="MapPin" size={14} className="text-muted-foreground" />
          <span className="text-sm text-foreground font-mono truncate">{file?.path}</span>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handlePathEdit}
          title="Modifica percorso"
        >
          <Icon name="Edit2" size={14} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigator.clipboard?.writeText(file?.path)}
          title="Copia percorso"
        >
          <Icon name="Copy" size={14} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleParentFolder}
          title="Vai alla cartella padre"
        >
          <Icon name="ArrowUp" size={14} />
        </Button>
      </div>
      {/* Quick Navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          { name: 'Documenti', path: '/Documenti', icon: 'FileText' },
          { name: 'Download', path: '/Download', icon: 'Download' },
          { name: 'Immagini', path: '/Immagini', icon: 'Image' },
          { name: 'Video', path: '/Video', icon: 'Video' },
          { name: 'Musica', path: '/Musica', icon: 'Music' }
        ]?.map((folder) => (
          <Link
            key={folder?.path}
            to={`/file-manager-dashboard?path=${encodeURIComponent(folder?.path)}`}
            className="inline-flex items-center space-x-1 px-2 py-1 text-xs bg-surface border border-border rounded-md hover:bg-hover-light transition-colors"
          >
            <Icon name={folder?.icon} size={12} className="text-muted-foreground" />
            <span className="text-muted-foreground">{folder?.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BreadcrumbNavigation;