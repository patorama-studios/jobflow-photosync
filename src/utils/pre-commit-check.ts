
import { verifyCodeBeforeDeployment } from './code-verification';

/**
 * Pre-commit check to verify code before allowing commits
 * 
 * This can be integrated with Git hooks or CI/CD pipelines
 */
export async function runPreCommitCheck(filesToCheck: Record<string, string>): Promise<boolean> {
  console.log('Running pre-commit code verification...');
  
  try {
    const verification = verifyCodeBeforeDeployment(filesToCheck);
    
    if (!verification.valid) {
      console.error('Code verification failed:');
      verification.issues.forEach(issue => {
        console.error(`File: ${issue.file}`);
        issue.issues.forEach(i => console.error(`- ${i}`));
      });
      return false;
    }
    
    console.log('Code verification passed!');
    return true;
  } catch (error) {
    console.error('Error during code verification:', error);
    return false;
  }
}

/**
 * Function to verify the current application bundle
 * Can be called during development to check for issues
 */
export function verifyCurrentApp(): Promise<{ valid: boolean; issues: string[] }> {
  return new Promise((resolve) => {
    console.log('Verifying current application...');
    const issues: string[] = [];
    
    // Check for React Router context
    if (typeof window !== 'undefined') {
      if (!window.__REACT_ROUTER_HISTORY__) {
        issues.push('React Router context not found');
      }
      
      // Check if any console errors have occurred since page load
      const consoleErrorCount = (window as any).__CONSOLE_ERROR_COUNT__ || 0;
      if (consoleErrorCount > 0) {
        issues.push(`${consoleErrorCount} console errors detected`);
      }
    }
    
    // Monitor for React errors during the next 2 seconds
    const originalConsoleError = console.error;
    let reactErrorsDetected = false;
    
    console.error = function(...args) {
      if (args[0] && typeof args[0] === 'string') {
        if (args[0].includes('Invalid hook call') || 
            args[0].includes('Context.Provider') ||
            args[0].includes('useNavigate()') ||
            args[0].includes('useLocation()')) {
          reactErrorsDetected = true;
          issues.push(`React error detected: ${args[0].substring(0, 100)}...`);
        }
      }
      originalConsoleError.apply(console, args);
    };
    
    // Wait 2 seconds then finalize the check
    setTimeout(() => {
      console.error = originalConsoleError;
      
      if (reactErrorsDetected) {
        issues.push('React errors were detected during verification');
      }
      
      resolve({
        valid: issues.length === 0,
        issues
      });
    }, 2000);
  });
}

/**
 * Install the global error monitoring system for enhanced debugging
 * Call this early in your application to catch issues
 */
export function installGlobalErrorMonitoring(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Initialize error count
  (window as any).__CONSOLE_ERROR_COUNT__ = 0;
  
  // Override console.error to count errors
  const originalConsoleError = console.error;
  console.error = function(...args) {
    (window as any).__CONSOLE_ERROR_COUNT__ = ((window as any).__CONSOLE_ERROR_COUNT__ || 0) + 1;
    originalConsoleError.apply(console, args);
  };
  
  // Add a global error handler
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    console.warn('[ErrorMonitor] Global error detected:', { message, source, lineno, colno });
    if (typeof originalOnError === 'function') {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };
  
  console.log('[ErrorMonitor] Global error monitoring installed');
}

/**
 * Declare global namespace for React Router history and console error count
 */
declare global {
  interface Window {
    __REACT_ROUTER_HISTORY__?: unknown;
    __CONSOLE_ERROR_COUNT__?: number;
  }
}
