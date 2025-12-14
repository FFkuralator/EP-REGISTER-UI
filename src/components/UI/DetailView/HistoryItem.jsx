import React from 'react'
import styles from './HistoryItem.module.css'
import getProgramLabel from '../../../utils/getProgramLabel';

export default function HistoryItem({ meta, changes}) {
  const adaptChangesToArray = (changes) => {
    if (typeof changes === 'object' && changes !== null && !Array.isArray(changes)) {
      return Object.values(changes);
    }
    return []; 
  };

  const adaptKeysToArray = (changes) => {
    if (typeof changes === 'object' && changes !== null && !Array.isArray(changes)) {
      return Object.keys(changes);
    }
    return []; 
  };

  const keys = adaptKeysToArray(changes);
  if (typeof changes === 'string') {
    return (
      <div className={styles.historyItem}>
        <div className={styles.yearCell}>{ meta.start_year}</div>
        <div className={styles.historyCell}>
          <div className={styles.noChanges}>{changes}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.historyItem}>
      <div className={styles.yearCell}>{ meta.start_year}</div>
      {adaptChangesToArray(changes).map((change, index) => (
        <div key={index} className={styles.historyCell}>
          <div><b>{ getProgramLabel(keys[index])}</b></div>
          <div>{meta.start_year - 1}: {getProgramLabel(change.master ?? '-', 'value')}</div>
          <div>{meta.start_year} : {getProgramLabel(change.current ?? '-', 'value')}</div>
        </div>
      ))}
    </div>
  )
}
