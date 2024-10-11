import React, { ReactNode, ErrorInfo } from 'react';
import styles from './ErrorBoundary.module.scss';
import { useNavigate } from 'react-router-dom';

interface ErrorBoundaryProps {
  children?: ReactNode;
  navigate?: (path: string) => void; // 선택적 prop으로 수정
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
    if (this.props.navigate) {
      this.props.navigate('/'); // navigate가 존재할 경우에만 실행
    }
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
            메인 페이지로 돌아가기
          </button>
        </div>
      );
    }

    return this.props.children ?? null;
  }
}

const ErrorBoundaryWithNavigate = (props: ErrorBoundaryProps) => {
  const navigate = useNavigate();
  return (
    <ErrorBoundary
      {...props}
      navigate={navigate} // navigate prop 자동 전달
    />
  );
};

export default ErrorBoundaryWithNavigate;
