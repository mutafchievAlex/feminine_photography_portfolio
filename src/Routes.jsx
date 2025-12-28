import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import AdminDashboard from './pages/admin-dashboard';
import Investment from './pages/investment';
import Gallery from './pages/gallery';
import AboutPage from './pages/about';
import BookingPage from './pages/booking';
import Homepage from './pages/homepage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import IndividualPhotographyAlbum from "pages/individual-photography-album";
import AlbumManagement from './pages/album-management';
import ManagePhotos from './pages/album-management/ManagePhotos';

function Routes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<Homepage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
          <Route path="/album-management" element={<ProtectedRoute element={<AlbumManagement />} />} />
          <Route path="/admin/albums/:albumId/photos" element={<ProtectedRoute element={<ManagePhotos />} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/individual-photography-album/:albumId" element={<IndividualPhotographyAlbum />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default Routes;