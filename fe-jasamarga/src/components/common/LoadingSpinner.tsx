import { Loader } from '@mantine/core';

export function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Loader size="xl" />
    </div>
  );
}