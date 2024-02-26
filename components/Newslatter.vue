<script lang="ts" setup></script>

<template>
  <div>
    <section class="bg-blue-100 dark:bg-gray-800">
      <div class="px-4 py-8">
        <div class="py-4 mb-8">
          <p class="text-sm text-center text-blue-700 font-bold tracking-wide">NEWSLETTER</p>
          <h2 class="text-xl text-center font-bold mt-2 mb-4 dark:text-white">
            Biar gak ketinggalan update..
          </h2>
          <p class="text-base font-normal text-center text-slate-500">
            Subscribe Newsletter RTHblog agar kamu bisa dapat info tentang
            teknologi menarik dan terkini langsung dikirim ke emailmu?
          </p>
        </div>
        <div class="flex space-y-4 justify-center sm:space-y-0 pb-4">
          <NuxtLink
            to="/"
            class="w-[80%] inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          >
            <svg
              class="w-6 h-6 me-2 fill-white rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"
              />
            </svg>
            Subscribe
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
