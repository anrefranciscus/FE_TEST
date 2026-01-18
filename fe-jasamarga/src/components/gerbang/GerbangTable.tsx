'use client';

import {
  Table,
  ActionIcon,
  Group,
  Pagination,
  Box,
} from '@mantine/core';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';

interface GerbangTableProps {
  data: any[];
  onEdit: (gerbang: any) => void;
  onDelete: (id: number, IdCabang: number) => void;
  onView?: (gerbang: any) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function GerbangTable({
  data,
  onEdit,
  onDelete,
  onView,
  page,
  totalPages,
  onPageChange,
  loading = false,
}: GerbangTableProps) {
  const rows = data.map((gerbang) => (
    <Table.Tr key={gerbang._uid}>
      <Table.Td>{gerbang.id}</Table.Td>
      <Table.Td>{gerbang.NamaGerbang}</Table.Td>
      <Table.Td>{gerbang.NamaCabang}</Table.Td>
      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          {onView && (
            <ActionIcon
              variant="light"
              color="blue"
              size="sm"
              onClick={() => onView(gerbang)}
            >
              <IconEye size={16} />
            </ActionIcon>
          )}
          <ActionIcon
            variant="light"
            color="yellow"
            size="sm"
            onClick={() => onEdit(gerbang)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="red"
            size="sm"
            onClick={() => onDelete(gerbang.id, gerbang.IdCabang)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box>
      <Table.ScrollContainer minWidth={900}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Id</Table.Th>
              <Table.Th>Nama Gerbang</Table.Th>
              <Table.Th>Nama Cabang</Table.Th>
              <Table.Th>Aksi</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7} ta="center" py="xl">
                  Tidak ada data untuk ditampilkan
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            value={page}
            onChange={onPageChange}
            total={totalPages}
            disabled={loading}
          />
        </Group>
      )}
    </Box>
  );
}
