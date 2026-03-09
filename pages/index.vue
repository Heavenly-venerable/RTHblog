<script lang="ts" setup>
import type { BlogPost } from "~/types/blog";

// Fetch data from GitHub API
const { data: api, error, pending } = await useFetch<BlogPost[]>(
  "https://api.github.com/repos/Heavenly-venerable/RTHblog/issues",
  {
    // Optional: add transform to format data if needed
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

// Handle error state
const hasError = computed(() => !!error.value);
</script>

<template>
  <main class="min-h-screen bg-white">
    <!-- Hero Section -->
    <Hero />

    <!-- Blog List Section -->
    <section v-if="!hasError" class="px-4 py-8 mx-auto max-w-7xl sm:py-12">
      <BlogList :api="api || []" :loading="pending" />
    </section>

    <!-- Error State -->
    <section v-else class="px-4 py-16 mx-auto max-w-7xl text-center">
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
        <NuxtLink to="/"
          class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
          Muat Ulang Halaman
        </NuxtLink>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="border-t border-gray-200">
      <Newsletter />
    </section>
  </main>
</template>
