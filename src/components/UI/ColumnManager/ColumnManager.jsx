import React, { useState } from 'react';
import styles from './ColumnManager.module.css';

export default function ColumnManager({
  columns,
  visibleColumnKeys,
  onUpdateVisibility,
  onUpdateOrder,
  onReset,
  onClose,
}) {
  const [localVisibleKeys, setLocalVisibleKeys] = useState(new Set(visibleColumnKeys));
  const [localOrder, setLocalOrder] = useState([...columns]);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleToggleColumn = (columnKey) => {
    setLocalVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  };

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex) => {
    if (draggedItem === null) return;

    const newOrder = [...localOrder];
    const draggedColumn = newOrder[draggedItem];
    newOrder.splice(draggedItem, 1);
    newOrder.splice(targetIndex, 0, draggedColumn);

    setLocalOrder(newOrder);
    setDraggedItem(null);
  };

  const handleApply = () => {
    onUpdateVisibility(Array.from(localVisibleKeys));
    onUpdateOrder(localOrder);
    onClose();
  };

  const handleReset = () => {
    const allKeys = columns.map(col => col.key);
    setLocalVisibleKeys(new Set(allKeys));
    setLocalOrder([...columns]);
    onReset();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Управление столбцами</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.instructions}>
            Перетаскивайте столбцы для изменения порядка. Отключите ненужные столбцы.
          </p>

          <div className={styles.columnsList}>
            {localOrder.map((column, index) => (
              <div
                key={column.key}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`${styles.columnItem} ${
                  draggedItem === index ? styles.dragging : ''
                }`}
              >
                <div className={styles.dragHandle}>⋮⋮</div>

                <div className={styles.columnInfo}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={localVisibleKeys.has(column.key)}
                      onChange={() => handleToggleColumn(column.key)}
                      className={styles.checkbox}
                    />
                    <span className={styles.columnTitle}>{column.title}</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.resetBtn} onClick={handleReset}>
            Сбросить по умолчанию
          </button>
          <div className={styles.actionButtons}>
            <button className={styles.cancelBtn} onClick={onClose}>
              Отмена
            </button>
            <button className={styles.applyBtn} onClick={handleApply}>
              Применить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
