import React, { ReactNode, ErrorInfo } from 'react';
import styles from './ErrorBoundary.module.scss';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary에서 잡은 에러:', error, errorInfo);
  }

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Error</h2>
          <button
            className={styles.backButton}
            onClick={this.handleGoBack}
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      );
    }

    return this.props.children ?? null;
  }
}

export default ErrorBoundary;
