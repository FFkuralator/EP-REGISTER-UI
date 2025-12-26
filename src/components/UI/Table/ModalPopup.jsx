import React, { useState } from 'react'
import { Filter, X, ChevronDown, Check } from 'lucide-react'
import filterIcon from '../../../../public/filterIcon.png';
import styles from './ModalPopup.module.css'

export default function ModalPopup({ onFilter, filterState, columns }) {
  const [isOpen, setIsOpen] = useState(false)
  const filterableColumns = columns.filter((column) => (column.filterOptions || []).length > 0)

  if (filterableColumns.length === 0) {
    return null
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.filterButton}
        onClick={handleOpen}
      >
        <img src={filterIcon} className={styles.icon} />
        <span>Фильтры</span>
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Все фильтры</h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={handleClose}
              >
                <X size={24} />
              </button>
            </div>

            {/* Содержимое фильтров */}
            <div className={styles.modalContent}>
              {filterableColumns.map((column) => (
                <div key={column.key} className={styles.filterSection}>
                  <h3 className={styles.sectionTitle}>{column.title || column.key}</h3>
                  <div className={styles.options}>
                    {column.filterOptions.map((option) => (
                      <label key={option.key} className={styles.filterOption}>
                        <input
                          value={String(option.value)}
                          type="checkbox"
                          onChange={(e) => {
                            onFilter(column.key, e.currentTarget.value)
                          }}
                          checked={(filterState[column.key] || []).map(String).includes(String(option.value))}
                        />
                        <span>{option.label || option.value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}