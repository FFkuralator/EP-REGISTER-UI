import React, { useState, useCallback } from 'react';
import TableFilter from './TableFilter';
import styles from './TableHead.module.css';
import TriangleButton from '../Button/TriangleButton';

export default function TableHead({ columns, onSort, sortState, onFilter, filterState }) {
  const [openFilter, setOpenFilter] = useState(null);
  const [filterXY, setFilterXY] = useState({ x: 0, y: 0 });

  const toggleFilter = useCallback((e, key) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOpenFilter((prev) => (prev === key ? null : key));
    setFilterXY({ x: rect.left, y: rect.bottom + 2 });
  }, []);

  return (
    <thead className={styles.tableHead}>
      <tr className={styles.tableHeadRow}>
        {columns.map((column) => {
          const isFilterActive = openFilter === column.key;
          const isSortActive = sortState.by === column.key;
          const isFilterStateActive = (filterState[column.key] || []).length > 0;
          const hasActiveState = isFilterActive || isSortActive || isFilterStateActive;

          return (
            <th
              key={column.key}
              className={hasActiveState ? styles.activeHeadCell : ''}
            >
              <div className={styles.headCell}>
                {column.sortable ? (
                  <span
                    className={styles.sortableHeadCell}
                    onClick={() => onSort(column.key)}
                  >
                    {column.title}
                  </span>
                ) : (
                  <span>{column.title}</span>
                )}

                {column.sortable && (
                  <span>
                    {isSortActive
                      ? sortState.order === 'asc'
                        ? '↑'
                        : '↓'
                      : '\u00A0'}
                  </span>
                )}

                {(column.filterOptions || []).length > 0 
                && (
                  <TriangleButton
                    open={isFilterActive}
                    onOpen={(e) => toggleFilter(e, column.key)}
                  />
                )}

                {isFilterActive && (column.filterOptions || []).length > 0 
                && (
                  <TableFilter
                    column={column}
                    onFilter={onFilter}
                    filterState={filterState}
                    xy={filterXY}
                  />
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
