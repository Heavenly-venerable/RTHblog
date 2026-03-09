<script lang="ts" setup>
interface Reply {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
  replies: Reply[];
}

interface Props {
  articleId: string;
}

const props = defineProps<Props>();

const author = ref<string>("");
const replyAuthor = ref<string>("");
const content = ref<string>("");
const replyContent = ref<string>("");
const isModalOpen = ref<boolean>(false);
const commentId = ref<string>("");

const { data: comments } = useFetch<Comment[]>(`/api/comments/article/${props.articleId}`);

// Calculate total comments count including replies
const totalComments = computed<number>(() => {
  let totalCount = 0;

  if (Array.isArray(comments.value)) {
    for (let i = 0; i < comments.value.length; i++) {
      totalCount++; // Add main comment
      const comment = comments.value[i];
      if (comment.replies && Array.isArray(comment.replies)) {
        totalCount += comment.replies.length; // Add replies
      }
    }
  }

  return totalCount;
});

function formatCommentTime(createdAt: string): string {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diff = now.getTime() - createdDate.getTime();

  const oneMinute = 60 * 1000;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;
  const oneWeek = oneDay * 7;

  if (diff < oneMinute) {
    return "Just now";
  } else if (diff < oneHour) {
    const minutes = Math.floor(diff / oneMinute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diff < oneDay) {
    const hours = Math.floor(diff / oneHour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diff < oneWeek) {
    const days = Math.floor(diff / oneDay);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    const weeks = Math.floor(diff / oneWeek);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
}

async function addComment(): Promise<void> {
  if (!author.value || !content.value) return;

  const response = await $fetch<Comment>("/api/comments", {
    method: "POST",
    body: {
      author: author.value,
      content: content.value,
      articleId: props.articleId,
    },
  });

  if (comments.value) {
    comments.value.push(response);
  }

  // Reset form
  author.value = "";
  content.value = "";
}

async function deleteComment(id: string): Promise<void> {
  await $fetch(`/api/comments/${id}`, {
    method: "DELETE",
  });

  if (comments.value) {
    comments.value = comments.value.filter((comment) => comment._id !== id);
  }
}

async function deleteReply(id: string): Promise<void> {
  await $fetch(`/api/comments/replies/${id}`, {
    method: "DELETE",
  });

  if (comments.value) {
    comments.value = comments.value.map((comment) => {
      comment.replies = comment.replies.filter((reply) => reply._id !== id);
      return comment;
    });
  }
}

async function addReply(id: string): Promise<void> {
  if (!replyAuthor.value || !replyContent.value) return;

  const response = await $fetch<Reply>(`/api/comments/replies/${id}`, {
    method: "POST",
    body: {
      author: replyAuthor.value,
      content: replyContent.value,
    },
  });

  if (comments.value) {
    const commentedPost = comments.value.find((comment) => comment._id === id);
    if (commentedPost) {
      commentedPost.replies.push(response);
    }
  }

  // Reset modal and form
  isModalOpen.value = false;
  replyAuthor.value = "";
  replyContent.value = "";
  commentId.value = "";
}

function openReplyModal(id: string): void {
  isModalOpen.value = true;
  commentId.value = id;
}

function closeReplyModal(): void {
  isModalOpen.value = false;
  replyAuthor.value = "";
  replyContent.value = "";
  commentId.value = "";
}
</script>

<template>
  <section class="bg-white pb-8 lg:pb-16">
    <div class="max-w-2xl px-4 mx-auto">
      <!-- Header with comment count -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-bold text-gray-900 lg:text-2xl">
          Comments ({{ totalComments }})
        </h2>
      </div>

      <!-- Comment form -->
      <form class="mb-6">
        <div class="mb-4">
          <label for="author" class="sr-only">Your Name</label>
          <input v-model="author" type="text" id="author" placeholder="Your name..."
            class="w-full px-4 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
        </div>

        <div class="mb-4">
          <label for="comment" class="sr-only">Your comment</label>
          <textarea v-model="content" id="comment" rows="4"
            class="w-full px-4 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a comment..." required></textarea>
        </div>

        <button @click.prevent="addComment()" type="submit"
          class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Post Comment
        </button>
      </form>

      <!-- Comments list -->
      <div v-if="comments && comments.length > 0" class="space-y-6">
        <article v-for="comment in comments" :key="comment._id" class="border-b border-gray-200 pb-6">
          <!-- Main comment -->
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <p class="text-sm font-semibold text-gray-900">
                  {{ comment.author }}
                </p>
                <p class="ml-4 text-sm text-gray-500">
                  {{ formatCommentTime(comment.createdAt) }}
                </p>
              </div>
              <p class="text-gray-700">
                {{ comment.content }}
              </p>

              <!-- Reply button -->
              <button @click.prevent="openReplyModal(comment._id)" type="button"
                class="flex items-center mt-2 text-sm text-gray-500 hover:text-blue-600">
                <svg class="w-4 h-4 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 20 18">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                </svg>
                Reply
              </button>
            </div>

            <!-- Delete comment button -->
            <button @click.prevent="deleteComment(comment._id)" class="p-2 text-gray-400 hover:text-red-600">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <!-- Replies -->
          <div v-if="comment.replies && comment.replies.length > 0" class="ml-6 mt-4 pl-4 border-l-2 border-gray-200">
            <div v-for="reply in comment.replies" :key="reply._id" class="mb-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <p class="text-sm font-semibold text-gray-900">
                      {{ reply.author }}
                    </p>
                    <p class="ml-4 text-sm text-gray-500">
                      {{ formatCommentTime(reply.createdAt) }}
                    </p>
                  </div>
                  <p class="text-gray-700">
                    {{ reply.content }}
                  </p>
                </div>

                <!-- Delete reply button -->
                <button @click.prevent="deleteReply(reply._id)" class="p-2 text-gray-400 hover:text-red-600">
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
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

      <!-- Empty state -->
      <div v-else class="py-8 text-center bg-gray-50 rounded-lg">
        <p class="text-gray-600">No comments yet. Be the first to comment!</p>
      </div>
    </div>

    <!-- Reply Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click.self="closeReplyModal">
      <div class="w-full max-w-lg bg-white rounded-lg">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Add Reply</h3>
          <button @click="closeReplyModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form class="p-4">
          <div class="mb-4">
            <label for="reply-author" class="block mb-2 text-sm font-medium text-gray-700">Your Name</label>
            <input v-model="replyAuthor" type="text" id="reply-author"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>

          <div class="mb-4">
            <label for="reply-content" class="block mb-2 text-sm font-medium text-gray-700">Your Reply</label>
            <textarea v-model="replyContent" id="reply-content" rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required></textarea>
          </div>

          <button @click.prevent="addReply(commentId)" type="submit"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Add Reply
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
