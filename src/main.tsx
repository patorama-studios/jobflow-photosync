import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/theme-provider.tsx'

// Apply theme and font immediately to prevent layout shifts
const applyThemeAndFont = () => {
  try {
    // Theme application
    const savedTheme = localStorage.getItem('theme') || 'system';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (savedTheme === 'system' && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Font application
    const savedFont = localStorage.getItem('preferredFont');
    if (savedFont) {
      document.body.style.fontFamily = `${savedFont}, sans-serif`;
    }
    
    // Font size application
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      document.documentElement.style.fontSize = `${savedFontSize}px`;
    }
  } catch (error) {
    console.error('Failed to apply theme settings:', error);
    // Continue with default theme/font if there's an error
  }
};

// Execute theme application immediately
applyThemeAndFont();

// Function to mount the app with error handling
const mountApp = () => {
  try {
    // Pre-fetch root element for better performance
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }
    
    // Create and mount root with BrowserRouter
    const root = createRoot(rootElement);
    root.render(
      <BrowserRouter>
        <ThemeProvider defaultTheme="light">
          <App />
        </ThemeProvider>
      </BrowserRouter>
    );
  } catch (error) {
    console.error("Error mounting app:", error);
    // Display error message on the page
    const errorElement = document.createElement('div');
    errorElement.className = 'error-container';
    errorElement.innerHTML = `
      <h2>Application Error</h2>
      <p>Sorry, there was a problem loading the application. Please try refreshing the page.</p>
      <p>Technical details: ${error instanceof Error ? error.message : String(error)}</p>
    `;
    document.body.appendChild(errorElement);
  }
};

// Use native browser API if available, else use setTimeout
if (navigator.onLine) {
  // Only optimize startup if we're online
  mountApp(); // Call immediately to fix the blank screen issue
} else {
  // If offline, mount immediately
  mountApp();
}

// Register service worker for production
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.error('ServiceWorker registration failed:', error);
    });
  });
}
