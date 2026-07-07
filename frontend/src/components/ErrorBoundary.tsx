import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

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
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
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
        <div className="error-page">
          <AlertCircle size={64} className="error-icon" />
          <h1>Something went wrong</h1>
          <p>We're sorry, but an unexpected error occurred.</p>
          <button className="primary-action" onClick={this.handleReset}>
            <RefreshCw size={18} />
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const NotFoundPage: React.FC = () => {
  return (
    <div className="error-page">
      <AlertCircle size={64} className="error-icon" />
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <button className="primary-action" onClick={() => window.location.href = '/'}>
        Go back home
      </button>
    </div>
  );
};

export const ServerErrorPage: React.FC = () => {
  return (
    <div className="error-page">
      <AlertCircle size={64} className="error-icon" />
      <h1>500 - Server Error</h1>
      <p>We're experiencing some technical difficulties. Please try again later.</p>
      <div className="error-troubleshoot">
        <h3>Troubleshooting steps:</h3>
        <ul>
          <li>Check your internet connection</li>
          <li>Clear your browser cache and cookies</li>
          <li>Try again in a few minutes</li>
        </ul>
      </div>
    </div>
  );
};
