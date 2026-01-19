'use client';

import { Table, Pagination, Group, Text } from '@mantine/core';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import { LalinRow } from '@/lib/types/laporan';

interface LaporanTableProps {
  data: LalinRow[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function LaporanTable({
  data,
  page,
  totalPages,
  onPageChange,
  loading = false,
}: LaporanTableProps) {
  return (
    <>
      <Table striped highlightOnHover withColumnBorders>
        <thead>
          <tr>
            <th>No</th>
            <th>Ruas</th>
            <th>Gerbang</th>
            <th>Gardu</th>
            <th>Hari</th>
            <th>Tanggal</th>
            <th>Metode Pembayaran</th>
            <th>Gol I</th>
            <th>Gol II</th>
            <th>Gol III</th>
            <th>Gol IV</th>
            <th>Total Lalin</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => {
              // Total lalin per baris
              const totalLalin =
                row.Tunai +
                row.DinasOpr +
                row.DinasMitra +
                row.DinasKary +
                row.eMandiri +
                row.eBri +
                row.eBni +
                row.eBca +
                row.eNobu +
                row.eDKI +
                row.eMega +
                row.eFlo;

              return (
                <tr key={row.id}>
                  <td>{(page - 1) * 10 + index + 1}</td>
                  <td>{row.IdCabang}</td>
                  <td>Gerbang {row.IdGerbang}</td>
                  <td>Gardu {row.IdGardu}</td>
                  <td>
                    {format(new Date(row.Tanggal), 'EEEE', {
                      locale: id,
                    })}
                  </td>
                  <td>
                    {format(
                      new Date(row.Tanggal),
                      'dd-MM-yyyy'
                    )}
                  </td>
                  <td>Tunai & Non Tunai</td>

                  <td>{row.Golongan === 1 ? totalLalin : 0}</td>
                  <td>{row.Golongan === 2 ? totalLalin : 0}</td>
                  <td>{row.Golongan === 3 ? totalLalin : 0}</td>
                  <td>{row.Golongan === 4 ? totalLalin : 0}</td>

                  <td>
                    <Text fw={700}>
                      {totalLalin.toLocaleString('id-ID')}
                    </Text>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={12} style={{ textAlign: 'center', padding: 40 }}>
                <Text c="dimmed">
                  Tidak ada data untuk ditampilkan
                </Text>
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
    </>
  );
}
