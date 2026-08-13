<script setup>
definePageMeta({
  title: "Data Pegawai",
  layout: false,
});

useSeoMeta({
  title: "Data Pegawai",
});

import {
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
  IconFileDescription,
  IconCloudDownload,
  IconDownload,
  IconFileSpreadsheet,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-vue";

import { dataPegawai } from "~/data/data-pegawai.js";
import { formatDateID } from "~/utils/formatDate.js";

/*
 * Data pegawai
 *
 * Dibuat sebagai ref agar data bisa berubah ketika:
 * - pegawai dihapus
 * - status pegawai diubah
 */
const employees = ref([...dataPegawai]);

/*
 * Search
 *
 * Pencarian berdasarkan:
 * - NIP
 * - Nama
 * - Jabatan
 */
const searchQuery = ref("");

/*
 * Filter Jabatan
 */
const selectedJabatan = ref("");

/*
 * Filter Masa Kerja
 */
const minMasaKerja = ref("");
const maxMasaKerja = ref("");

/*
 * Filter Status Kontrak
 */
const selectedKontrak = ref("");

/*
 * Sorting
 *
 * Kolom yang bisa diurutkan:
 * - NIP
 * - Nama
 * - Jabatan
 * - Tanggal Masuk
 * - Masa Kerja
 */
const sortBy = ref("");
const sortDirection = ref("asc");

/*
 * Bulk Select
 *
 * Menyimpan NIP pegawai yang dipilih.
 */
const selectedEmployees = ref([]);

/*
 * Status yang akan diberikan kepada
 * pegawai yang dipilih.
 */
const selectedStatus = ref("");

/*
 * Pegawai yang akan dihapus.
 *
 * Digunakan untuk modal konfirmasi.
 */
const employeeToDelete = ref(null);

/*
 * Daftar jabatan
 *
 * Diambil otomatis dari data pegawai.
 */
const jabatanOptions = computed(() => {
  return [
    ...new Set(
      employees.value
        .map((item) => item.jabatan)
        .filter(Boolean)
    ),
  ];
});

/*
 * Data setelah Search dan Filter
 */
const filteredPegawai = computed(() => {
  let result = [...employees.value];

  /*
   * Search NIP / Nama / Jabatan
   */
  const keyword = searchQuery.value
    .trim()
    .toLowerCase();

  if (keyword) {
    result = result.filter((item) => {
      return (
        String(item.nip || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.nama || "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.jabatan || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }

  /*
   * Filter Jabatan
   */
  if (selectedJabatan.value) {
    result = result.filter(
      (item) =>
        item.jabatan === selectedJabatan.value
    );
  }

  /*
   * Filter Masa Kerja Minimum
   */
  if (minMasaKerja.value !== "") {
    result = result.filter((item) => {
      const masaKerja = parseInt(
        item.masaKerja,
        10
      );

      return (
        masaKerja >=
        Number(minMasaKerja.value)
      );
    });
  }

  /*
   * Filter Masa Kerja Maksimum
   */
  if (maxMasaKerja.value !== "") {
    result = result.filter((item) => {
      const masaKerja = parseInt(
        item.masaKerja,
        10
      );

      return (
        masaKerja <=
        Number(maxMasaKerja.value)
      );
    });
  }

  /*
   * Filter Status Kontrak
   */
  if (selectedKontrak.value) {
    result = result.filter(
      (item) =>
        item.statusKontrak ===
        selectedKontrak.value
    );
  }

  return result;
});

/*
 * Sorting data
 */
const sortedPegawai = computed(() => {
  const result = [...filteredPegawai.value];

  if (!sortBy.value) {
    return result;
  }

  result.sort((a, b) => {
    let valueA = a[sortBy.value];
    let valueB = b[sortBy.value];

    /*
     * Masa kerja berupa teks:
     * "5 tahun", "2 tahun", dst.
     */
    if (sortBy.value === "masaKerja") {
      valueA = parseInt(valueA, 10) || 0;
      valueB = parseInt(valueB, 10) || 0;

      return sortDirection.value === "asc"
        ? valueA - valueB
        : valueB - valueA;
    }

    /*
     * Tanggal masuk
     */
    if (sortBy.value === "tanggalMasuk") {
      valueA = new Date(valueA);
      valueB = new Date(valueB);

      return sortDirection.value === "asc"
        ? valueA - valueB
        : valueB - valueA;
    }

    /*
     * Sorting teks
     */
    return sortDirection.value === "asc"
      ? String(valueA || "").localeCompare(
          String(valueB || "")
        )
      : String(valueB || "").localeCompare(
          String(valueA || "")
        );
  });

  return result;
});

/*
 * Sorting tabel
 */
const handleSort = (column) => {
  if (sortBy.value === column) {
    sortDirection.value =
      sortDirection.value === "asc"
        ? "desc"
        : "asc";

    return;
  }

  sortBy.value = column;
  sortDirection.value = "asc";
};

/*
 * Pagination
 */
const currentPage = ref(1);
const itemsPerPage = ref(10);

/*
 * Jumlah halaman
 */
const totalPages = computed(() => {
  return Math.max(
    1,
    Math.ceil(
      sortedPegawai.value.length /
        itemsPerPage.value
    )
  );
});

/*
 * Data yang ditampilkan pada halaman aktif
 */
const paginatedPegawai = computed(() => {
  const start =
    (currentPage.value - 1) *
    itemsPerPage.value;

  return sortedPegawai.value.slice(
    start,
    start + itemsPerPage.value
  );
});

/*
 * Nomor halaman
 */
const pageNumbers = computed(() => {
  return Array.from(
    { length: totalPages.value },
    (_, index) => index + 1
  );
});

/*
 * Pindah halaman
 */
const goToPage = (page) => {
  if (
    page < 1 ||
    page > totalPages.value
  ) {
    return;
  }

  currentPage.value = page;
};

/*
 * Kembali ke halaman pertama
 * ketika filter berubah.
 */
watch(
  [
    searchQuery,
    selectedJabatan,
    minMasaKerja,
    maxMasaKerja,
    selectedKontrak,
  ],
  () => {
    currentPage.value = 1;
  }
);

/*
 * Cek apakah seluruh pegawai
 * pada halaman aktif sudah dipilih.
 */
const isAllSelected = computed(() => {
  if (!paginatedPegawai.value.length) {
    return false;
  }

  return paginatedPegawai.value.every(
    (item) =>
      selectedEmployees.value.includes(
        item.nip
      )
  );
});

/*
 * Pilih / batalkan satu pegawai.
 */
const toggleEmployee = (nip) => {
  const index =
    selectedEmployees.value.indexOf(nip);

  if (index === -1) {
    selectedEmployees.value.push(nip);
  } else {
    selectedEmployees.value.splice(
      index,
      1
    );
  }
};

/*
 * Pilih / batalkan seluruh pegawai
 * pada halaman aktif.
 */
const toggleAllEmployees = () => {
  const currentNips =
    paginatedPegawai.value.map(
      (item) => item.nip
    );

  if (isAllSelected.value) {
    selectedEmployees.value =
      selectedEmployees.value.filter(
        (nip) =>
          !currentNips.includes(nip)
      );

    return;
  }

  currentNips.forEach((nip) => {
    if (
      !selectedEmployees.value.includes(
        nip
      )
    ) {
      selectedEmployees.value.push(nip);
    }
  });
};

/*
 * Hapus satu pegawai
 */
const confirmDelete = (employee) => {
  employeeToDelete.value = employee;
};

/*
 * Konfirmasi hapus satu pegawai.
 */
const deleteEmployee = () => {
  if (!employeeToDelete.value) {
    return;
  }

  const nip =
    employeeToDelete.value.nip;

  employees.value =
    employees.value.filter(
      (item) => item.nip !== nip
    );

  selectedEmployees.value =
    selectedEmployees.value.filter(
      (item) => item !== nip
    );

  employeeToDelete.value = null;
};

/*
 * Hapus seluruh pegawai yang dipilih.
 */
const deleteSelectedEmployees = () => {
  if (!selectedEmployees.value.length) {
    return;
  }

  employees.value =
    employees.value.filter(
      (item) =>
        !selectedEmployees.value.includes(
          item.nip
        )
    );

  selectedEmployees.value = [];

  /*
   * Jika halaman aktif sudah kosong,
   * kembali ke halaman sebelumnya.
   */
  if (
    currentPage.value >
    totalPages.value
  ) {
    currentPage.value =
      totalPages.value;
  }
};

/*
 * Ubah status pegawai yang dipilih.
 *
 * Status:
 * - Aktif
 * - Nonaktif
 */
const updateSelectedStatus = () => {
  if (
    !selectedEmployees.value.length ||
    !selectedStatus.value
  ) {
    return;
  }

  employees.value =
    employees.value.map((item) => {
      if (
        selectedEmployees.value.includes(
          item.nip
        )
      ) {
        return {
          ...item,
          status:
            selectedStatus.value,
        };
      }

      return item;
    });

  selectedEmployees.value = [];
  selectedStatus.value = "";
};

/*
 * Download daftar pegawai sebagai CSV.
 *
 * File CSV dapat dibuka menggunakan Excel.
 */
const downloadExcel = () => {
  const headers = [
    "No",
    "NIP",
    "Nama",
    "Jabatan",
    "Tanggal Masuk",
    "Masa Kerja",
    "Status Kontrak",
    "Status",
  ];

  const rows =
    sortedPegawai.value.map(
      (item, index) => [
        index + 1,
        item.nip,
        item.nama,
        item.jabatan,
        item.tanggalMasuk,
        item.masaKerja,
        item.statusKontrak || "-",
        item.status || "Aktif",
      ]
    );

  const csv = [
    headers,
    ...rows,
  ]
    .map((row) =>
      row
        .map(
          (value) =>
            `"${String(value).replace(
              /"/g,
              '""'
            )}"`
        )
        .join(",")
    )
    .join("\n");

  const blob = new Blob(
    ["\ufeff" + csv],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download =
    "daftar-pegawai.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/*
 * Download daftar pegawai sebagai PDF.
 *
 * Untuk sementara menggunakan fitur print browser.
 * User dapat memilih "Save as PDF".
 */
const downloadPdf = () => {
  window.print();
};

/*
 * Download detail satu pegawai.
 *
 * Untuk sementara menggunakan print browser.
 */
const downloadEmployeePdf = (employee) => {
  console.log(
    "Download detail pegawai:",
    employee
  );

  window.print();
};
</script>

<template>
  <NuxtLayout name="default">

    <!-- Tombol Data Baru -->
    <template #actions>
      <NuxtLink
        to="/pegawai/form"
        class="btn btn-primary"
      >
        <IconPlus size="20" />
        Data Baru
      </NuxtLink>
    </template>

    <div class="card">

      <!--
        ==================================================
        FILTER
        ==================================================
      -->
      <div class="card-header">
        <div
          class="d-flex flex-wrap gap-2 w-100"
        >

          <!-- Masa Kerja -->
          <div
            class="d-flex align-items-center gap-1"
          >
            <span class="text-nowrap">
              Masa Kerja
            </span>

            <input
              v-model="minMasaKerja"
              type="number"
              min="0"
              class="form-control"
              style="width: 70px"
              placeholder="Min"
            />

            <span>-</span>

            <input
              v-model="maxMasaKerja"
              type="number"
              min="0"
              class="form-control"
              style="width: 70px"
              placeholder="Max"
            />
          </div>

          <!-- Filter Jabatan -->
          <select
            v-model="selectedJabatan"
            class="form-select"
            style="width: 180px"
          >
            <option value="">
              Semua Jabatan
            </option>

            <option
              v-for="jabatan in jabatanOptions"
              :key="jabatan"
              :value="jabatan"
            >
              {{ jabatan }}
            </option>
          </select>

          <!-- Filter Kontrak -->
          <select
            v-model="selectedKontrak"
            class="form-select"
            style="width: 180px"
          >
            <option value="">
              Status Kontrak
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

          <!-- Search -->
          <div
            class="input-group ms-auto"
            style="width: 250px"
          >
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Cari NIP / Nama / Jabatan..."
            />

            <button
              class="btn"
              type="button"
            >
              <IconSearch size="20" />
            </button>
          </div>

        </div>
      </div>

      <!--
        ==================================================
        TOOLBAR
        ==================================================
      -->
      <div
        class="card-body border-bottom"
      >
        <div
          class="d-flex flex-wrap gap-2 align-items-center"
        >

          <!-- Download PDF -->
          <button
            type="button"
            class="btn btn-outline-danger"
            @click="downloadPdf"
          >
            <IconDownload size="18" />
            Download PDF
          </button>

          <!-- Download Excel -->
          <button
            type="button"
            class="btn btn-outline-success"
            @click="downloadExcel"
          >
            <IconFileSpreadsheet
              size="18"
            />
            Download Excel
          </button>

          <!-- Hapus Data -->
          <button
            type="button"
            class="btn btn-danger"
            :disabled="
              selectedEmployees.length === 0
            "
            @click="
              deleteSelectedEmployees
            "
          >
            <IconTrash size="18" />
            Hapus Data
          </button>

          <!-- Status -->
          <select
            v-model="selectedStatus"
            class="form-select"
            style="width: 150px"
            :disabled="
              selectedEmployees.length === 0
            "
            @change="updateSelectedStatus"
          >
            <option value="">
              Status
            </option>

            <option value="Aktif">
              Aktif
            </option>

            <option value="Nonaktif">
              Nonaktif
            </option>
          </select>

          <!-- Jumlah data terpilih -->
          <span
            v-if="
              selectedEmployees.length
            "
            class="text-secondary ms-auto"
          >
            {{
              selectedEmployees.length
            }}
            data dipilih
          </span>

        </div>
      </div>

      <!--
        ==================================================
        TABEL
        ==================================================
      -->
      <div
        class="table-responsive card-body p-0"
      >
        <table
          class="table table-vcenter table-hover"
        >

          <thead>
            <tr>

              <!-- Checkbox -->
              <th
                width="1"
                class="text-center"
              >
                <input
                  type="checkbox"
                  class="form-check-input"
                  :checked="
                    isAllSelected
                  "
                  @change="
                    toggleAllEmployees
                  "
                />
              </th>

              <!-- No -->
              <th width="5">
                No
              </th>

              <!-- Aksi -->
              <th
                width="15"
                class="text-center"
              >
                Aksi
              </th>

              <!-- NIP -->
              <th
                role="button"
                @click="
                  handleSort('nip')
                "
              >
                NIP

                <IconChevronUp
                  v-if="
                    sortBy === 'nip' &&
                    sortDirection === 'asc'
                  "
                  size="15"
                />

                <IconChevronDown
                  v-if="
                    sortBy === 'nip' &&
                    sortDirection === 'desc'
                  "
                  size="15"
                />
              </th>

              <!-- Nama -->
              <th
                role="button"
                @click="
                  handleSort('nama')
                "
              >
                Nama

                <IconChevronUp
                  v-if="
                    sortBy === 'nama' &&
                    sortDirection === 'asc'
                  "
                  size="15"
                />

                <IconChevronDown
                  v-if="
                    sortBy === 'nama' &&
                    sortDirection === 'desc'
                  "
                  size="15"
                />
              </th>

              <!-- Jabatan -->
              <th
                role="button"
                @click="
                  handleSort('jabatan')
                "
              >
                Jabatan

                <IconChevronUp
                  v-if="
                    sortBy === 'jabatan' &&
                    sortDirection === 'asc'
                  "
                  size="15"
                />

                <IconChevronDown
                  v-if="
                    sortBy === 'jabatan' &&
                    sortDirection === 'desc'
                  "
                  size="15"
                />
              </th>

              <!-- Tanggal Masuk -->
              <th
                role="button"
                @click="
                  handleSort('tanggalMasuk')
                "
              >
                Tanggal Masuk

                <IconChevronUp
                  v-if="
                    sortBy ===
                      'tanggalMasuk' &&
                    sortDirection === 'asc'
                  "
                  size="15"
                />

                <IconChevronDown
                  v-if="
                    sortBy ===
                      'tanggalMasuk' &&
                    sortDirection === 'desc'
                  "
                  size="15"
                />
              </th>

              <!-- Masa Kerja -->
              <th
                role="button"
                @click="
                  handleSort('masaKerja')
                "
              >
                Masa Kerja

                <IconChevronUp
                  v-if="
                    sortBy ===
                      'masaKerja' &&
                    sortDirection === 'asc'
                  "
                  size="15"
                />

                <IconChevronDown
                  v-if="
                    sortBy ===
                      'masaKerja' &&
                    sortDirection === 'desc'
                  "
                  size="15"
                />
              </th>

            </tr>
          </thead>

          <tbody>

            <!-- Data -->
            <tr
              v-for="(
                item, index
              ) in paginatedPegawai"
              :key="item.nip"
            >

              <!-- Checkbox -->
              <td class="text-center">
                <input
                  type="checkbox"
                  class="form-check-input"
                  :checked="
                    selectedEmployees.includes(
                      item.nip
                    )
                  "
                  @change="
                    toggleEmployee(
                      item.nip
                    )
                  "
                />
              </td>

              <!-- No -->
              <td class="text-center">
                {{
                  (currentPage - 1) *
                    itemsPerPage +
                  index +
                  1
                }}
              </td>

              <!-- Aksi -->
              <td class="text-nowrap">
                <div
                  class="d-flex gap-2"
                >

                  <!-- Edit -->
                  <NuxtLink
                    :to="`/pegawai/form/${item.nip}`"
                    class="text-dark"
                    title="Edit"
                  >
                    <IconPencil
                      size="20"
                    />
                  </NuxtLink>

                  <!-- Detail -->
                  <NuxtLink
                    :to="`/pegawai/${item.nip}`"
                    class="text-dark"
                    title="Detail"
                  >
                    <IconFileDescription
                      size="20"
                    />
                  </NuxtLink>

                  <!-- Download -->
                  <button
                    type="button"
                    class="btn btn-link p-0 text-dark"
                    title="Download PDF"
                    @click="
                      downloadEmployeePdf(
                        item
                      )
                    "
                  >
                    <IconCloudDownload
                      size="20"
                    />
                  </button>

                  <!-- Hapus -->
                  <button
                    type="button"
                    class="btn btn-link p-0 text-danger"
                    title="Hapus"
                    @click="
                      confirmDelete(item)
                    "
                  >
                    <IconTrash
                      size="20"
                    />
                  </button>

                </div>
              </td>

              <!-- NIP -->
              <td>
                {{ item.nip }}
              </td>

              <!-- Nama -->
              <td>
                {{ item.nama }}
              </td>

              <!-- Jabatan -->
              <td>
                {{ item.jabatan }}
              </td>

              <!-- Tanggal Masuk -->
              <td>
                {{
                  formatDateID(
                    item.tanggalMasuk
                  )
                }}
              </td>

              <!-- Masa Kerja -->
              <td>
                {{ item.masaKerja }}
              </td>

            </tr>

            <!-- Data kosong -->
            <tr
              v-if="
                paginatedPegawai.length ===
                0
              "
            >
              <td
                colspan="8"
                class="text-center text-secondary py-4"
              >
                Data pegawai tidak ditemukan.
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <!--
        ==================================================
        PAGINATION
        ==================================================
      -->
      <div
        class="card-footer d-flex align-items-center"
      >
        <div class="text-secondary">
          Menampilkan
          <strong>
            {{
              paginatedPegawai.length
                ? (currentPage - 1) *
                    itemsPerPage +
                  1
                : 0
            }}
          </strong>
          -
          <strong>
            {{
              Math.min(
                currentPage *
                  itemsPerPage,
                sortedPegawai.length
              )
            }}
          </strong>
          dari
          <strong>
            {{ sortedPegawai.length }}
          </strong>
          data
        </div>

        <ul
          class="pagination m-0 ms-auto"
        >
          <li
            class="page-item"
            :class="{
              disabled:
                currentPage === 1,
            }"
          >
            <button
              class="page-link"
              @click="
                goToPage(
                  currentPage - 1
                )
              "
            >
              Sebelumnya
            </button>
          </li>

          <li
            v-for="page in pageNumbers"
            :key="page"
            class="page-item"
            :class="{
              active:
                currentPage === page,
            }"
          >
            <button
              class="page-link"
              @click="
                goToPage(page)
              "
            >
              {{ page }}
            </button>
          </li>

          <li
            class="page-item"
            :class="{
              disabled:
                currentPage ===
                totalPages,
            }"
          >
            <button
              class="page-link"
              @click="
                goToPage(
                  currentPage + 1
                )
              "
            >
              Berikutnya
            </button>
          </li>
        </ul>
      </div>

      <!--
        ==================================================
        MODAL KONFIRMASI HAPUS
        ==================================================
      -->
      <div
        v-if="employeeToDelete"
        class="modal modal-blur fade show d-block"
        tabindex="-1"
        style="background: rgba(0, 0, 0, 0.5)"
      >
        <div
          class="modal-dialog modal-sm modal-dialog-centered"
        >
          <div class="modal-content">

            <div class="modal-status bg-danger"></div>

            <div
              class="modal-body text-center py-4"
            >
              <IconTrash
                size="40"
                class="text-danger mb-2"
              />

              <h3>
                Hapus Data
              </h3>

              <div class="text-secondary">
                Apakah kamu yakin ingin
                menghapus data
                <strong>
                  {{
                    employeeToDelete.nama
                  }}
                </strong>
                ?
              </div>
            </div>

            <div class="modal-footer">
              <div class="w-100">
                <div class="row">

                  <div class="col">
                    <button
                      type="button"
                      class="btn w-100"
                      @click="
                        employeeToDelete =
                          null
                      "
                    >
                      Batal
                    </button>
                  </div>

                  <div class="col">
                    <button
                      type="button"
                      class="btn btn-danger w-100"
                      @click="
                        deleteEmployee
                      "
                    >
                      Hapus
                    </button>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>

  </NuxtLayout>
</template>