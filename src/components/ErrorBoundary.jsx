import React from "react";
import Icon from "./AppIcon";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    error.__ErrorBoundary = true;
    this.setState({ error, errorInfo });
    window.__COMPONENT_ERROR__?.(error, errorInfo);
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state?.hasError) {
      const isDev = import.meta.env.DEV;
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8 max-w-2xl">
            <div className="flex justify-center items-center mb-4">
              <Icon name="AlertTriangle" size={48} className="text-red-600" />
            </div>
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-3xl font-bold text-red-900">Something went wrong</h1>
              <p className="text-red-700">We encountered an unexpected error while processing your request.</p>
              
              {isDev && this.state?.error && (
                <div className="mt-6 bg-red-100 border border-red-400 rounded p-4 text-left">
                  <p className="font-mono text-sm text-red-900 break-words">
                    <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}
                  </p>
                  {this.state?.errorInfo?.componentStack && (
                    <details className="mt-3">
                      <summary className="cursor-pointer font-semibold text-red-800">Component Stack</summary>
                      <pre className="font-mono text-xs text-red-700 mt-2 overflow-auto max-h-48">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-center items-center mt-6 gap-3">
              <button
                onClick={() => window.location.href = "/"}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded flex items-center gap-2 transition-colors duration-200"
              >
                <Icon name="Home" size={18} />
                Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center gap-2 transition-colors duration-200"
              >
                <Icon name="RefreshCw" size={18} />
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props?.children;
  }
}

export default ErrorBoundary;