import React from 'react';
import styles from './Input.module.css';

export default function Input({ value, onChange, placeholder, disabled = false }) {
  return (
    <input
      className={styles.input}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
