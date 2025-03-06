
/**
 * Code Verification Utility
 * 
 * This utility provides functions to verify code structure and prevent common errors
 * like missing providers, incorrect nesting, and router-related issues.
 */

/**
 * Verifies that React Router components are properly nested
 * 
 * Common errors:
 * - Using hooks like useNavigate, useParams outside Router context
 * - Using Routes outside Router context
 * - Using Navigate outside Router context
 */
export function verifyRouterNesting(code: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check for common router hook usage outside Router context
  const routerHooks = ['useNavigate', 'useParams', 'useLocation', 'useRouteMatch', 'useHistory'];
  
  routerHooks.forEach(hook => {
    // Simple regex to detect if hooks are used but <Router> isn't present or is incorrectly positioned
    if (code.includes(hook) && !code.includes('<Router') && !code.includes('RouterProvider')) {
      issues.push(`${hook} detected but no Router component found`);
    }
    
    // Check for potential incorrect nesting (very basic check)
    if (code.includes(hook) && 
        code.includes('<Router') && 
        code.indexOf(hook) < code.indexOf('<Router')) {
      issues.push(`${hook} might be used before Router is initialized`);
    }
  });

  // Check for Route components outside Router
  if ((code.includes('<Route') || code.includes('<Routes')) && !code.includes('<Router')) {
    issues.push('Route or Routes components detected but no Router component found');
  }

  // Check for Router components used inside a provider that should be inside Router
  if (code.includes('<HeaderSettingsProvider>') && 
      code.includes('<Router') && 
      code.indexOf('<HeaderSettingsProvider>') < code.indexOf('<Router')) {
    issues.push('HeaderSettingsProvider should be inside Router if it uses router hooks');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Verifies that context providers are properly nested
 * 
 * Common errors:
 * - Using hooks outside their providers
 * - Incorrect provider nesting order
 */
export function verifyProviderNesting(code: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Common provider-hook pairs to check
  const providerHookPairs = [
    { provider: 'HeaderSettingsProvider', hook: 'useHeaderSettings' },
    { provider: 'ThemeProvider', hook: 'useTheme' },
    { provider: 'QueryClientProvider', hook: 'useQuery' },
    { provider: 'AuthProvider', hook: 'useAuth' },
  ];

  providerHookPairs.forEach(({ provider, hook }) => {
    if (code.includes(hook) && !code.includes(provider)) {
      issues.push(`${hook} detected but no ${provider} found`);
    }
  });

  // Check for potential recursive provider issues
  providerHookPairs.forEach(({ provider, hook }) => {
    if (code.includes(provider) && code.includes(hook)) {
      const providerStart = code.indexOf(provider);
      const hookUse = code.indexOf(hook);
      
      if (hookUse < providerStart) {
        issues.push(`${hook} is used before ${provider} is initialized`);
      }
    }
  });

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Verifies component import and usage issues
 */
export function verifyComponentUsage(code: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check for potential missing imports
  const componentUsageRegex = /<([A-Z][a-zA-Z0-9]*)/g;
  const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+[^;]*|[^;{]*)\s+from\s+['"][^'"]*['"]/g;
  
  let match;
  const usedComponents = new Set<string>();
  
  while ((match = componentUsageRegex.exec(code)) !== null) {
    usedComponents.add(match[1]);
  }

  const importStatements = code.match(importRegex) || [];
  const importedComponents = new Set<string>();
  
  importStatements.forEach(statement => {
    // Very simple extraction, would need more robust parsing for real usage
    const components = statement.replace(/import\s+/, '').replace(/\s+from.*/, '');
    
    if (components.includes('{')) {
      const matches = components.match(/{([^}]*)}/);
      if (matches && matches[1]) {
        matches[1].split(',').forEach(comp => {
          const trimmed = comp.trim().split(' as ')[0];
          if (trimmed) importedComponents.add(trimmed);
        });
      }
    } else {
      const defaultImport = components.trim();
      if (defaultImport) importedComponents.add(defaultImport);
    }
  });

  usedComponents.forEach(component => {
    if (!importedComponents.has(component) && !['React', 'Fragment'].includes(component)) {
      issues.push(`Component <${component}> is used but not imported`);
    }
  });

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Performs a pre-deployment verification to catch common issues
 */
export function verifyCodeBeforeDeployment(files: Record<string, string>): { 
  valid: boolean; 
  issues: { file: string; issues: string[] }[] 
} {
  const allIssues: { file: string; issues: string[] }[] = [];
  
  // Check each file for potential issues
  Object.entries(files).forEach(([filename, content]) => {
    const fileIssues: string[] = [];
    
    // Router nesting checks
    if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) {
      const routerCheck = verifyRouterNesting(content);
      if (!routerCheck.valid) {
        fileIssues.push(...routerCheck.issues);
      }
      
      // Provider nesting checks
      const providerCheck = verifyProviderNesting(content);
      if (!providerCheck.valid) {
        fileIssues.push(...providerCheck.issues);
      }
      
      // Component import checks
      const componentCheck = verifyComponentUsage(content);
      if (!componentCheck.valid) {
        fileIssues.push(...componentCheck.issues);
      }
    }
    
    if (fileIssues.length > 0) {
      allIssues.push({ file: filename, issues: fileIssues });
    }
  });
  
  return {
    valid: allIssues.length === 0,
    issues: allIssues
  };
}

// Runtime verification functions
/**
 * Check if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Performs a runtime verification to ensure all contexts are properly provided
 */
export function verifyRuntimeContexts(): { valid: boolean; issues: string[] } {
  if (!isBrowser()) {
    return { valid: true, issues: [] };
  }
  
  const issues: string[] = [];
  
  // Check if we're inside a Router context
  if (typeof window.history.pushState === 'function' && !window.__REACT_ROUTER_HISTORY__) {
    issues.push('Application might be missing Router context');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Declare global namespace for React Router history
 */
declare global {
  interface Window {
    __REACT_ROUTER_HISTORY__?: unknown;
  }
}
