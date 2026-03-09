<script lang="ts" setup>
// No props or complex logic needed for now
</script>

<template>
  <section class="bg-gray-800 mt-14">
    <div class="px-4 py-16 mx-auto max-w-7xl sm:py-24">
      <div class="text-center">
        <h1 class="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          Belajar Teknologi dengan Mudah dan Menyenangkan
        </h1>
        
        <p class="max-w-3xl mx-auto mb-8 text-base text-gray-300 sm:text-lg">
          Temukan berbagai artikel, tutorial, dan tips seputar teknologi yang
          bisa membantu Anda meningkatkan keterampilan, pengetahuan, dan karier
          Anda.
        </p>
        
        <div class="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <NuxtLink
            to="/article"
            class="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Lihat Artikel Terbaru
            <svg
              class="w-4 h-4 ml-2"
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
  </section>
</template>
