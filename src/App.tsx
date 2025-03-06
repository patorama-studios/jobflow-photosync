
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
import SettingsPage from './pages/Settings'
import Production from './pages/Production'
import Learning from './pages/Learning'
import Apps from './pages/Apps'
import Login from './pages/Login'
import { HeaderSettingsProvider } from './hooks/useHeaderSettings'

// Import the new components and context
import { NotificationsProvider } from './contexts/NotificationsContext';
import NotificationsCenter from './pages/NotificationsCenter';
import MainLayout from './components/layout/MainLayout'
import Client from './pages/Client'
import CompanyDetails from './pages/CompanyDetails'

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
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<MainLayout><ProtectedRoute><Dashboard /></ProtectedRoute></MainLayout>} />
                  <Route path="/dashboard" element={<MainLayout><ProtectedRoute><Dashboard /></ProtectedRoute></MainLayout>} />
                  <Route path="/orders/*" element={<MainLayout><ProtectedRoute><OrdersPage /></ProtectedRoute></MainLayout>} />
                  <Route path="/customers" element={<MainLayout><ProtectedRoute><Customers /></ProtectedRoute></MainLayout>} />
                  <Route path="/client/:clientId" element={<MainLayout><ProtectedRoute><Client /></ProtectedRoute></MainLayout>} />
                  <Route path="/company/:companyId" element={<MainLayout><ProtectedRoute><CompanyDetails /></ProtectedRoute></MainLayout>} />
                  <Route path="/calendar" element={<MainLayout><ProtectedRoute><Calendar /></ProtectedRoute></MainLayout>} />
                  <Route path="/settings/*" element={<MainLayout><ProtectedRoute><SettingsPage /></ProtectedRoute></MainLayout>} />
                  <Route path="/production" element={<MainLayout><ProtectedRoute><Production /></ProtectedRoute></MainLayout>} />
                  <Route path="/learning" element={<MainLayout><ProtectedRoute><Learning /></ProtectedRoute></MainLayout>} />
                  <Route path="/apps" element={<MainLayout><ProtectedRoute><Apps /></ProtectedRoute></MainLayout>} />
                  <Route path="/notifications" element={<MainLayout><ProtectedRoute><NotificationsCenter /></ProtectedRoute></MainLayout>} />
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
