<template>
  <video-player style="width: 100%" :src="videoSrc" controls />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { VideoPlayer } from "@videojs-player/vue";
import { useRouteQuery } from "@vueuse/router";
import { baseURL } from "../../utils/axios";
import "video.js/dist/video-js.css";

const filePath = useRouteQuery("filePath");

const videoSrc = computed(() => `${baseURL}/video?filePath=${filePath.value}`);
</script>
