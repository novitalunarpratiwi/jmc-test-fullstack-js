const express = require('express');
const router = express.Router();
const {
  getMasterWilayah,
  getMasterData
} = require('../controllers/masterDataController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Endpoint Master Data (Bisa diakses oleh semua user yang sudah login)
router.get('/master-wilayah', verifyToken, getMasterWilayah);
router.get('/master-data', verifyToken, getMasterData);

module.exports = router;