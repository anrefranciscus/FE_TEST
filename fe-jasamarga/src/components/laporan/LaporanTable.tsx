'use client';

import { Table, Pagination, Group, Text } from '@mantine/core';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { LalinRow } from '@/lib/types/laporan';

export type TotalMode =
  | 'TUNAI'
  | 'ETOLL'
  | 'FLO'
  | 'KTP'
  | 'ALL'
  | 'ETOLL_TUNAI_FLO';

interface LaporanTableProps {
  data: LalinRow[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  totalMode: TotalMode;
}

const getTotalByMode = (row: LalinRow, mode: TotalMode) => {
  const etoll =
    row.eMandiri +
    row.eBri +
    row.eBni +
    row.eBca +
    row.eNobu +
    row.eDKI +
    row.eMega;

  const ktp =
    row.DinasOpr + row.DinasMitra + row.DinasKary;

  switch (mode) {
    case 'TUNAI':
      return row.Tunai;
    case 'ETOLL':
      return etoll;
    case 'FLO':
      return row.eFlo;
    case 'KTP':
      return ktp;
    case 'ETOLL_TUNAI_FLO':
      return etoll + row.Tunai + row.eFlo;
    case 'ALL':
    default:
      return etoll + row.Tunai + row.eFlo + ktp;
  }
};

export function LaporanTable({
  data,
  page,
  totalPages,
  onPageChange,
  loading = false,
  totalMode,
}: LaporanTableProps) {
  return (
    <>
      <Table striped highlightOnHover withColumnBorders>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>No</th>
            <th style={{ textAlign: 'center' }}>Ruas</th>
            <th style={{ textAlign: 'center' }}>Gerbang</th>
            <th style={{ textAlign: 'center' }}>Gardu</th>
            <th style={{ textAlign: 'center' }}>Hari</th>
            <th style={{ textAlign: 'center' }}>Tanggal</th>
            <th style={{ textAlign: 'center' }}>
              Metode Pembayaran
            </th>
            <th style={{ textAlign: 'center' }}>Gol I</th>
            <th style={{ textAlign: 'center' }}>Gol II</th>
            <th style={{ textAlign: 'center' }}>Gol III</th>
            <th style={{ textAlign: 'center' }}>Gol IV</th>
            <th style={{ textAlign: 'center' }}>
              Total Lalin
            </th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => {
              const total = getTotalByMode(row, totalMode);

              return (
                <tr key={row.id}>
                  <td style={{ textAlign: 'center' }}>
                    {index + 1}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.IdCabang}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    Gerbang {row.IdGerbang}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    Gardu {row.IdGardu}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {format(new Date(row.Tanggal), 'EEEE', {
                      locale: id,
                    })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {format(
                      new Date(row.Tanggal),
                      'dd-MM-yyyy'
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    Tunai & Non Tunai
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    {row.Golongan === 1 ? total : 0}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.Golongan === 2 ? total : 0}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.Golongan === 3 ? total : 0}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.Golongan === 4 ? total : 0}
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <Text fw={700}>
                      {total.toLocaleString('id-ID')}
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
