'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [token, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
}