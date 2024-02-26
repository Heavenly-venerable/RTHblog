<script lang="ts" setup>
const content = defineProps(["content"]);
const words = computed(() => {
  return content?.content.toString().split(/\s+/).length;
});
const minutes = computed(() => {
  return Math.ceil(words.value / 200);
});
</script>

<template>
  <div>
    <span class="text-gray-500">{{ minutes }} menit baca</span>
  </div>
</template>

<style scoped></style>
