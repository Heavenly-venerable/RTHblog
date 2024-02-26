<script lang="ts" setup>
import { marked } from "marked";
import { useDateFormat } from "@vueuse/core";

const route = useRoute();
const { data: api } = await useFetch(
  `https://api.github.com/repos/Heavenly-venerable/blog/issues/${route.params.number}`,
);
const labels = api?.value.labels;
const label = ref();
for (let i in labels) {
  label.value = labels[i].name;
}
const { data: apiLabels } = await useFetch(
  `https://api.github.com/repos/Heavenly-venerable/blog/issues?labels=${label.value}`,
);

const relateArticles = [];

// Loop melalui setiap label dalam apiLabels
for (let n in apiLabels?.value) {
  const labelId = apiLabels?.value[n].id;

  // Periksa kesesuaian ID dengan api.id
  if (api?.value.id !== labelId) {
    // Jika cocok, tambahkan artikel ke daftar artikel yang ingin ditampilkan
    relateArticles.push(apiLabels?.value[n]);
  }
}

const content = marked.parse(api?.value.body);
const date = api?.value.created_at;
const formattedDate = useDateFormat(date, "DD MMM YYYY");
</script>

<template>
  <div>
    <main class="pb-24 pt-36">
      <div class="px-4 mx-auto max-w-screen-xl">
        <div class="mb-4">
          <NuxtLink to="/"
            ><svg
              class="w-10 h-10 p-2 bg-gray-200 fill-gray-900 rounded-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
              /></svg
          ></NuxtLink>
        </div>
        <article class="mx-auto w-full max-w-2xl divide-y">
          <header class="mb-4">
            <address class="flex items-center mb-6 not-italic">
              <div
                class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white"
              >
                <img
                  class="mr-4 w-16 h-16 rounded-full"
                  src="https://th.bing.com/th/id/OIG4.17Cnsp8XeW01koI5EvIm?pid=ImgGn"
                  alt="Hariyanto Saputra"
                />
                <div>
                  <NuxtLink
                    href="#"
                    rel="author"
                    class="text-xl font-bold text-gray-900 dark:text-white"
                    >Hariyanto Saputra</NuxtLink
                  >
                  <p class="text-base text-gray-500 dark:text-gray-400">
                    Junior Web Developer
                  </p>
                  <p class="text-base text-gray-500 dark:text-gray-400">
                    {{ formattedDate }}
                  </p>
                </div>
              </div>
            </address>
            <h1
              class="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white"
            >
              {{ api?.title }}
            </h1>
          </header>
          <div
            class="leading-relaxed tracking-wide py-4 text-gray-700"
            :class="$style.myClass"
            v-html="content"
          ></div>
        </article>
      </div>
    </main>
    <div class="pb-8">
      <CommentSection :articleid="api?.id" />
    </div>
    <div class="pb-8">
      <BlogList :api="relateArticles" />
    </div>
    <div class="pb-8">
      <Newslatter />
    </div>
  </div>
</template>

<style module>
.myClass {
  h1 {
    @apply hidden;
  }
  h2 {
    @apply py-2 text-2xl font-bold text-gray-900;
  }
  p {
    @apply py-2 text-gray-700;
  }
  pre {
    @apply overflow-x-auto bg-gray-800 text-gray-100 my-1 p-4;
  }
  code {
    @apply bg-gray-800 text-gray-100 rounded-md p-0.5;
  }
  li {
    @apply py-2 list-disc mx-4;
  }
  a {
    @apply underline text-blue-500;
  }
}
</style>
