<script setup>
definePageMeta({ 
  layout: "auth", 
  title: "Login", 
}); 
 
import LoginForm from "~/features/auth/Login/components/LoginForm.vue"; 
 
const { initTheme } = useTheme(); 
const config = useRuntimeConfig(); 
 
onMounted(() => { 
  initTheme(); 
}); 
</script> 
 
<template> 
  <div class="box col-md-8 p-4"> 
    <!-- Logo dan nama aplikasi --> 
    <div class="d-flex gap-3 mb-4 align-items-center"> 
      <div class="logo"> 
        <img 
          src="~/assets/images/logo/logo_jmc_black.png" 
          alt="Logo JMC" 
          height="50" 
        /> 
      </div> 
 
      <div class="logo-text"> 
        <h1 class="mb-0 text-primary">JMC HR Management</h1> 
        <div>HR System</div> 
      </div> 
    </div> 
 
    <p>Selamat Datang, silahkan masukkan username dan password anda!</p> 
 
    <!-- Login Form --> 
    <LoginForm /> 
  </div> 
</template>