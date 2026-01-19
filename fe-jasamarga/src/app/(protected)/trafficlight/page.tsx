'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Paper,
  Title,
  Group,
  Button,
  Text,
  LoadingOverlay,
  Divider,
  Box,
  TextInput,
} from '@mantine/core';
import { DatePickerInput, DateValue } from '@mantine/dates';
import {
  IconDownload,
  IconRefresh,
  IconCalendar,
  IconSearch,
} from '@tabler/icons-react';
import { format } from 'date-fns';

import Layout from '@/components/Layout';
import { lalinsApi } from '@/lib/api/laporan';
import { LaporanTable } from '@/components/laporan/LaporanTable';
import { PaymentSummary } from '@/components/laporan/PaymentSummary';
import { useExport } from '@/lib/hooks/useExport';
import { notifications } from '@mantine/notifications';
import { LalinRow } from '@/lib/types/laporan';

const LIMIT = 10;

export default function LaporanLaluLintasPage() {
  const defaultDate = new Date(2023, 10, 2)
  const [date, setDate] = useState<DateValue>(defaultDate);
  const [rawData, setRawData] = useState<LalinRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const { exportToExcel } = useExport();

  /* ================= FETCH ALL DATA ================= */
  const fetchData = async () => {
    if (!date) return;

    setLoading(true);
    try {
      const tanggal = format(date, 'yyyy-MM-dd');

      // 🔥 ambil SEMUA data (tanpa page & limit)
      const response = await lalinsApi.getAll({ tanggal });

      if (response.status) {
        setRawData(response.data.rows.rows);
        setPage(1);
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Gagal memuat data',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */
 const filteredData = useMemo(() => {
    if (!search) return rawData;

    const keyword = search.toLowerCase();

    return rawData.filter((row) => {
      const searchableText = `
        gerbang ${row.IdGerbang}
        gardu ${row.IdGardu}
        gol ${row.Golongan}
        golongan ${row.Golongan}
        shift ${row.Shift}
      `.toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [search, rawData]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * LIMIT;
    return filteredData.slice(start, start + LIMIT);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / LIMIT);

  useEffect(() => {
    fetchData();
  }, [date]);

  /* ================= EXPORT ================= */
  // const handleExport = async () => {
  //   try {
  //     if (!date) return;
  //     const tanggal = format(date, 'yyyy-MM-dd');

  //     await exportToExcel(
  //       { tanggal },
  //       `laporan-lalu-lintas-${tanggal}.xlsx`
  //     );
  //   } catch (error: any) {
  //     notifications.show({
  //       title: 'Error',
  //       message: error.message || 'Gagal export data',
  //       color: 'red',
  //     });
  //   }
  // };

  return (
    <Layout>
      <Box pos="relative">
        <LoadingOverlay visible={loading} />

        {/* HEADER */}
        <Group justify="space-between" mb="lg">
          <Title order={2}>Laporan Lalu Lintas Harian</Title>

          <Group>
            <DatePickerInput
              value={date}
              onChange={(val) => val && setDate(val)}
              leftSection={<IconCalendar size={16} />}
              placeholder="Pilih tanggal"
              clearable={false}
            />
            <Button
              leftSection={<IconDownload size={16} />}
              variant="light"
              disabled
            >
              Export Excel
            </Button>

            <Button
              leftSection={<IconRefresh size={16} />}
              onClick={fetchData}
            >
              Refresh
            </Button>
          </Group>
        </Group>

        {/* SEARCH */}
        <Paper p="md" withBorder mb="lg">
          <TextInput
            placeholder="Cari Gerbang / Gardu / Golongan / Shift"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              setPage(1);
            }}
          />
        </Paper>

        <PaymentSummary data={filteredData} />

        <Paper withBorder mt="lg">
          <LaporanTable
            data={paginatedData}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            loading={loading}
          />
        </Paper>

        <Divider my="lg" />

        <Text size="sm" c="dimmed">
          Menampilkan {filteredData.length} data
        </Text>
      </Box>
    </Layout>
  );
}
