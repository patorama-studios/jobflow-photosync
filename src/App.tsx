
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
import Login from './pages/Login'
import { HeaderSettingsProvider } from './hooks/useHeaderSettings'

// Import the new components and context
import { NotificationsProvider } from './contexts/NotificationsContext';
import { AIAssistantProvider } from './contexts/AIAssistantContext';
import NotificationsCenter from './pages/NotificationsCenter';
import MainLayout from './components/layout/MainLayout'
import Client from './pages/Client'
import CompanyDetails from './pages/CompanyDetails'
import { Toaster as SonnerToaster } from "sonner";

function App() {
  const queryClient = new QueryClient()
  const googleMapsApiKey = 'AIzaSyDEWzYsyUXf7OCoVaoLOworw0l9MY6ZkP4'

  return (
    <ThemeProvider>
      <NotificationsProvider>
        <GoogleMapsProvider apiKey={googleMapsApiKey}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AIAssistantProvider>
                <HeaderSettingsProvider>
                  <SonnerToaster position="top-right" closeButton />
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
                    <Route path="/notifications" element={<MainLayout><ProtectedRoute><NotificationsCenter /></ProtectedRoute></MainLayout>} />
                  </Routes>
                </HeaderSettingsProvider>
              </AIAssistantProvider>
            </AuthProvider>
          </QueryClientProvider>
        </GoogleMapsProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );
}

export default App;
