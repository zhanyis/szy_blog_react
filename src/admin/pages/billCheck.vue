<template>
  <div style="height: calc(var(--vh, 1vh) * 100 - 64px - 4rem - 80px);overflow: auto;" class="relative pb-14">
    <div v-for="item in list" class="bg-white py-2 flex items-center">
      <van-image
        width="100"
        height="100"
        lazy-load
        :src="item.photo_url_true"
        @click="item.photo_url && showImg(item.photo_url_true)"
      />
      <div class="ml-4 flex-1">
        <div class="text-lg">{{ item.amount }}  {{ item.comment }}</div>
        <div class="text-sm">支付者：{{ item.payee_name }}</div>
        <div class="text-sm">参与者：{{ item.share_with_user_name }}</div>
        <div class="text-sm">日期: {{ item.transation_date }}</div>
        <div class="text-sm">收益:{{ item.netAmount }}</div>
      </div>
      <t-button v-show="item.payee_id === user.user_id" class="mr-4" shape="circle" theme="danger" @click="deleteRecord(item)">
        <template #icon><CloseIcon /></template>
      </t-button>
    </div>
  </div>
  <div class="absolute bottom-0 bg-yellow-100 w-full p-4 z-20">合计: {{ totalAmount.toFixed(2) }}</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "../../utils/axios";
import { useUserStore } from "../../store/userInfo";
import moment from "moment";
import { baseURL } from "../../utils/axios";
import { showImagePreview, showConfirmDialog } from 'vant';
import { CloseIcon } from "tdesign-icons-vue-next";
import { DialogPlugin, MessagePlugin } from "tdesign-vue-next";
import 'vant/es/dialog/style';

const { user } = useUserStore();
const list = ref([]);

const showImg = (url) => {
  showImagePreview({
    images: [url],
    startPosition: 0,
    closeable: true,
  });
};

const totalAmount = ref(0);

const getAllListRelated = () => {
  axios.get("/getAllListRelated").then((res) => {
    list.value = res.data.data.map((item) => {
      item.amount = Number(item.amount).toFixed(2);
      item.shareUserCount = item.share_with_user_id.split(",").length;
      item.shareUserNum = item.share_with_user_id.split(",").map(Number);
      item.photo_url_true = item.photo_url && (baseURL + '/public/' + item.photo_url);
      item.transation_date = moment(item.date).add(8, 'hour').format('YYYY-MM-DD');
      if (item.payee_id === user.user_id) {
        if (item.shareUserNum.includes(user.user_id)) {
          item.netAmount = (Number(item.amount) / item.shareUserCount) * (item.shareUserCount - 1);
        } else {
          item.netAmount = item.amount;
        }
      } else {
        item.netAmount = (Number(item.amount) / item.shareUserCount) * -1;
      }
      item.netAmount = Number(item.netAmount).toFixed(2);
      totalAmount.value += Number(item.netAmount);
      return item;
    }).reverse();
  });
};

const deleteRecord = (item) => {
  // const confirmDia = DialogPlugin({
  //   header: 'delete',
  //   body: `删了就没了${item.netAmount}蚊`,
  //   confirmBtn: 'ok',
  //   cancelBtn: 'cancel',
  //   onConfirm: ({ e }) => {
  //     axios.delete(`/splitBills/${item.id}`).then((res) => {
  //       MessagePlugin.success('删除成功')
  //       getAllListRelated();
  //     });
  //     confirmDia.hide();
  //   },
  //   onClose: ({ e, trigger }) => {
  //     confirmDia.hide();
  //   },
  // });
  showConfirmDialog({
    title: 'delete',
    message: `删了就没了${item.netAmount}蚊`,
  })
    .then(() => {
      // on confirm
      axios.delete(`/splitBills/${item.id}`).then((res) => {
        MessagePlugin.success('删除成功')
        getAllListRelated();
      });
    })
    .catch(() => {
      // on cancel
    });
}

onMounted(() => {
  getAllListRelated()
});
</script>
