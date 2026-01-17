'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/hooks/useAuth';

export default function LayoutProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider
      theme={{
        primaryColor: 'blue',
        colors: {
          brand: [
            '#e7f5ff',
            '#d0ebff',
            '#a5d8ff',
            '#74c0fc',
            '#4dabf7',
            '#339af0',
            '#228be6',
            '#1c7ed6',
            '#1971c2',
            '#1864ab',
          ],
        },
      }}
    >
      <ModalsProvider>
        <AuthProvider>
          <Notifications position="top-right" />
          {children}
        </AuthProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
