
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Apply theme immediately on script execution to prevent flash of wrong theme
const applyTheme = () => {
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
};

// Execute theme application immediately
applyTheme();

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
