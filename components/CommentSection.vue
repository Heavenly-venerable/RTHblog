<script lang="ts" setup>
import { useDateFormat } from "@vueuse/core";

const props = defineProps(["articleid"]);
const author = ref("");
const replyAuthor = ref("");
const content = ref("");
const replyContent = ref("");
const isOpenModal = ref(false);
const cId = ref("");
const totalComments = ref(0);

const { data: comments } = useFetch(`/api/comments/article/${props.articleid}`);

let totalCount = 0;
const commentsArray = comments.value;
if (Array.isArray(commentsArray)) {
  for (let i = 0; i < commentsArray.length; i++) {
    totalCount++; // Menambahkan jumlah komentar
    const comment = commentsArray[i];
    if (comment.replies && Array.isArray(comment.replies)) {
      totalCount += comment.replies.length; // Menambahkan jumlah balasan jika ada
    }
  }
}
totalComments.value = totalCount;

function waktuKomentar(waktuPembuatan) {
  const waktuSekarang = new Date();
  const waktuPembuatanDate = new Date(waktuPembuatan);
  const selisih = waktuSekarang - waktuPembuatanDate;
  const satuMenit = 60 * 1000;
  const satuJam = satuMenit * 60;
  const satuHari = satuJam * 24;
  const satuMinggu = satuHari * 7;

  if (selisih < satuMenit) {
    return "Baru saja";
  } else if (selisih < satuJam) {
    const menit = Math.floor(selisih / satuMenit);
    return `${menit} menit`;
  } else if (selisih < satuHari) {
    const jam = Math.floor(selisih / satuJam);
    return `${jam} jam`;
  } else if (selisih < satuMinggu) {
    const hari = Math.floor(selisih / satuHari);
    return `${hari} hari`;
  } else {
    const minggu = Math.floor(selisih / satuMinggu);
    return `${minggu} mg`;
  }
}

async function addComment() {
  await $fetch("/api/comments", {
    method: "POST",
    body: {
      author: author.value,
      content: content.value,
      articleId: props.articleid,
    },
  });
}

async function addReply(id) {
  await $fetch(`/api/comments/replies/${id}`, {
    method: "POST",
    body: {
      author: replyAuthor.value,
      content: replyContent.value,
    },
  });
}

function onClickReply(id) {
  isOpenModal.value = !isOpenModal.value;
  cId.value = id;
}
</script>

<template>
  <div>
    <section class="bg-white dark:bg-gray-900 pb-8 lg:pb-16 antialiased">
      <div class="max-w-2xl mx-auto px-4">
        <div class="flex justify-between items-center mb-6">
          <h2
            class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white"
          >
            Comments ({{ totalComments }})
          </h2>
        </div>
        <form class="mb-6">
          <div
            class="py-2 px-4 mb-4 bg-white rounded-lg border border-gray-200"
          >
            <label for="author" class="sr-only">Your Name</label>
            <input
              v-model="author"
              type="text"
              id="author"
              placeholder="Your name...."
              class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
              required
            />
          </div>
          <div
            class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          >
            <label for="comment" class="sr-only">Your comment</label>
            <textarea
              v-model="content"
              id="comment"
              rows="6"
              class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
              placeholder="Write a comment..."
              required
            ></textarea>
          </div>
          <button
            @click="addComment()"
            type="submit"
            class="w-full items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-primary-800"
          >
            Post comment
          </button>
        </form>
      </div>
      <article class="p-6">
        <div v-for="comment in comments" class="flex flex-col justify-between">
          <div class="flex items-center mb-2">
            <p class="text-sm font-semibold text-gray-900">
              {{ comment?.author }}
            </p>
            <p class="text-sm text-gray-600 ml-4">
              {{ waktuKomentar(comment?.createdAt) }}
            </p>
          </div>
          <p class="text-gray-500 dark:text-gray-400">
            {{ comment?.content }}
          </p>
          <div class="flex items-center mt-2 space-x-4">
            <button
              @click="onClickReply(comment?._id)"
              type="button"
              class="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
            >
              <svg
                class="mr-1.5 w-3.5 h-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 18"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                />
              </svg>
              Reply
            </button>
          </div>
          <div
            :class="{ 'border-l': comment?.replies.length }"
            class="px-6 pt-4 pb-0 ml-4"
          >
            <div
              v-for="reply in comment?.replies"
              class="flex flex-col justify-between mb-4"
            >
              <div class="flex items-center mb-2">
                <p class="text-sm font-semibold text-gray-900">
                  {{ reply?.author }}
                </p>
                <p class="text-sm text-gray-600 ml-4">
                  {{ waktuKomentar(reply?.createdAt) }}
                </p>
              </div>
              <p class="text-gray-500 dark:text-gray-400">
                {{ reply?.content }}
              </p>
              <div class="flex items-center mt-2 space-x-4">
                <button
                  @click="onClickReply(comment?._id)"
                  type="button"
                  class="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                >
                  <svg
                    class="mr-1.5 w-3.5 h-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 18"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                    />
                  </svg>
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
    <!-- Modal -->
    <div
      v-if="isOpenModal"
      class="idm overflow-y-auto overflow-x-hidden fixed top-16 bg-[rgba(255,255,255,.9)] right-0 left-0 z-50 w-full h-full"
    >
      <div
        class="flex items-center justify-center relative p-4 w-full max-w-lg h-full md:h-auto"
      >
        <div
          class="relative p-4 mb-8 bg-white rounded-lg shadow dark:bg-gray-800 md:p-8"
        >
          <div class="absolute -top-10">
            <svg
              @click="isOpenModal = !isOpenModal"
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"
              />
            </svg>
          </div>

          <form class="mb-6">
            <div
              class="py-2 px-4 mb-4 bg-white rounded-lg border border-gray-200"
            >
              <label for="author" class="sr-only">Your Name</label>
              <input
                v-model="replyAuthor"
                type="text"
                id="author"
                placeholder="Your name...."
                class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                required
              />
            </div>
            <div
              class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            >
              <label for="comment" class="sr-only">Your comment</label>
              <textarea
                v-model="replyContent"
                id="comment"
                rows="6"
                class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a comment..."
                required
              ></textarea>
            </div>
            <button
              @click="addReply(cId)"
              type="submit"
              class="w-full items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-primary-800"
            >
              Add Reply
            </button>
          </form>
        </div>
      </div>
    </div>
    <!-- Modal -->
  </div>
</template>

<style scoped></style>
