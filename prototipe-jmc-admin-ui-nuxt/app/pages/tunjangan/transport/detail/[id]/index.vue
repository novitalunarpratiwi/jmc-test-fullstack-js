<template>
  <div>
    <h3 class="card-title mb-3">Detail Tunjangan: Januari 2026</h3>
    <div class="card shadow-sm border-0 rounded-3">
      <div class="card-header">
        <!-- Tombol dengan simulasi loading -->
        <button class="btn btn-primary" @click="hitungTunjangan" :disabled="isCalculating">
          <span v-if="isCalculating" class="spinner-border spinner-border-sm me-2" role="status"></span>
          Hitung Tunjangan
        </button>
        
        <div class="ms-auto">
          <!-- Input pencarian terhubung dengan v-model -->
          <div class="input-group">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Cari Nama, KM, atau Nominal..."
              style="min-width: 250px;"
            />
            <button class="btn" type="button" disabled>
              <IconSearch :stroke="2" />
            </button>
          </div>
        </div>
      </div>
      
      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter">
          <thead>
            <tr>
              <th width="5" class="text-center">No</th>
              <th>Nama Penerima</th>
              <th class="text-center">Kilometer</th>
              <th class="text-center">Jumlah Hari</th>
              <th class="text-end">Nominal</th>
            </tr>
          </thead>
          <!-- Pindahkan v-for ke <tr> agar struktur tabel tidak rusak -->
          <tbody>
            <tr
              v-for="(item, index) in paginatedData"
              :key="item.id || index"
            >
              <!-- Penomoran otomatis menyesuaikan halaman aktif -->
              <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="fw-medium">{{ item.nama }}</td>
              <td class="text-center">{{ item.km }}</td>
              <td class="text-center">{{ item.hari }}</td>
              <td class="text-end">{{ formatRupiah(item.nominal) }}</td>
            </tr>

            <!-- Jika data tidak ditemukan -->
            <tr v-if="paginatedData.length === 0">
              <td colspan="5" class="text-center text-muted py-4">
                Data penerima tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination Reaktif -->
      <div class="card-footer d-flex align-items-center" v-if="totalPages > 0">
        <p class="m-0 text-muted">
          Menampilkan <span>{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span> sampai 
          <span>{{ Math.min(currentPage * itemsPerPage, filteredData.length) }}</span> dari 
          <span>{{ filteredData.length }}</span> data
        </p>

        <ul class="pagination ms-auto m-0">
          <!-- Tombol Prev -->
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="currentPage > 1 && currentPage--">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M15 6l-6 6l6 6"></path>
              </svg>
              prev
            </a>
          </li>
          
          <!-- Nomor Halaman -->
          <li 
            class="page-item" 
            v-for="page in totalPages" 
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
          </li>
          
          <!-- Tombol Next -->
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="currentPage < totalPages && currentPage++">
              next
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 6l6 6l-6 6"></path>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { detailTunjanganTransport } from "~/data/tunjangan-transport.js";
import { IconSearch } from "@tabler/icons-vue";
import { formatRupiah } from "~/utils/formatRupiah.js";

definePageMeta({
  title: "Detail Tunjangan Transport",
});

// --- State Management ---
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10); // Menampilkan 10 data per halaman (bisa diubah)
const isCalculating = ref(false);

// --- Simulasi Fitur Tombol ---
const hitungTunjangan = async () => {
  isCalculating.value = true;
  // Simulasi proses perhitungan di backend (delay 1.5 detik)
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Tampilkan notifikasi (Anda bisa ganti dengan library Toast seperti vue-toastification)
  alert("Perhitungan tunjangan transport bulan ini telah diperbarui!");
  
  isCalculating.value = false;
};

// --- Computed Properties ---

// 1. Mengolah Pencarian Data (Multi-kolom)
const filteredData = computed(() => {
  let result = detailTunjanganTransport || [];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    
    result = result.filter(item => {
      // Pengecekan kecocokan di berbagai kolom
      const matchNama = item.nama?.toLowerCase().includes(query);
      const matchKm = String(item.km).includes(query);
      const matchHari = String(item.hari).includes(query);
      const matchNominal = String(item.nominal).includes(query);
      
      // Jika salah satu cocok, data akan ditampilkan
      return matchNama || matchKm || matchHari || matchNominal;
    });
  }

  return result;
});

// 2. Memotong Data untuk Halaman Aktif
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

// 3. Menghitung Total Halaman
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value);
});

// --- Watchers ---
// Otomatis kembali ke halaman 1 saat user mengetik kata kunci baru
watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>