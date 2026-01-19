'use client';

import { SimpleGrid, Paper, Text, Title } from '@mantine/core';
import { paymentClusters } from '@/lib/constants/payment';

interface PaymentSummaryProps {
  data: any[];
}

export function PaymentSummary({ data }: PaymentSummaryProps) {
  const calculateTotals = () => {
    let totalTunai = 0;
    let totalEToll = 0;
    let totalFlo = 0;
    let totalKTP = 0;

    data.forEach((item) => {
      totalTunai += item.Tunai || 0;

      paymentClusters.E_TOLL.forEach((key) => {
        totalEToll += item[key] || 0;
      });

      totalFlo += item.eFlo || 0;

      paymentClusters.KTP.forEach((key) => {
        totalKTP += item[key] || 0;
      });
    });

    const totalETollTunaiFlo = totalTunai + totalEToll + totalFlo;
    const totalKeseluruhan =
      totalTunai + totalEToll + totalFlo + totalKTP;

    return {
      totalTunai,
      totalEToll,
      totalFlo,
      totalKTP,
      totalETollTunaiFlo,
      totalKeseluruhan,
    };
  };

  const totals = calculateTotals();

  const summaryItems = [
    { label: 'Total Tunai', value: totals.totalTunai, color: 'blue' },
    { label: 'Total E-Toll', value: totals.totalEToll, color: 'green' },
    { label: 'Total Flo', value: totals.totalFlo, color: 'orange' },
    { label: 'Total KTP', value: totals.totalKTP, color: 'grape' },
    {
      label: 'Total E-Toll + Tunai + Flo',
      value: totals.totalETollTunaiFlo,
      color: 'cyan',
    },
    {
      label: 'Total Keseluruhan',
      value: totals.totalKeseluruhan,
      color: 'red',
    },
  ];

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, md: 3 }}
      mb="lg"
    >
      {summaryItems.map((item) => (
        <Paper key={item.label} p="md" withBorder>
          <Text size="sm" c="dimmed" fw={500}>
            {item.label}
          </Text>

          <Title order={3} c={`${item.color}.6`}>
            {item.value.toLocaleString('id-ID')} transaksi
          </Title>
        </Paper>
      ))}
    </SimpleGrid>
  );
}
