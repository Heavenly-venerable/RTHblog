<script lang="ts" setup>
const showScrollButton = ref(false);
const scrollTimer = ref();

function handleScroll() {
  clearTimeout(scrollTimer.value);
  const scrollPosition = window.scrollY || window.pageYOffset;
  showScrollButton.value = scrollPosition > 100;

  if (showScrollButton) {
    scrollTimer.value = setTimeout(() => {
      showScrollButton.value = false;
    }, 3000);
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

onMounted(() => {
  scrollToTop();
  window.addEventListener("scroll", handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div>
    <div
      v-if="showScrollButton"
      @click="scrollToTop()"
      class="fixed bottom-10 right-6"
    >
      <svg
        class="h-10 w-10 p-2 fill-white rounded-full bg-blue-500 hover:ring hover:ring-blue-700"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
      >
        <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped></style>
