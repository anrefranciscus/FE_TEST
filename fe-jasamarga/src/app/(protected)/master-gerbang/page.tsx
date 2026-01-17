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
import { IconPlus, IconRefresh, IconSearch } from '@tabler/icons-react';
import { gerbangAPI } from '@/lib/api/gerbang';
import { GerbangTable } from '@/components/gerbang/GerbangTable';
import { GerbangForm } from '@/components/gerbang/GerbangForm';
import { SearchInput } from '@/components/common/SearchInput';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { GerbangApiResponse } from '@/lib/types/gerbang';
import Layout from '@/components/Layout';



export default function MasterGerbangPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [selectedGerbang, setSelectedGerbang] = useState<any>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search }),
      };

      const response = await gerbangAPI.getAll(
        params
      ) as GerbangApiResponse;

      if (!response.status) return;

      const rows = response.data.rows.rows ?? [];

      const uniqueRows = rows.filter(
        (g, i, arr) => arr.findIndex(x => x.id === g.id) === i
      );

      setData(uniqueRows);

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
  }, [pagination.page, pagination.limit, search]);

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
              onClick={fetchData}
              loading={loading}
              variant="light"
            >
              <IconRefresh size={18} />
            </ActionIcon>
          </Group>
        </Paper>

        {/* TABLE */}
        <Paper withBorder radius="md">
          <GerbangTable
            data={data}
            onEdit={(g) => {
              setSelectedGerbang(g);
              open();
            }}
            onDelete={async (g:any) => {
              console.log("Test")
              console.log('DELETE PAYLOAD', {
    id: g.id,
    idCabang: g.idCabang,
  });
              if (!confirm('Apakah Anda yakin ingin menghapus data gerbang ini?')) return;

              try {
                const response = await gerbangAPI.delete({
                  id: g.id,
                  IdCabang: g.IdCabang
                });

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
                  message: error.message || 'Gagal menghapus data gerbang',
                  color: 'red',
                });
              }
            }}
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
            loading={loading}
          />
        </Paper>

        {/* MODAL */}
        <Modal
          opened={opened}
          onClose={close}
          title={selectedGerbang ? 'Edit Gerbang' : 'Tambah Gerbang Baru'}
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
