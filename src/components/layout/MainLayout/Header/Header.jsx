import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import LoginModal from '../../../UI/LoginModal/LoginModal';
import styles from './Header.module.css';

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { user, isAuthenticated, logout } = {user: null, isAuthenticated: false, logout: () => {}}; // Replace with actual context or props

    const navItems = [
        { path: '/', label: 'Главная' },
        { path: '/register', label: 'Программы' },
        { path: '/about', label: 'О нас' }
    ];

    const dropdownItems = [
        { label: 'Мой профиль', action: () => console.log('Переход в профиль') },
        { label: 'Настройки', action: () => console.log('Переход в настройки') },
        { label: 'Выйти', action: () => {
            logout();
            setIsDropdownOpen(false);
        } }
    ];

    // Закрываем мобильное меню при смене роута
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Блокируем скролл когда мобильное меню открыто
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
        setIsMobileMenuOpen(false);
    };

    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    return (
        <header className={styles.header}>
          <div className={styles.left}>
            <Link to="/" className={styles.logo}>
                <img
                    src="/logo.svg"
                    alt="ep register logo"
                    className={styles.logoImage}
                />
                <span>Портфель ОП</span>
            </Link>
          </div>
                    
          {/* Desktop Navigation */}
          <div className={styles.center}>
            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`${styles.navLink} ${
                            location.pathname === item.path ? styles.active : ''
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
          </div>          
          
          <div className={styles.right}>
            {isAuthenticated ? (
              <div className={styles.profile}>
                <div className={styles.dropdown}>
                    <div
                        className={styles.profileInfo}
                        onClick={toggleDropdown}
                    >
                        <div className={styles.avatar}>
                            {user.email ? user.email[0].toUpperCase() : 'U'}
                        </div>
                        <span className={styles.userName}>
                            {user.email || 'Пользователь'}
                        </span>
                    </div>

                    <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.show : ''}`}>
                        {dropdownItems.map((item, index) => (
                            <button
                                key={index}
                                className={styles.dropdownItem}
                                onClick={() => {
                                    item.action();
                                    closeDropdown();
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
              </div>
            ) : (
              <button 
                className={styles.loginButton}
                onClick={handleLoginClick}
              >
                Вход
              </button>
            )}

            {isDropdownOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: -1
                    }}
                    onClick={closeDropdown}
                />
            )}
          </div>

          {/* Burger Button */}
          <button 
            className={`${styles.burgerButton} ${isMobileMenuOpen ? styles.active : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Открыть меню"
          >
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
          </button>

          {/* Mobile Menu Overlay */}
          <div 
            className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.open : ''}`}
            onClick={closeMobileMenu}
          />

          {/* Mobile Menu */}
          <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
            <nav className={styles.mobileNav}>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`${styles.mobileNavLink} ${
                            location.pathname === item.path ? styles.active : ''
                        }`}
                        onClick={closeMobileMenu}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className={styles.mobileActions}>
                {isAuthenticated ? (
                    <>
                        <div className={styles.mobileUserInfo}>
                            <div className={styles.avatar}>
                                {user.email ? user.email[0].toUpperCase() : 'U'}
                            </div>
                            <span className={styles.mobileUserName}>
                                {user.email || 'Пользователь'}
                            </span>
                        </div>
                        <div className={styles.mobileDropdownItems}>
                            {dropdownItems.map((item, index) => (
                                <button
                                    key={index}
                                    className={styles.mobileDropdownItem}
                                    onClick={() => {
                                        item.action();
                                        closeMobileMenu();
                                    }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <button 
                        className={styles.mobileLoginButton}
                        onClick={handleLoginClick}
                    >
                        Вход
                    </button>
                )}
            </div>
          </div>

          <LoginModal 
            isOpen={isLoginModalOpen}
            onClose={handleCloseLoginModal}
          />
        </header>
    );
}