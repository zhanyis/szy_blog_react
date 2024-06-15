<template>
  <div class="bg-white rounded p-3">
    <t-button class="mb-3" @click="query">
      <template #icon>
        <t-icon name="search" />
      </template>
    </t-button>
    <t-table
      row-key="id"
      :data="data"
      :columns="columns"
      stripe
      bordered
      hover
      table-layout="auto"
      size="medium"
      :pagination="pagination"
      cell-empty-content="-"
    >
      <template #createdAt="{ row }">
        {{ new Date(row.createdAt).toLocaleString('zh-CN') }}
      </template>
      <template #updatedAt="{ row }">
        {{ new Date(row.updatedAt).toLocaleString('zh-CN') }}
      </template>
      <template #op-column>
        <p>操作</p>
      </template>
      <template #op="slotProps">
        <t-button :disabled="!user.isLogin" variant="text" @click="rehandleClickOp(slotProps)">编辑</t-button>
        <t-button :disabled="!user.isLogin" variant="text" theme="warning" @click="deleteCommentById(slotProps.id)">删除</t-button>
      </template>
    </t-table>
  </div>

  <t-dialog v-model:visible="visibleBody" header="编辑" :on-confirm="updateComment">
    <template #body>
      <t-form>
        <t-form-item label="内容" name="content">
          <t-input v-model:value="updateContent.content"></t-input>
        </t-form-item>
        <t-form-item label="用户" name="user_id">
          <t-input v-model:value="updateContent.user_id"></t-input>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, reactive } from "vue"
import { queryComment, deleteCommentById, updateCommentById } from "../../hooks/useComment"
import { useUserStore } from '../../store/userInfo'

const { user } = useUserStore();

const data = ref([])
const columns = [
  {
    width: '100',
    colKey: 'id',
    title: 'id',
    // 对齐方式
    align: 'center',
    // // 设置列类名
    // className: 'custom-column-class-name',
    // // 设置列属性
    // attrs: {
    //   'data-id': 'first-column',
    // },
  },
  {
    colKey: 'content',
    title: '内容',
  },
  {
    colKey: 'user_id',
    title: '用户id',
  },
  {
    colKey: 'createdAt',
    title: '创建时间'
  },
  {
    colKey: 'updatedAt',
    title: '更新时间',
  },
  {
    colKey: 'op',
    width: 200,
    title: 'op-column',
    cell: 'op',
  },
  // {
  //   colKey: 'detail.position',
  //   title: '详情信息',
  //   /**
  //    * 1.内容超出时，是否显示省略号。值为 true，则浮层默认显示单元格内容；
  //    * 2.值类型为 Function 则自定义浮层显示内容；
  //    * 3.值类型为 Object，则自动透传属性到 Popup 组件。
  //    */
  //   // ellipsis: true,

  //   // 透传省略内容浮层 Popup 组件全部特性，示例代码有效，勿删！！！
  //   // ellipsis: { placement: 'bottom', destroyOnClose: false },

  //   // 完全自定义 ellipsis 浮层的样式和内容，示例代码有效，勿删！！！
  //   // ellipsis: (h, { row, col, rowIndex, colIndex }) => {
  //   //   if (rowIndex % 2) {
  //   //     return (
  //   //       <div>
  //   //         is even row {rowIndex + 1}, with data {row.detail.position}
  //   //       </div>
  //   //     );
  //   //   }
  //   //   return (
  //   //     <div>
  //   //       is odd row {rowIndex + 1}, with data {row.detail.position}
  //   //     </div>
  //   //   );
  //   // },
  // },
];

const pagination = reactive({
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 0
});

const updateContent = reactive({
  content: '',
  user_id: '',
  id: 1
})

const rehandleClickOp = ({ row }) => {
  updateContent.content = row.content
  updateContent.user_id = row.user_id
  updateContent.id = row.id
  visibleBody.value = true
};

const updateComment = () => {
  updateCommentById(updateContent.id, updateContent.content, updateContent.user_id).then(() => visibleBody.value = false)
}

const query = () => {
  queryComment().then((res: any) => {
    data.value = res.data.data
    pagination.total = data.value.length
  })
}

const visibleBody = ref(false);

onMounted(query)
</script>