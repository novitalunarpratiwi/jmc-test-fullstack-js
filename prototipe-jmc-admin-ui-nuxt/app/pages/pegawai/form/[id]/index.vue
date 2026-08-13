<template>
  <PegawaiForm :pegawai-id="pegawaiId" />
</template>

<script setup>
definePageMeta({
  title: "Edit Pegawai",
});

useSeoMeta({
  title: "Edit Pegawai",
});

import PegawaiForm from "~/features/DataPegawai/components/PegawaiForm.vue";

// Mengambil NIP dari URL
const route = useRoute();

const pegawaiId = route.params.id;
</script>