<template>
  <div class="bg-white rounded h-full overflow-auto p-10">
    <t-form>
      <t-form-item label="上传文件" name="upload">
        <t-upload
          v-model="files"
          :action="uploadUrl"
          tips="上传文件大小在 1000M 以内"
          :size-limit="{ size: 1000, unit: 'MB' }"
          :format-response="formatResponse"
          :on-select-change="handleSelectChange"
          @fail="handleFail"
          withCredentials
          :headers="{'x-csrf-token': Cookies.get(xsrfCookieName)}"
        ></t-upload>
      </t-form-item>
      <t-form-item label="上传视频" name="uploadVideo">
        <t-upload
          v-model="filesVideo"
          :action="uploadUrl + 'Video'"
          :format-response="formatResponse"
          :on-select-change="handleSelectChange"
          @fail="handleFail"
          withCredentials
          :headers="{'x-csrf-token': Cookies.get(xsrfCookieName)}"
        ></t-upload>
      </t-form-item>
      <t-form-item label="测试get接口" name="testGet">
        <t-button variant="outline" @click="tryConnect">testGet</t-button>
      </t-form-item>
      <t-form-item label="测试post接口" name="testPost">
        <t-button variant="outline" @click="testPost">testPost</t-button>
      </t-form-item>
    </t-form>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import axios from "../../utils/axios";
import { MessagePlugin } from 'tdesign-vue-next';
import { baseURL, xsrfCookieName } from "../../utils/axios";
import Cookies from "js-cookie";

const files = ref([]);

const filesVideo = ref([]);

const handleFail = ({ file }) => {
  MessagePlugin.error(`文件 ${file.name} 上传失败`);
};
const handleSelectChange = (files) => {
  console.log(files);
};

const formatResponse = (res) => {
  // if (!res.url) {
  //   return { error: '上传失败，请重试' };
  // }
  // return { ...res, url: res.url };
  return { ...res }
};

const tryConnect = () => {
  axios.get("/").then((res) => {
  });
};

const testPost = () => {
  axios.post("/testPost", {}).then((res) => {
  });
};

const uploadUrl = ref('');

onMounted(() => {
  uploadUrl.value = baseURL + '/upload'
})
</script>
