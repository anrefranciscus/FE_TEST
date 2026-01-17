'use client';

import { TextInput, TextInputProps } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface SearchInputProps extends Omit<TextInputProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({
  value,
  onChange,
  ...props
}: SearchInputProps) {
  return (
    <TextInput
      leftSection={<IconSearch size={16} />}
      leftSectionPointerEvents="none"
      placeholder="Cari..."
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      {...props}
    />
  );
}
