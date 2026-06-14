import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/home';
  };

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-neutral-light text-neutral-dark font-sans text-center">
          <div className="max-w-md p-8 bg-white rounded-3xl shadow-xl border border-neutral-border flex flex-col items-center gap-6 animate-float">
            <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center text-4xl text-primary animate-pulse">
              ⚠️
            </div>
            
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-neutral-dark leading-tight">
                Something Went Wrong
              </h1>
              <p className="text-sm text-neutral-dark/60">
                We encountered an unexpected crash. Don't worry, your cart and order statuses are safe in the cloud.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="w-full text-left bg-neutral-light p-4 rounded-xl border border-neutral-border overflow-x-auto max-h-40 text-xs font-mono text-primary-dark">
                {this.state.error.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
              </div>
            )}

            <div className="flex gap-4 w-full">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-semibold shadow-md shadow-primary/20 hover:bg-primary-dark transition-all duration-200"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-xl border border-neutral-border bg-white text-neutral-dark font-semibold hover:bg-neutral-light transition-all duration-200"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
