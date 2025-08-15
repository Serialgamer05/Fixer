import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import ActiveFilters from './components/ActiveFilters';
import SearchResults from './components/SearchResults';
import SavedSearches from './components/SavedSearches';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SearchAndFilterInterface = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterPanelExpanded, setIsFilterPanelExpanded] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Filter state
  const [filters, setFilters] = useState({
    fileTypes: [],
    sizeRanges: [],
    dateRanges: [],
    tags: []
  });

  // Search suggestions and history
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);

  // Mock file data
  const mockFiles = [
    {
      id: '1',
      name: 'Relazione_Progetto_2024.pdf',
      type: 'PDF Document',
      size: 2457600,
      modified: '2024-08-14T10:30:00Z',
      path: '/Documenti/Lavoro',
      thumbnail: null,
      tags: ['lavoro', 'importante']
    },
    {
      id: '2',
      name: 'Presentazione_Marketing.pptx',
      type: 'PowerPoint Presentation',
      size: 5242880,
      modified: '2024-08-13T15:45:00Z',
      path: '/Documenti/Presentazioni',
      thumbnail: null,
      tags: ['marketing', 'presentazione']
    },
    {
      id: '3',
      name: 'Foto_Vacanze_Estate.jpg',
      type: 'JPEG Image',
      size: 3145728,
      modified: '2024-08-12T18:20:00Z',
      path: '/Immagini/Vacanze',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop',
      tags: ['vacanze', 'estate']
    },
    {
      id: '4',
      name: 'Video_Tutorial_React.mp4',
      type: 'MP4 Video',
      size: 52428800,
      modified: '2024-08-11T09:15:00Z',
      path: '/Video/Tutorial',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150&h=150&fit=crop',
      tags: ['tutorial', 'programmazione']
    },
    {
      id: '5',
      name: 'Musica_Rilassante.mp3',
      type: 'MP3 Audio',
      size: 8388608,
      modified: '2024-08-10T20:30:00Z',
      path: '/Musica/Relax',
      thumbnail: null,
      tags: ['musica', 'relax']
    },
    {
      id: '6',
      name: 'Archivio_Backup_Sistema.zip',
      type: 'ZIP Archive',
      size: 104857600,
      modified: '2024-08-09T14:00:00Z',
      path: '/Backup',
      thumbnail: null,
      tags: ['backup', 'sistema']
    },
    {
      id: '7',
      name: 'Applicazione_Gestionale.exe',
      type: 'Executable',
      size: 15728640,
      modified: '2024-08-08T11:45:00Z',
      path: '/Software',
      thumbnail: null,
      tags: ['software', 'gestionale']
    },
    {
      id: '8',
      name: 'Log_Sistema_Agosto.log',
      type: 'Log File',
      size: 1048576,
      modified: '2024-08-07T23:59:00Z',
      path: '/Logs',
      thumbnail: null,
      tags: ['log', 'sistema']
    },
    {
      id: '9',
      name: 'Contratto_Affitto_2024.pdf',
      type: 'PDF Document',
      size: 1572864,
      modified: '2024-08-06T16:30:00Z',
      path: '/Documenti/Personali',
      thumbnail: null,
      tags: ['contratto', 'personale']
    },
    {
      id: '10',
      name: 'Screenshot_Applicazione.png',
      type: 'PNG Image',
      size: 2097152,
      modified: '2024-08-05T12:15:00Z',
      path: '/Immagini/Screenshot',
      thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=150&h=150&fit=crop',
      tags: ['screenshot', 'applicazione']
    }
  ];

  // Initialize from localStorage
  useEffect(() => {
    const savedQueries = localStorage.getItem('recentSearchQueries');
    const savedSearchesList = localStorage.getItem('savedSearches');
    
    if (savedQueries) {
      setRecentQueries(JSON.parse(savedQueries));
    }
    
    if (savedSearchesList) {
      setSavedSearches(JSON.parse(savedSearchesList));
    }

    // Check for URL parameters
    const urlParams = new URLSearchParams(location.search);
    const queryParam = urlParams?.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [location?.search]);

  // Handle responsive design
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate search suggestions based on files
  useEffect(() => {
    if (searchQuery?.length > 0) {
      const suggestions = mockFiles?.filter(file => 
          file?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          file?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
        )?.map(file => ({
          name: file?.name,
          path: file?.path,
          icon: getFileIcon(file)
        }))?.slice(0, 8);
      
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

  const getFileIcon = (file) => {
    const extension = file?.name?.split('.')?.pop()?.toLowerCase();
    const iconMap = {
      pdf: 'FileText',
      pptx: 'FileText',
      jpg: 'Image',
      jpeg: 'Image',
      png: 'Image',
      mp4: 'Video',
      mp3: 'Music',
      zip: 'Archive',
      exe: 'Zap',
      log: 'FileText',
    };
    return iconMap?.[extension] || 'File';
  };

  // Filter and search logic
  const filteredResults = useMemo(() => {
    let results = [...mockFiles];

    // Apply text search
    if (searchQuery) {
      results = results?.filter(file =>
        file?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        file?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase())) ||
        file?.path?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply file type filters
    if (filters?.fileTypes?.length > 0) {
      results = results?.filter(file => {
        const extension = file?.name?.split('.')?.pop()?.toLowerCase();
        return filters?.fileTypes?.some(typeId => {
          const typeExtensions = {
            document: ['pdf', 'doc', 'docx', 'txt', 'pptx'],
            image: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
            video: ['mp4', 'avi', 'mov', 'mkv'],
            audio: ['mp3', 'wav', 'flac', 'aac'],
            archive: ['zip', 'rar', '7z', 'tar'],
            executable: ['exe', 'msi', 'app', 'deb']
          };
          return typeExtensions?.[typeId]?.includes(extension);
        });
      });
    }

    // Apply size filters
    if (filters?.sizeRanges?.length > 0) {
      results = results?.filter(file => {
        const sizeInMB = file?.size / (1024 * 1024);
        return filters?.sizeRanges?.some(sizeId => {
          const ranges = {
            tiny: [0, 1],
            small: [1, 10],
            medium: [10, 100],
            large: [100, 500],
            huge: [500, 1000]
          };
          const [min, max] = ranges?.[sizeId] || [0, 1000];
          return sizeInMB >= min && sizeInMB <= max;
        });
      });
    }

    // Apply date filters
    if (filters?.dateRanges?.length > 0) {
      results = results?.filter(file => {
        const fileDate = new Date(file.modified);
        const now = new Date();
        
        return filters?.dateRanges?.some(dateId => {
          switch (dateId) {
            case 'today':
              return fileDate?.toDateString() === now?.toDateString();
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              return fileDate >= weekAgo;
            case 'month':
              const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
              return fileDate >= monthAgo;
            case 'year':
              const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
              return fileDate >= yearAgo;
            default:
              return true;
          }
        });
      });
    }

    // Apply tag filters
    if (filters?.tags?.length > 0) {
      results = results?.filter(file =>
        filters?.tags?.some(tag =>
          file?.tags?.some(fileTag => 
            fileTag?.toLowerCase()?.includes(tag?.toLowerCase())
          )
        )
      );
    }

    // Apply sorting
    results?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'size':
          return b?.size - a?.size;
        case 'modified':
          return new Date(b.modified)?.getTime() - new Date(a.modified)?.getTime();
        case 'type':
          return a?.type?.localeCompare(b?.type);
        case 'relevance':
        default:
          // Simple relevance scoring based on search query matches
          if (!searchQuery) return 0;
          const aScore = (a?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ? 2 : 0) +
                        (a?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase())) ? 1 : 0);
          const bScore = (b?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ? 2 : 0) +
                        (b?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase())) ? 1 : 0);
          return bScore - aScore;
      }
    });

    return results;
  }, [searchQuery, filters, sortBy]);

  const handleSearchSubmit = () => {
    if (searchQuery?.trim()) {
      // Add to recent queries
      const newRecentQueries = [searchQuery, ...recentQueries?.filter(q => q !== searchQuery)]?.slice(0, 10);
      setRecentQueries(newRecentQueries);
      localStorage.setItem('recentSearchQueries', JSON.stringify(newRecentQueries));
      
      // Update URL
      navigate(`/search-and-filter-interface?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearchSubmit();
  };

  const handleRemoveFilter = (filterType, value) => {
    const newFilters = { ...filters };
    
    switch (filterType) {
      case 'fileType':
        newFilters.fileTypes = newFilters?.fileTypes?.filter(type => type !== value);
        break;
      case 'sizeRange':
        newFilters.sizeRanges = newFilters?.sizeRanges?.filter(size => size !== value);
        break;
      case 'dateRange':
        newFilters.dateRanges = newFilters?.dateRanges?.filter(date => date !== value);
        break;
      case 'tag':
        newFilters.tags = newFilters?.tags?.filter(tag => tag !== value);
        break;
    }
    
    setFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setFilters({
      fileTypes: [],
      sizeRanges: [],
      dateRanges: [],
      tags: []
    });
    setSearchQuery('');
  };

  const handleFileSelect = (file, isMultiSelect) => {
    if (isMultiSelect) {
      setSelectedFiles(prev => {
        const isSelected = prev?.some(selected => selected?.id === file?.id);
        if (isSelected) {
          return prev?.filter(selected => selected?.id !== file?.id);
        } else {
          return [...prev, file];
        }
      });
    } else {
      setSelectedFiles([file]);
    }
  };

  const handleSaveSearch = (search) => {
    const newSavedSearches = [...savedSearches, search];
    setSavedSearches(newSavedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(newSavedSearches));
  };

  const handleLoadSearch = (search) => {
    setSearchQuery(search?.query);
    setFilters(search?.filters);
  };

  const handleDeleteSearch = (searchId) => {
    const newSavedSearches = savedSearches?.filter(search => search?.id !== searchId);
    setSavedSearches(newSavedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(newSavedSearches));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-all duration-200 ${
        sidebarCollapsed ? 'ml-12' : 'ml-64'
      } pt-16 min-h-screen`}>
        {/* Search Header */}
        <div className="bg-surface border-b border-border">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Icon name="Search" size={24} className="text-primary" />
                <h1 className="text-2xl font-semibold text-foreground">
                  Ricerca e Filtri
                </h1>
              </div>
              
              <SavedSearches
                savedSearches={savedSearches}
                onLoadSearch={handleLoadSearch}
                onSaveSearch={handleSaveSearch}
                onDeleteSearch={handleDeleteSearch}
                currentSearch={{ query: searchQuery, filters }}
              />
            </div>

            <div className="flex items-center space-x-4">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={handleSearchSubmit}
                suggestions={searchSuggestions}
                recentQueries={recentQueries}
                showSuggestions={searchSuggestions?.length > 0}
                onSuggestionSelect={handleSuggestionSelect}
              />
              
              <Button
                variant="default"
                onClick={handleSearchSubmit}
                disabled={!searchQuery?.trim()}
                className="px-6"
              >
                <Icon name="Search" size={16} className="mr-2" />
                Cerca
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          isExpanded={isFilterPanelExpanded}
          onToggle={() => setIsFilterPanelExpanded(!isFilterPanelExpanded)}
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={filteredResults?.length}
        />

        {/* Active Filters */}
        <ActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
          resultCount={filteredResults?.length}
        />

        {/* Search Results */}
        <SearchResults
          results={filteredResults}
          searchQuery={searchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onFileSelect={handleFileSelect}
          selectedFiles={selectedFiles}
        />
      </main>
    </div>
  );
};

export default SearchAndFilterInterface;