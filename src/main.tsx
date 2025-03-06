
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { installGlobalErrorMonitoring } from './utils/pre-commit-check.ts'

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

// Install global error monitoring early
installGlobalErrorMonitoring();

// Pre-verification checks
console.log('[App] Running pre-mount verification...');

// Function to mount the app with error handling
const mountApp = () => {
  try {
    // Pre-fetch root element for better performance
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }
    
    // Create and mount root
    const root = createRoot(rootElement);
    root.render(
      <App />
    );
    
    // Post-mount verification
    console.log('[App] Running post-mount verification...');
    
    // Check for common React context errors after a brief delay
    setTimeout(() => {
      if ((window as any).__CONSOLE_ERROR_COUNT__ > 0) {
        console.warn(`[App] ${(window as any).__CONSOLE_ERROR_COUNT__} errors were detected during startup`);
      } else {
        console.log('[App] No errors detected during startup');
      }
      
      // Check for missing Router context
      if (typeof window !== 'undefined' && !window.__REACT_ROUTER_HISTORY__) {
        console.warn('[App] React Router context not found after mount');
      }
    }, 1000);
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

// Call mountApp immediately to avoid blank screen issues
mountApp();

// Register service worker for production
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.error('ServiceWorker registration failed:', error);
    });
  });
}

// Declare global namespace for React Router history
declare global {
  interface Window {
    __REACT_ROUTER_HISTORY__?: unknown;
    __CONSOLE_ERROR_COUNT__?: number;
  }
}
