const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Endpoint untuk login admin atau pegawai
 *     tags: [Authentication]
 *     security: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Username atau Email
 *                 example: adminjmc
 *               password:
 *                 type: string
 *                 example: password123
 *               captcha:
 *                 type: string
 *                 example: JMC2026
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan token JWT
 *       400:
 *         description: Validasi input gagal
 *       401:
 *         description: Password salah
 *       404:
 *         description: Akun tidak ditemukan
 */
router.post('/login', login);

module.exports = router;