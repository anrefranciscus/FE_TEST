'use client';

import { useState } from 'react';
import {
  TextInput,
  Select,
  Button,
  Group,
  LoadingOverlay,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { gerbangAPI } from '@/lib/api/gerbang';
import { notifications } from '@mantine/notifications';

interface GerbangFormProps {
  gerbang?: any;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function GerbangForm({
  gerbang,
  onSubmitSuccess,
  onCancel,
}: GerbangFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      kode: gerbang?.kode ?? '',
      nama: gerbang?.nama ?? '',
      lokasi: gerbang?.lokasi ?? '',
      ruas: gerbang?.ruas ?? '',
      status: gerbang?.status ?? 'active',
    },
    validate: {
      kode: (v) => (!v.trim() ? 'Kode gerbang diperlukan' : null),
      nama: (v) => (!v.trim() ? 'Nama gerbang diperlukan' : null),
      lokasi: (v) => (!v.trim() ? 'Lokasi diperlukan' : null),
      ruas: (v) => (!v.trim() ? 'Ruas diperlukan' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      if (gerbang) {
        await gerbangAPI.update(gerbang.id, values);
        notifications.show({
          title: 'Berhasil',
          message: 'Data gerbang berhasil diperbarui',
          color: 'green',
        });
      } else {
        await gerbangAPI.create(values);
        notifications.show({
          title: 'Berhasil',
          message: 'Data gerbang berhasil ditambahkan',
          color: 'green',
        });
      }
      onSubmitSuccess();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error?.message ?? 'Gagal menyimpan data gerbang',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Kode Gerbang"
          placeholder="Contoh: G001"
          required
          mb="md"
          {...form.getInputProps('kode')}
        />

        <TextInput
          label="Nama Gerbang"
          placeholder="Contoh: Gerbang Tol Bekasi Barat"
          required
          mb="md"
          {...form.getInputProps('nama')}
        />

        <TextInput
          label="Lokasi"
          placeholder="Contoh: Km 12 Tol Jakarta-Cikampek"
          required
          mb="md"
          {...form.getInputProps('lokasi')}
        />

        <TextInput
          label="Ruas (Cabang)"
          placeholder="Contoh: Ruas Jakarta-Cikampek"
          required
          mb="md"
          {...form.getInputProps('ruas')}
        />

        <Select
          label="Status"
          placeholder="Pilih status"
          data={[
            { value: 'active', label: 'Aktif' },
            { value: 'inactive', label: 'Non-Aktif' },
          ]}
          required
          mb="xl"
          {...form.getInputProps('status')}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" loading={loading}>
            {gerbang ? 'Update' : 'Simpan'}
          </Button>
        </Group>
      </form>
    </Box>
  );
}
