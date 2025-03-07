
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { installGlobalErrorMonitoring } from './utils/pre-commit-check.ts'

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

// Set up a global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Increment error count for monitoring
  window.__CONSOLE_ERROR_COUNT__ = (window.__CONSOLE_ERROR_COUNT__ || 0) + 1;
});

// Install global error monitoring in non-blocking way
setTimeout(() => {
  try {
    installGlobalErrorMonitoring();
    console.log('Error monitoring initialized');
  } catch (err) {
    console.error('Failed to initialize error monitoring:', err);
  }
}, 0);

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
    // Render App - Don't wrap with BrowserRouter since it's already in AppProviders
    root.render(<App />);
    
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
    const errorElement = document.createElement('div');
    errorElement.className = 'error-container';
    errorElement.innerHTML = `
      <h2 style="color: #e11d48; font-size: 24px;">Application Error</h2>
      <p style="font-size: 16px;">Sorry, there was a problem loading the application. Please try refreshing the page.</p>
      <p style="font-size: 14px; color: #666;">Technical details: ${error instanceof Error ? error.message : String(error)}</p>
      <button style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; margin-top: 16px; cursor: pointer;" onclick="window.location.reload()">Refresh Page</button>
    `;
    document.body.appendChild(errorElement);
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
  }
}
