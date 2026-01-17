'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface BranchChartProps {
  data: any[];
}

const BRANCH_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function BranchChart({ data }: BranchChartProps) {
  const processData = () => {
    const branchTotals: Record<number, { total: number; count: number }> = {};
    
    data.forEach(item => {
      const total = 
        item.Tunai +
        item.eMandiri + item.eBri + item.eBni + item.eBca +
        item.eNobu + item.eDKI + item.eMega + item.eFlo +
        item.DinasOpr + item.DinasMitra + item.DinasKary;
      
      if (!branchTotals[item.IdCabang]) {
        branchTotals[item.IdCabang] = { total: 0, count: 0 };
      }
      branchTotals[item.IdCabang].total += total;
      branchTotals[item.IdCabang].count += 1;
    });
    
    return Object.entries(branchTotals)
      .map(([branchId, { total }]) => ({
        name: `Ruas ${branchId}`,
        value: total,
      }))
      .sort((a, b) => b.value - a.value);
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
            <Cell key={`cell-${index}`} fill={BRANCH_COLORS[index % BRANCH_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}