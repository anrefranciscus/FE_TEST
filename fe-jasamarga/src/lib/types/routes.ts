export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  LAPORAN: '/laporan-lalu-lintas',
  MASTER_GERBANG: '/master-gerbang',
};

export const NAV_MENU = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'dashboard',
  },
  {
    label: 'Laporan Lalu Lintas',
    path: ROUTES.LAPORAN,
    icon: 'report',
  },
  {
    label: 'Master Data Gerbang',
    path: ROUTES.MASTER_GERBANG,
    icon: 'gate',
  },
];