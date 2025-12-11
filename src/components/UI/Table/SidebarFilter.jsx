import React from 'react'
import styles from './SidebarFilter.module.css'

export default function SidebarFilter({ onFilter, filterState, columns }) {
  return (
    <div className={styles.sidebarFilter}>
      <h2>Фильтры</h2>
      {columns.map((column) => {
        if ((column.filterOptions || []).length === 0) return null;

        return (
          <div key={column.key} className={styles.filterSection}>
            {column.filterOptions.map((option) => (
              <label key={option.key} className={styles.filterOption}>
                <input
                  value={String(option.value)}
                  type="checkbox"
                  onChange={(e) => onFilter(column.key, e.currentTarget.value)}
                  checked={(filterState[column.key] || []).map(String).includes(String(option.value))}
                />
                {option.label || option.value}
              </label>
            ))}
          </div>
        )
      })}
    </div>
  )
}
