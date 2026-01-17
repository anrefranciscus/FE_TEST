'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Container,
  Group,
  Text,
  Image,
  Box,
  Flex,
  useMantineTheme,
  rem,
  Alert,
  Loader,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock, IconUser, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const [formError, setFormError] = useState<string>('');
  const theme = useMantineTheme();
  
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  // Redirect jika sudah login
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(callbackUrl);
    }
  }, [isAuthenticated, user, router, callbackUrl]);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (!value.trim() ? 'Username diperlukan' : null),
      password: (value) => (!value.trim() ? 'Password diperlukan' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setFormError('');
    
    try {
      await login(values.username, values.password);
      
      // Show success notification
      notifications.show({
        title: 'Login Berhasil',
        message: 'Selamat datang di sistem monitoring terpadu',
        color: 'green',
        autoClose: 3000,
      });
      
      // Redirect will be handled by useEffect above
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Set error message based on error type
      let errorMessage = 'Login gagal. Silakan coba lagi.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Username atau password salah.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Endpoint tidak ditemukan.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setFormError(errorMessage);
      
      // Show error notification
      notifications.show({
        title: 'Login Gagal',
        message: errorMessage,
        color: 'red',
        icon: <IconAlertCircle size="1rem" />,
      });
    }
  };

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <Container fluid p={0} style={{ minHeight: '100vh' }}>
        <Flex h="100vh" align="center" justify="center">
          <Loader size="xl" color={theme.colors.blue[6]} />
        </Flex>
      </Container>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return (
      <Container fluid p={0} style={{ minHeight: '100vh' }}>
        <Flex h="100vh" align="center" justify="center">
          <Box ta="center">
            <Loader size="xl" color={theme.colors.blue[6]} mb="md" />
            <Text size="lg" fw={500}>
              Mengarahkan ke dashboard...
            </Text>
          </Box>
        </Flex>
      </Container>
    );
  }

  return (
    <Container fluid p={0} style={{ minHeight: '100vh' }}>
      <Flex h="100vh">
        {/* Left Section - Form */}
        <Box
          w={{ base: '100%', md: '50%' }}
          bg="white"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: rem(40),
          }}
        >
          <Box maw={420} w="100%">
            <Box mb={40}>
              <Title
                order={1}
                ta="left"
                mb="xs"
                style={{
                  fontSize: rem(28),
                  fontWeight: 700,
                  color: theme.colors.dark[7],
                }}
              >
                Selamat Datang
              </Title>
              <Text size="sm" c="dimmed">
                Masuk ke akun Anda untuk melanjutkan
              </Text>
            </Box>

            <Paper
              withBorder
              shadow="sm"
              p="xl"
              radius="md"
              style={{
                borderColor: theme.colors.gray[2],
              }}
            >
              {formError && (
                <Alert
                  color="red"
                  title="Error"
                  icon={<IconAlertCircle size="1rem" />}
                  mb="md"
                  styles={{
                    root: {
                      borderColor: theme.colors.red[6],
                    },
                  }}
                >
                  {formError}
                </Alert>
              )}

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                  label="Username"
                  placeholder="Masukkan username"
                  required
                  leftSection={<IconUser size={18} />}
                  {...form.getInputProps('username')}
                  mb="md"
                  size="md"
                  error={form.errors.username}
                  styles={{
                    input: {
                      borderColor: form.errors.username ? theme.colors.red[6] : theme.colors.gray[3],
                      '&:focus': {
                        borderColor: form.errors.username ? theme.colors.red[6] : theme.colors.blue[6],
                      },
                    },
                  }}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Masukkan password"
                  required
                  leftSection={<IconLock size={18} />}
                  {...form.getInputProps('password')}
                  mb="xl"
                  size="md"
                  error={form.errors.password}
                  styles={{
                    input: {
                      borderColor: form.errors.password ? theme.colors.red[6] : theme.colors.gray[3],
                      '&:focus': {
                        borderColor: form.errors.password ? theme.colors.red[6] : theme.colors.blue[6],
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  size="md"
                  loading={isLoading}
                  disabled={isLoading}
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.blue[6]}, ${theme.colors.cyan[6]})`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: theme.shadows.md,
                    },
                    '&:disabled': {
                      background: theme.colors.gray[3],
                      transform: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {isLoading ? 'Memproses...' : 'Masuk'}
                </Button>
              </form>

              <Group justify="center" mt="xl" pt="lg" style={{ borderTop: `1px solid ${theme.colors.gray[2]}` }}>
                <Text size="sm" c="dimmed" ta="center">
                  <Text span fw={600} c="dark">
                    Akun Demo:
                  </Text>
                  <br />
                  Username: <strong>Super Admin</strong>
                  <br />
                  Password: <strong>password12345</strong>
                </Text>
              </Group>
            </Paper>

            <Text size="xs" c="dimmed" ta="center" mt="xl">
              © {new Date().getFullYear()} PT Jasa Marga (Persero) Tbk.
              <br />
              Semua hak dilindungi undang-undang.
            </Text>
          </Box>
        </Box>

        {/* Right Section - Logo/Brand */}
        <Box
          w={{ base: 0, md: '50%' }}
          visibleFrom="md"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.blue[8]}, ${theme.colors.cyan[7]})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: rem(40),
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative elements */}
          <Box
            style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '100%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
          
          <Box
            style={{
              position: 'absolute',
              bottom: '-30%',
              left: '-30%',
              width: '80%',
              height: '80%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 60%)',
            }}
          />

          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: rem(40),
              zIndex: 1,
            }}
          >
            <Box
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: rem(16),
                padding: rem(40),
                border: `1px solid rgba(255, 255, 255, 0.2)`,
              }}
            >
              <Image
                src="/jasamarga-logo.png"
                alt="Jasa Marga"
                w={280}
                h={80}
                fit="contain"
                style={{
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </Box>

            <Box ta="center" style={{ maxWidth: rem(500) }}>
              <Title
                order={2}
                c="white"
                mb="md"
                style={{
                  fontSize: rem(32),
                  fontWeight: 700,
                }}
              >
                Sistem Monitoring Terpadu
              </Title>
              <Text
                size="lg"
                c="white"
                opacity={0.9}
                style={{
                  lineHeight: 1.6,
                }}
              >
                Platform terpadu untuk memantau dan mengelola operasional
                infrastruktur dengan efisiensi maksimal
              </Text>
            </Box>

            <Box
              style={{
                display: 'flex',
                gap: rem(24),
                marginTop: rem(40),
              }}
            >
              <Box>
                <Text
                  fw={700}
                  size="xl"
                  c="white"
                  ta="center"
                >
                  99.8%
                </Text>
                <Text size="sm" c="white" opacity={0.8}>
                  Uptime System
                </Text>
              </Box>
              <Box
                style={{
                  width: '1px',
                  background: 'rgba(255, 255, 255, 0.3)',
                }}
              />
              <Box>
                <Text
                  fw={700}
                  size="xl"
                  c="white"
                  ta="center"
                >
                  24/7
                </Text>
                <Text size="sm" c="white" opacity={0.8}>
                  Real-time Monitoring
                </Text>
              </Box>
              <Box
                style={{
                  width: '1px',
                  background: 'rgba(255, 255, 255, 0.3)',
                }}
              />
              <Box>
                <Text
                  fw={700}
                  size="xl"
                  c="white"
                  ta="center"
                >
                  100+
                </Text>
                <Text size="sm" c="white" opacity={0.8}>
                  Active Users
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}