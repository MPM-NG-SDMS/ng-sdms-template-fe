<script setup>
import { markRaw } from 'vue';
import Logo from '../../assets/logo.png';


const rawLogo = markRaw(Logo);
</script>
<template>
  <img :src="rawLogo" alt="Logo MPM">
</template>
