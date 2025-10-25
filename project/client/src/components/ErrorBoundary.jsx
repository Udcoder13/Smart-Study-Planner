import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // Also log to console for visibility
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-6 rounded shadow max-w-xl">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-4">The app encountered an unexpected error.</p>
            <details className="text-xs text-red-600 whitespace-pre-wrap">
              {String(this.state.error)}
              {this.state.info?.componentStack}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
