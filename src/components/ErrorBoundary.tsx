
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode | (({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => ReactNode);
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error);
    console.error("Error info:", errorInfo);
    this.setState({ errorInfo });
    
    // Report error to console with component stack
    if (errorInfo.componentStack) {
      console.error("Component stack:", errorInfo.componentStack);
    }
  }
  
  public resetErrorBoundary = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        // If fallback is a function, call it with error and reset function
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback({ 
            error: this.state.error as Error, 
            resetErrorBoundary: this.resetErrorBoundary 
          });
        }
        // Otherwise, just render the fallback
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="p-6 bg-red-50 rounded-lg border border-red-200 shadow-sm">
          <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-sm text-red-700 mb-4">
            An error occurred while rendering this component.
          </p>
          <div className="mb-4 flex gap-2">
            <Button
              onClick={this.resetErrorBoundary}
              variant="destructive"
              size="sm"
            >
              Try again
            </Button>
            <Button
              onClick={() => window.location.href = "/dashboard"}
              variant="outline"
              size="sm"
            >
              Go to Dashboard
            </Button>
          </div>
          <details className="text-sm text-red-700 bg-white p-2 rounded border border-red-100">
            <summary className="cursor-pointer">Error details</summary>
            <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-48 text-xs">
              {this.state.error?.toString()}
            </pre>
            {this.state.errorInfo?.componentStack && (
              <>
                <p className="mt-2 font-semibold">Component Stack:</p>
                <pre className="mt-1 whitespace-pre-wrap overflow-auto max-h-48 text-xs">
                  {this.state.errorInfo.componentStack}
                </pre>
              </>
            )}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
