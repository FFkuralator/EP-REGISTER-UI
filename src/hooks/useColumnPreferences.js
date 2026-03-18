import { useState, useEffect } from 'react';

const STORAGE_KEY = 'columnPreferences';

export function useColumnPreferences(initialColumns, storageKey = STORAGE_KEY) {
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(null);
  const [columnOrder, setColumnOrder] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const { visible, order } = JSON.parse(stored);
        setVisibleColumnKeys(visible);
        setColumnOrder(order);
      } catch (e) {
        initializeDefaults();
      }
    } else {
      initializeDefaults();
    }
  }, [storageKey]);

  const initializeDefaults = () => {
    const defaultKeys = initialColumns.map(col => col.key);
    setVisibleColumnKeys(defaultKeys);
    setColumnOrder(initialColumns);
  };

  const savePreferences = (visible, order) => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          visible,
          order: order.map(col => ({ key: col.key, title: col.title })),
        })
      );
    } catch (e) {
    }
  };

  const updateVisibleColumns = (newVisibleKeys) => {
    setVisibleColumnKeys(newVisibleKeys);
    savePreferences(newVisibleKeys, columnOrder || initialColumns);
  };

  const updateColumnOrder = (newOrder) => {
    setColumnOrder(newOrder);
    savePreferences(visibleColumnKeys || initialColumns.map(col => col.key), newOrder);
  };

  const resetToDefaults = () => {
    const defaultKeys = initialColumns.map(col => col.key);
    setVisibleColumnKeys(defaultKeys);
    setColumnOrder(initialColumns);
    localStorage.removeItem(storageKey);
  };

  const getOrderedVisibleColumns = () => {
    const order = columnOrder || initialColumns;
    return order.filter(col => visibleColumnKeys?.includes(col.key));
  };

  return {
    visibleColumnKeys: visibleColumnKeys || initialColumns.map(col => col.key),
    columnOrder: columnOrder || initialColumns,
    updateVisibleColumns,
    updateColumnOrder,
    resetToDefaults,
    getOrderedVisibleColumns,
    isLoaded: visibleColumnKeys !== null,
  };
}
