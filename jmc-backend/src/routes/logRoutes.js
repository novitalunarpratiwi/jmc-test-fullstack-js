const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');
// const { verifyToken } = require('../middleware/authMiddleware'); // Pastikan ini aman

router.get('/', getLogs); // Endpoint: GET /api/logs

module.exports = router;