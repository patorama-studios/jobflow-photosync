
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
