import React from 'react';
import styles from './PaginationBlock.module.css';

export default function PaginationBlock({ onPageSizeChange, pageSizes, paginationState, onPageChange }) {
  return (
    <div 
      className={styles.paginationWrapper}
    >
      <div>
        <label>На странице: </label>
        <select 
          name="pageSize"
          className={ styles.paginationSelect}
          onChange={(e) => onPageSizeChange(e.target.value)}
          value={paginationState.pageSize || (pageSizes ? pageSizes[0] : 20)}
        >
          {pageSizes ? 
            pageSizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))
            :
            <>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </>
          }
        </select>
      </div>

      <div>
        {paginationState.startItem}-{paginationState.endItem} из {paginationState.totalItems}
      </div>

      <div>
        <button 
          type="button" 
          className={styles.paginationButton}
          disabled={paginationState.currentPage === 1} 
          onClick={() => onPageChange(-1)}
        >
          ←
        </button>
        <span className={ styles.pageState }>{paginationState.currentPage}/{paginationState.totalPages}</span>
        <button 
          type="button" 
          className={styles.paginationButton}
          disabled={paginationState.currentPage === paginationState.totalPages} 
          onClick={() => onPageChange(1)}
        >
          →
        </button>
      </div>
    </div>
  )
}
