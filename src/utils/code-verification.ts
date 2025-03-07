
export const getCodeSnippet = (code: string, line: number, context: number = 3): string => {
  if (!code) {
    return 'No code provided';
  }

  const lineNumber = line + 1;
  const startLine = Math.max(1, lineNumber - context);
  const endLine = lineNumber + context;
  
  // Split code by newlines
  const lines = code.split('\n');
  
  // Get the subset of lines
  const snippetLines = lines.slice(startLine - 1, endLine);
  
  // Join with line numbers
  let snippet = '';
  for (let i = 0; i < snippetLines.length; i++) {
    const currentLineNumber = startLine + i;
    const lineContent = snippetLines[i] || ''; // Use empty string if line is undefined
    const highlight = currentLineNumber === lineNumber ? '> ' : '  ';
    snippet += `${highlight}${currentLineNumber}: ${lineContent}\n`;
  }
  
  return snippet;
};

// Adding missing exports that are referenced in other files
export const verifyRouterNesting = () => {
  console.warn('verifyRouterNesting is a placeholder function');
  return true;
};

export const verifyProviderNesting = () => {
  console.warn('verifyProviderNesting is a placeholder function');
  return true;
};

export const verifyComponentUsage = () => {
  console.warn('verifyComponentUsage is a placeholder function');
  return true;
};

export const verifyCodeBeforeDeployment = () => {
  console.warn('verifyCodeBeforeDeployment is a placeholder function');
  return true;
};
