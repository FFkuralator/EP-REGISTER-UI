import React from 'react';
import styles from './Input.module.css';

export default function Input({
  value,
  onChange,
  placeholder,
  disabled = false,
  variant = 'default',
  icon
}) {
  return (
    <div className={styles.inputWrapper}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <input
        className={`${styles.input} ${styles[variant]} ${icon ? styles.withIcon : ''}`}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
