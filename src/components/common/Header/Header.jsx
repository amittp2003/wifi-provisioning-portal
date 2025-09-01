import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import jioLogo from '../../../assets/jio-logo.png';
import styles from './Header.module.css';

const Header = ({ isAuthenticated }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const desktopMenuButtonRef = useRef(null);
  const isMobileView = useRef(false);

  // Check if we're in mobile view
  useEffect(() => {
    isMobileView.current = window.innerWidth <= 768;
    
    const handleResize = () => {
      isMobileView.current = window.innerWidth <= 768;
      // Close menu when resizing between mobile and desktop
      setIsMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
    // Restore scroll when menu closes
    document.body.style.overflow = '';
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if we're in mobile view
      const mobileView = isMobileView.current;
      
      if (mobileView) {
        // Close mobile menu
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
            mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target)) {
          setIsMenuOpen(false);
          // Restore scroll when mobile menu closes
          document.body.style.overflow = '';
        }
      } else {
        // Close desktop menu
        if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target) &&
            desktopMenuButtonRef.current && !desktopMenuButtonRef.current.contains(event.target)) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Close menu with Escape key
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        
        // Restore scroll and focus back to appropriate button
        document.body.style.overflow = '';
        
        // Focus back to the appropriate menu button
        const mobileView = isMobileView.current;
        if (mobileView && mobileMenuButtonRef.current) {
          mobileMenuButtonRef.current.focus();
        } else if (!mobileView && desktopMenuButtonRef.current) {
          desktopMenuButtonRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Manage scroll locking
  useEffect(() => {
    const mobileView = isMobileView.current;
    
    if (mobileView && isMenuOpen) {
      // Prevent scrolling when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scrolling when menu is closed or in desktop view
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Focus management
  useEffect(() => {
    if (!isMenuOpen) return;
    
    const mobileView = isMobileView.current;
    
    if (mobileView && mobileMenuRef.current) {
      // Focus first focusable element in mobile menu
      const firstFocusable = mobileMenuRef.current.querySelector('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        setTimeout(() => {
          firstFocusable.focus();
        }, 100); // Small delay to ensure DOM is updated
      }
    }
    // For desktop, focus is handled by the button's onClick
  }, [isMenuOpen]);

  // Trap focus in mobile menu
  useEffect(() => {
    const mobileView = isMobileView.current;
    
    if (!mobileView || !isMenuOpen || !mobileMenuRef.current) return;

    const focusableElements = mobileMenuRef.current.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const trapFocus = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    document.addEventListener('keydown', trapFocus);
    return () => {
      document.removeEventListener('keydown', trapFocus);
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={`${styles.headerContainer} ${isAuthenticated ? styles.authenticated : ''}`}>
        <div className={styles.leftSection}>
          <a href={isAuthenticated ? "/dashboard" : "/"} className={styles.brand}>
            <img src={jioLogo} alt="Jio Logo" className={styles.jioLogo} />
          </a>
        </div>
        
        <div className={styles.centerSection}>
          <span className={styles.title}>Provisioning Portal - Managed WiFi</span>
        </div>
        
        {/* Desktop menu */}
        {isAuthenticated && (
          <div className={styles.userSection} ref={desktopMenuRef}>
            <button
              ref={desktopMenuButtonRef}
              className={styles.userMenuButton}
              onClick={() => {
                // Close mobile menu if it's open (shouldn't happen, but just in case)
                if (isMobileView.current) {
                  document.body.style.overflow = '';
                }
                setIsMenuOpen(!isMenuOpen);
              }}
              aria-expanded={isMenuOpen && !isMobileView.current}
              aria-haspopup="true"
              aria-label={`User menu, ${isMenuOpen && !isMobileView.current ? 'expanded' : 'collapsed'}`}
            >
              <span className={styles.userName}>Logged in as {user?.email || 'user@company.com'}</span>
              <span className={styles.dropdownIcon}></span>
            </button>
            
            {!isMobileView.current && isMenuOpen && (
              <div className={styles.userMenu}>
                <button
                  onClick={handleLogout}
                  className={styles.menuItem}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Mobile menu button - always visible but disabled when not authenticated */}
        <button
          ref={mobileMenuButtonRef}
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen && isMobileView.current ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen && isMobileView.current}
          aria-controls="mobile-menu"
          disabled={!isAuthenticated}
        >
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>
        
        {/* Mobile menu */}
        {isAuthenticated && isMobileView.current && isMenuOpen && (
          <div
            id="mobile-menu"
            className={styles.mobileMenu}
            ref={mobileMenuRef}
            role="menu"
            aria-label="Mobile menu"
          >
            <div className={styles.mobileUserInfo}>
              <span className={styles.mobileUserName}>Logged in as</span>
              <span className={styles.mobileUserEmail}>{user?.email || 'user@company.com'}</span>
            </div>
            <button
              onClick={handleLogout}
              className={styles.mobileMenuItem}
              role="menuitem"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
