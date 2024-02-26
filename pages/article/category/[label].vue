<script lang="ts" setup>
const route = useRoute();
const { data: api, refresh } = await useFetch(
  `https://api.github.com/repos/Heavenly-venerable/blog/issues`,
  {
    query: { labels: route.params.label },
  },
);
const { data: categories } = await useFetch(
  "https://api.github.com/repos/Heavenly-venerable/blog/labels",
);

const categoryUrl = "/article/category/";

onMounted(async () => {
  await refresh();
});
</script>

<template>
  <div>
    <section class="bg-white dark:text-white dark:bg-gray-900 pt-28 pb-24">
      <BlogList :api="api">
        <template #header>
          <div class="py-4 mb-8">
            <span class="text-sm text-blue-700 font-bold uppercase"
              >Artikel</span
            >
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
                  :to="categoryUrl + category.name"
                  class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                  >{{ category.name }}</NuxtLink
                >
              </div>
            </div>
          </div>
        </template>
      </BlogList>
    </section>
  </div>
</template>

<style scoped></style>
