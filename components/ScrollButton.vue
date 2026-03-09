<script lang="ts" setup>
const showScrollButton = ref<boolean>(false);
let scrollTimer: any;

function handleScroll(): void {
  clearTimeout(scrollTimer);

  const scrollPosition = window.scrollY || window.pageYOffset;
  showScrollButton.value = scrollPosition > 100;

  if (showScrollButton.value) {
    scrollTimer = setTimeout(() => {
      showScrollButton.value = false;
    }, 3000);
  }
}

function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  clearTimeout(scrollTimer);
});
</script>

<template>
  <button v-if="showScrollButton" @click="scrollToTop"
    class="fixed bottom-6 right-4 z-50 p-3 bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors sm:bottom-8 sm:right-6"
    aria-label="Scroll to top">
    <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  </button>
</template>
