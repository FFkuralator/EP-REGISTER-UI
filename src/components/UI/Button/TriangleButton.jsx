import React from 'react';
import styles from './TriangleButton.module.css';

export default function TriangleButton({ open = false, onOpen }) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onOpen}
    >
      <svg
        viewBox="0 0 16 16"
        width="16"
        height="16"
        className={`${styles.icon} ${open ? styles.iconOpen : ''}`}
        aria-hidden="true"
      >
        <path
          d="M3 5 L8 10 L13 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
