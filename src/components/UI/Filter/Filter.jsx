import React from 'react';
import styles from './Filter.module.css';

export default function Filter({ options, onFilter, filterState, xy }) {
  return (
    <fieldset
      className={ styles.filterWrapper }
      style={{ top: xy.y, left: xy.x }}
    >
      {options.map((option) => (
        <label key={option.value} className={styles.filterOption}>
          <input
            value={String(option.value)}
            type="checkbox"
            onChange={(e) => onFilter(e.currentTarget.value)}
            checked={(filterState || []).map(String).includes(String(option.value))}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
