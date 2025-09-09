import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AdminDashboard from './pages/admin-dashboard';
import Investment from './pages/investment';
import Gallery from './pages/gallery';
import AboutPage from './pages/about';
import BookingPage from './pages/booking';
import Homepage from './pages/homepage';
import { LanguageProvider } from './hooks/useLanguage';


const Routes = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            <Route path="/" element={<Homepage />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/investment" element={<Investment />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default Routes;