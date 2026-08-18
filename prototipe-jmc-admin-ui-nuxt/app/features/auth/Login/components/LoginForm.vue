<template>
  <form @submit.prevent="handleSubmit">
    <!-- Username -->
    <div class="mb-2">
      <input
        v-model="username"
        type="text"
        class="form-control py-3 border-0 bg-light text-dark"
        placeholder="Username"
        name="username"
        required
      />
    </div>

    <!-- Password -->
    <div class="mb-2 password-wrapper">
      <input
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        class="form-control py-3 border-0 bg-light text-dark"
        name="password"
        placeholder="Password"
        required
      />

      <button
        type="button"
        class="password-toggle"
        @click="showPassword = !showPassword"
        aria-label="Tampilkan password"
      >
        <!-- Mata terbuka -->
        <svg
          v-if="!showPassword"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>

        <!-- Mata tertutup -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path
            d="M10.73 5.08A10.43 10.43 0 0 1 12 5c5 0 8.33 4 10 7a13.16 13.16 0 0 1-1.67 2.68"
          />
          <path
            d="M6.61 6.61C4.62 7.89 3.12 9.75 2 12c1.67 3 5 7 10 7a9.74 9.74 0 0 0 3.39-.61"
          />
          <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
      </button>
    </div>

    <!-- Remember Me -->
    <div class="mb-2">
      <label class="form-check">
        <input
          v-model="rememberMe"
          type="checkbox"
          class="form-check-input"
        />
        <span class="form-check-label">Remember Me</span>
      </label>
    </div>

    <!-- CAPTCHA -->
    <div class="mb-2">
      <label class="form-label">Kode Keamanan</label>

      <div class="captcha-box mb-2">
        <span>{{ captchaCode }}</span>

        <button
          type="button"
          class="captcha-refresh"
          @click="generateCaptcha"
          title="Ganti kode"
        >
          ↻
        </button>
      </div>

      <input
        v-model="captchaInput"
        type="text"
        class="form-control py-3 border-0 bg-light text-dark"
        placeholder="Masukkan kode di atas"
        autocomplete="off"
        required
      />

      <small v-if="captchaError" class="text-danger">
        Kode keamanan salah.
      </small>
    </div>

    <!-- Pesan Error -->
    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>

    <!-- Submit -->
    <div class="d-grid mt-4">
      <button
        class="btn btn-primary text-uppercase shadow py-3"
        type="submit"
        :disabled="loading"
      >
        {{ loading ? "Memproses..." : "Masuk" }}
      </button>
    </div>
  </form>
</template>

<script setup>
const username = ref("");
const password = ref("");
const rememberMe = ref(false);

const showPassword = ref(false);

const captchaCode = ref("");
const captchaInput = ref("");
const captchaError = ref(false);

const loading = ref(false);
const errorMessage = ref("");

// Membuat CAPTCHA
const generateCaptcha = () => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < 5; i++) {
    code += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  captchaCode.value = code;
  captchaInput.value = "";
  captchaError.value = false;
};

// Login
const handleSubmit = async () => {
  errorMessage.value = "";

  // Cek CAPTCHA
  if (captchaInput.value.toUpperCase() !== captchaCode.value) {
    captchaError.value = true;
    generateCaptcha();
    return;
  }

  loading.value = true;

  try {
    const response = await fetch(
      "https://jmc-test-fullstack-js-4le5.vercel.app/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: username.value,
          password: password.value,
        }),
      }
    );

    const result = await response.json();

    console.log("Response backend:", result);

    if (!response.ok) {
      throw new Error(
        result.message || "Login gagal."
      );
    }

    // Backend mengembalikan token di result.data.token
    const token = result.data?.token;
    const user = result.data?.user;

    if (!token) {
      throw new Error("Token login tidak ditemukan.");
    }

    // Simpan token sesuai Remember Me
    if (rememberMe.value) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    }

    console.log("Login berhasil:", user);
    console.log("ID ROLE:", user?.id_role);

    // Masuk ke dashboard
    await navigateTo("/");

  } catch (error) {
    console.error("Login error:", error);

    errorMessage.value =
      error.message || "Gagal terhubung ke server.";

    generateCaptcha();

  } finally {
    loading.value = false;
  }
};

// Generate CAPTCHA ketika halaman dibuka
onMounted(() => {
  generateCaptcha();
});
</script>