import React, { useState, useCallback, useRef, useLayoutEffect } from 'react';
import styles from './Table.module.css';
import PaginationBlock from './PaginationBlock';
import BaseCellRenderer from './BaseCellRenderer';
import Menu from '../Menu/Menu';
import TableHead from './TableHead';

/**
 * Generic table component with sorting, filtering, context menu and hierarchy support.
 */
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
  onToggleHierarchy,
  expandedFamilies,
}) {
  /** @type {[Object, Function]} Состояние контекстного меню */
  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    row: null,
  });

  const wrapperRef = useRef(null);

  /**
   * Динамически обновляет CSS-переменную высоты заголовка таблицы.
   * Необходимо для правильного позиционирования sticky-элементов.
   */
  useLayoutEffect(() => {
    function updateHeaderHeight() {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const thead = wrapper.querySelector('thead');
      const headerHeight = thead ? thead.offsetHeight : 0;
      wrapper.style.setProperty('--thead-height', `${headerHeight}px`);
    }

  /**
   * Обработчик правого клика для показа контекстного меню.
   * 
   * @param {React.MouseEvent} e - Событие мыши
   * @param {Object} row - Данные строки
   */
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
  /**
   * Закрывает контекстное меню.
   */
        row,
      });
    },
    [menuContent]
  );

  const closeMenu = useCallback(() => {
  /**
   * Генерирует элементы меню с подставленными данными строки.
   * Заменяет функции href/onClick на конкретные значения.
   * 
   * @returns {Array<Object>} - Обработанный массив элементов меню
   */
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
                      onContextMenu={(e) => handleRightClick(e, row)}
                      className={row._is_child ? styles.childRow : styles.tableRow}
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
                                    ) : (
                            <BaseCellRenderer value={row[column.key ?? '']} />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
            </table>
        </div>


        { menu.visible &&
            <Menu 
                flag={menu}
                changeFlag={closeMenu}
                menu={getProcessedMenuContent()}
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
