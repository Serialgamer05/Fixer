import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PDFPreview = ({ file }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(5); // Mock total pages
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handlePageInput = (e) => {
    const page = parseInt(e?.target?.value);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* PDF Controls */}
      <div className="flex items-center justify-between p-4 bg-surface/50 border-b border-border">
        {/* Page Navigation */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="h-9 w-9"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Pagina</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={handlePageInput}
              className="w-16 px-2 py-1 text-sm text-center border border-border rounded bg-background"
            />
            <span className="text-sm text-muted-foreground">di {totalPages}</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="h-9 w-9"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>

        {/* Zoom Controls */}
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
      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-muted/20 p-4">
        <div className="flex justify-center">
          <div 
            className="bg-white shadow-strong rounded-lg overflow-hidden transition-transform duration-200"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            {isLoading ? (
              <div className="w-[595px] h-[842px] flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">Caricamento pagina...</span>
                </div>
              </div>
            ) : (
              <div className="w-[595px] h-[842px] p-8 bg-white">
                {/* Mock PDF Content */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      Documento PDF - Pagina {currentPage}
                    </h1>
                    <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
                  </div>

                  <div className="space-y-4 text-gray-700">
                    <p className="text-justify leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
                      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                      commodo consequat.
                    </p>

                    <p className="text-justify leading-relaxed">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
                      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
                      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>

                    <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                      Sezione {currentPage}: Contenuto Specifico
                    </h2>

                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Elemento importante numero uno della pagina {currentPage}</li>
                      <li>Secondo elemento rilevante per questa sezione</li>
                      <li>Terzo punto da considerare nell'analisi</li>
                      <li>Quarto aspetto fondamentale del documento</li>
                    </ul>

                    <p className="text-justify leading-relaxed mt-4">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem 
                      accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae 
                      ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt 
                      explicabo.
                    </p>

                    <div className="bg-gray-100 p-4 rounded-lg mt-6">
                      <h3 className="font-semibold text-gray-800 mb-2">Nota Importante:</h3>
                      <p className="text-sm text-gray-600">
                        Questo è un esempio di contenuto PDF per la pagina {currentPage}. 
                        Il sistema di anteprima supporta la navigazione tra le pagine e 
                        i controlli di zoom per una migliore visualizzazione.
                      </p>
                    </div>
                  </div>

                  {/* Page Footer */}
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-xs text-gray-500 border-t pt-4">
                    <span>{file?.name}</span>
                    <span>Pagina {currentPage} di {totalPages}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* PDF Info */}
      <div className="p-4 bg-surface/50 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Usa le frecce o i numeri per navigare</span>
          <span>Rotella del mouse per zoom rapido</span>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;