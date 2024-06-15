<template>
  <div class="bg-white rounded p-3">
    <div class="mb-3">
      <t-button @click="query">
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
    </div>
    <t-table
      row-key="id"
      :data="data"
      :columns="columns"
      stripe
      bordered
      hover
      table-layout="fixed"
      size="medium"
      :pagination="pagination"
      cell-empty-content="-"
      hide-sort-tips
      @sort-change="sortChange"
    >
      <template #watch_time="{ row }">
        {{ new Date(row.watch_time).toLocaleString("zh-CN") }}
      </template>
      <template #review_score="{ row }">
        <t-link theme="primary" @click="handleReviewClick(row.id)">{{
          row.review_score * 4
        }}</t-link>
      </template>
      <template #createdAt="{ row }">
        {{ new Date(row.createdAt).toLocaleString("zh-CN") }}
      </template>
      <template #updatedAt="{ row }">
        {{ new Date(row.updatedAt).toLocaleString("zh-CN") }}
      </template>
      <template #op-column>
        <p>操作</p>
      </template>
      <template #op="slotProps">
        <t-button
          variant="text"
          :disabled="!user.isLogin"
          @click="handleEdit(slotProps)"
          >编辑</t-button
        >
        <t-button
          variant="text"
          :disabled="!user.isLogin"
          @click="handleComment(slotProps)"
          >评分</t-button
        >
        <t-button
          variant="text"
          v-if="user.isLogin || !user.user_auth_type"
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
    @close="resetpropertyComment"
    placement="top:10%"
  >
    <template #body>
      <t-form>
        <t-form-item v label="楼盘名称" name="property_name">
          <t-input v-model:value="modalContent.property_name"></t-input>
        </t-form-item>
        <t-form-item label="楼盘地点" name="property_location">
          <t-input v-model:value="modalContent.property_location"></t-input>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>

  <t-dialog v-model:visible="comment.visible" placement="top:10%">
    <form v-for="c in commentContent">
      <t-divider>{{ c.user.user_name }}</t-divider>
      <t-form-item label="地区评分" name="location_score">
        <t-rate allowHalf disabled :value="c.location_score" />
      </t-form-item>
      <t-form-item label="投资价值评分" name="investment_value_score">
        <t-rate allowHalf disabled :value="c.investment_value_score" />
      </t-form-item>
      <t-form-item label="公共设施评分" name="property_facility_score">
        <t-rate allowHalf disabled :value="c.property_facility_score" />
      </t-form-item>
      <t-form-item label="房间质量评分" name="property_indoor_score">
        <t-rate allowHalf disabled :value="c.property_indoor_score" />
      </t-form-item>
      <t-form-item label="个人主观评分" name="personal_score">
        <t-rate allowHalf disabled :value="c.personal_score" />
      </t-form-item>
      <t-form-item label="备注" name="remark">
        {{ c.remark }}
      </t-form-item>
    </form>
  </t-dialog>

  <t-drawer
    v-model:visible="propertyComment.visible"
    :on-confirm="handleCommentConfirm"
  >
    手机上看星星要点击两次QaQ
    <t-form ref="form" :data="propertyComment" :colon="true" label-align="top">
      <t-form-item label="地区评分" name="location_score">
        <t-rate allowHalf v-model:value="propertyComment.location_score" />
      </t-form-item>
      <t-form-item label="投资价值评分" name="investment_value_score">
        <t-rate allowHalf v-model:value="propertyComment.investment_value_score" />
      </t-form-item>
      <t-form-item label="公共设施评分" name="property_facility_score">
        <t-rate allowHalf v-model:value="propertyComment.property_facility_score" />
      </t-form-item>
      <t-form-item label="房间质量评分" name="property_indoor_score">
        <t-rate allowHalf v-model:value="propertyComment.property_indoor_score" />
      </t-form-item>
      <t-form-item label="个人主观评分" name="personal_score">
        <t-rate allowHalf v-model:value="propertyComment.personal_score" />
      </t-form-item>
      <t-form-item label="备注" name="remark">
        <t-textarea
          v-model:value="propertyComment.remark"
          :autosize="{ minRows: 3, maxRows: 5 }"
          placeholder="请输入内容"
        />
      </t-form-item>
    </t-form>
  </t-drawer>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, computed } from "vue";
import axios from "../../utils/axios";
import { useUserStore } from "../../store/userInfo";
import { MessagePlugin } from "tdesign-vue-next";
import { usePropertyComment } from "../../hooks/useProperty"

const data = ref([]);

const { user } = useUserStore();

const {
  propertyComment,
  allComment,
  comment,
  commentContent,
  getAllComment,
  resetpropertyComment
} = usePropertyComment()

const sortChange = (sort: { descending: string; sortBy: string }) => {
  if (sort) {
    data.value = data.value
      .concat()
      .sort((a, b) =>
        sort.descending
          ? b[sort.sortBy] - a[sort.sortBy]
          : a[sort.sortBy] - b[sort.sortBy]
      );
  } else {
    data.value = data.value.concat();
  }
};

const columns = computed(() => {
  if (!user.isLogin) {
    return [
    {
      colKey: "property_name",
      title: "楼盘名称",
      align: "center",
    },
    {
      colKey: "property_location",
      title: "楼盘地点",
    },
    {
      colKey: "review_score",
      title: "综合评分",
      sortType: "all",
      sorter: true,
    }]
  }
  return [
    {
      colKey: "property_name",
      title: "楼盘名称",
      align: "center",
      width: 100
    },
    {
      colKey: "property_location",
      title: "楼盘地点",
      width: 100
    },
    {
      colKey: "review_score",
      title: "综合评分",
      sortType: "all",
      sorter: true,
      width: 100
    },
    {
      colKey: "createdAt",
      title: "创建时间",
      width: 200,
    },
    {
      colKey: "updatedAt",
      title: "更新时间",
      width: 200,
    },
    {
      colKey: "op",
      width: 90,
      title: "op-column",
      cell: "op",
      fixed: "right",
    },
  ];
});

const pagination = reactive({
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 0,
  showPageNumber: false,
  showPageSize: false
});

const modalContent = reactive({
  property_name: "",
  property_location: "",
  watch_time: new Date(),
  related_video_link: "",
  review_score: 0,
  two_room_feet: 0,
  two_room_price_avg: 0,
  three_room_feet: 0,
  three_room_price_avg: 0,
  id: -1,
});

const resetModalContent = () => {
  modalContent.property_name = "";
  modalContent.property_location = "";
  modalContent.watch_time = new Date();
  modalContent.related_video_link = "";
  modalContent.review_score = 0;
  modalContent.two_room_feet = 0;
  modalContent.two_room_price_avg = 0;
  modalContent.three_room_feet = 0;
  modalContent.three_room_price_avg = 0;
  modalContent.id = -1;
};

const handleEdit = ({ row }: { row: typeof modalContent }) => {
  modalContent.property_name = row.property_name;
  modalContent.property_location = row.property_location;
  modalContent.watch_time = row.watch_time
  modalContent.review_score = row.review_score
  modal.visible = true;
  modal.title = "编辑";
};

const submitComment = () => {
  if (modal.title === "编辑") {
    axios
      .put("/property/" + modalContent.id, {
        ...modalContent,
      })
      .then(() => {
        modal.visible = false;
        MessagePlugin.success('修改成功')
        resetModalContent();
        query();
      });
  } else {
    axios
      .post("/property", {
        ...modalContent,
        id: undefined,
      })
      .then(() => {
        modal.visible = false;
        MessagePlugin.success('新增评论成功')
        resetModalContent();
        query();
      });
  }
};

const query = () => {
  axios.get("/property").then((res: any) => {
    data.value = res.data.data.sort((a: { review_score: number }, b : { review_score: number }) => b.review_score - a.review_score);
    pagination.total = data.value.length;
  });
};

const newProperty = () => {
  modal.visible = true;
  modal.title = "新增";
};

const deletePropertyById = (id: number) => {
  axios.delete(`/property/${id}`).then(query);
};

const modal = reactive({
  visible: false,
  title: "新增",
});

const handleReviewClick = (id: number) => {
  comment.visible = true;
  comment.id = id;
};

const handleComment = (data: any) => {
  propertyComment.visible = true;
  propertyComment.property_id = data.row.id;
  const res = allComment.value.filter((c) => c.property_id === data.row.id && c.user_id === user.user_id)
  if (res.length >= 1) {
    propertyComment.property_id = res[0].property_id;
    propertyComment.user_id = res[0].user_id;
    propertyComment.location_score = res[0].location_score;
    propertyComment.investment_value_score = res[0].investment_value_score;
    propertyComment.property_facility_score = res[0].property_facility_score;
    propertyComment.property_indoor_score = res[0].property_indoor_score;
    propertyComment.personal_score = res[0].personal_score;
    propertyComment.remark = res[0].remark;
    propertyComment.isEdit = true;
    propertyComment.id = res[0].id;
  }
};


const handleCommentConfirm = () => {
  if (propertyComment.isEdit) {
    axios
      .put("/propertyComment/"  + propertyComment.id, propertyComment)
      .then((res) => {
        MessagePlugin.info(res.data.msg);
      })
      .finally(() => {
        propertyComment.visible = false;
        resetpropertyComment();
        getAllComment()
        query();
      });
  } else {
    axios
      .post("/propertyComment", propertyComment)
      .then((res) => {
        MessagePlugin.info(res.data.msg);
      })
      .finally(() => {
        propertyComment.visible = false;
        resetpropertyComment();
        getAllComment()
        query();
      });
  }
};

watch(
  user,
  () => {
    propertyComment.user_id = user.user_id;
  },
  { immediate: true }
);

onMounted(() => {
  getAllComment()
  query()
});
</script>
