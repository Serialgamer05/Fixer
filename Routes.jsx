import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import FolderManagementInterface from './pages/folder-management-interface';
import FileUploadInterface from './pages/file-upload-interface';
import FilePreviewModal from './pages/file-preview-modal';
import FileManagerDashboard from './pages/file-manager-dashboard';
import SearchAndFilterInterface from './pages/search-and-filter-interface';
import FilePropertiesDialog from './pages/file-properties-dialog';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<FileManagerDashboard />} />
        <Route path="/folder-management-interface" element={<FolderManagementInterface />} />
        <Route path="/file-upload-interface" element={<FileUploadInterface />} />
        <Route path="/file-preview-modal" element={<FilePreviewModal />} />
        <Route path="/file-manager-dashboard" element={<FileManagerDashboard />} />
        <Route path="/search-and-filter-interface" element={<SearchAndFilterInterface />} />
        <Route path="/file-properties-dialog" element={<FilePropertiesDialog />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
