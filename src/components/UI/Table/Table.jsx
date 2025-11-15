import React, { useState, useCallback } from 'react';
import styles from './Table.module.css';
import PaginationBlock from './PaginationBlock';
import BaseCellRenderer from './BaseCellRenderer';
import Menu from '../Menu/Menu';
import TableHead from './TableHead';

export default function Table({
  columns,
  data,
  onSort,
  sortState,
  onFilter,
  filterState,
  menuContent,
  pagination,
  paginationSize,
  handlePageSizeChange,
  paginationData,
  handlePageChange,
}) {
  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    row: null,
  });

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

  return (
    <div className={styles.tableWrapper}>
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
                    <tr key={row.id}
                        onContextMenu={(e) => handleRightClick(e, row)}
                        className={ styles.tableRow}
                    >
                        {columns.map((column) => (
                            <td 
                                key={column.key}
                                className={styles.baseCell}
                            >
                                <BaseCellRenderer value={row[column.key ?? '']} />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>

        { menu.visible &&
            <Menu 
                flag={menu}
                changeFlag={closeMenu}
                menu={menuContent}
            />
        }
        
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
