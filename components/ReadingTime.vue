<script lang="ts" setup>
interface Props {
  content: string;
}

const props = defineProps<Props>();

const words = computed<number>(() => {
  if (!props.content) return 0;
  return props.content.toString().split(/\s+/).length;
});

const minutes = computed<number>(() => {
  return Math.max(1, Math.ceil(words.value / 200));
});
</script>

<template>
  <span class="text-sm text-gray-500">{{ minutes }} menit baca</span>
</template>
