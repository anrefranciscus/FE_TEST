'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Paper,
  Title,
  Group,
  Button,
  LoadingOverlay,
  Box,
  Text,
} from '@mantine/core';
import { DatePickerInput, DateValue } from '@mantine/dates';
import {
  IconCalendar,
  IconRefresh,
  IconDownload,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { notifications } from '@mantine/notifications';

import Layout from '@/components/Layout';
import { LaporanTable } from '@/components/laporan/LaporanTable';
import { lalinsApi } from '@/lib/api/laporan';
import { LalinRow, LalinApiResponse } from '@/lib/types/laporan';

const PAGE_SIZE = 10;

export default function LaporanLaluLintasPage() {
  const defaultDate = new Date(2023, 10, 2)
  const [date, setDate] = useState<DateValue>(defaultDate);
  const [allData, setAllData] = useState<LalinRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const fetchData = useCallback(async () => {
    if (!date) return;

    setLoading(true);

    try {
      const res: LalinApiResponse =
        await lalinsApi.getByDate(
          format(date, 'yyyy-MM-dd')
        );

      if (!res.status) {
        throw new Error(res.message);
      }

      setAllData(res.data.rows.rows);
      setPage(1); // reset page saat ganti tanggal
    } catch (error: any) {
      notifications.show({
        title: 'Gagal',
        message:
          error?.message ||
          'Gagal memuat data laporan',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [date]);

  // ===============================
  // EFFECT
  // ===============================
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ===============================
  // CLIENT SIDE PAGINATION
  // ===============================
  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allData.slice(start, start + PAGE_SIZE);
  }, [allData, page]);

  const totalPages = Math.ceil(allData.length / PAGE_SIZE);

  // ===============================
  // RENDER
  // ===============================
  return (
    <Layout>
      <Box pos="relative">
        <LoadingOverlay visible={loading} />

        {/* HEADER */}
        <Group justify="space-between" mb="lg">
          <Title order={2}>
            Laporan Lalu Lintas Harian
          </Title>

          <Group>
            <DatePickerInput
              value={date}
              onChange={setDate}
              leftSection={<IconCalendar size={16} />}
              clearable={false}
            />

            <Button
              leftSection={<IconRefresh size={16} />}
              onClick={fetchData}
              loading={loading}
            >
              Refresh
            </Button>

            <Button
              leftSection={<IconDownload size={16} />}
              variant="light"
              disabled
            >
              Export
            </Button>
          </Group>
        </Group>

        {/* TABLE */}
        <Paper withBorder radius="md">
          <LaporanTable
            data={paginatedData}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            loading={loading}
          />
        </Paper>

        {/* FOOTER */}
        <Text size="sm" c="dimmed" mt="sm">
          Menampilkan {paginatedData.length} dari{' '}
          {allData.length} data
        </Text>
      </Box>
    </Layout>
  );
}
