'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AppShell,
  Text,
  Button,
  NavLink,
  Avatar,
  Menu,
  Stack,
  Box,
  Burger,
  Group,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconDashboard,
  IconReport,
  IconBuildingBridge ,
  IconLogout,
  IconUser,
  IconChevronDown,
} from '@tabler/icons-react'
import { authAPI } from '@/lib/api/auth'

const menuItems = [
  { label: 'Dashboard', icon: IconDashboard, href: '/dashboard' },
  { label: 'Laporan Lalu Lintas', icon: IconReport, href: '/traffictlight' },
  { label: 'Master Data Gerbang', icon: IconBuildingBridge , href: '/master-gerbang' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState('')
  const [active, setActive] = useState('Dashboard')
  const [opened, { toggle }] = useDisclosure()
  const router = useRouter()

  useEffect(() => {
    const userStr = localStorage.getItem('jasamarga_user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUsername(user.username ?? '')
      } catch {
        setUsername('')
      }
    }
  }, [])

  const handleLogout = async () => {
    await authAPI.logout()
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      {/* Header */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text size="xl" fw={700}>
              Jasa Marga - Monitoring System
            </Text>
          </Group>
          <Avatar color="blue" radius="xl">
            SA
          </Avatar>
        </Group>
      </AppShell.Header>

      {/* Navbar */}
      <AppShell.Navbar p="xs">
        <AppShell.Section grow mt="md">
          <Stack gap="xs">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                label={item.label}
                leftSection={<item.icon size={16} />}
                active={item.label === active}
                onClick={() => {
                  setActive(item.label)
                  router.push(item.href)
                }}
              />
            ))}
          </Stack>
        </AppShell.Section>

        <AppShell.Section>
          <Menu>
            <Menu.Target>
              <Button
                variant="light"
                fullWidth
                leftSection={<IconUser size={16} />}
                rightSection={<IconChevronDown size={16} />}
              >
                {username || 'User'}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconLogout size={14} />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  )
}