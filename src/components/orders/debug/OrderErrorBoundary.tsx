
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class OrderErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Order component error:", error);
    console.error("Component stack:", errorInfo.componentStack);
    
    // Log specific details for react-is errors
    if (error.message.includes('react-is') || error.message.includes('isFragment')) {
      console.error("React-is dependency error detected. This usually indicates a version mismatch.");
      
      // Attempt to check if react-is is available
      import('react-is').then(reactIs => {
        console.log("Successful import of react-is. Available exports:", Object.keys(reactIs));
      }).catch(err => {
        console.error("Failed to import react-is:", err);
      });
    }
  }

  private resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="container py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-red-800 mb-2">Order Display Error</h2>
            <p className="text-sm text-red-700 mb-4">
              We encountered an error while trying to display this order.
            </p>
            
            {this.state.error && this.state.error.message.includes('react-is') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <p className="text-sm font-medium text-yellow-800">React Library Error</p>
                <p className="text-xs text-yellow-700">
                  This appears to be an issue with React dependencies. The application needs to reload to fix this issue.
                </p>
              </div>
            )}
            
            <div className="mb-4 flex space-x-2">
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
              <Link to="/orders">
                <Button variant="outline">
                  Return to Orders
                </Button>
              </Link>
            </div>
            
            <details className="text-sm text-red-700 bg-white p-2 rounded border border-red-100">
              <summary>Error details</summary>
              <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-48 text-xs">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
