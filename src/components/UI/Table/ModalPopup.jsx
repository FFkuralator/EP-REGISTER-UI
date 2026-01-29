import React, { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'
import filterIcon from '../../../../public/filterIcon.png';
import styles from './ModalPopup.module.css'

/** Tab configuration for filter modal sidebar */
const TABS_CONFIG = [
  {
    id: 'tags',
    label: 'Теги',
    fields: [],
    isEmpty: true,
  },
  {
    id: 'language_level',
    label: 'Язык и уровень',
    fields: ['language', 'degree_title'],
  },
  {
    id: 'type_form',
    label: 'Вид и форма',
    fields: ['educational_standard_type', 'educational_form'],
  },
];

/** Field key to Russian label mapping for filter sections */
const FIELD_LABELS = {
  'language': 'Язык реализации',
  'degree_title': 'Уровень образования',
  'educational_standard_type': 'Вид образовательного стандарта',
  'educational_form': 'Форма обучения',
};

/**
 * Modal popup with tabbed filter interface.
 * Displays filter categories in sidebar with checkbox options.
 */
export default function ModalPopup({ onFilter, filterState, columns, onResetFilters }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(TABS_CONFIG[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const filterableColumns = columns.filter((column) => (column.filterOptions || []).length > 0)

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleReset = () => {
    if (onResetFilters) {
      onResetFilters()
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen]);

  const getColumnsForTab = (tabId) => {
    const tabConfig = TABS_CONFIG.find(tab => tab.id === tabId);
    if (!tabConfig) return [];
    return filterableColumns.filter(col => tabConfig.fields.includes(col.key));
  };

  const activeTabConfig = TABS_CONFIG.find(tab => tab.id === activeTab);
  const activeTabColumns = getColumnsForTab(activeTab);

  const getActiveFiltersCount = () => {
    return Object.values(filterState).reduce((count, values) => count + (values?.length || 0), 0);
  };

  const activeFiltersCount = getActiveFiltersCount();

  if (filterableColumns.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.filterButton}
        onClick={handleOpen}
      >
        <img src={filterIcon} className={styles.icon} alt="" />
        <span>Фильтры</span>
        {activeFiltersCount > 0 && (
          <span className={styles.badge}>{activeFiltersCount}</span>
        )}
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

            <div className={styles.modalBody}>

              <div className={styles.sidebar}>
                <nav className={styles.tabsList}>
                  {TABS_CONFIG.map((tab) => (
                    <button
                      key={tab.id}
                      className={`${styles.tabItem} ${activeTab === tab.id ? styles.tabItemActive : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>

                <div className={styles.sidebarActions}>
                  <button
                    type="button"
                    className={styles.applyButton}
                    onClick={handleClose}
                  >
                    Применить
                  </button>
                  <button
                    type="button"
                    className={styles.resetButton}
                    onClick={handleReset}
                  >
                    Сбросить всё
                  </button>
                </div>
              </div>

              <div className={styles.contentArea}>
                <div className={styles.searchWrapper}>
                  <Search size={16} className={styles.searchIcon} />
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Поиск по фильтрам"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {activeTabConfig?.isEmpty ? (
                  <div className={styles.emptyState}>
                    <p>Здесь будут теги</p>
                  </div>
                ) : (
                  <div className={styles.filtersContent}>
                    {activeTabColumns.map((column) => (
                      <div key={column.key} className={styles.filterSection}>
                        <h3 className={styles.sectionTitle}>
                          {FIELD_LABELS[column.key] || column.title || column.key}
                        </h3>
                        <div className={styles.options}>
                          {column.filterOptions
                            .filter(option => 
                              !searchQuery || 
                              (option.label || option.value).toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((option) => (
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
