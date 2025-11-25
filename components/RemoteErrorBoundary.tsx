'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

/**
 * RemoteErrorBoundary
 *
 * Error boundary specifically for Module Federation remote components
 * Catches errors during remote loading and provides graceful fallback
 */
export class RemoteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error details
    console.error('[RemoteErrorBoundary] ❌ Caught error:', {
      module: this.props.moduleName,
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
    });

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Optional: Send to error tracking service
    // Example: Sentry, LogRocket, etc.
    // if (typeof window !== 'undefined') {
    //   // Sentry.captureException(error, {
    //   //   contexts: { errorInfo },
    //   //   tags: { module: this.props.moduleName },
    //   // });
    // }
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="max-w-lg w-full mx-4">
            <div className="text-center p-8 bg-gray-800 rounded-lg border border-red-700">
              {/* Error Icon */}
              <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              {/* Error Title */}
              <h2 className="text-2xl font-bold text-white mb-2">
                Service Temporarily Unavailable
              </h2>

              {/* Module Name */}
              {this.props.moduleName && (
                <p className="text-gray-400 text-sm mb-4">
                  Module: <code className="bg-gray-700 px-2 py-1 rounded">{this.props.moduleName}</code>
                </p>
              )}

              {/* Error Message */}
              {this.state.error && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded text-left">
                  <p className="text-red-300 text-sm font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>

                <button
                  onClick={() => window.history.back()}
                  className="w-full px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Go Back
                </button>
              </div>

              {/* Debug Info (development only) */}
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-gray-400 text-sm hover:text-gray-300">
                    Show Error Details (Dev Only)
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-900 border border-gray-700 rounded text-xs text-gray-300 overflow-auto max-h-48">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
