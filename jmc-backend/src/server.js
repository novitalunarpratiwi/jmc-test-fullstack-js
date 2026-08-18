require('dotenv').config();
const app = require('./app');
const prisma = require('./configs/prisma');

const PORT = process.env.PORT || 5000;

// Jalankan server HANYA jika bukan di environment Vercel / serverless
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    server.close(() => {
      console.log('Server closed and database connection terminated.');
      process.exit(0);
    });
  });
}

// Wajib diekspor untuk Vercel
module.exports = app;