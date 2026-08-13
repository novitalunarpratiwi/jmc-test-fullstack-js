<template>
  <div class="page-wrapper">
    <!-- Page Header dengan struktur native Tabler -->
    <div class="page-header d-print-none mb-4">
      <div class="container-xl">
        <div class="row g-2 align-items-center">
          <div class="col">
            <!-- Pre-title -->
            <div class="page-pretitle text-uppercase mb-1">
              Konfigurasi Sistem
            </div>
            <h2 class="page-title text-dark">
              <!-- Ikon Setting Tabler -->
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-settings me-2 text-primary" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
              </svg>
              Setting Tunjangan Transport
            </h2>
            <div class="text-muted mt-2">
              Atur besaran nominal tunjangan transport harian untuk karyawan.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Page Body -->
    <div class="page-body">
      <div class="container-xl">
        <div class="row">
          <!-- Diperlebar menjadi col-lg-8 agar layout 2 kolom form tidak terlalu sempit -->
          <div class="col-12 col-md-10 col-lg-8">
            <div class="card shadow-sm border-0 rounded-3">
              <div class="card-header bg-transparent border-bottom-0 pt-4 pb-0">
                <h3 class="card-title fw-bold">Form Konfigurasi</h3>
              </div>
              <div class="card-body">
                
                <!-- FORM MULAI DI SINI -->
                <form @submit.prevent="handleSave">
                  <div class="p-3 border rounded mb-3">
                    <div class="row">
                      <!-- Tarif (Rp) -->
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Tarif (Rp)</label>
                        <input 
                          type="number" 
                          class="form-control" 
                          v-model="form.tarif" 
                          placeholder="0"
                          required
                          :disabled="isLoading"
                        >
                      </div>

                      <!-- Berlaku Mulai -->
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Berlaku Mulai</label>
                        <input 
                          type="date" 
                          class="form-control" 
                          v-model="form.berlakuMulai" 
                          required
                          :disabled="isLoading"
                        >
                      </div>

                      <!-- Minimum Kilometer -->
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Minimum Kilometer</label>
                        <input 
                          type="number" 
                          class="form-control" 
                          v-model="form.minKm" 
                          placeholder="0"
                          required
                          :disabled="isLoading"
                        >
                      </div>

                      <!-- Maksimum Kilometer -->
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Maksimum Kilometer</label>
                        <input 
                          type="number" 
                          class="form-control" 
                          v-model="form.maxKm" 
                          placeholder="0"
                          required
                          :disabled="isLoading"
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Alert Notifikasi -->
                  <div v-if="message.text" :class="`alert alert-${message.type} mb-3`" role="alert">
                    {{ message.text }}
                  </div>

                  <!-- Area Tombol -->
                  <div class="d-flex gap-2 p-3 bg-light border rounded">
                    <button 
                      type="submit" 
                      class="btn btn-primary px-4" 
                      :disabled="isLoading"
                    >
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Simpan
                    </button>
                    
                    <button 
                      type="button" 
                      class="btn btn-outline-primary px-4" 
                      @click="goBack"
                      :disabled="isLoading"
                    >
                      Kembali
                    </button>
                  </div>
                </form>
                <!-- FORM SELESAI -->

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 

definePageMeta({
  title: "Setting Tunjangan Transport",
});

const router = useRouter();

// --- State Form ---
const form = reactive({
  tarif: 7000,
  berlakuMulai: '2026-08-28', // Sesuai dengan tanggal di gambar
  minKm: 19,
  maxKm: 121
});

const isLoading = ref(false);
const message = reactive({
  type: '',
  text: ''
});

// --- Lifecycle ---
onMounted(async () => {
  // Area untuk mengambil data konfigurasi awal jika diperlukan dari API
});

// --- Fungsi Simpan ---
const handleSave = async () => {
  try {
    isLoading.value = true;
    message.text = ''; 
    
    // Simulasi jeda penyimpanan
    await new Promise(resolve => setTimeout(resolve, 800));
    
    showMessage('success', 'Konfigurasi tunjangan berhasil disimpan!');
  } catch (error) {
    showMessage('danger', 'Terjadi kesalahan saat menyimpan data.');
  } finally {
    isLoading.value = false;
  }
};

// --- Fungsi Kembali ---
const goBack = () => {
  router.back(); 
};

// --- Fungsi Pesan Notifikasi ---
const showMessage = (type, text) => {
  message.type = type;
  message.text = text;
  
  if(type === 'success') {
    setTimeout(() => {
      message.text = '';
    }, 3000);
  }
};
</script>