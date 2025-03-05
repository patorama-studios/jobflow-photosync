
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Apply theme immediately to prevent flash of wrong theme
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

// Use requestIdleCallback to defer non-critical initialization
const mountApp = () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  }
};

// Use requestIdleCallback if available, otherwise use setTimeout
if (typeof window.requestIdleCallback === 'function') {
  window.requestIdleCallback(mountApp);
} else {
  setTimeout(mountApp, 1);
}
