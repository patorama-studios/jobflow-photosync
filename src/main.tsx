
import { createRoot } from 'react-dom/client'
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

createRoot(document.getElementById("root")!).render(<App />);
