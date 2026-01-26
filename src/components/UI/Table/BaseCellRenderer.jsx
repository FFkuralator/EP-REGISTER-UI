import React from 'react';
import AllTagsCellRenderer from './AllTagsCellRenderer';
import TagColumnCell from './TagColumnCell';

export default function BaseCellRenderer({ type = 'text', value, row, onTagsChange, tagName }) {
  if (type === 'allTags') {
    return (
      <AllTagsCellRenderer 
        value={value} 
        row={row}
        onTagsChange={onTagsChange}
      />
    );
  }

  if (type === 'tagColumn') {
    return (
      <TagColumnCell
        tagName={tagName}
        row={row}
        onRefresh={onTagsChange}
      />
    );
  }

  if (value == null) {
    return <span title="">—</span>;
  }

  const strValue = String(value);
  const isLongText = strValue.length > 40;

  return (
    <span title={isLongText ? strValue : ''}>
      {isLongText ? `${strValue.substring(0, 20)}...` : strValue}
    </span>
  );
}
