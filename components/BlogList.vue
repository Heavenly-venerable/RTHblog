<script lang="ts" setup>
import { marked } from "marked";
defineProps(["api"]);
const baseUrl = "/article/category/";
</script>

<template>
  <div>
    <section class="bg-white dark:bg-gray-900">
      <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
        <slot name="header">
          <div class="py-4 mb-8">
            <span class="text-sm text-blue-700 font-bold">UPDATE</span>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
              Apa yang baru di blog ini?
            </h2>
            <p class="text-lg text-slate-500">
              Baca artikel terbaru yang masih fresh dan hangat.
            </p>
          </div>
        </slot>
        <div v-if="api.length > 0">
          <div class="grid md:grid-cols-2 gap-8">
            <div
              v-for="content in api"
              class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12"
            >
              <NuxtLink
                v-for="label in content?.labels"
                :to="baseUrl + label.name"
                class="bg-purple-100 text-purple-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-purple-400 mb-2"
              >
                <svg
                  class="w-2.5 h-2.5 me-1.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 4 1 8l4 4m10-8 4 4-4 4M11 1 9 15"
                  />
                </svg>
                {{ label.name }}
              </NuxtLink>
              <h2
                class="text-gray-900 dark:text-white text-3xl font-extrabold mb-2"
              >
                {{ content?.title }}
              </h2>
              <ReadingTime
                class="mb-2"
                :content="marked.parse(content?.body)"
              />
              <div
                class="text-lg font-normal text-gray-500 dark:text-gray-400 mb-4 text-wrap line-clamp-4 max-w-64"
              >
                <div
                  v-html="marked.parse(content?.body)"
                  class="text-wrap"
                ></div>
              </div>
              <NuxtLink
                :to="'/article/' + content?.number"
                class="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center"
                >Read more
                <svg
                  class="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div
          v-else-if="api.length === 0"
          class="bg-blue-100 text-blue-500 px-4 py-2 rounded-md"
        >
          <div class="flex my-1">
            <div>
              <svg
                class="h-6 w-6 bg-blue-500 p-1 rounded-full fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 512"
              >
                <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                <path
                  d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V320c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM32 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-xl mb-2 font-bold">Info</h3>
              <p>
                Belum ada konten dengan tag ini, silahkan baca artikel yang lain
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
