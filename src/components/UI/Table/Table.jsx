import React, { useState, useCallback, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router';
import styles from './Table.module.css';
import PaginationBlock from './PaginationBlock';
import BaseCellRenderer from './BaseCellRenderer';
import TableHead from './TableHead';

export default function Table({
  columns,
  data,
  onSort,
  sortState,
  onFilter,
  filterState,
  pagination,
  paginationSize,
  handlePageSizeChange,
  paginationData,
  handlePageChange,
  onToggleHierarchy,
  expandedFamilies,
  onTagsChange,
}) {

  const wrapperRef = useRef(null);

  useLayoutEffect(() => {
    function updateHeaderHeight() {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const thead = wrapper.querySelector('thead');
      const headerHeight = thead ? thead.offsetHeight : 0;
      wrapper.style.setProperty('--thead-height', `${headerHeight}px`);
    }

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  const handleRightClick = useCallback(
    (e, row) => {
      if (!menuContent) return;

      e.preventDefault();

      setMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        row,
      });
    },
    [menuContent]
  );

  const closeMenu = useCallback(() => {
    setMenu((m) => ({ ...m, visible: false }));
  }, []);

  const getProcessedMenuContent = () => {
    if (!menu.row) return menuContent;

    return menuContent.map((item) => {
      if (item.href && typeof item.href === 'function') {
        return { ...item, href: item.href(menu.row) };
      }
      if (item.onClick && typeof item.onClick === 'function') {
        return { ...item, onClick: () => item.onClick(menu.row) };
      }
      return item;
    });
  };

  const getRowClassName = (row) => {
    if (row._is_child) {
      return row._matches_filter === false ? styles.childRowDimmed : styles.childRow;
    }
    if (row._is_filtered_match) return styles.filteredMatchRow;
    return styles.tableRow;
  };

  return (
    <div className={styles.tableComponent}>
        <div ref={wrapperRef} className={ styles.tableWrapper }>
            <table className={styles.table}>
                <TableHead
                    columns={columns}
                    onSort={onSort}
                    sortState={sortState}
                    onFilter={onFilter}
                    filterState={filterState}
                />
        
                <tbody>
                  {data.map((row) => (
                    <tr key={`${row.family_id ?? ''}-${row.id}`} 
                      className={getRowClassName(row)}
                    >
                      {columns.map((column) => (
                        <td 
                          key={column.key}
                          data-label={column.title || column.key}
                          className={column.key === '__hierarchy' ? styles.hierarchyCell : styles.baseCell}
                        >
                                    {column.key === '__hierarchy' ? (
                                      row._is_latest && row._has_multiple ? (
                                        <button 
                                          className={styles.expandButton}
                                          onClick={() => onToggleHierarchy && onToggleHierarchy(row.family_id)}
                                        >
                                          {expandedFamilies && expandedFamilies.has && expandedFamilies.has(row.family_id) ? '−' : '+'}
                                        </button>
                                      ) : null
                                    ) : column.key === 'title' ? (
                                      <Link to={`/program/${row.id}`} className={styles.cellLink}>
                                        <BaseCellRenderer 
                                          type={column.cellType || 'text'}
                                          value={row[column.key ?? '']} 
                                          row={row}
                                          onTagsChange={onTagsChange}
                                        />
                                      </Link>
                                    ) : (
                            <BaseCellRenderer 
                              type={column.cellType || 'text'}
                              value={row[column.key ?? '']} 
                              row={row}
                              onTagsChange={onTagsChange}
                              tagName={column.tagName}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
            </table>
        </div>
        
        {pagination &&
            <PaginationBlock 
                onPageSizeChange={handlePageSizeChange}
                pageSizes={paginationSize ?? null}
                paginationState={paginationData}
                onPageChange={handlePageChange}
            />
        }
    </div>
    );
}
