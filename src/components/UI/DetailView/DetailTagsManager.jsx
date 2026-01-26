import React, { useState, useEffect } from 'react';
import styles from './DetailTagsManager.module.css';
import { getTags, addTag, addTagsToProgram, removeTagsFromProgram, addTagsToFamily, removeTagsFromFamily } from '../../../api/tag';
import { useParams } from 'react-router';

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

export default function DetailTagsManager({ value, onRefresh }) {
  const { programID } = useParams();
  const [newTagName, setNewTagName] = useState('');
  const [newTagValue, setNewTagValue] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [applyToFamily, setApplyToFamily] = useState(false);
  const [existingTags, setExistingTags] = useState([]);
  const [selectedExistingTag, setSelectedExistingTag] = useState(null);
  const [tagSearchFilter, setTagSearchFilter] = useState('');
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [addTagMode, setAddTagMode] = useState('new');

  const tags = value && typeof value === 'object' 
    ? Object.entries(value).map(([name, tagData]) => ({
        name,
        id: tagData.id,
        value: tagData.value,
        type: tagData.type
      }))
    : [];

  useEffect(() => {
    if (isAddingTag && existingTags.length === 0 && !isLoadingTags) {
      setIsLoadingTags(true);
      getTags().then(response => {
        setExistingTags(response.result);
        setIsLoadingTags(false);
      }).catch(() => setIsLoadingTags(false));
    }
  }, [isAddingTag, existingTags.length, isLoadingTags]);

  const closeAddForm = () => {
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
      await removeFunc(programID, [tag.id]);
      onRefresh?.();
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
        const type = newTagValue.trim() 
          ? (newTagValue === 'true' || newTagValue === 'false' ? 'BOOLEAN' : /^\d+$/.test(newTagValue) ? 'NUMBER' : 'TEXT')
          : 'SIMPLE';
        
        const response = await addTag({
          name: newTagName.trim(),
          number_value: type === 'NUMBER' ? parseInt(newTagValue, 10) : null,
          text_value: type === 'TEXT' ? newTagValue.trim() : null,
          boolean_value: type === 'BOOLEAN' ? (newTagValue.trim() === 'true') : null,
          type,
        });
        tagId = response?.result?.id || response?.id;
      }

      if (tagId) {
        const addFunc = applyToFamily ? addTagsToFamily : addTagsToProgram;
        await addFunc(programID, [tagId]);
        onRefresh?.();
        closeAddForm();
      }
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const renderTag = (tag) => {
    const color = getColorForTag(tag.name);
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

  const filteredExistingTags = existingTags.filter(tag => {
    const searchLower = tagSearchFilter.toLowerCase();
    const tagDisplay = `${tag.name}: ${tag.value || '—'}`.toLowerCase();
    return tagDisplay.includes(searchLower);
  });

  const alreadyAddedTagIds = new Set(tags.map(t => t.id));
  const availableTags = filteredExistingTags.filter(tag => !alreadyAddedTagIds.has(tag.id));

  return (
    <div className={styles.tagsManager}>
      <div className={styles.tagsContainer}>
        {tags.length > 0 && (
          <div className={styles.tagsList}>
            {tags.map(tag => renderTag(tag))}
          </div>
        )}
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
                  else if (e.key === 'Escape') closeAddForm();
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
                  else if (e.key === 'Escape') closeAddForm();
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
              onClick={closeAddForm}
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
    </div>
  );
}
