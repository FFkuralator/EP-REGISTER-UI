import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../../../../hooks/useAuth';
import LoginModal from '../../../UI/LoginModal/LoginModal';
import styles from './Header.module.css';

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();

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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
    };

    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    return (
        <header className={styles.header}>
          <div className={styles.left}>
            <Link to="/" className={styles.logo}>
                <img
                    src="/vite.svg"
                    alt="EduProg Logo"
                    className={styles.logoImage}
                />
                <span>Портфель ОП</span>
            </Link>
          </div>
                    
                    
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

          <LoginModal 
            isOpen={isLoginModalOpen}
            onClose={handleCloseLoginModal}
          />
        </header>
    );
}