const express = require('express');
const router = express.Router();
const {
  getAllPegawai,
  getPegawaiById,
  createPegawai,
  updatePegawai,
  deletePegawai
} = require('../controllers/pegawaiController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Endpoint CRUD Pegawai (dilindungi middleware verifyToken)
router.get('/pegawai', verifyToken, getAllPegawai);
router.get('/pegawai/:id', verifyToken, getPegawaiById);
router.post('/pegawai', verifyToken, createPegawai);
router.put('/pegawai/:id', verifyToken, updatePegawai);
router.delete('/pegawai/:id', verifyToken, deletePegawai);

module.exports = router;