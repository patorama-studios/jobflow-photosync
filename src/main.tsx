
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

// Install global error monitoring early but with improved performance
installGlobalErrorMonitoring();

// Optimize mounting process
const mountApp = async () => {
  try {
    // Get root element
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }
    
    // Create and mount root
    const root = createRoot(rootElement);
    
    // Small optimization to ensure smooth rendering
    await Promise.resolve();
    
    root.render(
      <App />
    );
    
    // Defer non-critical verification to avoid blocking main thread
    setTimeout(() => {
      if ((window as any).__CONSOLE_ERROR_COUNT__ > 0) {
        console.warn(`[App] ${(window as any).__CONSOLE_ERROR_COUNT__} errors were detected during startup`);
      }
      
      // Check for missing Router context
      if (typeof window !== 'undefined' && !window.__REACT_ROUTER_HISTORY__) {
        console.warn('[App] React Router context not found after mount');
      }
    }, 2000);
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

// Use requestIdleCallback for non-critical mounting if available
if ('requestIdleCallback' in window) {
  (window as any).requestIdleCallback(() => mountApp());
} else {
  // Fallback to setTimeout with a small delay for older browsers
  setTimeout(mountApp, 10);
}

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
