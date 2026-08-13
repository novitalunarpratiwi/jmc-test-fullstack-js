const prisma = require('../configs/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validasi gagal',
      errors: errors.array()
    });
  }

  const { identifier, password } = req.body;

  try {
    // Cari akun berdasarkan username atau email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier }
        ]
      }
    });

    // Kalau akun tidak ditemukan
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Akun dengan username atau email tersebut tidak ditemukan.'
      });
    }

    // Cek password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Password yang Anda masukkan salah.'
      });
    }

    // Data yang dimasukkan ke dalam token
    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      id_role: user.id_role
    };

    // Buat JWT
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'secret_key_default',
      {
        expiresIn: '8h'
      }
    );

    // Login berhasil
    return res.status(200).json({
      status: 'success',
      message: 'Login berhasil',
      data: {
        token,
        token_type: 'Bearer',
        expires_in: '8h',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          nama: user.nama,
          id_role: user.id_role
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server saat proses login.',
      error: error.message
    });
  }
};

module.exports = {
  login
};