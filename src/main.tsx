
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

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

// Show initial loading state before app initialization
showInitialLoading();

// Mount app with improved reliability and recovery mechanisms
const mountApp = () => {
  try {
    console.log('Starting app mount...');
    
    // Get root element
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }
    
    // Create and mount root
    const root = createRoot(rootElement);
    
    // Mount the app with error boundaries
    root.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
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
        <button onclick="window.location.reload()" style="background:#3b82f6;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;">
          Refresh Page
        </button>
        <button onclick="localStorage.clear();window.location.href='/'" style="background:#6b7280;color:white;border:none;padding:8px 16px;border-radius:4px;margin-left:8px;cursor:pointer;">
          Reset & Reload
        </button>
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

// Call mount after a brief delay to ensure DOM is ready
// Reduced delay from 100ms to 50ms for faster startup
setTimeout(() => {
  mountApp();
}, 50);

// Optimize service worker registration
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Delay service worker registration to not block initial render
    // Using requestIdleCallback for better performance when available
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
      });
    } else {
      setTimeout(() => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
      }, 2000);
    }
  });
}

// Declare global namespace for React Router history
declare global {
  interface Window {
    __REACT_ROUTER_HISTORY__?: unknown;
    __CONSOLE_ERROR_COUNT__?: number;
  }
}
