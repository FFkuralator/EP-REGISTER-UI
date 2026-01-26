import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router'
import Table from '../../components/UI/Table/Table';
import Input from '../../components/UI/Input/Input';
import useDebounce from '../../hooks/useDebounce';
import getProgramLabel from '../../utils/getProgramLabel';
import getFormattedDate from '../../utils/getFormattedDate';
import PROGRAM_COLUMNS_CONFIG from '../../config/PROGRAM_COLUMNS_CONFIG';
import { API_BASE_URL } from '../../api/api';
import { getTags } from '../../api/tag';
import styles from './RegisterPage.module.css'
import SidebarFilter from '../../components/UI/Table/SidebarFilter';
import ColumnSettings from '../../components/UI/Table/ColumnSettings';

export default function RegisterPage() {
  const dateKeys = [
    "poa_accreditation_expiry",
    "state_accreditation_expiry"
  ];

  const monthsToYears = (months) => {
    if (!months) return null;
    return +((months / 12).toFixed(1));
  };

  const formatProgramsData = (array, dateKeys) => {
    return (array || []).map(item => {
      const formattedItem = { ...item };

      if (formattedItem.standard_duration_months !== undefined) {
        formattedItem.standard_duration_months = monthsToYears(
          formattedItem.standard_duration_months
        );
      }

      Object.entries(formattedItem).forEach(([key, value]) => {
        formattedItem[key] = getProgramLabel(value, 'value');
      });

      dateKeys.forEach(key => {
        if (formattedItem[key]) {
          formattedItem[key] = getFormattedDate(formattedItem[key]);
        }
      });

      return formattedItem;
    });
  };

  const [rowData, setRowData] = useState([]);
  const [dataCount, setDataCount] = useState();
  const [families, setFamilies] = useState([]);
  const [expandedFamilies, setExpandedFamilies] = useState(new Set());

  const fetchData = React.useCallback(async () => {
    try {
      const result = await fetch(`${API_BASE_URL}/educational_program/active/get?lang=ru`, {
          headers: {
            "auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiJdLCJpc3MiOiJkZXYiLCJpYXQiOjE3NjMwMDY0MDB9.7Ky0pApLsyaV5ToYsrBydTB-4RtuS3RjNdI_anHZD_Y"
          }
      });
      const rawData = await result.json();

      const seenRoots = new Set();
      const familiesList = [];

      for (const prog of rawData.result) {
        try {
          const resp = await fetch(`${API_BASE_URL}/educational_program/hierarchy?educational_program_id=${prog.id}&lang=ru`, {
            headers: {
              "auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiJdLCJpc3MiOiJkZXYiLCJpYXQiOjE3NjMwMDY0MDB9.7Ky0pApLsyaV5ToYsrBydTB-4RtuS3RjNdI_anHZD_Y"
            }
          });
          if (!resp.ok) continue;
          const hRes = await resp.json();
          if (!hRes || !Array.isArray(hRes.result) || hRes.result.length === 0) continue;
          const root = hRes.result[0];
          const rootId = root.id;
          if (seenRoots.has(rootId)) continue;

          const members = [];
          (function collect(node) {
            if (!node) return;
            members.push(node);
            if (Array.isArray(node.children)) node.children.forEach(collect);
          })(root);

          let latest = members[0];
          for (const m of members) {
            const mYear = m.start_year ?? -Infinity;
            const lYear = latest.start_year ?? -Infinity;
            if (mYear > lYear) latest = m;
            else if (mYear === lYear && m.id > latest.id) latest = m;
          }

          const formattedMembers = formatProgramsData(members, dateKeys);
          const formattedLatest = formatProgramsData([latest], dateKeys)[0];
          formattedLatest._has_multiple = (formattedMembers.length > 1);

          familiesList.push({ familyId: rootId, latest: formattedLatest, members: formattedMembers });
          seenRoots.add(rootId);
        } catch (error) {
          console.error('Ошибка загрузки иерархии:', error);
        }
      }

      setFamilies(familiesList);
      setRowData(familiesList.map(f => f.latest));
      setDataCount(familiesList.length);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [sort, setSort] = useState({
    by: null,
    order: 'asc',
  });

  const handleSort = (columnKey) => {
    setSort((prev) =>
      prev.by === columnKey
        ? { ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }
        : { by: columnKey, order: 'asc' }
    );
  };

  const [filter, setFilter] = useState({});
  const [tagFilter, setTagFilter] = useState({ tags: {}, mode: 'and' });
  
  const handleFilter = (columnKey, value) => {
    setFilter((prev) => {
      const existing = prev[columnKey] || [];
      const exists = existing.includes(value);
      const updated = exists ? existing.filter((v) => v !== value) : [...existing, value];
      return { ...prev, [columnKey]: updated };
    });
  };

  const [paginationData, setPaginationData] = useState({
    pageSize: 20,
    startItem: dataCount > 1 ? 1 : 0,
    endItem: 0,
    totalItems: 0,
    currentPage: 1,
    totalPages: 0,
  });

  useEffect(() => {
    if (dataCount !== undefined) {
      setPaginationData({
        pageSize: 20,
        startItem: 1,
        endItem: dataCount <= 20 ? dataCount : 20,
        totalItems: dataCount,
        currentPage: 1,
        totalPages: Math.ceil(dataCount / 20),
      });
    }
  }, [dataCount]);

  const handlePageChange = (direction) => {
    setPaginationData((prev) => {
      const newPage = prev.currentPage + direction;
      const startItem = (newPage - 1) * prev.pageSize + 1;
      const endItem = Math.min(newPage * prev.pageSize, prev.totalItems);
      return {
        ...prev,
        currentPage: newPage,
        startItem,
        endItem,
      };
    });
  };

  const handlePageSizeChange = (value) => {
    setPaginationData({
      pageSize: value,
      startItem: 1,
      endItem: dataCount <= value ? dataCount : value,
      totalItems: dataCount,
      currentPage: 1,
      totalPages: Math.ceil(dataCount / value),
    })
  };

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 800);
  const [allTags, setAllTags] = useState([]);
  const [columnOrder, setColumnOrder] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);

  useEffect(() => {
    getTags().then(res => setAllTags(res.result || [])).catch(() => {});
  }, []);

  const uniqueTagNames = React.useMemo(() => {
    const names = new Set();
    allTags.forEach(tag => names.add(tag.name));
    return [...names];
  }, [allTags]);

  const tagColumns = React.useMemo(() => {
    return uniqueTagNames.map(name => ({
      key: `tag_${name}`,
      title: name,
      tagName: name,
      cellType: 'tagColumn',
      isTagColumn: true,
      sortable: false
    }));
  }, [uniqueTagNames]);

  const columnsWithFilters = React.useMemo(() => {
    return PROGRAM_COLUMNS_CONFIG.map(column => {
      if (column.key === 'field_of_study_title') {
        const uniqueValues = [...new Set(rowData.map(row => row[column.key]))].filter(Boolean);
        return {
          ...column,
          filterOptions: uniqueValues.map(value => ({
            key: value,
            value: value,
            label: value
          }))
        };
      }
      if (column.key === 'school_title') {
        const uniqueValues = [...new Set(rowData.map(row => row[column.key]))].filter(Boolean);
        return {
          ...column,
          filterOptions: uniqueValues.map(value => ({
            key: value,
            value: value,
            label: value
          }))
        };
      }
      return column;
    });
  }, [rowData]);

  const allColumns = React.useMemo(() => {
    return [...columnsWithFilters, ...tagColumns];
  }, [columnsWithFilters, tagColumns]);

  useEffect(() => {
    if (allColumns.length > 0 && columnOrder.length === 0) {
      setColumnOrder(allColumns.map(c => c.key));
      setVisibleColumns(columnsWithFilters.map(c => c.key));
    }
  }, [allColumns, columnsWithFilters, columnOrder.length]);

  const orderedColumns = React.useMemo(() => {
    const colMap = Object.fromEntries(allColumns.map(c => [c.key, c]));
    return columnOrder.filter(k => colMap[k]).map(k => colMap[k]);
  }, [allColumns, columnOrder]);

  const displayColumns = React.useMemo(() => {
    const visible = orderedColumns.filter(c => visibleColumns.includes(c.key));
    return [{ key: '__hierarchy', title: '' }, ...visible];
  }, [orderedColumns, visibleColumns]);

  const handleColumnOrderChange = (newOrder) => {
    setColumnOrder(newOrder.map(c => c.key));
  };

  const matchesTagFilter = (row) => {
    const includes = Object.entries(tagFilter.tags).filter(([, m]) => m === 'include').map(([id]) => parseInt(id));
    const excludes = Object.entries(tagFilter.tags).filter(([, m]) => m === 'exclude').map(([id]) => parseInt(id));
    
    const rowTagIds = row.tags ? Object.values(row.tags).map(t => t.id) : [];
    
    if (excludes.some(id => rowTagIds.includes(id))) return false;
    if (includes.length === 0) return true;
    
    return tagFilter.mode === 'and'
      ? includes.every(id => rowTagIds.includes(id))
      : includes.some(id => rowTagIds.includes(id));
  };

  const processedData = React.useMemo(() => {
    let result = [...rowData];

    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    if (Object.keys(filter).length > 0) {
      result = result.filter((row) => {
        return Object.entries(filter).every(([columnKey, values]) => {
          if (!values || values.length === 0) return true;
          return values.includes(String(row[columnKey]));
        });
      });
    }

    if (Object.keys(tagFilter.tags).length > 0) {
      result = result.filter(matchesTagFilter);
    }

    if (sort.by) {
      result.sort((a, b) => {
        const aVal = a[sort.by];
        const bVal = b[sort.by];

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return sort.order === 'asc' ? 1 : -1;
        if (bVal == null) return sort.order === 'asc' ? -1 : 1;

        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sort.order === 'asc' ? aNum - bNum : bNum - aNum;
        }

        const aStr = String(aVal).localeCompare(String(bVal));
        return sort.order === 'asc' ? aStr : -aStr;
      });
    }

    return result;
  }, [rowData, debouncedSearch, filter, tagFilter, sort]);

  const hasActiveFilters = debouncedSearch.trim() || Object.keys(filter).length > 0 || Object.keys(tagFilter.tags).length > 0;

  const matchesAllFilters = (row) => {
    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase();
      if (!Object.values(row).some(v => String(v).toLowerCase().includes(searchLower))) return false;
    }
    if (Object.keys(filter).length > 0) {
      const matches = Object.entries(filter).every(([columnKey, values]) => {
        if (!values || values.length === 0) return true;
        return values.includes(String(row[columnKey]));
      });
      if (!matches) return false;
    }
    if (Object.keys(tagFilter.tags).length > 0 && !matchesTagFilter(row)) return false;
    return true;
  };

  const tableData = React.useMemo(() => {
    const out = [];
    const processedIds = new Set(processedData.map(r => r.id));
    
    for (const f of families) {
      const latestMatches = processedIds.has(f.latest.id);
      
      if (latestMatches) {
        out.push({ ...f.latest, family_id: f.familyId, _is_latest: true });
        if (expandedFamilies.has(f.familyId)) {
          const others = f.members
            .filter(m => m.id !== f.latest.id)
            .map(m => ({ ...m, family_id: f.familyId, _is_child: true }));
          out.push(...others);
        }
      } else if (hasActiveFilters) {
        const matchingMembers = f.members.filter(m => matchesAllFilters(m));
        if (matchingMembers.length > 0) {
          const bestMatch = matchingMembers.reduce((best, m) => {
            const mYear = m.start_year ?? -Infinity;
            const bYear = best.start_year ?? -Infinity;
            return mYear > bYear || (mYear === bYear && m.id > best.id) ? m : best;
          }, matchingMembers[0]);
          
          out.push({ 
            ...bestMatch, 
            family_id: f.familyId, 
            _is_latest: true, 
            _is_filtered_match: true,
            _has_multiple: matchingMembers.length > 1 || f.members.length > 1
          });
          
          if (expandedFamilies.has(f.familyId)) {
            const others = f.members
              .filter(m => m.id !== bestMatch.id)
              .map(m => ({ 
                ...m, 
                family_id: f.familyId, 
                _is_child: true,
                _matches_filter: matchesAllFilters(m)
              }));
            out.push(...others);
          }
        }
      }
    }
    
    return out;
  }, [families, expandedFamilies, processedData, hasActiveFilters, debouncedSearch, filter, tagFilter]);

  const toggleFamily = (familyId) => {
    setExpandedFamilies(prev => {
      const copy = new Set(prev);
      if (copy.has(familyId)) copy.delete(familyId);
      else copy.add(familyId);
      return copy;
    });
  }

  const refreshData = () => {
    fetchData();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по полям"
        />
        <Link
          className={styles.createButton}
          to={`/program/new/add`}
        >
          Создать ОП
        </Link>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.sidebarContainer}>
          <ColumnSettings
            columns={orderedColumns}
            visibleColumns={visibleColumns}
            onColumnsChange={setVisibleColumns}
            onOrderChange={handleColumnOrderChange}
          />
          <SidebarFilter
            onFilter={handleFilter}
            filterState={filter}
            columns={columnsWithFilters}
            tagFilter={tagFilter}
            onTagFilterChange={setTagFilter}
          />
        </div>

        <div className={styles.contentArea}>
          <Table
            columns={displayColumns}
            data={tableData}
            onToggleHierarchy={toggleFamily}
            expandedFamilies={expandedFamilies}
            onSort={handleSort}
            sortState={sort}
            onFilter={handleFilter}
            filterState={filter}
            pagination={true}
            paginationData={paginationData}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
            onTagsChange={refreshData}
          />
        </div>
      </div>
    </div>
  );
}
