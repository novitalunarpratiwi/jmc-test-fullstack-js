const prisma = require('../configs/prisma');

// 1. Get All Pegawai
const getAllPegawai = async (req, res) => {
  try {
    const pegawai = await prisma.pegawai.findMany();
    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mengambil daftar pegawai',
      data: pegawai
    });
  } catch (error) {
    console.error('Get All Pegawai error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data pegawai',
      error: error.message
    });
  }
};

// 2. Get Pegawai by ID
const getPegawaiById = async (req, res) => {
  const { id } = req.params;
  try {
    const pegawai = await prisma.pegawai.findUnique({
      where: { id: Number(id) }
    });

    if (!pegawai) {
      return res.status(404).json({
        status: 'error',
        message: 'Data pegawai tidak ditemukan'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mengambil detail pegawai',
      data: pegawai
    });
  } catch (error) {
    console.error('Get Pegawai By ID error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil detail pegawai',
      error: error.message
    });
  }
};

// 3. Create Pegawai
const createPegawai = async (req, res) => {
  try {
    const newData = req.body;
    const pegawai = await prisma.pegawai.create({
      data: newData
    });

    return res.status(201).json({
      status: 'success',
      message: 'Data pegawai berhasil ditambahkan',
      data: pegawai
    });
  } catch (error) {
    console.error('Create Pegawai error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menambahkan data pegawai',
      error: error.message
    });
  }
};

// 4. Update Pegawai
const updatePegawai = async (req, res) => {
  const { id } = req.params;
  try {
    const updateData = req.body;
    const pegawai = await prisma.pegawai.update({
      where: { id: Number(id) },
      data: updateData
    });

    return res.status(200).json({
      status: 'success',
      message: 'Data pegawai berhasil diperbarui',
      data: pegawai
    });
  } catch (error) {
    console.error('Update Pegawai error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui data pegawai (ID mungkin tidak ditemukan)',
      error: error.message
    });
  }
};

// 5. Delete Pegawai
const deletePegawai = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.pegawai.delete({
      where: { id: Number(id) }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Data pegawai berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete Pegawai error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus data pegawai',
      error: error.message
    });
  }
};

module.exports = {
  getAllPegawai,
  getPegawaiById,
  createPegawai,
  updatePegawai,
  deletePegawai
};