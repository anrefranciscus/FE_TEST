'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  Title,
  Group,
  Button,
  Text,
  LoadingOverlay,
  Divider,
  Box,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconDownload, IconRefresh, IconFilter } from '@tabler/icons-react';
import { format } from 'date-fns';
import { laporanAPI } from '@/lib/api/laporan';
import { LaporanFilter } from '@/components/laporan/LaporanFilter';
import { LaporanTable } from '@/components/laporan/LaporanTable';
import { PaymentSummary } from '@/components/laporan/PaymentSummary';
import { useExport } from '@/lib/hooks/useExport';
import { notifications } from '@mantine/notifications';

export default function LaporanLaluLintasPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    search: '',
    gerbang: '',
    shift: '',
  });

  const { exportToExcel } = useExport();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const params = {
        tanggal: formattedDate,
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.gerbang && { gerbang: parseInt(filters.gerbang) }),
        ...(filters.shift && { shift: parseInt(filters.shift) }),
      };

      const response = await laporanAPI.getAll(params);

      if (response.status) {
        setData(response.data.rows.rows);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.total_pages,
          totalItems: response.data.count,
        }));
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Gagal memuat data laporan',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [date, pagination.page, pagination.limit, filters]);

  const handleExport = async () => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const params = {
        tanggal: formattedDate,
        ...filters,
      };

      await exportToExcel(
        params,
        `laporan-lalu-lintas-${formattedDate}.xlsx`
      );
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Gagal mengekspor data',
        color: 'red',
      });
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Layout>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />

        <Group position="apart" mb="lg">
          <Title order={2}>Laporan Lalu Lintas Harian</Title>
          <Group>
            <DatePicker
              value={date}
              onChange={(val) => val && setDate(val)}
              icon={<IconFilter size={16} />}
              placeholder="Pilih tanggal"
              clearable={false}
            />
            <Button
              leftIcon={<IconDownload size={16} />}
              onClick={handleExport}
              loading={loading}
              variant="light"
            >
              Export Excel
            </Button>
            <Button
              leftIcon={<IconRefresh size={16} />}
              onClick={fetchData}
              loading={loading}
            >
              Refresh
            </Button>
          </Group>
        </Group>

        <Paper p="md" withBorder radius="md" mb="lg">
          <LaporanFilter onFilterChange={handleFilterChange} />
        </Paper>

        <PaymentSummary data={data} />

        <Box mt="lg">
          <Paper withBorder radius="md">
            <LaporanTable
              data={data}
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </Paper>
        </Box>

        <Divider my="lg" />

        <Text size="sm" color="dimmed">
          Menampilkan {data.length} dari {pagination.totalItems} data
        </Text>
      </div>
    </Layout>
  );
}
