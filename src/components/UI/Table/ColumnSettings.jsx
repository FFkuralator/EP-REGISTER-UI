import React, { useState } from 'react';
import { Settings, GripVertical, Eye, EyeOff } from 'lucide-react';
import styles from './ColumnSettings.module.css';

export default function ColumnSettings({ columns, visibleColumns, onColumnsChange, onOrderChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newOrder = [...columns];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, removed);
    
    onOrderChange(newOrder);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const toggleColumn = (key) => {
    const newVisible = visibleColumns.includes(key)
      ? visibleColumns.filter(k => k !== key)
      : [...visibleColumns, key];
    onColumnsChange(newVisible);
  };

  const visibleCount = columns.filter(c => visibleColumns.includes(c.key)).length;

  return (
    <div className={styles.columnSettings}>
      <button 
        type="button" 
        className={styles.settingsBtn}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Settings size={16} />
        <span>Столбцы ({visibleCount}/{columns.length})</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <span>Настройка столбцов</span>
            <button type="button" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          
          <div className={styles.columnsList}>
            {columns.map((col, index) => (
              <div
                key={col.key}
                className={`${styles.columnItem} ${draggedIndex === index ? styles.dragging : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <GripVertical size={14} className={styles.dragHandle} />
                <button
                  type="button"
                  className={`${styles.visibilityBtn} ${visibleColumns.includes(col.key) ? styles.visible : ''}`}
                  onClick={() => toggleColumn(col.key)}
                >
                  {visibleColumns.includes(col.key) ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <span className={styles.columnName} title={col.title}>
                  {col.title || col.key}
                  {col.isTagColumn && <span className={styles.tagBadge}>тег</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
