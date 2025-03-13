
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

// Display fallback UI for critical errors
function displayFallbackUI(message: string) {
  // Don't create multiple fallback UIs
  if (document.getElementById('fallback-ui')) {
    return;
  }
  
  const fallbackElement = document.createElement('div');
  fallbackElement.id = 'fallback-ui';
  fallbackElement.style.padding = '20px';
  fallbackElement.style.maxWidth = '600px';
  fallbackElement.style.margin = '40px auto';
  fallbackElement.style.borderRadius = '8px';
  fallbackElement.style.backgroundColor = '#f8f9fa';
  fallbackElement.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  fallbackElement.innerHTML = `
    <h2 style="color: #e11d48; margin-bottom: 10px;">Application Error</h2>
    <p style="margin-bottom: 15px;">${message}</p>
    <p style="margin-bottom: 15px;">Try navigating directly to a page:</p>
    <div>
      <button style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;" 
              onclick="window.location.href = '/dashboard'">
        Dashboard
      </button>
      <button style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;" 
              onclick="window.location.href = '/orders'">
        Orders
      </button>
      <button style="background: #6b7280; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;" 
              onclick="window.location.reload()">
        Refresh Page
      </button>
    </div>
  `;
  
  if (document.getElementById('root')) {
    const rootElement = document.getElementById('root');
    // Clear root element first
    if (rootElement) {
      rootElement.innerHTML = '';
      rootElement.appendChild(fallbackElement);
    }
  } else {
    document.body.appendChild(fallbackElement);
  }
}

// Improved mount function with safety timeouts
const mountApp = () => {
  let hasMounted = false;
  
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
    
    // Mount directly without waiting
    root.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    hasMounted = true;
    console.log('App render completed');
    
    // Show a simple initialization message in the console
    console.log('%c✨ App Initialized ✨', 'color: #3b82f6; font-weight: bold; font-size: 14px;');
  } catch (error) {
    console.error("Error mounting app:", error);
    
    // Display more visible error message
    if (!hasMounted) {
      displayFallbackUI(error instanceof Error ? error.message : String(error));
    }
  }
};

// Call mount immediately
console.log('Initializing application...');
mountApp();

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
