'use client';

import {
  SimpleGrid,
  Card,
  Group,
  Text,
  Title,
  LoadingOverlay,
} from '@mantine/core';
import {
  IconCash,
  IconReceipt,
  IconTrendingUp,
  IconBuilding,
  IconMapPin,
} from '@tabler/icons-react';
import { formatCurrency } from '@/lib/utils/format';

interface DashboardStatsProps {
  stats: {
    totalTransactions: number;
    totalRevenue: number;
    avgPerHour: number;
    totalGerbang: number;
    totalBranches: number;
  };
  loading?: boolean;
}

const statCards = [
  {
    title: 'Total Transaksi',
    key: 'totalTransactions',
    icon: IconReceipt,
    color: 'blue',
    formatter: (value: number) => value.toLocaleString('id-ID'),
    suffix: 'transaksi',
  },
  {
    title: 'Total Pendapatan',
    key: 'totalRevenue',
    icon: IconCash,
    color: 'green',
    formatter: formatCurrency,
  },
  {
    title: 'Rata-rata per Jam',
    key: 'avgPerHour',
    icon: IconTrendingUp,
    color: 'orange',
    formatter: (value: number) => value.toLocaleString('id-ID'),
    suffix: 'transaksi/jam',
  },
  {
    title: 'Total Gerbang',
    key: 'totalGerbang',
    icon: IconMapPin,
    color: 'grape',
    formatter: (value: number) => value.toString(),
    suffix: 'gerbang',
  },
  {
    title: 'Total Ruas',
    key: 'totalBranches',
    icon: IconBuilding,
    color: 'cyan',
    formatter: (value: number) => value.toString(),
    suffix: 'ruas',
  },
];

export function DashboardStats({ stats, loading = false }: DashboardStatsProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }}>
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key as keyof typeof stats];

        return (
          <Card
            key={card.key}
            withBorder
            radius="md"
            pos="relative"
          >
            <LoadingOverlay visible={loading} />

            <Group wrap="nowrap" align="flex-start">
              <Icon
                size={24}
                color={`var(--mantine-color-${card.color}-6)`}
              />

              <div>
                <Text size="sm" c="dimmed" fw={500}>
                  {card.title}
                </Text>

                <Title order={3} mt={4}>
                  {card.formatter(value as number)}
                  {card.suffix && (
                    <Text
                      component="span"
                      size="sm"
                      c="dimmed"
                      ml={4}
                    >
                      {card.suffix}
                    </Text>
                  )}
                </Title>
              </div>
            </Group>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
