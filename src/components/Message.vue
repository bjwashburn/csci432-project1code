<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="message">
    <strong>{{ senderName }}</strong>
    <span>{{ formatDate(updatedAt) }}</span>
    <p>{{ text }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  senderName: String,
  updatedAt: String,
  text: String
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(); 
}
</script>

<style scoped>
.message {
  margin-bottom: 1em;
  padding: 1em;
  border-bottom: 1px solid #ccc;
}
</style>
