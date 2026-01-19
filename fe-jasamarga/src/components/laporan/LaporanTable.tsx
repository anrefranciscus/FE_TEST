'use client';

import {
  Table,
  Pagination,
  Group,
  Text,
  ActionIcon,
  Badge,
} from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import {
  paymentMethodLabels,
  shiftLabels,
  golonganLabels,
} from '@/lib/constants/payment';
import { format } from 'date-fns';

interface LaporanTableProps {
  data: any[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (id: number) => void;
}

export function LaporanTable({
  data,
  page,
  totalPages,
  onPageChange,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: LaporanTableProps) {
  const calculateRowTotal = (row: any) => {
    return Object.keys(paymentMethodLabels).reduce((sum, key) => {
      return sum + (row[key] || 0);
    }, 0);
  };

  const rows = data.map((row) => {
    const rowTotal = calculateRowTotal(row);

    return (
      <tr key={row.id}>
        <td>{format(new Date(row.Tanggal), 'dd/MM/yyyy')}</td>

        <td>
          <Badge color="blue">Gerbang {row.IdGerbang}</Badge>
        </td>

        <td>
          <Badge
            color={
              row.Shift === 1
                ? 'blue'
                : row.Shift === 2
                ? 'green'
                : 'orange'
            }
          >
            {shiftLabels[row.Shift] || `Shift ${row.Shift}`}
          </Badge>
        </td>

        <td>
          <Badge variant="outline">
            {golonganLabels[row.Golongan] || `Gol ${row.Golongan}`}
          </Badge>
        </td>

        <td>{row.Tunai.toLocaleString('id-ID')}</td>

        <td>
          {(
            row.eMandiri +
            row.eBri +
            row.eBni +
            row.eBca +
            row.eDKI +
            row.eMega +
            row.eNobu
          ).toLocaleString('id-ID')}
        </td>

        <td>{row.eFlo.toLocaleString('id-ID')}</td>

        <td>
          {(row.DinasOpr + row.DinasMitra + row.DinasKary).toLocaleString(
            'id-ID'
          )}
        </td>

        <td>
          <Text fw={700}>{rowTotal.toLocaleString('id-ID')}</Text>
        </td>

        <td>
          <Group gap="xs" wrap="nowrap">
            {onView && (
              <ActionIcon
                color="blue"
                size="sm"
                onClick={() => onView(row)}
              >
                <IconEye size={14} />
              </ActionIcon>
            )}

            {onEdit && (
              <ActionIcon
                color="yellow"
                size="sm"
                onClick={() => onEdit(row)}
              >
                <IconEdit size={14} />
              </ActionIcon>
            )}

            {onDelete && (
              <ActionIcon
                color="red"
                size="sm"
                onClick={() => onDelete(row.id)}
              >
                <IconTrash size={14} />
              </ActionIcon>
            )}
          </Group>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Gerbang</th>
            <th>Shift</th>
            <th>Golongan</th>
            <th>Tunai</th>
            <th>E-Toll</th>
            <th>Flo</th>
            <th>KTP</th>
            <th>Total</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={10} style={{ textAlign: 'center', padding: 40 }}>
                <Text c="dimmed">Tidak ada data untuk ditampilkan</Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Group justify="center" p="md">
          <Pagination
            value={page}
            onChange={onPageChange}
            total={totalPages}
            disabled={loading}
          />
        </Group>
      )}
    </div>
  );
}
