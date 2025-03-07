
import { verifyCodeBeforeDeployment, VerificationResult } from './code-verification';

/**
 * Pre-commit check to verify code before allowing commits
 * Optimized for performance
 */
export async function runPreCommitCheck(filesToCheck: Record<string, string>): Promise<boolean> {
  console.log('Running pre-commit code verification...');
  
  try {
    // Wrap in a microtask to prevent blocking UI
    const verification: VerificationResult = await Promise.resolve().then(() => 
      verifyCodeBeforeDeployment(filesToCheck)
    );
    
    if (!verification.valid) {
      console.error('Code verification failed:');
      verification.issues.forEach(issue => {
        console.error(`File: ${issue.file}`);
        issue.issues.forEach(i => console.error(`- ${i.message}`));
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
 * Optimized to be non-blocking
 */
export function verifyCurrentApp(): Promise<{ valid: boolean; issues: string[] }> {
  return new Promise((resolve) => {
    console.log('Verifying current application...');
    const issues: string[] = [];
    
    // Use requestIdleCallback if available for non-blocking checks
    const runVerification = () => {
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
      
      // Monitor for React errors with a shorter timeout
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
      
      // Wait 1 second then finalize the check
      setTimeout(() => {
        console.error = originalConsoleError;
        
        if (reactErrorsDetected) {
          issues.push('React errors were detected during verification');
        }
        
        resolve({
          valid: issues.length === 0,
          issues
        });
      }, 1000);
    };
    
    // Use requestIdleCallback if available
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(runVerification);
    } else {
      // Fallback to setTimeout
      setTimeout(runVerification, 10);
    }
  });
}

/**
 * Install the global error monitoring system for enhanced debugging
 * Optimized for minimal performance impact
 */
export function installGlobalErrorMonitoring(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Initialize error count with lazy evaluation
  Object.defineProperty(window, '__CONSOLE_ERROR_COUNT__', {
    value: 0,
    writable: true,
    configurable: true
  });
  
  // Override console.error to count errors with minimal overhead
  const originalConsoleError = console.error;
  console.error = function(...args) {
    window.__CONSOLE_ERROR_COUNT__ = (window.__CONSOLE_ERROR_COUNT__ || 0) + 1;
    originalConsoleError.apply(console, args);
  };
  
  // Add a global error handler with passive mode
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    // Use setTimeout to avoid blocking the main thread
    setTimeout(() => {
      console.warn('[ErrorMonitor] Global error detected:', { message, source, lineno, colno });
    }, 0);
    
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
