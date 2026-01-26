import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './AllTagsCellRenderer.module.css';
import { getTags, addTag, addTagsToProgram, removeTagsFromProgram, addTagsToFamily, removeTagsFromFamily } from '../../../api/tag';

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

export default function AllTagsCellRenderer({ value, row, onTagsChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagValue, setNewTagValue] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [applyToFamily, setApplyToFamily] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [existingTags, setExistingTags] = useState([]);
  const [selectedExistingTag, setSelectedExistingTag] = useState(null);
  const [tagSearchFilter, setTagSearchFilter] = useState('');
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [addTagMode, setAddTagMode] = useState('new');
  const popoverRef = useRef(null);
  const cellRef = useRef(null);

  const tags = value && typeof value === 'object' 
    ? Object.entries(value).map(([name, tagData]) => ({
        name,
        id: tagData.id,
        value: tagData.value,
        type: tagData.type
      }))
    : [];

  const displayLimit = 2;
  const hasMore = tags.length > displayLimit;
  const displayTags = tags.slice(0, displayLimit);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target) && 
          cellRef.current && !cellRef.current.contains(event.target)) {
        closePopover();
      }
    };

    if (isExpanded) {
      if (existingTags.length === 0 && !isLoadingTags) {
        setIsLoadingTags(true);
        getTags().then(tags => {
          setExistingTags(tags.result);
          setIsLoadingTags(false);
        }).catch(() => setIsLoadingTags(false));
      }

      if (cellRef.current) {
        const cellRect = cellRef.current.getBoundingClientRect();
        const padding = 8;
        const minMargin = 10;
        
        let top = cellRect.bottom + window.scrollY + padding;
        let left = cellRect.left + window.scrollX;
        
        setTimeout(() => {
          if (popoverRef.current) {
            const popoverRect = popoverRef.current.getBoundingClientRect();
            const popoverWidth = popoverRect.width || 400;
            const popoverHeight = popoverRect.height || 500;
            
            if (left + popoverWidth + minMargin > window.innerWidth) {
              left = Math.max(minMargin, cellRect.right + window.scrollX - popoverWidth);
            }
            
            if (top + popoverHeight + minMargin > window.innerHeight + window.scrollY) {
              top = cellRect.top + window.scrollY - popoverHeight - padding;
            }
            
            left = Math.max(minMargin, left);
            
            if (top < minMargin + window.scrollY) {
              top = cellRect.bottom + window.scrollY + padding;
            }
            
            setPopoverPosition({ top, left });
          }
        }, 0);
      }
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded, existingTags.length, isLoadingTags]);

  const closePopover = () => {
    setIsExpanded(false);
    setIsAddingTag(false);
    setAddTagMode('new');
    setSelectedExistingTag(null);
    setTagSearchFilter('');
    setNewTagName('');
    setNewTagValue('');
    setApplyToFamily(false);
  };

  const handleDeleteTag = async (tag) => {
    try {
      const removeFunc = applyToFamily ? removeTagsFromFamily : removeTagsFromProgram;
      await removeFunc(row.id, [tag.id]);
      onTagsChange?.();
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
    setApplyToFamily(false);
  };

  const handleAddTag = async () => {
    try {
      let tagId;
      
      if (selectedExistingTag) {
        tagId = selectedExistingTag.id;
      } else if (newTagName.trim()) {
        let type = newTagValue.trim() ? newTagValue == 'true' || newTagValue == 'false' ? 'BOOLEAN' : /^\d+$/.test(newTagValue) ? 'NUMBER' : 'TEXT' : 'SIMPLE'
        const response = await addTag({
          name: newTagName.trim(),
          number_value: type === 'NUMBER' ? parseInt(newTagValue, 10) : null,
          text_value: type === 'TEXT' ? newTagValue.trim() : null,
          boolean_value: type === 'BOOLEAN' ? (newTagValue.trim() === 'true') : null,
          type: type,
        });
        tagId = response?.result?.id || response?.id;
      }

      if (tagId) {
        const addFunc = applyToFamily ? addTagsToFamily : addTagsToProgram;
        await addFunc(row.id, [tagId]);
        onTagsChange?.();
      }

      setNewTagName('');
      setNewTagValue('');
      setSelectedExistingTag(null);
      setTagSearchFilter('');
      setIsAddingTag(false);
      setAddTagMode('new');
      setApplyToFamily(false);
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const renderTag = (tag, color) => {
    const tagText = tag.type === 'SIMPLE' ? tag.name : `${tag.name}: ${tag.value || '—'}`;

    return (
      <div
        key={tag.id}
        className={styles.tag}
        style={{
          background: color.bg,
          borderColor: color.border,
          color: color.text,
        }}
      >
        <span className={styles.tagText} title={tagText}>
          {tagText}
        </span>
        <button
          className={styles.deleteButton}
          onClick={() => handleDeleteTag(tag)}
          title="Удалить тег"
        >
          ✕
        </button>
      </div>
    );
  };

  const renderPopover = () => {
    const filteredExistingTags = existingTags.filter(tag => {
      const searchLower = tagSearchFilter.toLowerCase();
      const tagDisplay = `${tag.name}: ${tag.value || '—'}`.toLowerCase();
      return tagDisplay.includes(searchLower);
    });

    const alreadyAddedTagIds = new Set(tags.map(t => t.id));
    const availableTags = filteredExistingTags.filter(tag => !alreadyAddedTagIds.has(tag.id));

    return createPortal(
      <div 
        className={styles.popover} 
        ref={popoverRef}
        style={{
          position: 'fixed',
          top: `${popoverPosition.top}px`,
          left: `${popoverPosition.left}px`,
        }}
      >
        <div className={styles.popoverHeader}>
          <h4>Теги программы</h4>
          <button className={styles.closeButton} onClick={closePopover}>
            ✕
          </button>
        </div>

        <div className={styles.tagsScrollArea}>
          <div className={styles.tagsList}>
            {tags.map((tag) => renderTag(tag, getColorForTag(tag.name)))}
          </div>
        </div>

        {isAddingTag ? (
          <div className={styles.addTagForm}>
            <div className={styles.addTagTabs}>
              <button 
                className={`${styles.tabButton} ${addTagMode === 'new' ? styles.activeTab : ''}`}
                onClick={() => {
                  setAddTagMode('new');
                  setSelectedExistingTag(null);
                  setTagSearchFilter('');
                }}
              >
                Новый тег
              </button>
              <button 
                className={`${styles.tabButton} ${addTagMode === 'existing' ? styles.activeTab : ''}`}
                onClick={() => {
                  setAddTagMode('existing');
                  setNewTagName('');
                  setNewTagValue('');
                }}
              >
                Существующие
              </button>
            </div>

            {addTagMode === 'new' ? (
              <div className={styles.newTagInputs}>
                <input
                  type="text"
                  placeholder="Название тега"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className={styles.addInput}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTag();
                    else if (e.key === 'Escape') setIsAddingTag(false);
                  }}
                />
                <input
                  type="text"
                  placeholder="Значение (опционально)"
                  value={newTagValue}
                  onChange={(e) => setNewTagValue(e.target.value)}
                  className={styles.addInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTag();
                    else if (e.key === 'Escape') setIsAddingTag(false);
                  }}
                />
              </div>
            ) : (
              <div className={styles.existingTagsSearch}>
                <input
                  type="text"
                  placeholder="Поиск существующих тегов..."
                  value={tagSearchFilter}
                  onChange={(e) => setTagSearchFilter(e.target.value)}
                  className={styles.addInput}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setTagSearchFilter('');
                      setSelectedExistingTag(null);
                    }
                  }}
                />
                <div className={styles.existingTagsList}>
                  {isLoadingTags ? (
                    <div className={styles.loadingMessage}>Загрузка тегов...</div>
                  ) : availableTags.length === 0 ? (
                    <div className={styles.emptyMessage}>
                      {tagSearchFilter ? 'Тегов не найдено' : 'Нет доступных тегов'}
                    </div>
                  ) : (
                    availableTags.map((tag) => (
                      <div
                        key={tag.id}
                        className={`${styles.existingTagItem} ${selectedExistingTag?.id === tag.id ? styles.selected : ''}`}
                        onClick={() => setSelectedExistingTag(selectedExistingTag?.id === tag.id ? null : tag)}
                      >
                        <div className={styles.tagCheckbox}>
                          <input
                            type="checkbox"
                            checked={selectedExistingTag?.id === tag.id}
                            onChange={() => {}}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <span className={styles.tagLabel}>{tag.name}: {tag.value || '—'}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <label className={styles.familyCheckbox}>
              <input
                type="checkbox"
                checked={applyToFamily}
                onChange={(e) => setApplyToFamily(e.target.checked)}
              />
              <span className={styles.familyLabel}>Семейство</span>
            </label>

            <div className={styles.addTagButtons}>
              <button 
                className={styles.saveButton} 
                onClick={handleAddTag}
                disabled={addTagMode === 'new' ? !newTagName.trim() : !selectedExistingTag}
              >
                Добавить
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setIsAddingTag(false);
                  setNewTagName('');
                  setNewTagValue('');
                  setSelectedExistingTag(null);
                  setTagSearchFilter('');
                  setAddTagMode('new');
                  setApplyToFamily(false);
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <button
            className={styles.addButton}
            onClick={() => setIsAddingTag(true)}
          >
            + Добавить тег
          </button>
        )}
      </div>,
      document.body
    );
  };

  if (tags.length === 0) {
    return (
      <button
        className={styles.addButton}
        onClick={() => {
          setIsExpanded(true);
          setIsAddingTag(true);
        }}
      >
        + Добавить теги
      </button>
    );
  }

  return (
    <>
      <div className={styles.container} ref={cellRef}>
        <div className={styles.tagsPreview}>
          {displayTags.map((tag) => {
            const color = getColorForTag(tag.name);
            return (
              <div
                key={tag.id}
                className={styles.tagCompact}
                style={{
                  background: color.bg,
                  borderColor: color.border,
                  color: color.text,
                }}
                title={`${tag.name}: ${tag.value || '—'}`}
              >
                {tag.name}: {tag.value || '—'}
              </div>
            );
          })}
          <button
            className={styles.moreButton}
            onClick={() => setIsExpanded(true)}
          >
            {hasMore ? `+${tags.length - displayLimit}` : '+'}
          </button>
        </div>
      </div>
      {isExpanded && renderPopover()}
    </>
  );
}
