<script lang="ts" setup>
const { data: api } = await useFetch(
  "https://api.github.com/repos/Heavenly-venerable/blog/issues",
);
</script>

<template>
  <div>
    <Hero />
    <BlogList :api="api" />
    <div class="pb-8">
      <Newslatter />
    </div>
  </div>
</template>

<style scoped></style>
