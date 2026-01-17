'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { shiftLabels } from '@/lib/constants/payment';

interface ShiftChartProps {
  data: any[];
}

const SHIFT_COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export function ShiftChart({ data }: ShiftChartProps) {
  const processData = () => {
    const shiftTotals: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    
    data.forEach(item => {
      const total = 
        item.Tunai +
        item.eMandiri + item.eBri + item.eBni + item.eBca +
        item.eNobu + item.eDKI + item.eMega + item.eFlo +
        item.DinasOpr + item.DinasMitra + item.DinasKary;
      
      shiftTotals[item.Shift] = (shiftTotals[item.Shift] || 0) + total;
    });
    
    return Object.entries(shiftTotals).map(([shift, total]) => ({
      name: shiftLabels[parseInt(shift)] || `Shift ${shift}`,
      value: total,
    }));
  };

  const chartData = processData();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry) => `${entry.name}: ${entry.value}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={SHIFT_COLORS[index % SHIFT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}