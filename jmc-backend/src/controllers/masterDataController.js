const prisma = require('../configs/prisma');

// 1. Get All Master Wilayah (Untuk dropdown Kecamatan/Kota/Provinsi)
const getMasterWilayah = async (req, res) => {
  try {
    const wilayah = await prisma.master_wilayah.findMany();
    
    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mengambil data master wilayah',
      data: wilayah
    });
  } catch (error) {
    console.error('Get Master Wilayah error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data wilayah',
      error: error.message
    });
  }
};

// 2. Get All Master Data (Untuk dropdown Jabatan, Departemen, dll jika disatukan di tabel master_data)
const getMasterData = async (req, res) => {
  try {
    const masterData = await prisma.master_data.findMany();
    
    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mengambil master data umum',
      data: masterData
    });
  } catch (error) {
    console.error('Get Master Data error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil master data',
      error: error.message
    });
  }
};

module.exports = {
  getMasterWilayah,
  getMasterData
};