<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex gap-2 ms-auto">
        <!-- Filter Tahun dengan v-model -->
        <select v-model="selectedYear" class="form-select" style="width: 180px">
          <option value="">Semua Tahun</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>

        <!-- Search dengan v-model -->
        <div class="input-group">
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control" 
            placeholder="Cari Data Bulan..." 
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
            <th width="5">No</th>
            <th>Nama Bulan</th>
            <th class="text-center">Total Penerima</th>
            <th class="text-end">Total Tunjangan Transport</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>
        <!-- Loop dipindahkan ke <tr>, bukan <tbody> -->
        <tbody>
          <!-- Jika data ditemukan -->
          <tr v-for="(item, index) in paginatedData" :key="item.id">
            <!-- Penomoran otomatis menyesuaikan halaman -->
            <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ item.bulan }}</td>
            <td class="text-center">{{ item.totalPenerima }}</td>
            <td class="text-end">{{ formatRupiah(item.totalTunjangan) }}</td>
            <td class="text-center">
              <NuxtLink
                :to="`/tunjangan/transport/detail/${item.id}`"
                class="btn btn-primary btn-sm"
              >
                Detail
              </NuxtLink>
            </td>
          </tr>

          <!-- Jika data kosong (hasil filter/search tidak ada) -->
          <tr v-if="paginatedData.length === 0">
            <td colspan="5" class="text-center text-muted py-4">
              Data tidak ditemukan.
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
</template>

<script setup>
// Tambahkan ref, computed, dan watch dari vue
import { ref, computed, watch } from 'vue';
import { IconSearch } from "@tabler/icons-vue";

// Pastikan file ini tersedia di dalam direktori Anda
import { formatRupiah } from "~/utils/formatRupiah.js";
import { tunjanganTransport } from "~/data/tunjangan-transport.js";

definePageMeta({
  title: "Tunjangan Transport",
});

useSeoMeta({
  title: "Tunjangan Transport",
});

// --- State Management ---
const searchQuery = ref("");
const selectedYear = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(5); // Ubah angka ini untuk mengatur jumlah baris per halaman

// --- Computed Properties ---

// 1. Mengolah Filter & Pencarian Data
const filteredData = computed(() => {
  let result = tunjanganTransport || [];

  // Filter berdasarkan pilihan tahun
  if (selectedYear.value) {
    result = result.filter(item => {
      // Mencari kecocokan string tahun di dalam nama bulan (contoh: "Januari 2026")
      // Atau jika di file data punya atribut spesifik item.tahun, gunakan: item.tahun == selectedYear.value
      return item.bulan.includes(selectedYear.value);
    });
  }

  // Filter berdasarkan input teks (huruf besar/kecil diabaikan)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(item => 
      item.bulan.toLowerCase().includes(query)
    );
  }

  return result;
});

// 2. Mengolah Pemotongan Data untuk Halaman Aktif (Pagination)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

// 3. Menghitung Total Halaman yang Diperlukan
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value);
});

// --- Watchers ---
// Otomatis mengembalikan ke halaman 1 setiap kali user mengetik pencarian atau mengubah filter tahun
watch([searchQuery, selectedYear], () => {
  currentPage.value = 1;
});
</script>