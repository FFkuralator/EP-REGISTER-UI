import React from 'react'
import { Link } from 'react-router'
import styles from './DetailHeader.module.css'

export default function DetailHeader({ data, links }) {
  return (
    <div>
      <div>
        <div className={styles.sources}>
          <a href="#">{data.school_title}</a>/<a href="#">{data.degree_title}</a>/<a href="#">{data.field_of_study_title}</a>
        </div>
        <h1>{data.title}</h1>
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className={styles.link}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
