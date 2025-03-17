
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import React from 'react'

// Immediately apply theme to prevent flash
const applyTheme = () => {
  try {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (savedTheme === 'system' && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (error) {
    console.error('Failed to apply theme:', error);
  }
};

applyTheme();

// Show initial loading state
const showInitialLoading = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;
  
  if (!document.getElementById('initial-loading')) {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'initial-loading';
    loadingElement.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;width:100%;position:fixed;top:0;left:0;background-color:white;z-index:9999;';
    
    loadingElement.innerHTML = `
      <div style="width:40px;height:40px;border:3px solid #eee;border-top-color:#3498db;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px;"></div>
      <p style="font-family:system-ui,sans-serif;color:#555;">Loading application...</p>
      <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.dark #initial-loading{background-color:#1a1a1a}.dark #initial-loading p{color:#ccc}</style>
    `;
    
    rootElement.appendChild(loadingElement);
  }
};

showInitialLoading();

// Mount app with improved error handling
const mountApp = () => {
  try {
    console.log('Starting app mount...');
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      throw new Error('Root element not found');
    }
    
    // Create root
    const root = createRoot(rootElement);
    
    // Mount the app with error boundaries
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    
    // Remove initial loading indicator after app mount
    const initialLoading = document.getElementById('initial-loading');
    if (initialLoading) {
      // Delay removal slightly to ensure app is ready
      setTimeout(() => {
        initialLoading.style.opacity = '0';
        initialLoading.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          initialLoading.remove();
        }, 300);
      }, 300);
    }
    
    console.log('App render completed');
  } catch (error) {
    console.error("Error mounting app:", error);
    
    // Display fallback UI for critical errors
    const fallbackElement = document.createElement('div');
    fallbackElement.innerHTML = `
      <div style="padding:20px;max-width:600px;margin:40px auto;border-radius:8px;background-color:#f8f9fa;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color:#e11d48;margin-bottom:10px;">Application Error</h2>
        <p style="margin-bottom:15px;">${error instanceof Error ? error.message : String(error)}</p>
        <p style="margin-bottom:15px;color:#666;font-size:14px;">Try one of these solutions:</p>
        <ul style="margin-bottom:15px;color:#666;font-size:14px;list-style:disc;padding-left:20px;">
          <li>Clear your browser cache</li>
          <li>Try a different browser</li>
          <li>Disable browser extensions</li>
        </ul>
        <button onclick="window.location.reload()" style="background:#3b82f6;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;">
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

// Call mount with a small delay to ensure DOM is ready
setTimeout(() => {
  mountApp();
}, 50);
