const express = require('express');
const router = express.Router();
const prisma = require('../configs/prisma');

router.get('/health', async (req, res) => {
  try {
    // Test koneksi database sederhana
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      status: 'success',
      message: 'Server is running and Database is connected successfully!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server is running, but database connection failed.',
      error: error.message
    });
  }
});

module.exports = router;