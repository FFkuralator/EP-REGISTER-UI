import React from 'react'
import Button from '../Button/Button'
import styles from './DetailHeader.module.css'

export default function DetailHeader({ data, links }) {
  return (
    <div className={styles.headerWrapper}>
      <h1 className={styles.title}>{data.title}</h1>
      <div className={styles.buttons}>
        {links.map((link) => (
          <Button
            key={link.label}
            href={link.href}
          >
            {link.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
