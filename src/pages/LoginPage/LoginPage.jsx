import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  return (
    <div className={`${styles.loginPage} diagonal-dot-pattern`}>
      <main className={styles.mainContent}>
        <Container fluid className="h-100">
          <Row className="h-100 align-items-center justify-content-center">
            <Col lg={5} className={`${styles.welcomeSection}`}>
              <h1 className="display-4 fw-bold">Welcome</h1>
              <p className="lead">Sign in to upload CSVs and run provisioning jobs for Managed WiFi. You can use these login or your organization's Active Directory.</p>
            </Col>
            
            <Col lg={5} className="d-flex justify-content-center">
              <div className={`card shadow rounded-3 ${styles.loginCard}`}>
                <div className="card-body">
                  <LoginForm />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
      
      {/* Footer */}
      <footer className={`fixed-bottom ${styles.pageFooter}`}>
        <p className="text-center text-white mb-0">© 2025 Managed WiFi</p>
      </footer>
    </div>
  );
};

export default LoginPage;