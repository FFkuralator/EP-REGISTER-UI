import React from 'react'
import styles from './Button.module.css'
import { Link } from 'react-router'

export default function Button({ children, href, onClick, variant }) {
  const variantClass = variant && styles[variant];
  const buttonClass = [styles.button, variantClass].filter(Boolean).join(' ');

  if (href) {
    return (
      <Link to={href} className={buttonClass}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={buttonClass}>
      {children}
    </button>
  )
}
