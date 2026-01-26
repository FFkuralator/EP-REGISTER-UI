import React from 'react'
import styles from './DetailMeta.module.css'
import DetailTagsManager from './DetailTagsManager'

export default function DetailMeta({ data, getLabel, onRefresh, wide = true, tagsKey = 'tags' }) {
  const hasTagsField = data[tagsKey];
  const dataWithoutTags = Object.entries(data).reduce((acc, [key, value]) => {
    if (key !== tagsKey) acc[key] = value;
    return acc;
  }, {});
  
  const keys = Object.keys(dataWithoutTags);
  const keys_first_half = keys.slice(0, Math.ceil(keys.length / 2));
  const keys_second_half = keys.slice(Math.ceil(keys.length / 2));
  const values = Object.values(dataWithoutTags);
  const middleIndex = Math.ceil(keys.length / 2);

  return (
    <>
      {hasTagsField && (
        <div className={styles.tagsSection}>
          <DetailTagsManager 
            value={data[tagsKey]} 
            onRefresh={onRefresh}
          />
        </div>
      )}
      
      <div className={styles.metaWrapper} style={{ flexDirection: wide ? 'row' : 'column' }}>
        <div className={styles.metaColumn}>
          {keys_first_half.map((key, index) => (
            <div key={index} className={styles.metaItem}>
              <span className={styles.metaKey}>{getLabel(key, 'key')}:</span> {getLabel(values[index], 'value')}
            </div>
          ))}
        </div>

        <div className={styles.metaColumn}>
          {keys_second_half.map((key, index) => (
            <div key={index} className={styles.metaItem}>
              <span className={styles.metaKey}>{getLabel(key, 'key')}:</span> {getLabel(values[middleIndex + index], 'value')}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
