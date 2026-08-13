const prisma = require('../configs/prisma');

// 1. Get Pendidikan by ID Pegawai
const getPendidikanByPegawai = async (req, res) => {
  const { id_pegawai } = req.params;
  try {
    const pendidikan = await prisma.pegawai_pendidikan.findMany({
      where: { id_pegawai: Number(id_pegawai) },
      orderBy: { tahun_lulus: 'desc' } // Mengurutkan dari tahun lulus terbaru (opsional, sesuaikan kolom jika ada)
    });

    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mengambil riwayat pendidikan pegawai',
      data: pendidikan
    });
  } catch (error) {
    console.error('Get Pendidikan error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data pendidikan',
      error: error.message
    });
  }
};

// 2. Create Pendidikan Pegawai
const createPendidikan = async (req, res) => {
  try {
    const newData = req.body;
    const pendidikan = await prisma.pegawai_pendidikan.create({
      data: newData
    });

    return res.status(201).json({
      status: 'success',
      message: 'Riwayat pendidikan berhasil ditambahkan',
      data: pendidikan
    });
  } catch (error) {
    console.error('Create Pendidikan error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menambahkan riwayat pendidikan',
      error: error.message
    });
  }
};

// 3. Delete Pendidikan Pegawai
const deletePendidikan = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.pegawai_pendidikan.delete({
      where: { id: Number(id) }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Riwayat pendidikan berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete Pendidikan error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus riwayat pendidikan',
      error: error.message
    });
  }
};

module.exports = {
  getPendidikanByPegawai,
  createPendidikan,
  deletePendidikan
};