'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Grid,
    Paper,
    Title,
    Group,
    Button,
    Text,
    Select,
    LoadingOverlay,
} from '@mantine/core';
import { DatePickerInput, DateValue } from '@mantine/dates';
import {
    IconCalendar,
    IconRefresh,
    IconFilter,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { lalinsApi } from '@/lib/api/laporan';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { PaymentMethodChart } from '@/components/dashboard/PaymentMethodChart';
import { GatewayChart } from '@/components/dashboard/GatewayChart';
import { ShiftChart } from '@/components/dashboard/ShiftChart';
import { BranchChart } from '@/components/dashboard/BranchChart';
import { gerbangAPI } from '@/lib/api/gerbang';
import { notifications } from '@mantine/notifications';
import { Gateway, GerbangApiResponse } from '@/lib/types/gerbang';


export default function DashboardPage() {
    const defaultDate = new Date(2023, 10, 1)
    const [date, setDate] = useState<DateValue>(defaultDate);
    const [gateway, setGateway] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [dataLalin, setDataLalin] = useState<any[]>([]);
    const [gateways, setGateways] = useState<Gateway[]>([]);

    const [stats, setStats] = useState({
        totalTransactions: 0,
        totalRevenue: 0,
        avgPerHour: 0,
        totalGerbang: 0,
        totalBranches: 0,
    });
    const [dateString, setDateString] = useState<string | null>(null);

    useEffect(() => {
        setDateString(new Date().toLocaleString('id-ID'));
    }, []);

    const fetchGateways = async () => {
        try {
            const response = await gerbangAPI.getAll({ id: 3 }) as GerbangApiResponse;
            console.log(response.data)
            if (response.status) {
                const rows = response.data?.rows?.rows;
                const uniqueRows = rows.filter(
                    (g, i, arr) => arr.findIndex(x => x.id === g.id) === i
                );
                setGateways(uniqueRows);
            }
        } catch (error) {
            console.error('Error fetching gateways:', error);
        }
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const formattedDate = format(date!, 'yyyy-MM-dd');
            const response = await lalinsApi.getByDate(formattedDate);

            if (response.status) {
                const laporanData = response.data.rows.rows;
                setDataLalin(laporanData);
                calculateStats(laporanData);
            }
        } catch (error: any) {
            notifications.show({
                title: 'Error',
                message: error.message || 'Gagal memuat data dashboard',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    }, [date]);

    const calculateStats = (laporanData: any[]) => {
        let totalTransactions = 0;
        let totalRevenue = 0;
        const uniqueGerbang = new Set<number>();
        const uniqueBranches = new Set<number>();

        laporanData.forEach((item) => {
            const itemTotal =
                item.Tunai +
                item.eMandiri +
                item.eBri +
                item.eBni +
                item.eBca +
                item.eNobu +
                item.eDKI +
                item.eMega +
                item.eFlo +
                item.DinasOpr +
                item.DinasMitra +
                item.DinasKary;

            totalTransactions += itemTotal;
            totalRevenue += itemTotal * 10000;

            uniqueGerbang.add(item.IdGerbang);
            uniqueBranches.add(item.IdCabang);
        });

        setStats({
            totalTransactions,
            totalRevenue,
            avgPerHour: Math.round(totalTransactions / 24),
            totalGerbang: uniqueGerbang.size,
            totalBranches: uniqueBranches.size,
        });
    };

    useEffect(() => {
        fetchGateways();
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredData = gateway
        ? dataLalin.filter((item) => item.IdGerbang.toString() === gateway)
        : dataLalin;

    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} />

            <Group justify="space-between" mb="lg">
                <Title order={2}>Dashboard</Title>

                <Group>
                    <DatePickerInput
                        value={date}
                        onChange={(val) => val && setDate(val)}
                        leftSection={<IconCalendar size={16} />}
                        placeholder="Pilih tanggal"
                        clearable={false}
                    />


                    <Select
                        placeholder="Filter Gerbang"
                        data={gateways.map((g) => ({
                            value: g.id.toString(),
                            label: g.NamaCabang,
                        }))}
                        value={gateway}
                        onChange={setGateway}
                        leftSection={<IconFilter size={16} />}
                        clearable
                        w={200}
                    />

                    <Button
                        leftSection={<IconRefresh size={16} />}
                        onClick={fetchData}
                        loading={loading}
                        variant="light"
                    >
                        Refresh
                    </Button>
                </Group>
            </Group>

            <DashboardStats stats={stats} loading={loading} />

            <Grid gutter="lg" mt="lg">
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Paper p="md" withBorder radius="md">
                        <Title order={4} mb="md">
                            Transaksi per Metode Pembayaran
                        </Title>
                        <PaymentMethodChart data={filteredData} />
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Paper p="md" withBorder radius="md">
                        <Title order={4} mb="md">
                            Transaksi per Gerbang
                        </Title>
                        <GatewayChart data={filteredData} />
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Paper p="md" withBorder radius="md">
                        <Title order={4} mb="md">
                            Distribusi per Shift
                        </Title>
                        <ShiftChart data={filteredData} />
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Paper p="md" withBorder radius="md">
                        <Title order={4} mb="md">
                            Distribusi per Ruas
                        </Title>
                        <BranchChart data={filteredData} />
                    </Paper>
                </Grid.Col>
            </Grid>
            <Text size="sm" c="dimmed" mt="md">
                Data diperbarui pada: {dateString}
            </Text>

        </div>
    );
}
