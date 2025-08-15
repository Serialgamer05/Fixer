import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BreadcrumbNavigation = ({ path, onNavigate, onGoUp }) => {
  const pathSegments = path?.split('/')?.filter(segment => segment !== '');
  
  const handleSegmentClick = (index) => {
    const newPath = pathSegments?.slice(0, index + 1)?.join('/');
    onNavigate(newPath || '/');
  };

  return (
    <div className="flex items-center space-x-1 bg-surface border border-border rounded-lg px-3 py-2 min-h-[40px]">
      <Button
        variant="ghost"
        size="icon"
        onClick={onGoUp}
        disabled={pathSegments?.length === 0}
        className="h-6 w-6 p-0 mr-2"
        title="Vai alla cartella superiore"
      >
        <Icon name="ArrowUp" size={14} />
      </Button>
      <div className="flex items-center space-x-1 flex-1 min-w-0">
        <Button
          variant="ghost"
          onClick={() => onNavigate('/')}
          className="h-6 px-2 py-0 text-sm font-medium hover:bg-hover-light rounded"
        >
          <Icon name="Home" size={14} className="mr-1" />
          I miei file
        </Button>

        {pathSegments?.map((segment, index) => (
          <React.Fragment key={index}>
            <Icon name="ChevronRight" size={12} className="text-muted-foreground flex-shrink-0" />
            <Button
              variant="ghost"
              onClick={() => handleSegmentClick(index)}
              className="h-6 px-2 py-0 text-sm hover:bg-hover-light rounded max-w-[120px]"
            >
              <span className="truncate">{segment}</span>
            </Button>
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center space-x-1 ml-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history?.back()}
          className="h-6 w-6 p-0"
          title="Indietro"
        >
          <Icon name="ArrowLeft" size={14} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history?.forward()}
          className="h-6 w-6 p-0"
          title="Avanti"
        >
          <Icon name="ArrowRight" size={14} />
        </Button>
      </div>
    </div>
  );
};

export default BreadcrumbNavigation;