<template>
  <div style="height: 100%">
    <van-cell
      :title="currentSelectedDay"
      is-link
      arrow-direction="down"
      @click="selectDate"
    />
    <van-calendar
      v-model:show="calendar.show"
      :min-date="calendar.minDate"
      :max-date="calendar.maxDate"
      :value="currentSelectedDay"
      @confirm="onConfirm"
      :formatter="formatter"
    />
    <van-field
      v-model="content.first_content"
      rows="2"
      autosize
      label="今日碎事1"
      type="textarea"
      maxlength="255"
      placeholder="今日碎事1"
      show-word-limit
    />
    <van-field
      v-model="content.second_content"
      rows="2"
      autosize
      label="今日碎事2"
      type="textarea"
      maxlength="255"
      placeholder="今日碎事3"
      show-word-limit
    />
    <van-field
      v-model="content.third_content"
      rows="2"
      autosize
      label="今日碎事3"
      type="textarea"
      maxlength="255"
      placeholder="今日碎事3"
      show-word-limit
    />
    <div class="flex justify-center align-center m-2">
      <van-uploader
        v-if="currentIndex === writtenDay.length - 1"
        preview-size="12rem"
        @delete="content.img_1_url = ''"
        :after-read="afterRead"
        v-model="fileList"
        multiple
        :max-count="1"
      />
      <van-image
        v-if="currentIndex !== writtenDay.length - 1 && content.img_1_url"
        width="12rem"
        height="12rem"
        fit="cover"
        position="left"
        :src="baseURL + '/public/' + content.img_1_url"
        @click="showImg(baseURL + '/public/' + content.img_1_url)"
      />
    </div>
    <div class="flex justify-between">
      <t-button theme="success" :disabled="currentIndex === 0" shape="circle" @click="moveCurrentDay('backward')"><ChevronLeftIcon slot="icon"/></t-button>
      <t-button class="mb-5" theme="success" shape="round" @click="handleSave" :disabled="loading">
        <template #icon><AddIcon /></template>
        保存
      </t-button>
      <t-button class="mb-5" theme="success" shape="round" @click="show = true" v-show="otherWriten && currentSelectedDay === moment().format('yyyy-MM-DD')">
        看看ta的
      </t-button>
      <t-button theme="success" :disabled="currentIndex === writtenDay.length - 1" @click="moveCurrentDay('forward')" shape="circle"><ChevronRightIcon slot="icon"/></t-button>
    </div>

    <van-dialog v-model:show="show" :title="othersText?.img_3_url">
      <p class="mx-4 my-2">{{ othersText.first_content }}</p>
      <p class="mx-4 my-2">{{ othersText.second_content }}</p>
      <p class="mx-4 my-2">{{ othersText.third_content }}</p>
      <div class="w-full flex justify-center" v-if="othersText.img_1_url">
        <van-image
          width="12rem"
          height="12rem"
          fit="cover"
          position="left"
          :src="baseURL + '/public/' + othersText.img_1_url"
          @click="showImg(baseURL + '/public/' + othersText.img_1_url)"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, computed } from "vue";
import axios from "../../utils/axios";
import { useUserStore } from "../../store/userInfo";
import { ChevronLeftIcon, ChevronRightIcon, AddIcon } from "tdesign-icons-vue-next";
import moment from "moment";
import { MessagePlugin } from 'tdesign-vue-next';
import { useImgCompress } from '../../hooks/useImgCompress';
import { baseURL } from "../../utils/axios";
import { showImagePreview } from 'vant';

const { compressImg } = useImgCompress() 

const { user } = useUserStore();

const showImg = (url) => {
  showImagePreview({
    images: [url],
    startPosition: 0,
    closeable: true,
  });
};

const content = reactive({
  first_content: "",
  second_content: "",
  third_content: "",
  img_1_url: "",
});

const currentSelectedDay = ref('');

const calendar = reactive({
  show: false,
  minDate: moment("2023-06-01").toDate(),
  maxDate: moment().endOf("month").toDate(),
});

