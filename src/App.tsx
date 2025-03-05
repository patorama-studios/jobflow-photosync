
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from './contexts/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { GoogleMapsProvider } from './contexts/GoogleMapsContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import OrdersPage from './pages/Orders'
import Customers from './pages/Customers'
import Calendar from './pages/Calendar'
import Settings from './pages/Settings'
import Production from './pages/Production'
import Learning from './pages/Learning'
import Apps from './pages/Apps'
import { HeaderSettingsProvider } from './hooks/useHeaderSettings'

// Import the new components and context
import { NotificationsProvider } from './contexts/NotificationsContext';
import NotificationsCenter from './pages/NotificationsCenter';

function App() {
  const queryClient = new QueryClient()

  return (
    <ThemeProvider>
      <NotificationsProvider>
        <GoogleMapsProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <HeaderSettingsProvider>
                <Toaster />
                <Routes>
                  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/orders/*" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                  <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
                  <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                  <Route path="/settings/*" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/production" element={<ProtectedRoute><Production /></ProtectedRoute>} />
                  <Route path="/learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
                  <Route path="/apps" element={<ProtectedRoute><Apps /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><NotificationsCenter /></ProtectedRoute>} />
                </Routes>
              </HeaderSettingsProvider>
            </AuthProvider>
          </QueryClientProvider>
        </GoogleMapsProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );
}

export default App;
