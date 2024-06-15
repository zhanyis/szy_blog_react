<template>
  <t-dialog
    placement="top"
    header="发送微信消息"
    top="50px"
    :visible="visible"
    :on-confirm="sendWechatMessage"
    :on-close="close"
  >
    <template #body>
      <t-form>
        <t-form-item label="touser" name="touser">
          <t-input v-model:value="wechatParams.touser"></t-input>
        </t-form-item>
        <t-form-item label="agent_id" name="agent_id">
          <t-input v-model:value="wechatParams.agent_id"></t-input>
        </t-form-item>
        <t-form-item label="content" name="content">
          <t-textarea v-model:value="wechatParams.content" :autosize="{ minRows: 10, maxRows: 20 }"></t-textarea>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<script lang="ts" setup >
import { ref, reactive } from 'vue';
import axios from "../../utils/axios";
import { MessagePlugin } from "tdesign-vue-next";

const emit = defineEmits(['on-close', 'on-success'])

const visible = ref(false);

const wechatParams = reactive({
  touser: '',
  agent_id: '',
  content: ''
})

const sendWechatMessage = () => {
  if (!wechatParams.content) {
    MessagePlugin.info('至少写点什么吧。。');
    return
  }
  axios.post('/sendWechatComMessage', wechatParams).then((res) => {
    MessagePlugin.success(res.data.msg);
    close();
  })
};

const close = () => {
  visible.value = false;
  wechatParams.touser = '';
  wechatParams.agent_id = '';
  wechatParams.content = '';
  emit('on-close')
}

defineExpose({
  wechatParams,
  visible,
  sendWechatMessage
})
</script>