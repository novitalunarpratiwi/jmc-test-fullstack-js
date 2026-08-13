import { ref, computed, watch } from "vue";
import { dataPegawai } from "~/data/data-pegawai.js";

export const usePegawai = () => {
  // Data pegawai
  const employees = ref([...dataPegawai]);

  // Search
  const searchQuery = ref("");

  // Filter
  const selectedJabatan = ref("");
  const minMasaKerja = ref("");
  const maxMasaKerja = ref("");
  const selectedKontrak = ref("");

  // Sorting
  const sortBy = ref("");
  const sortDirection = ref("asc");

  // Pagination
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  // Data yang dipilih
  const selectedEmployees = ref([]);

  // Data yang akan dihapus
  const employeeToDelete = ref(null);

  /*
   * Daftar jabatan yang tersedia
   */
  const jabatanOptions = computed(() => {
    const jabatan = employees.value
      .map((item) => item.jabatan)
      .filter(Boolean);

    return [...new Set(jabatan)];
  });

  /*
   * Data setelah search dan filter
   */
  const filteredEmployees = computed(() => {
    let result = [...employees.value];

    // Search berdasarkan nama, NIP, atau jabatan
    if (searchQuery.value.trim()) {
      const keyword = searchQuery.value
        .toLowerCase()
        .trim();

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

    // Filter jabatan
    if (selectedJabatan.value) {
      result = result.filter(
        (item) =>
          item.jabatan === selectedJabatan.value
      );
    }

    // Filter masa kerja minimum
    if (minMasaKerja.value !== "") {
      result = result.filter(
        (item) =>
          Number(item.masaKerja || 0) >=
          Number(minMasaKerja.value)
      );
    }

    // Filter masa kerja maksimum
    if (maxMasaKerja.value !== "") {
      result = result.filter(
        (item) =>
          Number(item.masaKerja || 0) <=
          Number(maxMasaKerja.value)
      );
    }

    // Filter status kontrak
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
   * Sorting
   */
  const sortedEmployees = computed(() => {
    const result = [...filteredEmployees.value];

    if (!sortBy.value) {
      return result;
    }

    result.sort((a, b) => {
      let valueA = a[sortBy.value];
      let valueB = b[sortBy.value];

      if (sortBy.value === "masaKerja") {
        valueA = Number(valueA || 0);
        valueB = Number(valueB || 0);

        return sortDirection.value === "asc"
          ? valueA - valueB
          : valueB - valueA;
      }

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
   * Jumlah halaman
   */
  const totalPages = computed(() => {
    return Math.max(
      1,
      Math.ceil(
        sortedEmployees.value.length /
          itemsPerPage.value
      )
    );
  });

  /*
   * Data yang tampil pada halaman aktif
   */
  const paginatedEmployees = computed(() => {
    const start =
      (currentPage.value - 1) *
      itemsPerPage.value;

    return sortedEmployees.value.slice(
      start,
      start + itemsPerPage.value
    );
  });

  /*
   * Nomor data awal
   */
  const firstItem = computed(() => {
    if (!sortedEmployees.value.length) {
      return 0;
    }

    return (
      (currentPage.value - 1) *
        itemsPerPage.value +
      1
    );
  });

  /*
   * Nomor data terakhir
   */
  const lastItem = computed(() => {
    return Math.min(
      currentPage.value * itemsPerPage.value,
      sortedEmployees.value.length
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
   * Sorting tabel
   */
  const handleSort = (column) => {
    if (sortBy.value === column) {
      sortDirection.value =
        sortDirection.value === "asc"
          ? "desc"
          : "asc";
    } else {
      sortBy.value = column;
      sortDirection.value = "asc";
    }
  };

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
   * Pilih satu pegawai
   */
  const toggleEmployeeSelection = (nip) => {
    const index =
      selectedEmployees.value.indexOf(nip);

    if (index === -1) {
      selectedEmployees.value.push(nip);
    } else {
      selectedEmployees.value.splice(index, 1);
    }
  };

  /*
   * Cek apakah semua data halaman dipilih
   */
  const isAllSelected = computed(() => {
    if (!paginatedEmployees.value.length) {
      return false;
    }

    return paginatedEmployees.value.every(
      (item) =>
        selectedEmployees.value.includes(item.nip)
    );
  });

  /*
   * Pilih semua data pada halaman
   */
  const toggleSelectAll = () => {
    const currentNips =
      paginatedEmployees.value.map(
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
        !selectedEmployees.value.includes(nip)
      ) {
        selectedEmployees.value.push(nip);
      }
    });
  };

  /*
   * Membuka modal hapus
   */
  const confirmDelete = (employee) => {
    employeeToDelete.value = employee;
  };

  /*
   * Hapus satu pegawai
   */
  const deleteEmployee = () => {
    if (!employeeToDelete.value) {
      return;
    }

    const nip =
      employeeToDelete.value.nip;

    employees.value = employees.value.filter(
      (item) => item.nip !== nip
    );

    selectedEmployees.value =
      selectedEmployees.value.filter(
        (item) => item !== nip
      );

    employeeToDelete.value = null;
  };

  /*
   * Hapus semua pegawai yang dipilih
   */
  const deleteSelectedEmployees = () => {
    if (!selectedEmployees.value.length) {
      return;
    }

    employees.value = employees.value.filter(
      (item) =>
        !selectedEmployees.value.includes(
          item.nip
        )
    );

    selectedEmployees.value = [];
  };

  /*
   * Mengubah status pegawai
   */
  const updateSelectedStatus = (status) => {
    if (!selectedEmployees.value.length) {
      return;
    }

    employees.value = employees.value.map(
      (item) => {
        if (
          selectedEmployees.value.includes(
            item.nip
          )
        ) {
          return {
            ...item,
            status,
          };
        }

        return item;
      }
    );

    selectedEmployees.value = [];
  };

  /*
   * Reset seluruh filter
   */
  const resetFilters = () => {
    searchQuery.value = "";
    selectedJabatan.value = "";
    minMasaKerja.value = "";
    maxMasaKerja.value = "";
    selectedKontrak.value = "";

    currentPage.value = 1;
  };

  /*
   * Kembali ke halaman pertama
   * ketika filter berubah
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

  return {
    employees,

    searchQuery,
    selectedJabatan,
    minMasaKerja,
    maxMasaKerja,
    selectedKontrak,

    jabatanOptions,

    sortBy,
    sortDirection,

    currentPage,
    itemsPerPage,
    totalPages,
    pageNumbers,

    selectedEmployees,
    employeeToDelete,

    filteredEmployees,
    sortedEmployees,
    paginatedEmployees,

    firstItem,
    lastItem,

    isAllSelected,

    handleSort,
    goToPage,

    toggleEmployeeSelection,
    toggleSelectAll,

    confirmDelete,
    deleteEmployee,
    deleteSelectedEmployees,
    updateSelectedStatus,

    resetFilters,
  };
};