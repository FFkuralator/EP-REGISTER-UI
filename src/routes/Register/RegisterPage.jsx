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
import ModalPopup from '../../components/UI/Table/ModalPopup';
import searchIcon from '../../../public/search.png';

export default function RegisterPage() {
  const DISPLAY_TO_ENUM = {
    educational_form: {
      'Очно': 'OFFLINE',
      'Заочно': 'ONLINE',
      'Очно-заочная': 'BOTH',
    },
    language: {
      'Русский': 'RUSSIAN',
      'Английский': 'ENGLISH',
      'Частично на английском': 'PARTIALLY_ENGLISH',
    },
    network_form: {
      'Нет': 'NO',
      'ДВФУ - базовая': 'FEFU_BASIC',
      'ДВФУ - участник': 'FEFU_PARTICIPANT',
      'Неизвестен': 'UNKNOWN',
    },
    educational_standard_type: {
      'ФГОС ВО (3++)': 'ФГОС ВО (3++)',
      'ОС ВО ДВФУ': 'ОС ВО ДВФУ',
    },
  };

  const ALLOWED_SORT_FIELDS = new Set([
    'id',
    'title',
    'title_short',
    'degree_title',
    'school_title',
    'school_code',
    'partner_titles',
    'field_of_study_title',
    'field_of_study_code',
    'start_year',
    'end_year',
    'network_form',
    'educational_form',
    'educational_standard_type',
    'language',
    'language_hours',
    'standard_duration_months',
    'poa_accreditation_company',
    'poa_accreditation_expiry',
    'state_accreditation_expiry',
    'description',
  ]);

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
      const token = localStorage.getItem('auth_token');
      const authHeaders = token
        ? {
            Authorization: `Bearer ${token}`,
            auth: token,
          }
        : {};

      const result = await fetch(`${API_BASE_URL}/educational_program/active/get?lang=ru`, {
          headers: authHeaders
      });
      const rawData = await result.json();

      const seenRoots = new Set();
      const familiesList = [];

      for (const prog of rawData.result) {
        try {
          const resp = await fetch(`${API_BASE_URL}/educational_program/hierarchy?educational_program_id=${prog.id}&lang=ru`, {
            headers: authHeaders
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

  const handleResetFilters = () => {
    setFilter({});
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
  const [isExporting, setIsExporting] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [columnOrder, setColumnOrder] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);

  const refreshTags = React.useCallback(() => {
    getTags().then(res => setAllTags(res.result || [])).catch(() => {});
  }, []);

  const refreshAllData = React.useCallback(() => {
    fetchData();
    refreshTags();
  }, [fetchData, refreshTags]);

  useEffect(() => {
    refreshTags();
  }, [refreshTags]);

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

  const buildExportPayload = React.useCallback(() => {
    const include_tag_ids = Object.entries(tagFilter.tags)
      .filter(([, mode]) => mode === 'include')
      .map(([id]) => Number(id))
      .filter((id) => Number.isFinite(id));

    const exclude_tag_ids = Object.entries(tagFilter.tags)
      .filter(([, mode]) => mode === 'exclude')
      .map(([id]) => Number(id))
      .filter((id) => Number.isFinite(id));

    const filter_by = {};
    const pick = (key) => (filter[key] || []).filter(Boolean);

    const mapEnum = (field, values) => {
      const mapper = DISPLAY_TO_ENUM[field] || {};
      return values.map((value) => mapper[value] || value).filter(Boolean);
    };

    const numeric = (values) => values
      .map((v) => Number(v))
      .filter((v) => Number.isFinite(v));

    const directTextMap = {
      title: 'title_in',
      title_short: 'title_short_in',
      degree_title: 'degree_title_in',
      school_title: 'school_title_in',
      school_code: 'school_code_in',
      field_of_study_title: 'field_of_study_title_in',
      field_of_study_code: 'field_of_study_code_in',
      poa_accreditation_company: 'poa_accreditation_company_in',
      partner_titles: 'partner_title_in',
    };

    Object.entries(directTextMap).forEach(([source, target]) => {
      const values = pick(source);
      if (values.length > 0) {
        filter_by[target] = values;
      }
    });

    const startYears = numeric(pick('start_year'));
    if (startYears.length > 0) {
      filter_by.start_year_in = startYears;
    }

    const endYears = numeric(pick('end_year'));
    if (endYears.length > 0) {
      filter_by.end_year_in = endYears;
    }

    const langHours = numeric(pick('language_hours'));
    if (langHours.length > 0) {
      filter_by.language_hours_in = langHours;
    }

    const duration = numeric(pick('standard_duration_months'));
    if (duration.length > 0) {
      filter_by.standard_duration_months_in = duration;
    }

    const educationalFormValues = mapEnum('educational_form', pick('educational_form'));
    if (educationalFormValues.length > 0) {
      filter_by.educational_form_in = educationalFormValues;
    }

    const languageValues = mapEnum('language', pick('language'));
    if (languageValues.length > 0) {
      filter_by.language_in = languageValues;
    }

    const networkFormValues = mapEnum('network_form', pick('network_form'));
    if (networkFormValues.length > 0) {
      filter_by.network_form_in = networkFormValues;
    }

    const standardValues = mapEnum(
      'educational_standard_type',
      pick('educational_standard_type')
    );
    if (standardValues.length > 0) {
      filter_by.educational_standard_type_in = standardValues;
    }

    if (debouncedSearch.trim()) {
      filter_by.search = debouncedSearch.trim();
    }

    const sort_by = ALLOWED_SORT_FIELDS.has(sort.by) ? sort.by : 'title';
    const sort_order = sort.order === 'desc' ? 'desc' : 'asc';

    return {
      base_filter: {
        include_tag_ids,
        exclude_tag_ids,
        include_logic: tagFilter.mode === 'or' ? 'OR' : 'AND',
        exclude_logic: 'OR',
      },
      filter_by,
      sort_by,
      sort_order,
    };
  }, [filter, tagFilter, sort, debouncedSearch]);

  const handleExport = React.useCallback(async () => {
    if (isExporting) {
      return;
    }

    try {
      setIsExporting(true);
      const token = localStorage.getItem('auth_token');
      const payload = buildExportPayload();

      const response = await fetch(
        `${API_BASE_URL}/educational_program/active/export/excel?lang=ru`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                  auth: token,
                }
              : {}),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Не удалось выполнить экспорт');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'educational_program_active.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка экспорта:', error);
    } finally {
      setIsExporting(false);
    }
  }, [buildExportPayload, isExporting]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ModalPopup
          onFilter={handleFilter}
          filterState={filter}
          columns={columnsWithFilters}
          onResetFilters={handleResetFilters}
          allTags={allTags}
          tagFilter={tagFilter}
          onTagFilterChange={setTagFilter}
          onTagsRefresh={refreshTags}
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по полям"
          variant="registerPage"
          icon={<img src={searchIcon} alt="Search" width={16} height={16} />}
        />
        <Link
          className={styles.createButton}
          to={`/program/new/add`}
        >
          Создать ОП
        </Link>
        <button
          type="button"
          className={styles.exportButton}
          aria-label="Экспорт"
          onClick={handleExport}
          disabled={isExporting}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 3v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 9l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 21H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{isExporting ? 'Экспорт...' : 'Экспорт'}</span>
        </button>
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
            menuContent={[
              {
                label: 'Открыть',
                href: (row) => `/program/${row.id}`,
              },
              {
                label: 'Редактировать',
                href: (row) => `/program/${row.id}/edit`,
              },
              {
                label: 'Создать новую ОП на основе',
                href: (row) => `/program/${row.id}/add`,
              },
            ]}
            pagination={true}
            paginationData={paginationData}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
            onTagsChange={refreshData}
          />
      </div>
    </div>
  );
}
