'use client';

import { useEffect, useState } from 'react';
import {
  TextInput,
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
      id: gerbang?.id ?? '',
      IdCabang: gerbang?.IdCabang ?? '',
      NamaGerbang: gerbang?.NamaGerbang ?? '',
      NamaCabang: gerbang?.NamaCabang ?? ''
    },
    validate: {
      id: (v) => (!String(v).trim() ? 'Id diperlukan' : null),
      IdCabang: (v) => (!v.trim() ? 'Id Cabang gerbang diperlukan' : null),
      NamaGerbang: (v) => (!v.trim() ? 'Nama Gerbang diperlukan' : null),
      NamaCabang: (v) => (!v.trim() ? 'Nama Cabang diperlukan' : null),
    },
  });

    useEffect(() => {
    if (gerbang) {
      form.setValues({
        id: String(gerbang.id),
        IdCabang: String(gerbang.IdCabang),
        NamaGerbang: gerbang.NamaGerbang ?? '',
        NamaCabang: gerbang.NamaCabang ?? '',
      });
    } else {
      form.reset();
    }
  }, [gerbang]);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      if (gerbang) {
        await gerbangAPI.update(values);
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
          label="Id"
          placeholder="Contoh: 12"
          required
          mb="md"
          {...form.getInputProps('id')}
        />

        <TextInput
          label="Id Cabang"
          placeholder="Contoh: 16"
          required
          mb="md"
          {...form.getInputProps('IdCabang')}
        />

        <TextInput
          label="Nama Gerbang"
          placeholder="Contoh: Garut2"
          required
          mb="md"
          {...form.getInputProps('NamaGerbang')}
        />

        <TextInput
          label="Nama (Cabang)"
          placeholder="Contoh: Gedebage Cibarusa"
          required
          mb="md"
          {...form.getInputProps('NamaCabang')}
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
