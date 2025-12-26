import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router'
import Table from '../../components/UI/Table/Table';
import Input from '../../components/UI/Input/Input';
import useDebounce from '../../hooks/useDebounce';
import getProgramLabel from '../../utils/getProgramLabel';
import getFormattedDate from '../../utils/getFormattedDate';
import PROGRAM_COLUMNS_CONFIG from '../../config/PROGRAM_COLUMNS_CONFIG';
import { API_BASE_URL } from '../../config/api';
import styles from './RegisterPage.module.css'
import ModalPopup from '../../components/UI/Table/ModalPopup';
import filterIcon from '../../../public/filterIcon.png';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(`${API_BASE_URL}/educational_program/active/get?lang=ru`, {
            headers: {
              "auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiJdLCJpc3MiOiJkZXYiLCJpYXQiOjE3NjMwMDY0MDB9.7Ky0pApLsyaV5ToYsrBydTB-4RtuS3RjNdI_anHZD_Y"
            }
        });
        const rawData = await result.json();

        const formatted = formatProgramsData(rawData.result, dateKeys);

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
    };
    fetchData();
  }, []);

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

  const displayColumns = React.useMemo(() => {
    return [
      { key: '__hierarchy', title: '' },
      ...columnsWithFilters
    ];
  }, [columnsWithFilters]);

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
  }, [rowData, debouncedSearch, filter, sort]);

  const tableData = React.useMemo(() => {
    const out = [];
    for (const f of families) {
      out.push({ ...f.latest, family_id: f.familyId, _is_latest: true });
      if (expandedFamilies.has(f.familyId)) {
        const others = f.members.filter(m => m.id !== f.latest.id).map(m => ({ ...m, family_id: f.familyId, _is_child: true }));
        out.push(...others);
      }
    }
    const processedIds = new Set(processedData.map(r => r.id));
    return out.filter(r => processedIds.has(r.id) || r._is_child);
  }, [families, expandedFamilies, processedData]);

  const toggleFamily = (familyId) => {
    setExpandedFamilies(prev => {
      const copy = new Set(prev);
      if (copy.has(familyId)) copy.delete(familyId);
      else copy.add(familyId);
      return copy;
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ModalPopup
          onFilter={handleFilter}
          filterState={filter}
          columns={columnsWithFilters}
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по полям"
          variant="registerPage"
        />
        <Link
          className={styles.createButton}
          to={`/program/new/add`}
        >
          Создать ОП
        </Link>
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
      />
    </div>
  </div>
  );
}
