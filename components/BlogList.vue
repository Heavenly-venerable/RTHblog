<script lang="ts" setup>
import { marked } from "marked";
import type { BlogListProps } from "~/types/blog";

const props = defineProps<BlogListProps>();
const baseUrl = "/article/category/";

// Konfigurasi marked untuk mendukung gambar dari URL
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: false,
  mangle: false,
});

// Fungsi untuk mengekstrak gambar pertama dari konten markdown
const extractFirstImage = (content: string): string | null => {
  if (!content) return null;
  
  // Regex untuk mencari gambar markdown ![alt](url)
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(markdownImageRegex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  // Regex untuk mencari tag HTML img
  const htmlImageRegex = /<img.*?src=["'](.*?)["']/;
  const htmlMatch = content.match(htmlImageRegex);
  
  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1];
  }
  
  return null;
};

// Fungsi untuk memparsing markdown dengan aman
const parseMarkdown = (content: string): string => {
  if (!content) return "";
  
  // Parse markdown
  const parsed = marked.parse(content) as string;
  
  // Tambahkan class untuk gambar
  return parsed.replace(/<img /g, '<img loading="lazy" class="max-w-full h-auto rounded-lg my-2" ');
};

// Fungsi untuk membersihkan HTML dan mendapatkan teks saja (SSR-safe)
const stripHtml = (html: string): string => {
  // Hapus tag HTML menggunakan regex (SSR-safe)
  return html
    .replace(/<[^>]*>/g, ' ') // Ganti tag dengan spasi
    .replace(/\s+/g, ' ')     // Normalisasi spasi
    .trim();
};

// Fungsi untuk mendapatkan excerpt dari markdown
const getMarkdownExcerpt = (content: string, maxLength: number = 120): string => {
  if (!content) return "";
  
  // Hapus gambar markdown
  const withoutImages = content.replace(/!\[.*?\]\(.*?\)/g, '');
  
  // Parse markdown ke HTML
  const parsed = marked.parse(withoutImages) as string;
  
  // Strip HTML tags untuk mendapatkan teks murni
  const text = stripHtml(parsed);
  
  // Potong teks
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Fungsi untuk memotong teks (alternatif sederhana)
const truncateText = (text: string, maxLength: number = 120): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
</script>

<template>
  <section class="bg-white">
    <div class="w-full">
      <!-- Header Slot -->
      <slot name="header">
        <div class="mb-6 px-1 sm:mb-8">
          <span class="text-xs font-bold text-blue-600 sm:text-sm">UPDATE</span>
          <h2 class="mt-1 text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
            Apa yang baru di blog ini?
          </h2>
          <p class="mt-1 text-sm text-gray-600 sm:text-base">
            Baca artikel terbaru yang masih fresh dan hangat.
          </p>
        </div>
      </slot>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 lg:gap-6">
        <div v-for="n in 4" :key="n" 
          class="p-4 bg-gray-50 border border-gray-200 rounded-lg animate-pulse sm:p-6"
        >
          <div class="w-full h-32 mb-3 bg-gray-200 rounded-lg sm:h-40"></div>
          <div class="w-16 h-3 mb-2 bg-gray-200 rounded sm:w-20 sm:h-4 sm:mb-3"></div>
          <div class="w-3/4 h-5 mb-2 bg-gray-200 rounded sm:h-6 sm:mb-3"></div>
          <div class="w-full h-3 mb-1 bg-gray-200 rounded sm:h-4 sm:mb-2"></div>
          <div class="w-full h-3 mb-1 bg-gray-200 rounded sm:h-4 sm:mb-2"></div>
          <div class="w-2/3 h-3 mb-2 bg-gray-200 rounded sm:h-4 sm:mb-3"></div>
          <div class="w-20 h-3 bg-gray-200 rounded sm:w-24 sm:h-4"></div>
        </div>
      </div>

      <!-- Blog Posts Grid -->
      <div v-else-if="api.length > 0">
        <div class="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 lg:gap-6">
          <article 
            v-for="content in api" 
            :key="content.number"
            class="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors sm:p-5 md:p-6"
          >
            <!-- Featured Image -->
            <div v-if="extractFirstImage(content?.body)" class="mb-3 -mx-4 sm:-mx-5 md:-mx-6">
              <NuxtLink :to="'/article/' + content.number" class="block">
                <img 
                  :src="extractFirstImage(content?.body)" 
                  :alt="content?.title"
                  loading="lazy"
                  class="w-full h-32 object-cover sm:h-40 md:h-48"
                  :class="{
                    'rounded-t-lg': true
                  }"
                  @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                />
              </NuxtLink>
            </div>

            <!-- Categories/Labels -->
            <div class="flex flex-wrap gap-1.5 mb-2 sm:gap-2 sm:mb-3">
              <NuxtLink 
                v-for="label in content?.labels?.slice(0, 3)" 
                :key="label.name" 
                :to="baseUrl + label.name"
                class="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-purple-700 bg-purple-50 rounded hover:bg-purple-100 transition-colors sm:px-2 sm:py-1"
                :title="label.name"
              >
                <svg 
                  class="w-2.5 h-2.5 mr-0.5 sm:w-3 sm:h-3 sm:mr-1" 
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
                <span class="truncate max-w-[60px] sm:max-w-none">{{ label.name }}</span>
              </NuxtLink>
              <span 
                v-if="content?.labels && content.labels.length > 3" 
                class="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded sm:px-2 sm:py-1"
                :title="`+${content.labels.length - 3} lagi`"
              >
                +{{ content.labels.length - 3 }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="mb-2 text-base font-bold text-gray-900 line-clamp-2 sm:text-lg md:text-xl lg:text-2xl">
              <NuxtLink 
                :to="'/article/' + content.number" 
                class="hover:text-blue-600 transition-colors block"
              >
                {{ content?.title }}
              </NuxtLink>
            </h3>

            <!-- Reading Time -->
            <ReadingTime 
              class="block mb-2 text-xs text-gray-500 sm:text-sm sm:mb-3" 
              :content="content?.body" 
            />

            <!-- Excerpt - Teks tanpa HTML -->
            <div 
              class="mb-3 text-xs text-gray-600 line-clamp-2 sm:text-sm sm:line-clamp-3 md:text-base"
            >
              {{ getMarkdownExcerpt(content?.body, 120) }}
            </div>

            <!-- Read More Link -->
            <NuxtLink 
              :to="'/article/' + content.number"
              class="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors sm:text-sm"
            >
              Baca selengkapnya
              <svg 
                class="w-3 h-3 ml-1 sm:w-4 sm:h-4 sm:ml-1.5" 
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
          </article>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-12 px-4 text-center bg-gray-50 rounded-lg sm:py-16 sm:px-6">
        <div class="max-w-sm mx-auto sm:max-w-md">
          <div class="flex justify-center mb-3 sm:mb-4">
            <div class="p-2 bg-blue-100 rounded-full sm:p-3">
              <svg 
                class="w-5 h-5 text-blue-600 sm:w-6 sm:h-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>
          <h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">
            Belum Ada Artikel
          </h3>
          <p class="mb-5 text-xs text-gray-600 sm:text-sm sm:mb-6">
            Belum ada konten yang tersedia. Silakan kembali lagi nanti.
          </p>
          <NuxtLink 
            to="/"
            class="inline-flex items-center justify-center w-full px-4 py-2.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors sm:w-auto sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Refresh Halaman
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
