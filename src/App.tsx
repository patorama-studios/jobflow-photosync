
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Client from "./pages/Client";
import Learning from "./pages/Learning";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { CalendarPage } from "@/components/dashboard/CalendarPage";

const queryClient = new QueryClient();

// A simple wrapper component that applies the SidebarLayout to authenticated routes
const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <SidebarLayout>{children}</SidebarLayout>
    </ProtectedRoute>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes without sidebar */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Authenticated routes with sidebar */}
              <Route path="/dashboard" element={<AuthenticatedRoute><Dashboard /></AuthenticatedRoute>} />
              <Route path="/calendar" element={<AuthenticatedRoute><CalendarPage /></AuthenticatedRoute>} />
              <Route path="/client" element={<AuthenticatedRoute><Client /></AuthenticatedRoute>} />
              <Route path="/learning" element={<AuthenticatedRoute><Learning /></AuthenticatedRoute>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
