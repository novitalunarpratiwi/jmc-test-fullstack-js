import {
  IconLayoutDashboardFilled,
  IconUserFilled,
  IconDatabaseFilled,
  IconUsers,
  IconHistory,
} from "@tabler/icons-vue";

/*
 * Daftar menu sidebar berdasarkan role user:
 * 1 = Superadmin
 * 2 = Manager HRD
 * 3 = Admin HRD
 */

export const menuItems = [
  // Dashboard
  {
    title: "Dashboard",
    icon: IconLayoutDashboardFilled,
    to: "/",
    roles: [1, 2, 3],
  },

  // Data Pegawai
  {
    title: "Data Pegawai",
    icon: IconUserFilled,
    to: "/pegawai",
    roles: [1, 2, 3],
  },

  // Tunjangan
  {
    title: "Tunjangan",
    icon: IconDatabaseFilled,
    roles: [1, 2],
    children: [
      {
        title: "Setting Tunjangan Transport",
        to: "/tunjangan/setting",
      },
      {
        title: "Tunjangan Transport",
        to: "/tunjangan/transport",
      },
    ],
  },

  // Manajemen User
  {
    title: "Manajemen User",
    icon: IconUsers,
    roles: [2],
    children: [
      {
        title: "Manajemen Role",
        to: "/user/role",
      },
      {
        title: "Manajemen User",
        to: "/user/manage",
      },
    ],
  },

  // Log Aktifitas
  {
    title: "Log Aktifitas",
    icon: IconHistory,
    to: "/log",
    roles: [2],
  },
];