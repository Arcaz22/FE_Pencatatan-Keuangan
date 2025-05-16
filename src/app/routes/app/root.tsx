import { Outlet } from 'react-router-dom';
import { MainErrorFallback } from '@/components/errors/main';
import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <MainErrorFallback />;
    }

    return this.props.children;
  }
}

const AppRoot = () => {
  return (
    <ErrorBoundary>
      <main>
        <Outlet />
      </main>
    </ErrorBoundary>
  );
};

export default AppRoot;
