import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ImagePreview = ({ file, onPrevious, onNext, hasPrevious, hasNext }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsLoading(true);
  }, [file]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e?.clientX - position?.x,
        y: e?.clientY - position?.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e?.clientX - dragStart?.x,
        y: e?.clientY - dragStart?.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    switch (e?.key) {
      case 'ArrowLeft':
        if (hasPrevious) onPrevious();
        break;
      case 'ArrowRight':
        if (hasNext) onNext();
        break;
      case '+': case'=':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case '0':
        handleResetZoom();
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, hasPrevious, hasNext]);

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Zoom Controls */}
      <div className="flex items-center justify-center p-4 bg-surface/50 border-b border-border">
        <div className="flex items-center space-x-2 bg-card rounded-lg p-2 shadow-subtle">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="h-8 w-8"
          >
            <Icon name="ZoomOut" size={14} />
          </Button>
          
          <span className="text-sm font-medium text-foreground min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className="h-8 w-8"
          >
            <Icon name="ZoomIn" size={14} />
          </Button>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetZoom}
            className="h-8 w-8"
          >
            <Icon name="RotateCcw" size={14} />
          </Button>
        </div>
      </div>
      {/* Image Container */}
      <div className="flex-1 relative overflow-hidden bg-muted/20">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">Caricamento immagine...</span>
            </div>
          </div>
        )}

        <div 
          className="w-full h-full flex items-center justify-center cursor-move"
          onMouseDown={handleMouseDown}
          style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          <img
            src={file?.url}
            alt={file?.name}
            className="max-w-none transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) translate(${position?.x / zoom}px, ${position?.y / zoom}px)`,
              maxHeight: zoom === 1 ? '100%' : 'none',
              maxWidth: zoom === 1 ? '100%' : 'none'
            }}
            onLoad={handleImageLoad}
            draggable={false}
          />
        </div>

        {/* Navigation Arrows */}
        {hasPrevious && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 bg-card/80 backdrop-blur-sm hover:bg-card shadow-medium"
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
        )}

        {hasNext && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 bg-card/80 backdrop-blur-sm hover:bg-card shadow-medium"
          >
            <Icon name="ChevronRight" size={20} />
          </Button>
        )}
      </div>
      {/* Image Info */}
      <div className="p-4 bg-surface/50 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Usa i tasti freccia per navigare</span>
          <span>Rotella del mouse o +/- per zoom</span>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;