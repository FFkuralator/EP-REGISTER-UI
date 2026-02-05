import React from 'react'
import DetailHeader from './DetailHeader';
import DetailBlock from './DetailBlock';
import DetailMeta from './DetailMeta';
import styles from './DetailView.module.css'

export default function DetailView(
  { header,
    headerLinks,
    meta,
    getMetaLabel,
    details,
    sidebar,
    getSidebarLabel,
    tags,
    onRefresh
  }
) {
  return (
    <div className={styles.detailViewWrapper}>
      <DetailHeader data={header} links={headerLinks} />

      <div className={styles.main_column}>
        <div className={styles.column_wrapper}>
          {meta && (
            <DetailBlock title="Характеристики Образовательной программы">
              <DetailMeta data={meta} getLabel={getMetaLabel} onRefresh={onRefresh} />
            </DetailBlock>
          )}
          {tags && (
            <DetailBlock title="Теги">
              <DetailMeta data={{tags: tags}} getLabel={getMetaLabel} onRefresh={onRefresh} />
            </DetailBlock>
          )}
          {details &&
            details.map((block, index) => (
              block && <DetailBlock 
                key={index}
                title={block.title}
              > { block.content }
              </DetailBlock>
            ))
          }
        </div>

        <div className={styles.sidebar_column}>
          {sidebar &&
            sidebar.map((detail, index) => (
              <DetailMeta key={index} data={detail} getLabel={getSidebarLabel} wide={false} onRefresh={onRefresh} />
            ))
          }
        </div>
      </div>
    </div>
  )
}
