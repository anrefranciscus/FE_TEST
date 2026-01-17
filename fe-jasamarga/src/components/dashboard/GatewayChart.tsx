'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface GatewayChartProps {
  data: any[];
}

export function GatewayChart({ data }: GatewayChartProps) {
  const processData = () => {
    const gatewayTotals: Record<number, number> = {};
    
    data.forEach(item => {
      const total = 
        item.Tunai +
        item.eMandiri + item.eBri + item.eBni + item.eBca +
        item.eNobu + item.eDKI + item.eMega + item.eFlo +
        item.DinasOpr + item.DinasMitra + item.DinasKary;
      
      gatewayTotals[item.IdGerbang] = (gatewayTotals[item.IdGerbang] || 0) + total;
    });
    
    return Object.entries(gatewayTotals)
      .map(([gatewayId, total]) => ({
        name: `Gerbang ${gatewayId}`,
        total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10 gerbang
  };

  const chartData = processData();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`${value} transaksi`, 'Jumlah']}
          labelFormatter={(label) => `Gerbang: ${label}`}
        />
        <Legend />
        <Bar dataKey="total" name="Jumlah Transaksi" fill="#82ca9d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}