const fileList = ref([]);
const loading = ref(false);

const upload = (forms) => {
  axios
    .post("/uploadBills", forms, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      content.img_1_url = res.data.data;
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

const selectDate = () => {
  calendar.show = true;
};

const onConfirm = (value) => {
  calendar.show = false;
  currentSelectedDay.value = moment(value).format("yyyy-MM-DD")
};

const formatter = (day: any) => {
  if (!writtenDay.value.includes(moment(day.date).format('yyyy-MM-DD'))) {
    day.type = 'disabled'
  }
  return day
}

const handleSave = () => {
  if (type.value === 'add') {
    addDiary()
  } else {
    updateDiary()
  }
}

const updateDiary = () => {
  axios
    .put("/diaries/" + returnData.value.id, {
      ...returnData.value,
      ...content,
      user_name: user.user_name,
      user_id: user.user_id
    })
    .then((res) => {
      getDiaryByDate()
      getDateDairyWritten()
      MessagePlugin.success('更新成功')
    });
};

const addDiary = () => {
  axios
    .post("/diaries", {
      ...content,
      user_name: user.user_name,
      user_id: user.user_id,
      date: moment().valueOf(),
    })
    .then((res) => {
      type.value = 'edit'
      getDiaryByDate()
      getDateDairyWritten()
      MessagePlugin.success('保存成功')
    });
};
const currentIndex = computed(() => {
  return writtenDay.value.findIndex((item) => item === currentSelectedDay.value)
})
const writtenDay = ref([])
const getDateDairyWritten = () => {
  axios.get('/getDateDairyWritten').then(res => {
    writtenDay.value = [...new Set([...res.data.data.dateSet, moment().format("yyyy-MM-DD")])]
  })
}

const moveCurrentDay = (direction: string) => {
  if (direction === 'forward') {
    currentSelectedDay.value = writtenDay.value[currentIndex.value + 1]
  } else {
    currentSelectedDay.value = writtenDay.value[currentIndex.value - 1]
  }
}
const returnData = ref({})

const othersText = ref({
  img_1_url: '',
  img_3_url: '',
  first_content: '',
  second_content: '',
  third_content: ''
})
const otherWriten = ref(false)
const show = ref(false)


const type = ref('add')
const getDiaryByDate = (user_id) => {
  axios.get('/getDiaryByDate', {
    params: {
      date: currentSelectedDay.value,
      user_id,
    }
  }).then((res) => {
    const temp = res.data.data
    if (!user_id) {
      if (temp.length !== 1) {
        type.value = 'add'
        content.first_content = ""
        content.second_content = ""
        content.third_content = ""
        content.img_1_url = ""
        fileList.value = []
        returnData.value = {}
      } else {
        type.value = 'edit'
        content.first_content = temp[0].first_content
        content.second_content = temp[0].second_content
        content.third_content = temp[0].third_content
        content.img_1_url = temp[0].img_1_url
        if (temp[0].img_1_url) {
          fileList.value = [{ url: baseURL + '/public/' + temp[0].img_1_url  }];
        } else {
          fileList.value = []
        }
        returnData.value = temp[0]
      }
      if (currentSelectedDay.value === moment().format('yyyy-MM-DD')) {
        if (user.user_id === 1) {
          getDiaryByDate(2)
        } else if (user.user_id === 2) {
          getDiaryByDate(1)
        }
      }
    } else {
      if (temp.length === 1) {
        othersText.value = temp[0]
        otherWriten.value = true
      }
    }
  })
}

watch([currentSelectedDay, user], (val, oldval) => {
  // console.log('watch',val,oldval)
  getDiaryByDate()
})

onMounted(() => {
  // console.log('onmounted')
  getDateDairyWritten()
  currentSelectedDay.value = moment().format("yyyy-MM-DD")
});
</script>

<style scoped>
/deep/ .van-button--primary {
  background-color: #1989fa !important;
}
</style>
