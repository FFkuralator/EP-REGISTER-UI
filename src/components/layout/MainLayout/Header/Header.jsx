import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();

    const user = {
        name: 'Вася',
        avatar: 'В'
    };

    const navItems = [
        { path: '/', label: 'Главная' },
        { path: '/programs', label: 'Программы' },
        { path: '/register', label: 'Регистрация' },
        { path: '/about', label: 'О нас' }
    ];

    const dropdownItems = [
        { label: 'Мой профиль', action: () => console.log('Переход в профиль') },
        { label: 'Настройки', action: () => console.log('Переход в настройки') },
        { label: 'Выйти', action: () => console.log('Выход из системы') }
    ];

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>
                <img
                    src="/vite.svg"
                    alt="EduProg Logo"
                    className={styles.logoImage}
                />
                <span>Triceratops</span>
            </Link>

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

            <div className={styles.profile}>
                <div className={styles.dropdown}>
                    <div
                        className={styles.profileInfo}
                        onClick={toggleDropdown}
                    >
                        <div className={styles.avatar}>
                            {user.avatar}
                        </div>
                        <span className={styles.userName}>
                            {user.name}
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
        </header>
    );
}