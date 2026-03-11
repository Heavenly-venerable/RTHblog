<script lang="ts" setup>
import { marked } from "marked";
import type { BlogPost, Label } from "~/types/blog";

const route = useRoute();
const articleNumber = route.params.number;

// Fetch single article
const { data: article, error: articleError, pending: articlePending } = await useFetch<BlogPost>(
  `https://api.github.com/repos/Heavenly-venerable/RTHblog/issues/${articleNumber}`,
  {
    transform: (item: any) => ({
      number: item.number,
      title: item.title,
      body: item.body || "",
      labels: item.labels?.map((label: any) => ({
        name: label.name
      })) || []
    })
  }
);

// Get first label for related articles
const firstLabel = computed(() => {
  if (article.value?.labels && article.value.labels.length > 0) {
    return article.value.labels[0].name;
  }
  return null;
});

// Fetch related articles based on first label
const { data: relatedArticlesData } = await useFetch<BlogPost[]>(
  firstLabel.value
    ? `https://api.github.com/repos/Heavenly-venerable/RTHblog/issues?labels=${firstLabel.value}`
    : null,
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

// Filter out current article from related articles
const relatedArticles = computed(() => {
  if (!relatedArticlesData.value || !article.value) return [];

  return relatedArticlesData.value.filter(
    (item: BlogPost) => item.number !== article.value.number
  );
});

// Parse markdown content
const content = computed(() => {
  if (!article.value?.body) return "";
  return marked.parse(article.value.body) as string;
});

// Format date
const formattedDate = computed(() => {
  if (!article.value?.created_at) return "";
  return useDateFormat(article.value.created_at, "DD MMM YYYY").value;
});

// Handle error state
const hasError = computed(() => !!articleError.value);
</script>

<template>
  <main class="min-h-screen bg-white">
    <!-- Error State -->
    <div v-if="hasError" class="px-4 py-32 mx-auto max-w-7xl text-center">
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
          Artikel Tidak Ditemukan
        </h2>
        <p class="mb-6 text-sm text-gray-600">
          Maaf, artikel yang Anda cari tidak dapat ditemukan.
        </p>
        <NuxtLink to="/article"
          class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
          Kembali ke Artikel
        </NuxtLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="articlePending" class="px-4 py-32 mx-auto max-w-2xl">
      <div class="animate-pulse">
        <div class="w-10 h-10 mb-8 bg-gray-200 rounded-full"></div>
        <div class="flex items-center mb-6">
          <div class="w-16 h-16 mr-4 bg-gray-200 rounded-full"></div>
          <div class="flex-1">
            <div class="w-32 h-5 mb-2 bg-gray-200 rounded"></div>
            <div class="w-24 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div class="w-3/4 h-8 mb-4 bg-gray-200 rounded"></div>
        <div class="w-full h-4 mb-2 bg-gray-200 rounded"></div>
        <div class="w-full h-4 mb-2 bg-gray-200 rounded"></div>
        <div class="w-2/3 h-4 mb-8 bg-gray-200 rounded"></div>
        <div class="w-full h-64 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Article Content -->
    <div v-else-if="article" class="px-4 py-24 mx-auto max-w-7xl sm:py-32">
      <!-- Back Button -->
      <div class="mb-6 max-w-2xl mx-auto">
        <NuxtLink to="/article"
          class="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
          <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Artikel
        </NuxtLink>
      </div>

      <!-- Article Container -->
      <article class="mx-auto max-w-2xl">
        <!-- Article Header -->
        <header class="mb-8">
          <!-- Author Info -->
          <div class="flex items-center mb-6">
            <img class="w-12 h-12 mr-4 rounded-full sm:w-16 sm:h-16"
              src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG9jZWFufGVufDB8fDB8fHww" alt="Hariyanto Saputra" />
            <div>
              <h2 class="text-lg font-bold text-gray-900 sm:text-xl">
                Hariyanto Saputra
              </h2>
              <p class="text-sm text-gray-600">
                Fullstack Web Developer
              </p>
              <p class="text-sm text-gray-500">
                {{ formattedDate }}
              </p>
            </div>
          </div>

          <!-- Article Title -->
          <h1 class="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            {{ article.title }}
          </h1>

          <!-- Categories/Tags -->
          <div v-if="article.labels && article.labels.length > 0" class="flex flex-wrap gap-2">
            <NuxtLink v-for="label in article.labels" :key="label.name" :to="'/article/category/' + label.name"
              class="inline-flex items-center px-3 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors sm:text-sm">
              {{ label.name }}
            </NuxtLink>
          </div>
        </header>

        <!-- Article Body -->
        <div class="prose prose-sm sm:prose-base lg:prose-lg max-w-none" :class="$style.articleContent"
          v-html="content"></div>
      </article>
    </div>

    <!-- Comments Section -->
    <div v-if="article && !hasError" class="border-t border-gray-200">
      <div class="px-4 py-12 mx-auto max-w-7xl sm:py-16">
        <CommentSection :articleId="article.number.toString()" />
      </div>
    </div>

    <!-- Related Articles -->
    <div v-if="relatedArticles.length > 0" class="bg-gray-50 border-t border-gray-200">
      <div class="px-4 py-12 mx-auto max-w-7xl sm:py-16">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 sm:text-3xl">
            Artikel Terkait
          </h2>
          <p class="mt-2 text-gray-600">
            Baca juga artikel lain dengan topik yang sama
          </p>
        </div>
        <BlogList :api="relatedArticles" />
      </div>
    </div>

    <!-- Newsletter Section -->
    <div class="border-t border-gray-200">
      <Newsletter />
    </div>
  </main>
</template>

<style module>
.articleContent {

  /* Headings */
  h1 {
    @apply hidden;
    /* Hide h1 since we already display title separately */
  }

  h2 {
    @apply mt-8 mb-4 text-xl font-bold text-gray-900 sm:text-2xl;
  }

  h3 {
    @apply mt-6 mb-3 text-lg font-semibold text-gray-900 sm:text-xl;
  }

  /* Paragraphs */
  p {
    @apply mb-4 text-gray-700 leading-relaxed;
  }

  /* Code blocks */
  pre {
    @apply p-4 my-4 overflow-x-auto text-sm text-gray-100 bg-gray-800 rounded-lg;
  }

  code {
    @apply px-1 py-0.5 text-sm text-gray-100 bg-gray-800 rounded;
  }

  /* Inline code */
  :not(pre)>code {
    @apply px-1.5 py-0.5 text-sm text-gray-800 bg-gray-100 rounded;
  }

  /* Lists */
  ul,
  ol {
    @apply pl-5 mb-4 space-y-2;
  }

  li {
    @apply text-gray-700;
  }

  ul li {
    @apply list-disc;
  }

  ol li {
    @apply list-decimal;
  }

  /* Links */
  a {
    @apply text-blue-600 underline hover:text-blue-800 transition-colors;
  }

  /* Blockquotes */
  blockquote {
    @apply pl-4 my-4 italic text-gray-700 border-l-4 border-gray-300;
  }

  /* Images */
  img {
    @apply max-w-full h-auto my-4 rounded-lg;
  }

  /* Tables */
  table {
    @apply w-full my-4 border-collapse;
  }

  th {
    @apply px-4 py-2 font-semibold text-left bg-gray-100 border border-gray-300;
  }

  td {
    @apply px-4 py-2 border border-gray-300;
  }

  /* Horizontal rule */
  hr {
    @apply my-8 border-gray-200;
  }
}
</style>
