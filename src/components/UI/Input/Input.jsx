import React from 'react';
import styles from './Input.module.css';

export default function Input({ value, onChange, placeholder, disabled = false, variant = 'default' }) {
  return (
    <input
      className={`${styles.input} ${styles[variant]}`}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
