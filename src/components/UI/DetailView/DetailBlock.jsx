import React from 'react'
import styles from './DetailBlock.module.css'

export default function DetailBlock({ title, children }) {
  return (
    <section className={styles.detailWrapper} >
      <h2 className={styles.detailHeading}>{ title }</h2>
      { children }
    </section>
  )
}
