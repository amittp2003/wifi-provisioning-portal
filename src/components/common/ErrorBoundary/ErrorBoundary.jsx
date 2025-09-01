import React from 'react';
import { Alert, Button, Container } from 'react-bootstrap';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className={styles.container}>
          <div className={styles.content}>
            <Alert variant="danger" className={styles.alert}>
              <Alert.Heading>Something went wrong</Alert.Heading>
              <p>
                The application encountered an unexpected error. Please try refreshing the page.
                If the problem persists, contact support.
              </p>
              <hr />
              <div className={styles.details}>
                <details>
                  <summary>Error Details</summary>
                  <pre className={styles.errorPre}>
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
              <div className={styles.buttons}>
                <Button variant="outline-danger" onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button variant="danger" onClick={this.handleReload}>
                  Reload Page
                </Button>
              </div>
            </Alert>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;