const prisma = require('../configs/prisma');
const { logActivity } = require('../utils/logger');

const hitungTunjangan = async (req, res) => {
  // data_kehadiran didapat dari input frontend, misal: [{ id_pegawai: 1, hari_masuk: 20 }]
  const { bulan, tahun, data_kehadiran } = req.body; 

  try {
    // 1. Ambil setting tarif tunjangan terbaru
    const setting = await prisma.setting_tunjangan.findFirst({
      orderBy: { berlaku_mulai: 'desc' }
    });

    if (!setting) {
      return res.status(400).json({ message: 'Setting tunjangan belum diatur!' });
    }

    const hasilPerhitungan = [];

    // 2. Loop tiap pegawai untuk dihitung
    for (const kehadiran of data_kehadiran) {
      const pegawai = await prisma.pegawai.findUnique({
        where: { id: kehadiran.id_pegawai }
      });

      if (!pegawai) continue;
      
      // Asumsi status pegawai ada di master data, skip jika bukan pegawai tetap
      // if (pegawai.status !== 'Tetap') continue; 

      // Ambil jarak dan bulatkan (desimal >= 0.5 ke atas, < 0.5 ke bawah)
      let km = Math.round(parseFloat(pegawai.jarak_rumah_kantor || 0)); 
      let hariMasuk = kehadiran.hari_masuk;
      let nominal = 0;

      // Syarat: Min 19 hari kerja, dan jarak lebih dari 5 km
      if (hariMasuk >= 19 && km > 5) {
        // Jarak maksimal yang dihitung adalah 25 km
        let kmDihitung = km > 25 ? 25 : km;
        
        // Rumus: Base Fare x Km x Hari Masuk
        nominal = setting.base_fare * kmDihitung * hariMasuk;
      }

      hasilPerhitungan.push({
        id_pegawai: pegawai.id,
        bulan,
        tahun,
        jarak_km: km,
        jumlah_hari_masuk: hariMasuk,
        nominal_tunjangan: nominal
      });
    }

    // 3. Simpan hasil perhitungan ke database
    await prisma.tunjangan_transport.createMany({
      data: hasilPerhitungan
    });

    // 4. Ambil userId dari token/sesi (biasanya disisipkan oleh middleware auth)
    const userId = req.user ? req.user.id : 1; 

    // 5. Catat aktivitas ke log
    await logActivity(
      userId, 
      'CREATE', 
      'Tunjangan Transport', 
      `Menghitung tunjangan untuk periode ${bulan}/${tahun}`,
      req.ip
    );

    // 6. Kirim respons sukses
    return res.status(200).json({
      status: 'success',
      message: 'Perhitungan tunjangan berhasil diproses',
      data: hasilPerhitungan
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { hitungTunjangan };