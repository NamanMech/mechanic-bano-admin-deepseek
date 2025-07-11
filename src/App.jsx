import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PageStatusProvider, usePageStatus } from './context/PageStatusContext';
import Home from './pages/Home';
import YouTubeVideoManagement from './pages/YouTubeVideoManagement';
import PDFManagement from './pages/PDFManagement';
import WelcomeNoteManagement from './pages/WelcomeNoteManagement';
import SiteNameManagement from './pages/SiteNameManagement';
import PageControlManagement from './pages/PageControlManagement';
import SubscriptionPlans from './pages/SubscriptionPlans';
import UserManagement from './pages/UserManagement';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import ToastNotification from './components/ToastNotification';
import Unauthorized from './pages/Unauthorized';

// प्रोटेक्टेड रूट कंपोनेंट
const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <LoadingSpinner fullPage />;
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser.role !== requiredRole) {
    return <Unauthorized />;
  }
  
  return children;
};

// कंडीशनल रूट कंपोनेंट
const StatusBasedRoute = ({ path, element, requiredPage }) => {
  const { pageStatus, loading } = usePageStatus();
  
  if (loading) return <LoadingSpinner />;
  
  if (pageStatus[requiredPage]) {
    return <Route path={path} element={element} />;
  }
  
  return <Route path={path} element={<Unauthorized />} />;
};

function AppContent() {
  const { loading: authLoading } = useAuth();
  const { pageStatus, loading: statusLoading, fetchPageStatus } = usePageStatus();
  
  const isLoading = authLoading || statusLoading;

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <Router>
      <Navbar pageStatus={pageStatus} />
      <div className="content-container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <StatusBasedRoute 
            path="/videos" 
            element={
              <ProtectedRoute>
                <YouTubeVideoManagement />
              </ProtectedRoute>
            } 
            requiredPage="videos" 
          />
          
          <StatusBasedRoute 
            path="/pdfs" 
            element={
              <ProtectedRoute>
                <PDFManagement />
              </ProtectedRoute>
            } 
            requiredPage="pdfs" 
          />
          
          <StatusBasedRoute 
            path="/welcome" 
            element={
              <ProtectedRoute>
                <WelcomeNoteManagement />
              </ProtectedRoute>
            } 
            requiredPage="welcome" 
          />
          
          <StatusBasedRoute 
            path="/sitename" 
            element={
              <ProtectedRoute>
                <SiteNameManagement />
              </ProtectedRoute>
            } 
            requiredPage="sitename" 
          />
          
          <Route path="/pagecontrol" element={
            <ProtectedRoute requiredRole="superadmin">
              <PageControlManagement fetchPageStatus={fetchPageStatus} />
            </ProtectedRoute>
          } />
          
          <StatusBasedRoute 
            path="/subscription-plans" 
            element={
              <ProtectedRoute>
                <SubscriptionPlans />
              </ProtectedRoute>
            } 
            requiredPage="subscription-plans" 
          />
          
          <StatusBasedRoute 
            path="/users" 
            element={
              <ProtectedRoute requiredRole="superadmin">
                <UserManagement />
              </ProtectedRoute>
            } 
            requiredPage="users" 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <ToastNotification />
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PageStatusProvider>
        <AppContent />
      </PageStatusProvider>
    </AuthProvider>
  );
}
