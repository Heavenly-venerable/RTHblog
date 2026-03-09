<script lang="ts" setup>
import type { BlogPost, Category } from "~/types/blog";

// Fetch articles from GitHub API
const { data: api, error: articlesError, pending: articlesPending } = await useFetch<BlogPost[]>(
  "https://api.github.com/repos/Heavenly-venerable/RTHblog/issues",
  {
    transform: (data: any[]) => {
      return data.map(item => ({
        number: item.number,
        title: item.title,
        body: item.body || "",
        labels: item.labels?.map((label: any) => ({
          name: label.name
        })) || []
      }));
    }
  }
);

// Fetch categories/labels from GitHub API
const { data: categories, error: categoriesError } = await useFetch<Category[]>(
  "https://api.github.com/repos/Heavenly-venerable/RTHblog/labels",
  {
    transform: (data: any[]) => {
      return data.map(item => ({
        name: item.name,
        color: item.color,
        description: item.description || ""
      }));
    }
  }
);

const categoryUrl = "/article/category/";

// Handle error states
const hasError = computed(() => !!articlesError.value || !!categoriesError.value);
</script>

<template>
  <main class="min-h-screen bg-white">
    <!-- Header Section -->
    <section class="bg-white border-b border-gray-200">
      <div class="px-4 py-8 mx-auto max-w-7xl sm:py-12">
        <!-- Page Title -->
        <div class="mb-6">
          <span class="text-sm font-bold text-blue-600">ARTIKEL</span>
          <h1 class="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Semua Artikel
          </h1>
          <p class="mt-2 text-lg text-gray-600">
            Kumpulan artikel teknologi terbaru dan menarik untuk Anda
          </p>
        </div>

        <!-- Categories/Tags -->
        <div v-if="categories && categories.length > 0" class="space-y-3">
          <h2 class="text-base font-semibold text-gray-700">Jelajahi berdasarkan tag:</h2>
          <div class="flex flex-wrap gap-2">
            <NuxtLink v-for="category in categories" :key="category.name" :to="categoryUrl + category.name"
              class="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
              {{ category.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- Categories Loading State -->
        <div v-else-if="!categoriesError" class="space-y-3">
          <div class="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div class="flex flex-wrap gap-2">
            <div v-for="n in 6" :key="n" class="w-16 h-7 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog List Section -->
    <section class="px-4 py-8 mx-auto max-w-7xl sm:py-12">
      <!-- Error State -->
      <div v-if="hasError" class="p-8 text-center bg-gray-50 rounded-lg">
        <div class="max-w-md mx-auto">
          <div class="flex justify-center mb-4">
            <div class="p-3 bg-red-100 rounded-full">
              <svg class="w-6 h-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h2 class="mb-2 text-lg font-semibold text-gray-900">
            Gagal Memuat Artikel
          </h2>
          <p class="mb-6 text-sm text-gray-600">
            Maaf, terjadi kesalahan saat memuat artikel. Silakan coba lagi nanti.
          </p>
          <NuxtLink to="/article"
            class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            Muat Ulang Halaman
          </NuxtLink>
        </div>
      </div>

      <!-- Blog List with Header Slot -->
      <BlogList v-else :api="api || []" :loading="articlesPending">
        <template #header>
          <!-- Custom header for article index page -->
          <div class="mb-8">
            <span class="text-sm font-bold text-blue-600">UPDATE</span>
            <h2 class="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              Apa yang baru di blog ini?
            </h2>
            <p class="mt-2 text-base text-gray-600">
              Baca artikel terbaru yang masih fresh dan hangat.
            </p>
          </div>
        </template>
      </BlogList>
    </section>
  </main>
</template>
