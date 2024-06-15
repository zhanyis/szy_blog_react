<template>
  <div style="height: calc(var(--vh, 1vh) * 100 - 64px - 4rem - 100px); overflow: auto">
    <van-form @submit="onSubmit">
      <van-cell-group size="large">
        <van-field
          v-model="amount"
          type="number"
          name="金额"
          label="金额"
          placeholder="金额"
          :rules="[{ required: true, message: '请输入金额' }]"
        />
        <van-field
          name="userChecked"
          label="参与成员"
          :rules="[{ required: true, message: '请勾选参与成员' }]"
        >
          <template #input>
            <van-checkbox-group v-model="userChecked">
              <van-checkbox
                v-for="user in userList"
                :name="user.user_id"
                class="pb-2"
                >{{ user.user_name }}</van-checkbox
              >
            </van-checkbox-group>
          </template>
        </van-field>
        <van-field
          v-model="comment"
          rows="2"
          label="备注"
          type="textarea"
          maxlength="255"
          placeholder="备注"
          show-word-limit
        />
        <van-field name="uploader" label="证据">
          <template #input>
            <van-uploader
              @delete="fileUrl = ''"
              :after-read="afterRead"
              v-model="fileList"
              multiple
              :max-count="1"
            />
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px">
        <t-button
          class="mb-5"
          theme="success"
          shape="round"
          :disabled="loading"
          @click="submit"
        >
          <template #icon><AddIcon /></template>
          提交
        </t-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "../../utils/axios";
import { MessagePlugin } from "tdesign-vue-next";
import { useImgCompress } from '../../hooks/useImgCompress';

const { compressImg } = useImgCompress() 

const amount = ref(0);
const userChecked = ref([]);
const fileList = ref([]);
const comment = ref("");

const userList = ref([]);

const getAllUsers = () => {
  axios.get("/allUserList").then((res) => {
    userList.value = res.data.data;
  });
};

const loading = ref(false);

const fileUrl = ref("");


const upload = (forms) => {
  axios
    .post("/uploadBills", forms, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      fileUrl.value = res.data.data;
    })
    .finally(() => {
      loading.value = false;
    });
};

const afterRead = async (file) => {
  const size = file.file.size;
  console.log(file)
  if ((size / 1024) > 1024) {
    const ratio = (size / 1024) > 2048 ? 0.3 : 0.7;
    console.log('压缩')
    compressImg(file.file, 0.2).then((res) => {
      const forms = new FormData();
      loading.value = true;
      forms.append("file", res.file);
      upload(forms)
    })
  } else {
    console.log('不压缩')
    const forms = new FormData();
    loading.value = true;
    forms.append("file", file.file);
    upload(forms)
  }
};

const submit = () => {
  console.log(amount.value, userChecked.value.length, fileUrl.value);
  if (amount.value == 0) {
    MessagePlugin.error("至少也要记个1块钱吧");
    return;
  }
  if (!userChecked.value.length) {
    MessagePlugin.error("至少也要记个1个人吧");
    return;
  }
  const params = {
    amount: Number(amount.value),
    share_with_user_id: userChecked.value.join(","),
    photo_url: fileUrl.value,
    comment: comment.value,
  };
  axios
    .post("/splitBills", params)
    .then((res) => {
      MessagePlugin.success("记账成功");
    })
    .finally((res) => {
      amount.value = 0;
      userChecked.value = [];
      fileList.value = [];
      fileUrl.value = "";
      comment.value = "";
    });
};

onMounted(() => {
  getAllUsers();
});
</script>
