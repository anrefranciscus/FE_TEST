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
  IconRefresh,
  IconCalendar,
  IconSearch,
} from '@tabler/icons-react';
import { format } from 'date-fns';

import Layout from '@/components/Layout';
import { lalinsApi } from '@/lib/api/laporan';
import { LaporanTable } from '@/components/laporan/LaporanTable';
import { notifications } from '@mantine/notifications';
import { LalinRow } from '@/lib/types/laporan';

const LIMIT = 10;

type TotalMode =
  | 'TUNAI'
  | 'ETOLL'
  | 'FLO'
  | 'KTP'
  | 'ALL'
  | 'ETOLL_TUNAI_FLO';

export default function LaporanLaluLintasPage() {
  const defaultDate = new Date(2023, 10, 2);
  const [date, setDate] = useState<DateValue>(defaultDate);
  const [rawData, setRawData] = useState<LalinRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalMode, setTotalMode] = useState<TotalMode>('ALL');

  /* ================= FETCH ================= */
  const fetchData = async () => {
    if (!date) return;
    setLoading(true);

    try {
      const tanggal = format(date, 'yyyy-MM-dd');
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
      const text = `
        gerbang ${row.IdGerbang}
        gardu ${row.IdGardu}
        gol ${row.Golongan}
        shift ${row.Shift}
      `.toLowerCase();

      return text.includes(keyword);
    });
  }, [search, rawData]);

  /* ================= PAGINATION ================= */
  const paginatedData = useMemo(() => {
    const start = (page - 1) * LIMIT;
    return filteredData.slice(start, start + LIMIT);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / LIMIT);

  useEffect(() => {
    fetchData();
  }, [date]);

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
              clearable={false}
            />
            <Button
              leftSection={<IconRefresh size={16} />}
              onClick={fetchData}
            >
              Refresh
            </Button>
          </Group>
        </Group>

        {/* SEARCH */}
        <Paper p="md" withBorder mb="md">
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

        {/* FILTER BUTTON */}
        <Group mb="lg">
          <Button onClick={() => setTotalMode('TUNAI')} variant={totalMode === 'TUNAI' ? 'filled' : 'outline'}>
            Total Tunai
          </Button>
          <Button onClick={() => setTotalMode('ETOLL')} variant={totalMode === 'ETOLL' ? 'filled' : 'outline'}>
            Total E-Toll
          </Button>
          <Button onClick={() => setTotalMode('FLO')} variant={totalMode === 'FLO' ? 'filled' : 'outline'}>
            Total Flo
          </Button>
          <Button onClick={() => setTotalMode('KTP')} variant={totalMode === 'KTP' ? 'filled' : 'outline'}>
            Total KTP
          </Button>
          <Button onClick={() => setTotalMode('ETOLL_TUNAI_FLO')} variant={totalMode === 'ETOLL_TUNAI_FLO' ? 'filled' : 'outline'}>
            E-Toll + Tunai + Flo
          </Button>
          <Button onClick={() => setTotalMode('ALL')} variant={totalMode === 'ALL' ? 'filled' : 'outline'}>
            Total Keseluruhan
          </Button>
        </Group>

        {/* TABLE */}
        <Paper withBorder>
          <LaporanTable
            data={paginatedData}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            loading={loading}
            totalMode={totalMode}
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
