<script lang="ts" setup>
import type { Comment, Reply } from "~/types/comment";

interface Props {
  articleId: string;
}

const props = defineProps<Props>();

// State untuk form komentar
const author = ref<string>("");
const content = ref<string>("");
const isSubmitting = ref<boolean>(false);
const submitError = ref<string>("");

// State untuk reply
const replyAuthor = ref<string>("");
const replyContent = ref<string>("");
const isReplyModalOpen = ref<boolean>(false);
const activeCommentId = ref<number | null>(null);
const isSubmittingReply = ref<boolean>(false);

// State untuk komentar
const comments = ref<Comment[]>([]);
const isLoading = ref<boolean>(true);
const error = ref<string>("");

// Fetch comments
const fetchComments = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    const response = await $fetch<{ data: Comment[] }>(`/api/comments/article/${props.articleId}`);
    comments.value = response.data || [];
  } catch (err) {
    console.error("Error fetching comments:", err);
    error.value = "Gagal memuat komentar";
  } finally {
    isLoading.value = false;
  }
};

// Hitung total komentar (termasuk replies)
const totalComments = computed<number>(() => {
  let total = comments.value.length;
  comments.value.forEach(comment => {
    if (comment.replies) {
      total += comment.replies.length;
    }
  });
  return total;
});

// Format waktu
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const oneMinute = 60 * 1000;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;
  const oneWeek = oneDay * 7;

  if (diff < oneMinute) {
    return "Baru saja";
  } else if (diff < oneHour) {
    const minutes = Math.floor(diff / oneMinute);
    return `${minutes} menit lalu`;
  } else if (diff < oneDay) {
    const hours = Math.floor(diff / oneHour);
    return `${hours} jam lalu`;
  } else if (diff < oneWeek) {
    const days = Math.floor(diff / oneDay);
    return `${days} hari lalu`;
  } else {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
};

// Add comment
const addComment = async () => {
  if (!author.value || !content.value) {
    submitError.value = "Nama dan komentar harus diisi";
    return;
  }

  isSubmitting.value = true;
  submitError.value = "";

  try {
    const response = await $fetch<{ data: Comment; message: string }>("/api/comments", {
      method: "POST",
      body: {
        articleId: props.articleId,
        author: author.value,
        content: content.value,
      },
    });

    // Tambahkan komentar baru ke list
    if (response.data) {
      comments.value.unshift(response.data);
    }

    // Reset form
    author.value = "";
    content.value = "";
  } catch (err) {
    console.error("Error adding comment:", err);
    submitError.value = "Gagal menambahkan komentar";
  } finally {
    isSubmitting.value = false;
  }
};

// Delete comment
const deleteComment = async (id: number) => {
  if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
    return;
  }

  try {
    await $fetch(`/api/comments/${id}`, {
      method: "DELETE",
    });

    // Hapus dari list
    comments.value = comments.value.filter(comment => comment.id !== id);
  } catch (err) {
    console.error("Error deleting comment:", err);
    alert("Gagal menghapus komentar");
  }
};

// Delete reply
const deleteReply = async (id: number) => {
  if (!confirm("Apakah Anda yakin ingin menghapus balasan ini?")) {
    return;
  }

  try {
    await $fetch(`/api/comments/replies/${id}`, {
      method: "DELETE",
    });

    // Hapus dari list
    comments.value = comments.value.map(comment => ({
      ...comment,
      replies: comment.replies?.filter(reply => reply.id !== id) || []
    }));
  } catch (err) {
    console.error("Error deleting reply:", err);
    alert("Gagal menghapus balasan");
  }
};

// Open reply modal
const openReplyModal = (commentId: number) => {
  activeCommentId.value = commentId;
  isReplyModalOpen.value = true;
  replyAuthor.value = "";
  replyContent.value = "";
  submitError.value = "";
};

// Close reply modal
const closeReplyModal = () => {
  isReplyModalOpen.value = false;
  activeCommentId.value = null;
  replyAuthor.value = "";
  replyContent.value = "";
  submitError.value = "";
};

// Add reply
const addReply = async () => {
  if (!replyAuthor.value || !replyContent.value || !activeCommentId.value) {
    submitError.value = "Nama dan balasan harus diisi";
    return;
  }

  isSubmittingReply.value = true;
  submitError.value = "";

  try {
    const response = await $fetch<{ data: Reply; message: string }>(
      `/api/comments/${activeCommentId.value}/replies`,
      {
        method: "POST",
        body: {
          author: replyAuthor.value,
          content: replyContent.value,
        },
      }
    );

    // Tambahkan reply ke komentar yang sesuai
    if (response.data) {
      comments.value = comments.value.map(comment => {
        if (comment.id === activeCommentId.value) {
          return {
            ...comment,
            replies: [response.data, ...(comment.replies || [])]
          };
        }
        return comment;
      });
    }

    // Tutup modal
    closeReplyModal();
  } catch (err) {
    console.error("Error adding reply:", err);
    submitError.value = "Gagal menambahkan balasan";
  } finally {
    isSubmittingReply.value = false;
  }
};

// Load comments on mount
onMounted(() => {
  fetchComments();
});
</script>

