<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()

const handleClick = () => {
  window.open('https://beian.miit.gov.cn/', '_blank')
}

const goToAdmin = () => {
  router.push('/admin/')
}
</script>

<template>
  <div class="footer">
    <div>© 2022-present <span @click="goToAdmin">szy</span> | <a class="cursor-pointer underline" @click="handleClick"></a></div>
  </div>
</template>

<style scoped>
.footer {
  @apply text-sm h-16 text-gray-50 flex items-center justify-center;
  background-color: #181D1F;
}
</style>