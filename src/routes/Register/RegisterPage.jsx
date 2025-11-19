import React from 'react';
import { useState, useEffect } from 'react';
import Table from '../../components/UI/Table/Table';
import Input from '../../components/UI/Input/Input';
import useDebounce from '../../hooks/useDebounce';
import getProgramLabel from '../../utils/getProgramLabel';
import getFormattedDate from '../../utils/getFormattedDate';
import PROGRAM_COLUMNS_CONFIG from '../../config/PROGRAM_COLUMNS_CONFIG';

export default function RegisterPage() {
  const dateKeys = [
  "poa_accreditation_expiry",
  "state_accreditation_expiry"
];

  const monthsToYears = (months) => {
    if (!months) return null;
    return +( (months / 12).toFixed(1) );
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch('http://localhost:8042/dev/api/v1/educational_program/active/get?lang=ru', {
            headers: {
              "auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiJdLCJpc3MiOiJkZXYiLCJpYXQiOjE3NjMwMDY0MDB9.7Ky0pApLsyaV5ToYsrBydTB-4RtuS3RjNdI_anHZD_Y"
            }
        });
        const rawData = await result.json();

        const formatted = formatProgramsData(rawData.result, dateKeys);

        setRowData(formatted);
        setDataCount(rawData.count);
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

  return (
    <div>
      <div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по полям"
        />
      </div>

      <Table
        columns={PROGRAM_COLUMNS_CONFIG}
        data={rowData}
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
        ]}
        pagination={true}
        paginationData={paginationData}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
