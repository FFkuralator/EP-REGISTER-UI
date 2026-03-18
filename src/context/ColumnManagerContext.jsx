import React, { createContext, useState, useCallback } from 'react';

export const ColumnManagerContext = createContext();

export function ColumnManagerProvider({ children, initialColumns }) {
  const [columns, setColumns] = useState(initialColumns);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(
    initialColumns.map(col => col.key)
  );

  const updateColumnOrder = useCallback((newOrder) => {
    setColumns(newOrder);
  }, []);

  const toggleColumnVisibility = useCallback((columnKey, isVisible) => {
    setVisibleColumnKeys(prev => {
      if (isVisible) {
        return prev.includes(columnKey) ? prev : [...prev, columnKey];
      } else {
        return prev.filter(key => key !== columnKey);
      }
    });
  }, []);

  const resetToDefault = useCallback(() => {
    setVisibleColumnKeys(initialColumns.map(col => col.key));
    setColumns(initialColumns);
  }, [initialColumns]);

  const getVisibleColumns = useCallback(() => {
    return columns.filter(col => visibleColumnKeys.includes(col.key));
  }, [columns, visibleColumnKeys]);

  const value = {
    columns,
    visibleColumnKeys,
    updateColumnOrder,
    toggleColumnVisibility,
    resetToDefault,
    getVisibleColumns,
  };

  return (
    <ColumnManagerContext.Provider value={value}>
      {children}
    </ColumnManagerContext.Provider>
  );
}
