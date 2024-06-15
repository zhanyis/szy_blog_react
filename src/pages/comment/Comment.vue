<template>
  <div style="background-color: bisque;">
    <div class="min-h-screen mx-auto max-w-5xl pb-10">
      <div class="items-center flex justify-center mx-10 mb-10 pt-10">
        <input type="text" v-model="input" class="custom-input" />
        <div class="custom-button" @click="submit">submit</div>
      </div>
      <div v-for="c in comments" class="mt-10 mx-10 p-3 comments rounded">
        <div>{{ c.content }}</div>
        <div class="text-sm text-slate-500 text-right">{{ new Date(c.updatedAt).toLocaleString('zh-CN') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { createComment, queryComment } from "../../hooks/useComment";

const input = ref("");

const comments = ref<any>([{content: '123'}]);

const getComment = () => {
  queryComment().then((res) => {
    comments.value = res.data;
  });
};

const submit = () => {
  createComment(input.value, null)
    .then(() => {
      input.value = "";
      getComment();
    });
};

onMounted(getComment);
</script>

<style scoped>
.comments {
  background: #DF897A;
  border: 1px solid #3D2A2A;
}

.custom-input {
  @apply rounded text-3xl p-3 w-full mr-5;
  border: 1px solid #3D2A2A;
  outline: none;
  background: #cdc;
}

.custom-input:focus {
  border-color: #99E0CE
}

.custom-button {
  @apply cursor-pointer h-full text-3xl p-3 rounded border-double border-2;
  border: 1px solid #3D2A2A;
  background: #cdc;
}

.custom-button:hover {
  border-color: #99E0CE;
  color: #99E0CE;
}
</style>