import React, { useEffect } from 'react';
import styles from './Menu.module.css';

export default function Menu({ title, flag, changeFlag, menu }) {
  useEffect(() => {
    window.addEventListener('click', changeFlag);
    return () => window.removeEventListener('click', changeFlag);
  }, [changeFlag]);

  return (
    <>
      {flag.visible && (
        <div className={styles.menu} style={{ top: flag.y, left: flag.x }}>
          {title && <div>{title}</div>}

          {menu.map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