<template>
  <section class="bg-white">
    <div class="max-w-2xl px-4 mx-auto">
      <!-- Header dengan jumlah komentar -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-bold text-gray-900 lg:text-2xl">
          Komentar ({{ totalComments }})
        </h2>
      </div>

      <!-- Form Komentar -->
      <form @submit.prevent="addComment" class="mb-8">
        <div class="space-y-4">
          <div>
            <label for="comment-author" class="block mb-1 text-sm font-medium text-gray-700">
              Nama <span class="text-red-500">*</span>
            </label>
            <input id="comment-author" v-model="author" type="text"
              class="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan nama Anda" :disabled="isSubmitting" required />
          </div>

          <div>
            <label for="comment-content" class="block mb-1 text-sm font-medium text-gray-700">
              Komentar <span class="text-red-500">*</span>
            </label>
            <textarea id="comment-content" v-model="content" rows="4"
              class="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tulis komentar Anda..." :disabled="isSubmitting" required></textarea>
          </div>

          <!-- Error message -->
          <p v-if="submitError" class="text-sm text-red-600">
            {{ submitError }}
          </p>

          <button type="submit" :disabled="isSubmitting"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ isSubmitting ? "Mengirim..." : "Kirim Komentar" }}
          </button>
        </div>
      </form>

      <!-- Error State -->
      <div v-if="error" class="p-4 mb-6 text-sm text-red-600 bg-red-50 rounded-lg">
        {{ error }}
      </div>

      <!-- Konten Komentar (Loading, Daftar, atau Empty) -->
      <div v-if="isLoading" class="py-8 space-y-4">
        <!-- Loading Skeleton -->
        <div v-for="n in 2" :key="n" class="animate-pulse">
          <div class="flex items-start space-x-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="w-24 h-4 bg-gray-200 rounded"></div>
              <div class="w-full h-3 bg-gray-200 rounded"></div>
              <div class="w-3/4 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Daftar Komentar (hanya tampil jika tidak loading dan ada komentar) -->
      <div v-else-if="comments.length > 0" class="space-y-6">
        <article v-for="comment in comments" :key="comment.id" class="border-b border-gray-200 pb-6">
          <!-- Komentar Utama -->
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm font-medium text-blue-600">
                    {{ comment.author.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">
                    {{ comment.author }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ formatTime(comment.createdAt) }}
                  </p>
                </div>
              </div>
              <p class="text-sm text-gray-700 ml-11">
                {{ comment.content }}
              </p>

              <!-- Tombol Reply -->
              <button @click="openReplyModal(comment.id)" type="button"
                class="flex items-center mt-2 ml-11 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                <svg class="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Balas
              </button>
            </div>

            <!-- Tombol Hapus Komentar -->
            <button @click="deleteComment(comment.id)" class="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Hapus komentar">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <!-- Daftar Balasan -->
          <div v-if="comment.replies && comment.replies.length > 0" class="ml-11 mt-4 space-y-4">
            <div v-for="reply in comment.replies" :key="reply.id" class="pl-4 border-l-2 border-gray-200">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center mb-1">
                    <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                      <span class="text-xs font-medium text-purple-600">
                        {{ reply.author.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-gray-900">
                        {{ reply.author }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ formatTime(reply.createdAt) }}
                      </p>
                    </div>
                  </div>
                  <p class="text-sm text-gray-700 ml-8">
                    {{ reply.content }}
                  </p>
                </div>

                <!-- Tombol Hapus Balasan -->
                <button @click="deleteReply(reply.id)" class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Hapus balasan">
                  <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State (hanya tampil jika tidak loading, tidak error, dan tidak ada komentar) -->
      <div v-else-if="!error && !isLoading" class="py-12 text-center">
        <div class="flex justify-center mb-4">
          <div class="p-3 bg-gray-100 rounded-full">
            <svg class="w-6 h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
        <h3 class="mb-1 text-base font-medium text-gray-900">
          Belum Ada Komentar
        </h3>
        <p class="text-sm text-gray-500">
          Jadilah yang pertama berkomentar!
        </p>
      </div>
    </div>

    <!-- Modal Reply -->
    <Teleport to="body">
      <div v-if="isReplyModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeReplyModal"></div>

        <!-- Modal Content -->
        <div class="flex items-center justify-center min-h-screen p-4">
          <div class="relative w-full max-w-md bg-white rounded-lg shadow-xl">
            <div class="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">
                Tambah Balasan
              </h3>
              <button @click="closeReplyModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="addReply" class="p-4">
              <div class="space-y-4">
                <div>
                  <label for="reply-author" class="block mb-1 text-sm font-medium text-gray-700">
                    Nama <span class="text-red-500">*</span>
                  </label>
                  <input id="reply-author" v-model="replyAuthor" type="text"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama Anda" :disabled="isSubmittingReply" required />
                </div>

                <div>
                  <label for="reply-content" class="block mb-1 text-sm font-medium text-gray-700">
                    Balasan <span class="text-red-500">*</span>
                  </label>
                  <textarea id="reply-content" v-model="replyContent" rows="3"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tulis balasan Anda..." :disabled="isSubmittingReply" required></textarea>
                </div>

                <!-- Error message -->
                <p v-if="submitError" class="text-sm text-red-600">
                  {{ submitError }}
                </p>

                <button type="submit" :disabled="isSubmittingReply"
                  class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  {{ isSubmittingReply ? "Mengirim..." : "Kirim Balasan" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
