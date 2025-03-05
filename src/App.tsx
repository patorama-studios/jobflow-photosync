
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductionUpload from './pages/ProductionUpload';
import Orders from './pages/Orders';
import { CalendarPage } from './pages/CalendarPage';
import { Toaster } from "@/components/ui/toaster";
import { GoogleMapsProvider } from './contexts/GoogleMapsContext';

function App() {
  // Google Maps API key - in a real application, this would be stored securely
  // Replace this with your actual API key
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY";
  
  return (
    <GoogleMapsProvider apiKey={googleMapsApiKey}>
      <Router>
        <Routes>
          <Route path="/production/:orderId" element={<ProductionUpload />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/calendar" element={<CalendarPage />} />
          {/* Add a default route to redirect to calendar */}
          <Route path="/" element={<CalendarPage />} />
        </Routes>
        <Toaster />
      </Router>
    </GoogleMapsProvider>
  );
}

export default App;
