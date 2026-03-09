<script lang="ts" setup>
interface Link {
  name: string;
  url: string;
}

const isOpen = ref<boolean>(false);
const links: Link[] = [
  { name: "Home", url: "/" },
  { name: "Artikel", url: "/article" },
];

function handleClick(e: MouseEvent): void {
  const target = e.target as Node;
  const hm = document.querySelector(".hm");
  const navbarNav = document.querySelector(".navbar-nav");
  
  if (hm && navbarNav && !hm.contains(target) && !navbarNav.contains(target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClick);
});
</script>

<template>
  <nav class="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-50">
    <div class="px-4 py-3 mx-auto max-w-7xl">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center">
          <span class="text-xl font-semibold text-gray-900">
            <span class="text-blue-600">RTH</span>blog
          </span>
        </NuxtLink>

        <!-- Mobile menu button -->
        <button
          @click="isOpen = !isOpen"
          type="button"
          class="hm inline-flex items-center justify-center p-2 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          :aria-expanded="isOpen"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <!-- Navigation links -->
        <div
          class="navbar-nav absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent border-b md:border-0 border-gray-200 md:block"
          :class="{ 'hidden': !isOpen, 'block': isOpen }"
        >
          <div class="flex flex-col md:flex-row md:items-center md:space-x-8 p-4 md:p-0">
            <NuxtLink
              v-for="{ name, url } in links"
              :key="name"
              :to="url"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 md:hover:bg-transparent rounded-md transition-colors"
              @click="isOpen = false"
            >
              {{ name }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
