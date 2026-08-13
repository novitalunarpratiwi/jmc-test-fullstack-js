const express = require('express');
const router = express.Router();
const { hitungTunjangan } = require('../controllers/tunjanganController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/tunjangan/hitung', verifyToken, hitungTunjangan);

module.exports = router;