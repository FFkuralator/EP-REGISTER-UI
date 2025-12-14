import React from 'react'
import styles from './DetailMeta.module.css'

export default function Detaildata( { data, getLabel, wide = true } ) {
  const keys = Object.keys( data );
  const keys_first_half = keys.slice( 0, Math.ceil( keys.length / 2 ) );
  const keys_second_half = keys.slice( Math.ceil( keys.length / 2 ) );
  const values = Object.values( data );
  const middleIndex = Math.ceil( keys.length / 2 );

  return (
    <div className={styles.metaWrapper} style={{ flexDirection: wide ? 'row' : 'column'  }}>
      <div className={styles.metaColumn}>
        { keys_first_half.map(( key, index) => (
          <div key={ index } className={styles.metaItem}>
            <span className={styles.metaKey}>{ getLabel(key, 'key') }:</span> { getLabel(values[index], 'value') }
          </div>
        ))}
      </div>

      <div className={styles.metaColumn}>
        { keys_second_half.map(( key, index ) => (
          <div key={ index } className={styles.metaItem}>
            <span className={styles.metaKey}>{ getLabel(key, 'key') }:</span> { getLabel(values[middleIndex + index], 'value') }
          </div>
        ))}
      </div>
    </div>
  )
}
