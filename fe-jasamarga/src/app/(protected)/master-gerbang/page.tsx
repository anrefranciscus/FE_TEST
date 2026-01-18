'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  Title,
  Group,
  Button,
  LoadingOverlay,
  Modal,
  ActionIcon,
} from '@mantine/core';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

import Layout from '@/components/Layout';
import { SearchInput } from '@/components/common/SearchInput';
import { GerbangTable } from '@/components/gerbang/GerbangTable';
import { GerbangForm } from '@/components/gerbang/GerbangForm';

import { gerbangAPI } from '@/lib/api/gerbang';
import { GerbangApiResponse, Gerbang } from '@/lib/types/gerbang';

export default function MasterGerbangPage() {
  /* ================= STATE ================= */
  const [data, setData] = useState<Gerbang[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  });

  const [selectedGerbang, setSelectedGerbang] =
    useState<Gerbang | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  /* ================= FETCH DATA ================= */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = (await gerbangAPI.getAll({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
      })) as GerbangApiResponse;

      if (!response.status) return;

      const rows = response.data.rows?.rows ?? [];

      const normalizedRows = rows
        .filter((item) =>
          item.NamaGerbang.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.NamaCabang.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
        .map((item) => ({
          ...item,
          _uid: `${item.id}-${item.IdCabang}`,
        }));
      setData(normalizedRows);

      setPagination((prev) => ({
        ...prev,
        page: response.data.current_page,
        totalPages: response.data.total_pages,
        totalItems: response.data.count,
      }));
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Gagal memuat data gerbang',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Layout>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />

        {/* HEADER */}
        <Group justify="space-between" mb="lg">
          <Title order={2}>Master Data Gerbang</Title>

          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setSelectedGerbang(null);
              open();
            }}
          >
            Tambah Gerbang
          </Button>
        </Group>

        {/* SEARCH */}
        <Paper p="md" withBorder radius="md" mb="lg">
          <Group>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari gerbang..."
              style={{ flex: 1 }}
            />

            <ActionIcon
              size="lg"
              variant="light"
              onClick={fetchData}
              loading={loading}
            >
              <IconRefresh size={18} />
            </ActionIcon>
          </Group>
        </Paper>

        {/* TABLE */}
        <Paper withBorder radius="md">
          <GerbangTable
            data={data}
            loading={loading}
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
            onEdit={(g) => {
              setSelectedGerbang(g);
              open();
            }}
            onDelete={async (id: number, IdCabang: number) => {
              if (!confirm('Apakah Anda yakin ingin menghapus data ini?'))
                return;

              try {
                const response = await gerbangAPI.delete({ id: id, IdCabang: IdCabang });

                if (response.status) {
                  notifications.show({
                    title: 'Berhasil',
                    message: 'Data gerbang berhasil dihapus',
                    color: 'green',
                  });
                  fetchData();
                }
              } catch (error: any) {
                notifications.show({
                  title: 'Error',
                  message:
                    error.message || 'Gagal menghapus data gerbang',
                  color: 'red',
                });
              }
            }}
          />
        </Paper>

        {/* MODAL */}
        <Modal
          opened={opened}
          onClose={close}
          title={selectedGerbang ? 'Edit Gerbang' : 'Tambah Gerbang'}
          size="lg"
        >
          <GerbangForm
            gerbang={selectedGerbang}
            onSubmitSuccess={() => {
              close();
              fetchData();
            }}
            onCancel={close}
          />
        </Modal>
      </div>
    </Layout>
  );
}
