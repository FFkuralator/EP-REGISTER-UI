import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react';
import TagFilter from './TagFilter';
import styles from './SidebarFilter.module.css'

export default function SidebarFilter({ onFilter, filterState, columns, tagFilter, onTagFilterChange }) {
  const filterableColumns = columns.filter((column) => (column.filterOptions || []).length > 0);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const initial = {};
    filterableColumns.forEach((c) => { initial[c.key] = false });
    setOpenSections(initial);
  }, [columns]);

  const toggle = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <aside className={styles.sidebarFilter}>
      <h2>Фильтры</h2>
      
      {tagFilter && onTagFilterChange && (
        <TagFilter tagFilter={tagFilter} onTagFilterChange={onTagFilterChange} />
      )}

      {filterableColumns.map((column) => {
        const isOpen = !!openSections[column.key];
        return (
          <div key={column.key} className={styles.filterSection}>
            <button
              type="button"
              className={styles.filterHeader}
              onClick={() => toggle(column.key)}
            >
              <span className={styles.filterTitle}>{column.title || column.key}</span>
              <ChevronDown className={`${styles.chevron} ${isOpen ? styles.open : ''}`} size={18} color="currentColor" />
            </button>

            <div id={`opts-${column.key}`} className={`${styles.options} ${isOpen ? styles.open : ''}`}>
              {column.filterOptions.map((option) => (
                <label key={option.key} className={styles.filterOption}>
                  <input
                    value={String(option.value)}
                    type="checkbox"
                    onChange={(e) => onFilter(column.key, e.currentTarget.value)}
                    checked={(filterState[column.key] || []).map(String).includes(String(option.value))}
                  />
                  <span>{option.label || option.value}</span>
                </label>
              ))}
            </div>
          </div>
        )
      })}
    </aside>
  )
}
