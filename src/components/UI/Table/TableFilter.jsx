import React from 'react'
import Filter from '../Filter/Filter'

export default function TableFilter({ column, onFilter, filterState, xy }) {
  const handleFilter = (value) => {
    onFilter(column.key, value);
  }
  
  return (
    <Filter 
      options={column.filterOptions}
      onFilter={handleFilter}
      filterState={filterState[column.key]}
      xy={xy}
    />
  )
}
