
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { installGlobalErrorMonitoring } from './utils/pre-commit-check.ts'

// Fix for React library import issues - preload key packages
const preloadLibraries = async () => {
  try {
    // Dynamically import react-is
    const reactIs = await import('react-is');
    // Make it available globally for debugging
    window.__REACT_IS__ = reactIs;
    console.log('React-is loaded successfully:', Object.keys(reactIs));
  } catch (err) {
    console.error('Failed to preload React libraries:', err);
  }
};

// Fix for lodash import issue with Recharts - using window assignment instead of require
window.lodash = window._ = {};
if (typeof window !== 'undefined') {
  try {
    // Dynamically import lodash for browser environments
    import('lodash').then(lodashModule => {
      window._ = window.lodash = lodashModule;
      console.log('Lodash loaded dynamically');
    }).catch(err => {
      console.error('Failed to load lodash:', err);
    });
  } catch (error) {
    console.error('Error setting up lodash:', error);
  }
}

// Apply theme and font immediately to prevent layout shifts
const applyThemeAndFont = () => {
  try {
    // Theme application using a single localStorage read
    const savedTheme = localStorage.getItem('theme') || 'system';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (savedTheme === 'system' && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Font application - batch DOM operations
    const savedFont = localStorage.getItem('preferredFont');
    const savedFontSize = localStorage.getItem('fontSize');
    
    if (savedFont || savedFontSize) {
      // Use requestAnimationFrame for smoother rendering
      requestAnimationFrame(() => {
        if (savedFont) document.body.style.fontFamily = `${savedFont}, sans-serif`;
        if (savedFontSize) document.documentElement.style.fontSize = `${savedFontSize}px`;
      });
    }
  } catch (error) {
    console.error('Failed to apply theme settings:', error);
    // Continue with default theme/font if there's an error
  }
};

// Execute theme application immediately
applyThemeAndFont();

// Preload React libraries
preloadLibraries();

// Set up a global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Increment error count for monitoring
  window.__CONSOLE_ERROR_COUNT__ = (window.__CONSOLE_ERROR_COUNT__ || 0) + 1;
  
  // Look for specific React-related errors
  if (event.error && event.error.message && 
     (event.error.message.includes('react-is') || 
      event.error.message.includes('isFragment'))) {
    console.error('React dependency error detected:', event.error.message);
    displayFallbackUI('React component error. This is likely due to a library version conflict. Refreshing may help.');
    return;
  }
  
  // Specific handling for the Recharts/lodash error
  if (event.error && event.error.message && 
      (event.error.message.includes('lodash') || 
       event.error.message.includes('forwardRef') ||
       event.error.message.includes('Cannot read properties of undefined'))) {
    console.error('Detected critical library error. Attempting recovery...');
    displayFallbackUI('Application error with UI library. This is likely due to a library conflict.');
    return;
  }
  
  // Add fallback UI for critical errors
  if (document.body.children.length === 0 || 
      (document.getElementById('root') && document.getElementById('root').children.length === 0)) {
    displayFallbackUI('Application failed to render properly: ' + event.error.message);
  }
});

// Display fallback UI for critical errors
function displayFallbackUI(message) {
  const fallbackElement = document.createElement('div');
  fallbackElement.style.padding = '20px';
  fallbackElement.style.maxWidth = '600px';
  fallbackElement.style.margin = '40px auto';
  fallbackElement.style.borderRadius = '8px';
  fallbackElement.style.backgroundColor = '#f8f9fa';
  fallbackElement.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  fallbackElement.innerHTML = `
    <h2 style="color: #e11d48; margin-bottom: 10px;">Application Error</h2>
    <p style="margin-bottom: 15px;">${message}</p>
    <p style="margin-bottom: 15px;">Please try refreshing the page. If the problem persists, contact support.</p>
    <div>
      <button style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;" 
              onclick="window.location.reload()">
        Refresh Page
      </button>
      <button style="background: #6b7280; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;" 
              onclick="window.location.href = '/dashboard'">
        Try Dashboard Directly
      </button>
    </div>
  `;
  
  if (document.getElementById('root')) {
    document.getElementById('root').appendChild(fallbackElement);
  } else {
    document.body.appendChild(fallbackElement);
  }
}

// Install global error monitoring in non-blocking way
setTimeout(() => {
  try {
    installGlobalErrorMonitoring();
    console.log('Error monitoring initialized');
  } catch (err) {
    console.error('Failed to initialize error monitoring:', err);
  }
}, 0);

// Simple function to create a minimal UI if App component fails to load
function createMinimalUI() {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;
  
  rootElement.innerHTML = `
    <div style="padding: 2rem; text-align: center; max-width: 600px; margin: 0 auto;">
      <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">Patorama Studios</h1>
      <p style="margin-bottom: 1rem;">The application is having trouble loading. Let's try a direct route.</p>
      <div>
        <a href="/dashboard" style="display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 0.25rem; margin-right: 0.5rem;">
          Dashboard
        </a>
        <a href="/orders" style="display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 0.25rem; margin-right: 0.5rem;">
          Orders
        </a>
        <a href="/debug" style="display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 0.25rem;">
          Debug
        </a>
      </div>
    </div>
  `;
}

// Improved mount function with debugging for deployment issues
const mountApp = () => {
  try {
    // Add console logs for debugging
    console.log('Starting app mount...', window.location.href);
    console.log('Environment:', import.meta.env.MODE);
    
    // Get root element
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }
    
    console.log('Root element found, creating React root');
    
    // Create and mount root
    const root = createRoot(rootElement);
    
    console.log('Rendering app...');
    
    // Set a timeout to detect if App is taking too long to render
    const appLoadTimeout = setTimeout(() => {
      console.error('App render timed out - creating minimal UI');
      createMinimalUI();
    }, 5000);
    
    // Wrap App in BrowserRouter before rendering
    root.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    clearTimeout(appLoadTimeout);
    console.log('App render completed');
    
    // Show a simple initialization message in the console
    console.log('%c✨ Patorama Studios App Initialized ✨', 'color: #3b82f6; font-weight: bold; font-size: 14px;');
    
    // Defer non-critical verification
    setTimeout(() => {
      if ((window as any).__CONSOLE_ERROR_COUNT__ > 0) {
        console.warn(`[App] ${(window as any).__CONSOLE_ERROR_COUNT__} errors were detected during startup`);
      } else {
        console.log('No startup errors detected');
      }
    }, 2000);
  } catch (error) {
    console.error("Error mounting app:", error);
    
    // Display more visible error message
    displayFallbackUI(error instanceof Error ? error.message : String(error));
  }
};

// Call mount immediately
console.log('Initializing application...');
mountApp();

// Optimize service worker registration
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Delay service worker registration to not block initial render
    setTimeout(() => {
      navigator.serviceWorker.register('/sw.js').catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
    }, 1000);
  });
}

// Declare global namespace for React Router history
declare global {
  interface Window {
    __REACT_ROUTER_HISTORY__?: unknown;
    __CONSOLE_ERROR_COUNT__?: number;
    __REACT_IS__?: any; // For react-is global
    _?: any; // For lodash global
    lodash?: any; // For lodash global
  }
}
