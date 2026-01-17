'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { paymentClusters } from '@/lib/constants/payment';

interface PaymentMethodChartProps {
  data: any[];
}

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  const processData = () => {
    const paymentTotals: Record<string, number> = {};
    
    data.forEach(item => {
      // Tunai
      paymentTotals['Tunai'] = (paymentTotals['Tunai'] || 0) + (item.Tunai || 0);
      
      // E-Toll Cluster
      paymentTotals['BCA'] = (paymentTotals['BCA'] || 0) + (item.eBca || 0);
      paymentTotals['BRI'] = (paymentTotals['BRI'] || 0) + (item.eBri || 0);
      paymentTotals['BNI'] = (paymentTotals['BNI'] || 0) + (item.eBni || 0);
      paymentTotals['Mandiri'] = (paymentTotals['Mandiri'] || 0) + (item.eMandiri || 0);
      paymentTotals['DKI'] = (paymentTotals['DKI'] || 0) + (item.eDKI || 0);
      
      // Flo
      paymentTotals['Flo'] = (paymentTotals['Flo'] || 0) + (item.eFlo || 0);
      
      // KTP Cluster
      paymentTotals['DinasOpr'] = (paymentTotals['DinasOpr'] || 0) + (item.DinasOpr || 0);
      paymentTotals['DinasMitra'] = (paymentTotals['DinasMitra'] || 0) + (item.DinasMitra || 0);
      paymentTotals['DinasKary'] = (paymentTotals['DinasKary'] || 0) + (item.DinasKary || 0);
    });
    
    return Object.entries(paymentTotals).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const chartData = processData();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
        <YAxis />
        <Tooltip 
          formatter={(value) => [value, 'Jumlah Transaksi']}
          labelFormatter={(label) => `Metode: ${label}`}
        />
        <Bar dataKey="value" fill="#228be6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}