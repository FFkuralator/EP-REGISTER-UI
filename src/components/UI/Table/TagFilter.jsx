import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getTags } from '../../../api/tag';
import styles from './TagFilter.module.css';

const TAG_COLORS = [
  { bg: '#e6f7ff', border: '#91d5ff', text: '#0050b3' },
  { bg: '#f6ffed', border: '#b7eb8f', text: '#237804' },
  { bg: '#fff7e6', border: '#ffd591', text: '#ad6800' },
  { bg: '#fff1f0', border: '#ffccc7', text: '#a8071a' },
  { bg: '#f9f0ff', border: '#d3adf7', text: '#531dab' },
];

function getColorForTag(name) {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TAG_COLORS[hash % TAG_COLORS.length];
}

export default function TagFilter({ tagFilter, onTagFilterChange }) {
  const [tags, setTags] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getTags().then(res => setTags(res.result || [])).catch(() => {});
  }, []);

  const filteredTags = tags.filter(tag => {
    const display = `${tag.name}: ${tag.value || '—'}`.toLowerCase();
    return display.includes(searchQuery.toLowerCase());
  });

  const handleTagClick = (tagId, mode) => {
    const current = tagFilter.tags[tagId];
    if (current === mode) {
      const newTags = { ...tagFilter.tags };
      delete newTags[tagId];
      onTagFilterChange({ ...tagFilter, tags: newTags });
    } else {
      onTagFilterChange({ ...tagFilter, tags: { ...tagFilter.tags, [tagId]: mode } });
    }
  };

  const handleModeChange = (mode) => {
    onTagFilterChange({ ...tagFilter, mode });
  };

  const activeCount = Object.keys(tagFilter.tags).length;

  return (
    <div className={styles.tagFilter}>
      <button type="button" className={styles.filterHeader} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.filterTitle}>
          Теги {activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
        </span>
        <ChevronDown className={`${styles.chevron} ${isOpen ? styles.open : ''}`} size={18} />
      </button>

      <div className={`${styles.content} ${isOpen ? styles.open : ''}`}>
        <div className={styles.modeToggle}>
          <button
            type="button"
            className={`${styles.modeBtn} ${tagFilter.mode === 'and' ? styles.active : ''}`}
            onClick={() => handleModeChange('and')}
          >
            И
          </button>
          <button
            type="button"
            className={`${styles.modeBtn} ${tagFilter.mode === 'or' ? styles.active : ''}`}
            onClick={() => handleModeChange('or')}
          >
            ИЛИ
          </button>
        </div>

        <input
          type="text"
          placeholder="Поиск тегов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.legend}>
          <span className={styles.legendItem}><span className={styles.includeBox}>✓</span> включить</span>
          <span className={styles.legendItem}><span className={styles.excludeBox}>✕</span> исключить</span>
        </div>

        <div className={styles.tagsList}>
          {filteredTags.map(tag => {
            const color = getColorForTag(tag.name);
            const state = tagFilter.tags[tag.id];
            const tagDisplay = tag.type === 'SIMPLE' ? tag.name : `${tag.name}: ${tag.value || '—'}`;

            return (
              <div key={tag.id} className={styles.tagItem}>
                <div
                  className={styles.tagLabel}
                  style={{ background: color.bg, borderColor: color.border, color: color.text }}
                  title={tagDisplay}
                >
                  {tagDisplay}
                </div>
                <div className={styles.tagActions}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.includeBtn} ${state === 'include' ? styles.active : ''}`}
                    onClick={() => handleTagClick(tag.id, 'include')}
                    title="Включить"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.excludeBtn} ${state === 'exclude' ? styles.active : ''}`}
                    onClick={() => handleTagClick(tag.id, 'exclude')}
                    title="Исключить"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
