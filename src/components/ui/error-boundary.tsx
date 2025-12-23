'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="flex flex-col items-center justify-center min-h-[400px] px-4"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangle
            className="w-16 h-16 text-[rgb(var(--accent-danger))] mb-4"
            aria-hidden="true"
          />
          <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))] mb-2">
            Something went wrong
          </h2>
          <p className="text-[rgb(var(--text-muted))] text-center max-w-md mb-6">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-6 p-4 bg-[rgb(var(--bg-secondary))] rounded-lg border border-[rgba(var(--border),var(--border-opacity))] max-w-2xl">
              <summary className="cursor-pointer text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Error details (development only)
              </summary>
              <pre className="text-xs text-[rgb(var(--text-muted))] overflow-auto">
                {this.state.error.toString()}
                {'\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()} variant="default">
              Reload Page
            </Button>
            <Button onClick={this.handleReset} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
