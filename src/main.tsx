
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import React from 'react' // Added explicit React import

// Apply theme immediately to prevent layout shifts
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
      if (savedFont) document.body.style.fontFamily = `${savedFont}, sans-serif`;
      if (savedFontSize) document.documentElement.style.fontSize = `${savedFontSize}px`;
    }
  } catch (error) {
    console.error('Failed to apply theme settings:', error);
    // Continue with default theme/font if there's an error
  }
};

// Execute theme application immediately
applyThemeAndFont();

// Show initial loading state with improved performance
const showInitialLoading = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;
  
  // Only add if not already there
  if (!document.getElementById('initial-loading')) {
    // Use a document fragment to minimize reflows
    const fragment = document.createDocumentFragment();
    const loadingElement = document.createElement('div');
    loadingElement.id = 'initial-loading';
    loadingElement.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;width:100%;position:fixed;top:0;left:0;background-color:white;z-index:9999;';
    
    // Add spinner
    loadingElement.innerHTML = `
      <div style="width:40px;height:40px;border:3px solid #eee;border-top-color:#3498db;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px;"></div>
      <p style="font-family:system-ui,sans-serif;color:#555;">Loading application...</p>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .dark #initial-loading {
          background-color: #1a1a1a;
        }
        .dark #initial-loading p {
          color: #ccc;
        }
      </style>
    `;
    
    fragment.appendChild(loadingElement);
    rootElement.appendChild(fragment);
  }
};

// Check if dependency issues exist with React
const checkReactDependencies = () => {
  try {
    // Make sure React.forwardRef exists - this is often a source of errors
    if (typeof React.forwardRef !== 'function') {
      console.error('React.forwardRef is not a function. This could indicate a React version mismatch.');
      
      // Add error to DOM for debugging
      const rootElement = document.getElementById('root');
      if (rootElement) {
        const errorElement = document.createElement('div');
        errorElement.style.cssText = 'color:red;margin:20px;padding:20px;border:1px solid red;';
        errorElement.innerHTML = '<h3>React Dependency Error</h3><p>React.forwardRef is missing or not a function. Try clearing your browser cache or reloading the page.</p>';
        rootElement.appendChild(errorElement);
      }
      
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking React dependencies:', error);
    return false;
  }
};

// Show initial loading state before app initialization
showInitialLoading();

// Mount app with improved reliability and recovery mechanisms
const mountApp = () => {
  try {
    console.log('Starting app mount...');
    
    // Check React dependencies before mounting
    if (!checkReactDependencies()) {
      console.error('React dependency check failed, attempting to continue anyway');
    }
    
    // Get root element
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }
    
    // Create and mount root
    const root = createRoot(rootElement);
    
    // Mount the app with error boundaries
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    
    // Remove initial loading indicator after app mount with smooth transition
    const initialLoading = document.getElementById('initial-loading');
    if (initialLoading) {
      // Delay removal slightly to ensure app is ready
      setTimeout(() => {
        initialLoading.style.opacity = '0';
        initialLoading.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          initialLoading.remove();
        }, 300);
      }, 300); // Reduced from 500ms to 300ms for faster perceived performance
    }
    
    console.log('App render completed');
  } catch (error) {
    console.error("Error mounting app:", error);
    
    // Display improved fallback UI for critical errors
    const fallbackElement = document.createElement('div');
    fallbackElement.innerHTML = `
      <div style="padding:20px;max-width:600px;margin:40px auto;border-radius:8px;background-color:#f8f9fa;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color:#e11d48;margin-bottom:10px;">Application Error</h2>
        <p style="margin-bottom:15px;">${error instanceof Error ? error.message : String(error)}</p>
        <p style="margin-bottom:15px;color:#666;font-size:14px;">Try one of these solutions:</p>
        <ul style="margin-bottom:15px;color:#666;font-size:14px;list-style:disc;padding-left:20px;">
          <li>Clear your browser cache completely</li>
          <li>Try a different browser</li>
          <li>Disable browser extensions</li>
        </ul>
        <div>
          <button onclick="window.location.reload()" style="background:#3b82f6;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;">
            Refresh Page
          </button>
          <button onclick="localStorage.clear();window.location.href='/'" style="background:#6b7280;color:white;border:none;padding:8px 16px;border-radius:4px;margin-left:8px;cursor:pointer;">
            Reset & Reload
          </button>
        </div>
      </div>
    `;
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = '';
      rootElement.appendChild(fallbackElement);
    } else {
      document.body.appendChild(fallbackElement);
    }
  }
};

// Add explicit handling for React-is dependency issues
const handleReactIsError = () => {
  window.addEventListener('error', (event) => {
    const errorMessage = event.message || '';
    const errorStack = event?.error?.stack || '';
    
    // Check for specific React-is errors
    if (
      errorMessage.includes('react-is') || 
      errorMessage.includes('forwardRef') ||
      errorStack.includes('vendor-ui')
    ) {
      console.error('React dependency error detected:', errorMessage);
      
      // Clear module cache if possible
      if (window.location.search.indexOf('reload=true') === -1) {
        console.log('Attempting automatic recovery...');
        
        // Clear cache and reload
        if ('caches' in window) {
          caches.keys().then((names) => {
            names.forEach(name => {
              caches.delete(name);
            });
          });
        }
        
        // Add marker to prevent infinite reload loops
        window.location.href = window.location.pathname + '?reload=true';
        return true;
      }
    }
    return false;
  }, true);
};

// Initialize error handler for React-is dependency issues
handleReactIsError();

// Call mount after a brief delay to ensure DOM is ready
setTimeout(() => {
  mountApp();
}, 50);

// Declare global namespace for React Router history
declare global {
  interface Window {
    __REACT_ROUTER_HISTORY__?: unknown;
    __CONSOLE_ERROR_COUNT__?: number;
  }
}
