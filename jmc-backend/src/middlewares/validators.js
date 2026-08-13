const { body } = require('express-validator');

const validateLogin = [
  body('identifier')
    .notEmpty().withMessage('Username, email, atau nomor HP wajib diisi.'),
  body('password')
    .notEmpty().withMessage('Password wajib diisi.'),
  body('captcha')
    .notEmpty().withMessage('Captcha wajib diisi.')
    .custom((value) => {
      // Contoh captcha sederhana statis atau dinamis (misal: penjumlahan sederhana "2+3" atau string khusus)
      // Di sini kita contohkan validasi sederhana string captcha bernilai "JMC2026" atau hasil matematika
      if (value !== '5' && value.toLowerCase() !== 'jmc2026') {
        throw new Error('Kode captcha tidak valid.');
      }
      return true;
    })
];

module.exports = { validateLogin };