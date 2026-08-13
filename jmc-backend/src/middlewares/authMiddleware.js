const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Access token tidak ditemukan. Harap login terlebih dahulu.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key_default', (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Session telah habis (Token expired). Silakan login kembali.'
        });
      }
      return res.status(403).json({
        status: 'error',
        message: 'Token tidak valid.'
      });
    }

    // Simpan data payload user ke request object
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };