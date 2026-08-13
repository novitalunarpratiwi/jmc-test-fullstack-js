const express = require('express');
const router = express.Router();
const {
  getPendidikanByPegawai,
  createPendidikan,
  deletePendidikan
} = require('../controllers/pendidikanController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Endpoint Pendidikan Pegawai (dilindungi middleware verifyToken)
router.get('/pendidikan/pegawai/:id_pegawai', verifyToken, getPendidikanByPegawai);
router.post('/pendidikan', verifyToken, createPendidikan);
router.delete('/pendidikan/:id', verifyToken, deletePendidikan);

module.exports = router;