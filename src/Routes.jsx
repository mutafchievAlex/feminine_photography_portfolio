import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -24 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <RouterRoutes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Homepage /><SignIn /><SignUp /></PageTransition>} />
        <Route path="/homepage" element={<PageTransition><Homepage /><SignIn /><SignUp /></PageTransition>} />
        <Route path="/signin" element={<PageTransition><Homepage /><SignIn /><SignUp /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Homepage /><SignIn /><SignUp /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><Gallery /><SignIn /><SignUp /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /><SignIn /><SignUp /></PageTransition>} />
        <Route path="/investment" element={<PageTransition><Investment /><SignIn /><SignUp /></PageTransition>} />
        <Route path="/booking" element={<PageTransition><BookingPage /><SignIn /><SignUp /></PageTransition>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute element={<PageTransition><AdminDashboard /></PageTransition>} />} />
        <Route path="/album-management" element={<ProtectedRoute element={<PageTransition><AlbumManagement /></PageTransition>} />} />
        <Route path="/admin/albums/:albumId/photos" element={<ProtectedRoute element={<PageTransition><ManagePhotos /></PageTransition>} />} />
        <Route path="/individual-photography-album/:albumId" element={<PageTransition><IndividualPhotographyAlbum /><SignIn /><SignUp /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </RouterRoutes>
    </AnimatePresence>
  );
};

function Routes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <AnimatedRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default Routes;