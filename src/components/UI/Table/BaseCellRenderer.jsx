import React from 'react';

export default function BaseCellRenderer({ value }) {
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
