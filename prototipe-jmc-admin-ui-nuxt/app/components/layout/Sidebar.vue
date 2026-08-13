<template>
  <aside
    class="navbar navbar-vertical navbar-expand-lg navbar-dark sidebar"
    data-bs-theme="dark"
  >
    <div class="container-fluid px-0 justify-content-start">
      <!-- BRAND -->
      <h1 class="navbar-brand text-white ms-3 ms-lg-0 gap-3">
        <div class="logo">
          <img src="~/assets/images/logo/logo_jmc.png" alt="Logo" height="15" />
        </div>

        <NuxtLink
          to="/"
          class="fw-bold hstack gap-3 text-decoration-none text-white"
        >
          <div style="font-size: 0.9rem">{{ config.public.appName }}</div>
        </NuxtLink>
      </h1>

      <div
        id="sidebar-menu"
        class="offcanvas offcanvas-start px-lg-3"
        tabindex="-1"
      >
        <!-- HEADER -->
        <div class="offcanvas-header">
          <div class="d-flex gap-3 align-items-center">
            <div class="image">
              <img
                src="~/assets/images/logo/logo_jmc.png"
                alt="Logo"
                height="15"
              />
            </div>

            <div class="logo-text flex-grow-1">
              <h3 class="m-0"></h3>
              <div class="fs-4 fw-bold">{{ config.public.appName }}</div>
            </div>
          </div>

          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>

        <!-- BODY -->
        <div
          class="offcanvas-body p-3 p-lg-0 flex-column flex-grow-1 overflow-auto"
        >
          <ul class="navbar-nav align-items-start pt-lg-3">
            <template v-for="item in filteredMenuItems" :key="item.title">              <!-- Menu dengan children (dropdown) -->
              <li
                v-if="item.children"
                class="nav-item dropdown"
                :class="{ active: isParentActive(item) }"
              >
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  :class="{ active: isParentActive(item) }"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="false"
                  role="button"
                  aria-expanded="false"
                  @click.prevent="toggleDropdown(item.title)"
                >
                  <span class="nav-link-icon d-md-none d-lg-inline-block">
                    <component :is="item.icon" />
                  </span>
                  <span class="nav-link-title">{{ item.title }}</span>
                </a>
                <div
                  class="dropdown-menu"
                  :class="{
                    show:
                      openDropdowns.includes(item.title) ||
                      isParentActive(item),
                  }"
                >
                  <div class="dropdown-menu-columns">
                    <div class="dropdown-menu-column">
                      <NuxtLink
                        v-for="child in item.children"
                        :key="child.to"
                        :to="child.to"
                        class="dropdown-item"
                        :class="{ active: isActive(child.to) }"
                      >
                        {{ child.title }}
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </li>

              <!-- Menu biasa (tanpa children) -->
              <li v-else class="nav-item" :key="item.title">
                <NuxtLink
                  :to="item.to"
                  class="nav-link"
                  :class="{ active: isActive(item.to) }"
                >
                  <span class="nav-link-icon d-md-none d-lg-inline-block">
                    <component :is="item.icon" />
                  </span>
                  <span class="nav-link-title">{{ item.title }}</span>
                </NuxtLink>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { menuItems } from "~/data/menu.js";

// Mengambil route aktif
const route = useRoute();

// Mengambil konfigurasi aplikasi dari runtime config
const config = useRuntimeConfig();

// Menyimpan data user yang sedang login
const user = ref(null);

// Menyimpan dropdown yang sedang terbuka
const openDropdowns = ref([]);


// ======================================================
// LOAD USER
// Mengambil data user dari localStorage/sessionStorage
// ======================================================
const loadUser = () => {
  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  console.log("Data user dari storage:", storedUser);

  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);

      console.log("User berhasil dibaca:", user.value);
      console.log("ID Role:", user.value?.id_role);
    } catch (error) {
      console.error("Data user tidak valid:", error);
      user.value = null;
    }
  } else {
    console.warn("Data user tidak ditemukan di storage.");
  }
};


// ======================================================
// FILTER MENU BERDASARKAN ROLE
// Menentukan menu yang boleh dilihat oleh user
// ======================================================
const filteredMenuItems = computed(() => {

  // Ambil ID role user
  const roleId = Number(user.value?.id_role);

  console.log("Role ID yang digunakan:", roleId);

  // Kalau role belum ditemukan,
  // sementara tampilkan semua menu agar sidebar tidak kosong
  if (!roleId) {
    return menuItems;
  }

  // Filter menu berdasarkan role
  return menuItems.filter((item) => {

    // Kalau menu tidak memiliki roles,
    // menu tetap ditampilkan
    if (!item.roles) {
      return true;
    }

    // Cek apakah role user terdapat dalam daftar roles
    return item.roles.includes(roleId);
  });
});


// ======================================================
// CEK ROUTE AKTIF
// Menentukan apakah menu sedang aktif
// ======================================================
const isActive = (path) => {

  // Khusus halaman utama
  if (path === "/") {
    return route.path === "/";
  }

  // Mengecek route sama atau berada di dalam route tersebut
  return (
    route.path === path ||
    route.path.startsWith(path + "/")
  );
};


// ======================================================
// CEK PARENT MENU AKTIF
// Mengecek apakah salah satu child sedang aktif
// ======================================================
const isParentActive = (item) => {

  // Kalau bukan menu parent
  if (!item.children) {
    return false;
  }

  // Cek apakah salah satu child aktif
  return item.children.some((child) =>
    isActive(child.to)
  );
};


// ======================================================
// TOGGLE DROPDOWN
// Membuka atau menutup menu dropdown
// ======================================================
const toggleDropdown = (title) => {

  const index = openDropdowns.value.indexOf(title);

  // Kalau belum terbuka → buka
  if (index === -1) {
    openDropdowns.value.push(title);
  }

  // Kalau sudah terbuka → tutup
  else {
    openDropdowns.value.splice(index, 1);
  }
};


// ======================================================
// LOAD USER SAAT SIDEBAR DIMUAT
// ======================================================
onMounted(() => {
  loadUser();
});


// ======================================================
// OTOMATIS MEMBUKA DROPDOWN
// Kalau child sedang aktif, dropdown otomatis terbuka
// ======================================================
watch(
  () => route.path,
  () => {

    filteredMenuItems.value.forEach((item) => {

      if (
        item.children &&
        isParentActive(item) &&
        !openDropdowns.value.includes(item.title)
      ) {
        openDropdowns.value.push(item.title);
      }

    });
  },
  {
    immediate: true,
  }
);
</script>
