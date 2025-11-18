import React from 'react'
import styles from './HistoryItem.module.css'
import getProgramLabel from '../../../utils/getProgramKeyLabel';

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

  return (
    <div className={styles.historyItem}>
      <div className={styles.yearCell}>{ meta.start_year}</div>
      {adaptChangesToArray(changes).map((change, index) => (
        <div key={index} className={styles.historyCell}>
          <div><b>{ getProgramLabel(keys[index])}</b></div>
          <div>{meta.start_year - 1}: {change.master ?? '-'}</div>
          <div>{meta.start_year} : {change.current ?? '-'}</div>
        </div>
      ))}
    </div>
  )
}
