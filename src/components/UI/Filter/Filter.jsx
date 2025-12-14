import React, { useEffect, useRef, useState } from 'react';
import styles from './Filter.module.css';

export default function Filter({ options, onFilter, filterState, xy }) {
  const filterRef = useRef(null);
  const [adjustedXy, setAdjustedXy] = useState(xy);

  useEffect(() => {
    if (!filterRef.current) return;

    const filterEl = filterRef.current;
    const rect = filterEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    let adjustedX = xy.x;

    if (rect.right > viewportWidth) {
      adjustedX = viewportWidth - rect.width - 10;
    }

    if (adjustedX < 0) {
      adjustedX = 10;
    }

    setAdjustedXy({ x: adjustedX, y: xy.y });
  }, [xy]);

  return (
    <fieldset
      ref={filterRef}
      className={ styles.filterWrapper }
      style={{ top: adjustedXy.y, left: adjustedXy.x }}
    >
      {options.map((option) => (
        <label key={option.key} className={styles.filterOption}>
          <input
            value={String(option.value)}
            type="checkbox"
            onChange={(e) => onFilter(e.currentTarget.value)}
            checked={(filterState || []).map(String).includes(String(option.value))}
          />
          {option.label || option.value}
        </label>
      ))}
    </fieldset>
  );
}
