
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

// Show initial loading state
const showInitialLoading = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;
  
  // Only add if not already there
  if (!document.getElementById('initial-loading')) {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'initial-loading';
    loadingElement.style.display = 'flex';
    loadingElement.style.flexDirection = 'column';
    loadingElement.style.alignItems = 'center';
    loadingElement.style.justifyContent = 'center';
    loadingElement.style.height = '100vh';
    loadingElement.style.width = '100%';
    loadingElement.style.position = 'fixed';
    loadingElement.style.top = '0';
    loadingElement.style.left = '0';
    loadingElement.style.backgroundColor = 'white';
    
    // Add spinner
    loadingElement.innerHTML = `
      <div style="width: 40px; height: 40px; border: 3px solid #eee; border-top-color: #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
      <p style="font-family: system-ui, sans-serif; color: #555;">Loading application...</p>
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
    
    rootElement.appendChild(loadingElement);
  }
};

// Show initial loading state before app initialization
showInitialLoading();

// Mount app with safety mechanisms
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
    
    // Mount the app
    root.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Remove initial loading indicator after app mount
    const initialLoading = document.getElementById('initial-loading');
    if (initialLoading) {
      setTimeout(() => {
        initialLoading.style.opacity = '0';
        initialLoading.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          initialLoading.remove();
        }, 300);
      }, 500);
    }
    
    console.log('App render completed');
  } catch (error) {
    console.error("Error mounting app:", error);
    
    // Display fallback UI for critical errors
    const fallbackElement = document.createElement('div');
    fallbackElement.innerHTML = `
      <div style="padding: 20px; max-width: 600px; margin: 40px auto; border-radius: 8px; background-color: #f8f9fa; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #e11d48; margin-bottom: 10px;">Application Error</h2>
        <p style="margin-bottom: 15px;">${error instanceof Error ? error.message : String(error)}</p>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          Refresh Page
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
setTimeout(() => {
  mountApp();
}, 100);

// Don't register service worker until app is loaded
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Delay service worker registration to not block initial render
    setTimeout(() => {
      navigator.serviceWorker.register('/sw.js').catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
    }, 2000);
  });
}

// Declare global namespace for React Router history
declare global {
  interface Window {
    __REACT_ROUTER_HISTORY__?: unknown;
    __CONSOLE_ERROR_COUNT__?: number;
  }
}
