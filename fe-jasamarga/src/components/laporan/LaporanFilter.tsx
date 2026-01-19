'use client';

import { useState, useEffect } from 'react';
import { Group, Select, Button } from '@mantine/core';
import { IconFilter, IconX } from '@tabler/icons-react';
import { SearchInput } from '@/components/common/SearchInput';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface FilterValues {
  search: string;
  gerbang: string;
  shift: string;
}

interface LaporanFilterProps {
  onFilterChange: (filters: FilterValues) => void;
}

export function LaporanFilter({ onFilterChange }: LaporanFilterProps) {
  const [search, setSearch] = useState('');
  const [gerbang, setGerbang] = useState<string | null>(null);
  const [shift, setShift] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const gerbangOptions = [
    { value: '1', label: 'Gerbang Tol Bekasi Barat' },
    { value: '2', label: 'Gerbang Tol Cikarang' },
    { value: '3', label: 'Gerbang Tol Karawang' },
  ];

  const shiftOptions = [
    { value: '1', label: 'Shift 1 (00:00 - 08:00)' },
    { value: '2', label: 'Shift 2 (08:00 - 16:00)' },
    { value: '3', label: 'Shift 3 (16:00 - 24:00)' },
  ];

  const applyFilter = () => {
    onFilterChange({
      search: debouncedSearch,
      gerbang: gerbang ?? '',
      shift: shift ?? '',
    });
  };

  const handleReset = () => {
    setSearch('');
    setGerbang(null);
    setShift(null);

    onFilterChange({
      search: '',
      gerbang: '',
      shift: '',
    });
  };

  useEffect(() => {
    applyFilter();
  }, [debouncedSearch, gerbang, shift]);

  return (
    <Group>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Cari laporan..."
        style={{ flex: 1 }}
      />

      <Select
        placeholder="Filter Gerbang"
        data={gerbangOptions}
        value={gerbang}
        onChange={setGerbang}
        clearable
        style={{ width: 200 }}
      />

      <Select
        placeholder="Filter Shift"
        data={shiftOptions}
        value={shift}
        onChange={setShift}
        clearable
        style={{ width: 200 }}
      />

      <Button
        leftSection={<IconFilter size={16} />}
        onClick={applyFilter}
        variant="light"
      >
        Filter
      </Button>

      <Button
        leftSection={<IconX size={16} />}
        onClick={handleReset}
        variant="outline"
      >
        Reset
      </Button>
    </Group>
  );
}
