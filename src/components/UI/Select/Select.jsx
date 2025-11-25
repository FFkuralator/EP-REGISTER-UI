import React from 'react';
import styles from './Select.module.css';

export default function Select({ value, onChange, options, placeholder, disabled, multiple = false }) {
  if (multiple) {
    const selectedValues = Array.isArray(value) ? value : [];
    
    return (
      <div className={styles.multiSelectContainer}>
        <div className={styles.multiSelectDisplay}>
          {selectedValues.length > 0 ? (
            selectedValues.map((val) => {
              const option = options?.find(o => o.id === val);
              return (
                <div key={val} className={styles.tag}>
                  {option?.title || val}
                  <button
                    type="button"
                    className={styles.tagRemove}
                    onClick={() => {
                      onChange(selectedValues.filter(v => v !== val));
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })
          ) : (
            <span className={styles.placeholder}>{placeholder || 'Выберите...'}</span>
          )}
        </div>
        <select
          className={styles.multiSelect}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val && !selectedValues.includes(val)) {
              onChange([...selectedValues, val]);
            }
            e.target.value = '';
          }}
          disabled={disabled}
        >
          <option value="">{placeholder || 'Выберите...'}</option>
          {options && options.map((option) => (
            <option
              key={option.id}
              value={option.id}
              disabled={selectedValues.includes(option.id)}
            >
              {option.title}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <select
      className={styles.select}
      value={value ?? ''}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val === '' ? null : val);
      }}
      disabled={disabled}
    >
      <option value="">{placeholder || 'Выберите...'}</option>
      {options && options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.title}
        </option>
      ))}
    </select>
  );
}
