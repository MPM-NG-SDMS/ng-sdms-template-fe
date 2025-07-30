<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
<template>
  <div>
    <h1>{{ t('editTitle') }}</h1>
  </div>
</template>