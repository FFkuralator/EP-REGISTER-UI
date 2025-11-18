import React from 'react'
import DetailHeader from './DetailHeader';
import DetailBlock from './DetailBlock';
import DetailMeta from './DetailMeta';
import styles from './DetailView.module.css'

export default function DetailView(
  { header,
    meta,
    getMetaLabel,
    details,
    sidebar,
    getSidebarLabel
  }
) {
  return (
    <div className={styles.detailViewWrapper}>
      <DetailHeader data={header} />

      <div className={styles.main_column}>
        <div className={styles.column_wrapper}>
          {meta ?
            <DetailMeta data={meta} getLabel={getMetaLabel}/>
            : {}
          }
          {details ?
            details.map((block, index) => (
              <DetailBlock 
                key={index}
                title={block.title}
              > { block.content }
              </DetailBlock>
            ))
            : null
          }
        </div>

        <div className={styles.sidebar_column}>
          <div className={styles.column_wrapper}>
            </div>
              {sidebar ?
                sidebar.map((detail, index) => (
                  <DetailMeta key={index} data={detail} getLabel={getSidebarLabel} wide={false} />
                ))
                : null
              }
            </div>
          </div>
      </div>
  )
}
