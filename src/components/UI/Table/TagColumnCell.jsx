import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { addTag, addTagsToProgram, removeTagsFromProgram } from '../../../api/tag';
import styles from './TagColumnCell.module.css';

export default function TagColumnCell({ tagName, row, onRefresh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const cellRef = useRef(null);
  const popoverRef = useRef(null);

  const rowTags = row.tags || {};
  const tagEntry = Object.entries(rowTags).find(([name]) => name === tagName);
  const tagData = tagEntry ? tagEntry[1] : null;
  const hasTag = !!tagData;
  const isSimple = tagData?.type === 'SIMPLE';
  const displayValue = hasTag ? (isSimple ? tagName : (tagData.value || '—')) : '—';

  useEffect(() => {
    if (isEditing && cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      setPopoverPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      });
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target) &&
          cellRef.current && !cellRef.current.contains(e.target)) {
        setIsEditing(false);
      }
    };
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditing]);

  const handleSave = async () => {
    try {
      if (hasTag && tagData.id) {
        await removeTagsFromProgram(row.id, [tagData.id]);
      }
      
      if (value.trim() || !hasTag) {
        const type = value.trim() 
          ? (value === 'true' || value === 'false' ? 'BOOLEAN' : /^\d+$/.test(value) ? 'NUMBER' : 'TEXT')
          : 'SIMPLE';
        
        const response = await addTag({
          name: tagName,
          number_value: type === 'NUMBER' ? parseInt(value, 10) : null,
          text_value: type === 'TEXT' ? value.trim() : null,
          boolean_value: type === 'BOOLEAN' ? (value === 'true') : null,
          type
        });
        
        const newTagId = response?.result?.id || response?.id;
        if (newTagId) {
          await addTagsToProgram(row.id, [newTagId]);
        }
      }
      
      onRefresh?.();
      setIsEditing(false);
      setValue('');
    } catch (error) {
      console.error('Error saving tag:', error);
    }
  };

  const handleRemove = async () => {
    try {
      if (hasTag && tagData.id) {
        await removeTagsFromProgram(row.id, [tagData.id]);
        onRefresh?.();
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const type = value.trim() 
        ? (value === 'true' || value === 'false' ? 'BOOLEAN' : /^\d+$/.test(value) ? 'NUMBER' : 'TEXT')
        : 'SIMPLE';
      
      const response = await addTag({
        name: tagName,
        number_value: type === 'NUMBER' ? parseInt(value, 10) : null,
        text_value: type === 'TEXT' ? value.trim() : null,
        boolean_value: type === 'BOOLEAN' ? (value === 'true') : null,
        type
      });
      
      const newTagId = response?.result?.id || response?.id;
      if (newTagId) {
        await addTagsToProgram(row.id, [newTagId]);
        onRefresh?.();
      }
      setIsEditing(false);
      setValue('');
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const renderPopover = () => createPortal(
    <div 
      ref={popoverRef}
      className={styles.popover}
      style={{ top: popoverPosition.top, left: popoverPosition.left }}
    >
      <div className={styles.popoverHeader}>{tagName}</div>
      
      {hasTag ? (
        <>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={isSimple ? 'Добавить значение...' : 'Новое значение...'}
            className={styles.input}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setIsEditing(false);
            }}
          />
          <div className={styles.actions}>
            <button type="button" className={styles.saveBtn} onClick={handleSave}>
              Сохранить
            </button>
            <button type="button" className={styles.removeBtn} onClick={handleRemove}>
              Удалить
            </button>
          </div>
        </>
      ) : (
        <>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Значение (опционально)..."
            className={styles.input}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') setIsEditing(false);
            }}
          />
          <div className={styles.actions}>
            <button type="button" className={styles.saveBtn} onClick={handleAdd}>
              Добавить
            </button>
            <button type="button" className={styles.cancelBtn} onClick={() => setIsEditing(false)}>
              Отмена
            </button>
          </div>
        </>
      )}
    </div>,
    document.body
  );

  return (
    <>
      <span
        ref={cellRef}
        className={`${styles.cell} ${hasTag ? styles.hasTag : styles.noTag}`}
        onClick={() => {
          setIsEditing(true);
          setValue(hasTag && !isSimple ? (tagData.value || '') : '');
        }}
        title={hasTag ? `Редактировать: ${displayValue}` : 'Добавить тег'}
      >
        {displayValue}
      </span>
      {isEditing && renderPopover()}
    </>
  );
}
