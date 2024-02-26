<script lang="ts" setup>
const { data: api } = await useFetch(
  "https://api.github.com/repos/Heavenly-venerable/blog/issues",
);
const { data: categories } = await useFetch(
  "https://api.github.com/repos/Heavenly-venerable/blog/labels",
);
const categoryUrl = "/article/category/";
</script>

<template>
  <div>
    <main class="pt-28 pb-24">
      <BlogList :api="api"
        ><template v-slot:header>
          <div class="py-4 mb-8">
            <span class="text-sm text-blue-700 font-bold">UPDATE</span>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
              Apa yang baru di blog ini?
            </h2>
            <p class="text-lg text-slate-500">
              Baca artikel terbaru yang masih fresh dan hangat.
            </p>
            <div class="flex gap-4 py-4 overflow-x-auto">
              <p class="font-bold text-lg">Tag:</p>
              <div>
                <NuxtLink
                  v-for="category in categories"
                  :to="categoryUrl + category?.name"
                  class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                  >{{ category?.name }}</NuxtLink
                >
              </div>
            </div>
          </div>
        </template></BlogList
      >
    </main>
  </div>
</template>

<style scoped></style>
