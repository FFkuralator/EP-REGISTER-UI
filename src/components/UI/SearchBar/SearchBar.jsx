import React from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange, placeholder, disabled = false }) {
  return (
    <input
      className={styles.searchBar}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
