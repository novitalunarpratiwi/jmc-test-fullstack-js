const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Buat role terlebih dahulu jika belum ada
  const superadminRole = await prisma.user_role.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, nama_role: 'Superadmin' }
  });

  const managerRole = await prisma.user_role.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, nama_role: 'Manager HRD' }
  });

  const adminRole = await prisma.user_role.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, nama_role: 'Admin HRD' }
  });

  // 2. Buat User berdasarkan 'username'
  await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      password_hash: hashedPassword,
      nama: 'Super Administrator',
      email: 'superadmin@jmc.com',
      id_role: superadminRole.id,
      disabled: 0
    }
  });

  await prisma.user.upsert({
    where: { username: 'managerhrd' },
    update: {},
    create: {
      username: 'managerhrd',
      password_hash: hashedPassword,
      nama: 'Manager HRD',
      email: 'manager@jmc.com',
      id_role: managerRole.id,
      disabled: 0
    }
  });

  await prisma.user.upsert({
    where: { username: 'adminhrd' },
    update: {},
    create: {
      username: 'adminhrd',
      password_hash: hashedPassword,
      nama: 'Admin HRD',
      email: 'admin@jmc.com',
      id_role: adminRole.id,
      disabled: 0
    }
  });

  // =================================================================
  // 3. (TAMBAHAN) Data Default Setting Tunjangan Transport
  // Buka komentar di bawah jika tabel setting_tunjangan sudah ada
  // =================================================================
  
  await prisma.setting_tunjangan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      tarif: 7000,
      berlaku_mulai: new Date('2026-08-28'),
      min_km: 19,
      max_km: 121
    }
  });
  

  // =================================================================
  // 4. (TAMBAHAN) Data Dummy Log Aktivitas untuk test UI
  // Buka komentar di bawah jika tabel activity_log sudah ada
  // =================================================================
  
  await prisma.activity_log.createMany({
    data: [
      { userId: 1, action: 'LOGIN', module: 'Auth', detail: 'Superadmin berhasil login' },
      { userId: 3, action: 'CREATE', module: 'Tunjangan Transport', detail: 'Admin HRD menghitung tunjangan bulan ini' }
    ]
  });
  

  console.log('Berhasil seeding data Role, User, dan Modul lainnya!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });