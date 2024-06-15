<template>
  <div class="bg-white rounded p-3">
    <div class="mb-3 flex">
      <!-- <t-select
        style="width: 220px"
        class="mr-3"
        placeholder="请选择地点"
        v-model="queryReactive.property_location"
        clearable
      >
        <t-option
          v-for="i in queryReactive.property_location_option"
          :key="i"
          :label="i"
          :value="i"
        />
      </t-select> -->
      <t-button @click="query" :loading="queryReactive.loading">
        <template #icon>
          <t-icon name="search" />
        </template>
      </t-button>
      <t-button
        class="ml-3"
        theme="primary"
        :disabled="!user.isLogin"
        @click="newProperty"
      >
        <template #icon>
          <t-icon name="add" />
        </template>
      </t-button>
      <t-button
        class="ml-3"
        theme="primary"
        :disabled="!selectedRowKeys.length"
        @click="sendWechat"
      >
        推送微信
      </t-button>
    </div>
    <t-table
      row-key="id"
      :data="computedData"
      :columns="columns"
      stripe
      bordered
      hover
      table-layout="fixed"
      table-content-width="1300px"
      size="medium"
      :pagination="propertyUnitPage"
      :selected-row-keys="selectedRowKeys"
      select-on-row-click
      @select-change="rehandleSelectChange"
      cell-empty-content="-"
    >
      <template #watch_time="{ row }">
        {{ new Date(row.watch_time).toLocaleDateString("zh-CN") }}
      </template>
      <template #op-column>
        <p>操作</p>
      </template>
      <template #op="slotProps">
        <t-button
          variant="text"
          :disabled="!slotProps.row.video_link"
          :theme="watchedVideoId.includes(slotProps.row.id) ? 'default' : 'primary'"
          @click="handleOpenVideo(slotProps)"
          >视频</t-button
        >
        <t-button
          variant="text"
          :disabled="!user.isLogin"
          @click="handleEdit(slotProps)"
          >编辑</t-button
        >
        <t-button
          variant="text"
          v-if="user.user_auth_type"
          theme="warning"
          @click="deletePropertyById(slotProps.row.id)"
          >删除</t-button
        >
      </template>
    </t-table>
  </div>

  <t-dialog
    v-model:visible="modal.visible"
    :header="modal.title"
    :on-confirm="submitComment"
    placement="top:10%"
  >
    <template #body>
      <t-form>
        <t-form-item label="楼盘名称" name="property_name">
          <t-select
            style="width: 220px"
            class="mr-3"
            placeholder="请选择楼盘"
            v-model:value="modalContent.property_name"
            @change="handleSelectChange"
            filterable
            clearable
          >
            <t-option
              v-for="i in propertyData"
              :key="i.property_name"
              :label="i.property_name"
              :value="i.property_name"
            />
          </t-select>
          <!-- <t-input v-model:value="modalContent.property_name"></t-input> -->
        </t-form-item>
        <t-form-item label="楼盘地点" name="property_location">
          <t-input disabled  disable v-model:value="modalContent.property_location"></t-input>
        </t-form-item>
        <t-form-item label="看房时间" name="watch_time">
          <t-date-picker
            v-model:value="modalContent.watch_time"
          ></t-date-picker>
        </t-form-item>
        <t-form-item label="楼层" name="floor">
          <t-input v-model:value="modalContent.floor"></t-input>
        </t-form-item>
        <t-form-item label="房号" name="unit">
          <t-input v-model:value="modalContent.unit"></t-input>
        </t-form-item>
        <t-form-item label="朝向" name="towards">
          <t-input v-model:value="modalContent.towards"></t-input>
        </t-form-item>
        <t-form-item label="呎数" name="feet">
          <t-input v-model:value="modalContent.feet"></t-input>
        </t-form-item>
        <t-form-item label="价格" name="price">
          <t-input v-model:value="modalContent.price"></t-input>
        </t-form-item>
        <t-form-item label="楼龄" name="ages">
          <t-input v-model:value="modalContent.ages"></t-input>
        </t-form-item>
        <t-form-item label="上传视频" name="video">
          <t-upload
            v-model="filesVideo"
            accept=".mov"
            :action="baseURL + '/uploadVideo'"
            withCredentials
            @success="handleUploadSuccess"
            :headers="{'x-csrf-token': Cookies.get(xsrfCookieName)}"
          ></t-upload>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
  
  <sendWechatDialog ref="sendWechatRef" @on-close="selectedRowKeys = []" />
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from "vue";
import axios, { baseURL, xsrfCookieName } from "../../utils/axios";
import { useUserStore } from "../../store/userInfo";
import { useUserBehaviorStore } from "../../store/userBehavior";
import { MessagePlugin } from "tdesign-vue-next";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import sendWechatDialog from "../component/sendWechatDialog.vue";

const data = ref([]);

const router = useRouter();

const { user } = useUserStore();

const { watchedVideoId, addWatchVideoId, propertyUnitPage } = useUserBehaviorStore();

const selectedRowKeys = ref([]);

const sendWechatRef = ref(null);

const rehandleSelectChange = (value, { selectedRowData }) => {
  selectedRowKeys.value = value;
};

const sendWechat = () => {
  sendWechatRef.value.visible = true;
  sendWechatRef.value.wechatParams.touser = '@all';
  sendWechatRef.value.wechatParams.agent_id = '1000002';
  const content = `今日更新楼盘推送！!
    \n${data.value
      .filter(d => selectedRowKeys.value.includes(d.id))
      .map(d => `${d.property_name} ${d.unit} ${d.floor ? d.floor + '楼' : ''} ${d.towards}\n${d.price || ''}万 ${d.feet || ''}尺`)
      .join('\n') 
    }
    \n点击链接查看视频 <a href=\"https://localhost:3333/#/admin/property?pIds=${selectedRowKeys.value.join(',')}\">查看推送楼盘</a>`
  sendWechatRef.value.wechatParams.content = content;
}

const computedData = computed(() => {
  data.value = data.value.sort(
    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
  );
  if (queryReactive.property_location) {
    const result = data.value.filter(
      (i) => i.property_location === queryReactive.property_location
    );
    propertyUnitPage.current = 1;
    propertyUnitPage.total = result.length;
    return result;
  }
  return data.value;
});

const columns = [
  {
    colKey: 'row-select',
    type: 'multiple',
    // 禁用行选中方式一：使用 disabled 禁用行（示例代码有效，勿删）。disabled 参数：{row: RowData; rowIndex: number })
    // 这种方式禁用行选中，当前行会添加行类名 t-table__row--disabled，禁用行文字变灰
    // disabled: ({ rowIndex }) => rowIndex === 1 || rowIndex === 3,

    // 禁用行选中方式二：使用 checkProps 禁用行（示例代码有效，勿删）
    // 这种方式禁用行选中，行文本不会变灰
    width: 50,
  },
  {
    colKey: "property_name",
    title: "楼盘名称",
    align: "center",
    width: 90,
  },
  {
    colKey: "price",
    title: "价格",
    width: 80,
  },
  {
    colKey: "feet",
    title: "呎数",
    width: 80,
  },
  {
    colKey: "floor",
    title: "楼层",
    width: 80,
  },
  {
    colKey: "unit",
    title: "单位",
    width: 80,
  },
  {
    colKey: "towards",
    title: "朝向",
    width: 80,
  },
  {
    colKey: "ages",
    title: "楼龄",
    width: 80,
  },
  {
    colKey: "property_location",
    title: "楼盘地点",
    width: 100,
  },
  {
    colKey: "watch_time",
    title: "看房时间",
    width: 100,
  },
  {
    colKey: "op",
    width: 50,
    title: "op-column",
    cell: "op",
    fixed: "right",
  },
];

const queryReactive = reactive({
  property_location: "",
  property_location_option: [],
  loading: false
});

const handleOpenVideo = (props) => {
  console.log(props.row.video_link);
  addWatchVideoId(props.row.id);
  console.log(watchedVideoId);
  if (props.row.video_link) {
    const url = router.resolve({
      path: "/admin/watchVideo",
      query: {
        filePath: props.row.video_link,
      },
    });
    window.open(url.href, "_blank");
  }
  // window.open(baseURL + '/' + 'video?filePath=result.mp4', '_blank')
};

const modalContent = reactive({
  property_name: "",
  property_location: "",
  watch_time: new Date(),
  video_link: "",
  unit: "",
  towards: "",
  review_score: 0,
  floor: null,
  feet: null,
  price: null,
  ages: null,
  id: "",
});

const resetModalContent = () => {
  modalContent.property_name = "";
  modalContent.property_location = "";
  modalContent.watch_time = new Date();
  modalContent.video_link = "";
  modalContent.review_score = null;
  modalContent.feet = null;
  modalContent.price = null;
  modalContent.floor = null;
  modalContent.unit = "";
  modalContent.towards = "";
  modalContent.id = "";
  modalContent.ages = null;
  filesVideo.value = [];
  queryReactive.property_name = "";
};

const handleEdit = ({ row }) => {
  Object.keys(modalContent).forEach((k) => (modalContent[k] = row[k]));
  modal.visible = true;
  modal.title = "编辑";
};

const submitComment = () => {
  if (modal.loading) return
  modal.loading = true
  const { property_name, property_location } = modalContent
  if (modal.title === "编辑") {
    axios
      .put("/propertyUnit/" + modalContent.id, {
        ...modalContent,
      })
      .then(() => {
        modal.visible = false;
        modal.loading = false;
        MessagePlugin.success("修改成功")
        resetModalContent();
        query();
      });
  } else {
    axios
      .post("/propertyUnit", {
        ...modalContent,
        id: undefined,
      })
      .then((res) => {
        if (res.data.error) {
          MessagePlugin.error(res.data.error)
        } else {
          MessagePlugin.success("新增成功")
        }
        modal.visible = false;
        modal.loading = false;
        resetModalContent();
        modalContent.property_name = property_name;
        modalContent.property_location = property_location;
        query();
      });
  }
};

const query = () => {
  queryReactive.loading = true;
  axios.get("/propertyUnit").then((res: any) => {
    data.value = res.data.data;
    // console.log([...new Set(res.data.data.map(i => i.property_name))])
    queryReactive.property_location_option = [
      ...new Set(res.data.data.map((i) => i.property_location)),
    ];
    // propertyUnitPage.current = 1;
    propertyUnitPage.total = data.value.length;
  }).finally(() => queryReactive.loading = false);
};

const newProperty = () => {
  modal.visible = true;
  modal.title = "新增";
};

const deletePropertyById = (id: number) => {
  axios.delete(`/propertyUnit/${id}`).then(query);
};

const modal = reactive({
  visible: false,
  title: "新增",
  loading: false
});

const handleUploadSuccess = (context) => {
  console.log(context.response.data);
  modalContent.video_link = context.response.data;
};

const propertyData = ref([])

const queryProperty = () => {
  axios.get("/property").then((res: any) => {
    propertyData.value = res.data.data
  });
};

const handleSelectChange = (v: string) => {
  console.log(v);
  modalContent.property_location = propertyData.value.filter(p => p.property_name === v)[0]?.property_location
}

const filesVideo = ref([]);

onMounted(() => {
  query();
  queryProperty();
});
</script>

<style scoped>
.t-button--variant-text {
  padding-left: 0;
  padding-right: 0;
}
</style>
