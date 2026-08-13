const verifyRole = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role; // Role diambil dari payload JWT

      if (!userRole || (allowedRoles.length > 0 && !allowedRoles.includes(userRole))) {
        return res.status(403).json({
          status: 'error',
          message: 'Akses ditolak. Anda tidak memiliki hak akses (role) untuk fitur ini.'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal memverifikasi role pengguna.',
        error: error.message
      });
    }
  };
};

module.exports = { verifyRole };