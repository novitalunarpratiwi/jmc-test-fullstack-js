<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { dataPegawai } from "~/data/data-pegawai.js";

const route = useRoute();
const router = useRouter();

/*
 * Jika ada id pada URL, berarti mode edit.
 * Jika tidak ada id, berarti mode tambah.
 */
const isEdit = computed(() => Boolean(route.params.id));

/*
 * Data form pegawai
 */
const form = ref({
  nip: "",
  nama: "",
  jabatan: "",
  tanggalMasuk: "",
  masaKerja: "",
  statusKontrak: "",
});

/*
 * Daftar pilihan jabatan
 */
const jabatanOptions = [
  "Programmer",
  "System Analyst",
  "Akuntan",
  "Manager Produksi",
];

/*
 * Ambil data pegawai ketika halaman edit dibuka
 */
const loadEmployee = () => {
  if (!isEdit.value) {
    return;
  }

  const employee = dataPegawai.find(
    (item) => item.nip === route.params.id
  );

  if (!employee) {
    alert("Data pegawai tidak ditemukan.");
    router.push("/pegawai");
    return;
  }

  form.value = {
    nip: employee.nip || "",
    nama: employee.nama || "",
    jabatan: employee.jabatan || "",
    tanggalMasuk: employee.tanggalMasuk || "",
    masaKerja: String(employee.masaKerja || "").replace(
      " tahun",
      ""
    ),
    statusKontrak: employee.statusKontrak || "",
  };
};

/*
 * Simpan data pegawai
 */
const handleSubmit = () => {
  if (
    !form.value.nip ||
    !form.value.nama ||
    !form.value.jabatan ||
    !form.value.tanggalMasuk ||
    !form.value.masaKerja ||
    !form.value.statusKontrak
  ) {
    alert("Mohon lengkapi semua data pegawai.");
    return;
  }

  if (isEdit.value) {
    /*
     * Untuk sementara data masih menggunakan data dummy.
     * Nanti bagian ini bisa diganti dengan API backend.
     */
    const index = dataPegawai.findIndex(
      (item) => item.nip === route.params.id
    );

    if (index !== -1) {
      dataPegawai[index] = {
        ...dataPegawai[index],
        nip: form.value.nip,
        nama: form.value.nama,
        jabatan: form.value.jabatan,
        tanggalMasuk: form.value.tanggalMasuk,
        masaKerja: `${form.value.masaKerja} tahun`,
        statusKontrak: form.value.statusKontrak,
      };
    }

    alert("Data pegawai berhasil diubah.");
  } else {
    /*
     * Cek NIP agar tidak boleh sama
     */
    const existingEmployee = dataPegawai.find(
      (item) => item.nip === form.value.nip
    );

    if (existingEmployee) {
      alert("NIP sudah digunakan.");
      return;
    }

    dataPegawai.push({
      nip: form.value.nip,
      nama: form.value.nama,
      jabatan: form.value.jabatan,
      tanggalMasuk: form.value.tanggalMasuk,
      masaKerja: `${form.value.masaKerja} tahun`,
      statusKontrak: form.value.statusKontrak,
    });

    alert("Data pegawai berhasil ditambahkan.");
  }

  router.push("/pegawai");
};

/*
 * Kembali ke daftar pegawai
 */
const handleCancel = () => {
  router.push("/pegawai");
};

/*
 * Jalankan ketika halaman dibuka
 */
onMounted(() => {
  loadEmployee();
});
</script>

<template>
  <div class="row">
    <div class="col-12">
      <div class="card">

        <!-- Header -->
        <div class="card-header">
          <h3 class="card-title">
            {{ isEdit ? "Edit Pegawai" : "Tambah Pegawai" }}
          </h3>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit">
          <div class="card-body">

            <div class="row g-4">

              <!-- NIP -->
              <div class="col-md-6">
                <label class="form-label">
                  NIP
                </label>

                <input
                  v-model="form.nip"
                  type="text"
                  class="form-control"
                  placeholder="Masukkan NIP"
                  :disabled="isEdit"
                  required
                />
              </div>

              <!-- Nama -->
              <div class="col-md-6">
                <label class="form-label">
                  Nama Lengkap
                </label>

                <input
                  v-model="form.nama"
                  type="text"
                  class="form-control"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <!-- Jabatan -->
              <div class="col-md-6">
                <label class="form-label">
                  Jabatan
                </label>

                <select
                  v-model="form.jabatan"
                  class="form-select"
                  required
                >
                  <option value="">
                    Pilih Jabatan
                  </option>

                  <option
                    v-for="jabatan in jabatanOptions"
                    :key="jabatan"
                    :value="jabatan"
                  >
                    {{ jabatan }}
                  </option>
                </select>
              </div>

              <!-- Tanggal Masuk -->
              <div class="col-md-6">
                <label class="form-label">
                  Tanggal Masuk
                </label>

                <input
                  v-model="form.tanggalMasuk"
                  type="date"
                  class="form-control"
                  required
                />
              </div>

              <!-- Masa Kerja -->
              <div class="col-md-6">
                <label class="form-label">
                  Masa Kerja
                </label>

                <div class="input-group">
                  <input
                    v-model="form.masaKerja"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="Masukkan masa kerja"
                    required
                  />

                  <span class="input-group-text">
                    Tahun
                  </span>
                </div>
              </div>

              <!-- Status Kontrak -->
              <div class="col-md-6">
                <label class="form-label">
                  Status Kontrak
                </label>

                <select
                  v-model="form.statusKontrak"
                  class="form-select"
                  required
                >
                  <option value="">
                    Pilih Status Kontrak
                  </option>

                  <option value="PKWTT">
                    PKWTT
                  </option>

                  <option value="PKWT">
                    PKWT
                  </option>

                  <option value="Magang">
                    Magang
                  </option>
                </select>
              </div>

            </div>
          </div>

          <!-- Footer -->
          <div class="card-footer d-flex justify-content-end gap-2">

            <button
              type="button"
              class="btn btn-secondary"
              @click="handleCancel"
            >
              Kembali
            </button>

            <button
              type="submit"
              class="btn btn-primary"
            >
              {{ isEdit ? "Simpan Perubahan" : "Simpan" }}
            </button>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>