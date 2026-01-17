import React from 'react';
import styles from './PaginationBlock.module.css';

export default function PaginationBlock({ onPageSizeChange, pageSizes, paginationState, onPageChange }) {
  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.infoRow}>
        {paginationState.startItem}-{paginationState.endItem} из {paginationState.totalItems}
      </div>
    </div>
  );
}
