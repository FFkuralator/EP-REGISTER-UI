import React from 'react';
import styles from './PaginationBlock.module.css';

export default function PaginationBlock({ onPageSizeChange, pageSizes, paginationState, onPageChange }) {
  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.topRow}>
        <div className={styles.leftControls}>
            {pageSizes ? (
              pageSizes.map((size) => <option key={size} value={size}>{size}</option>)
            ) : (
              <>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </>
            )}
        </div>
      </div>

      <div className={styles.infoRow}>
        {paginationState.startItem}-{paginationState.endItem} из {paginationState.totalItems}
      </div>
    </div>
  );
}
