
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Apply theme and font immediately on script execution to prevent flash of wrong theme/style
const applyThemeAndFont = () => {
  // Theme application
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // System preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
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
};

// Execute theme and font application immediately
applyThemeAndFont();

// Function to mount the app with error handling
const mountApp = () => {
  try {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      const root = createRoot(rootElement);
      root.render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
    } else {
      console.error("Root element not found");
    }
  } catch (error) {
    console.error("Error mounting app:", error);
  }
};

// Optimized app mounting with fallback and error handling
if (typeof window.requestIdleCallback === 'function') {
  window.requestIdleCallback(mountApp, { timeout: 2000 }); // Add timeout to ensure it runs
} else {
  setTimeout(mountApp, 1);
}
