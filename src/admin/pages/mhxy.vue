<template>
  <div class="bg-white rounded p-3">
    <div class="mb-3 flex">
      <t-input style="width: 200px" class="mr-3" v-model="queryParams.item_name" placeholder="物品名称"/>
      <t-select style="width: 200px" class="mr-3" v-model="queryParams.type_id" placeholder="物品分类" clearable filterable>
        <t-option v-for="item in typeData" :key="item.id" :label="item.type_name" :value="item.id" />
      </t-select>
      <t-select v-show="width > 500" style="width: 100px" class="mr-3" v-model="queryParams.price_from">
        <t-option key="-1" label="全部" value="-1" />
        <t-option key="0" label="摆摊" value="0" />
        <t-option key="1" label="商人" value="1" />
      </t-select>
      <t-button @click="query">
        <template #icon>
          <t-icon name="search" />
        </template>
      </t-button>
      <t-button
        class="ml-3"
        theme="primary"
        :disabled="!user.isLogin"
        @click="newItem"
        v-show="width > 500"
      >
        <template #icon>
          <t-icon name="add" />
          新增物品记录
        </template>
      </t-button>
      <t-button
        class="ml-3"
        theme="primary"
        :disabled="!user.isLogin"
        @click="newType"
        v-show="width > 500"
      >
        <template #icon>
          <t-icon name="add" />
          新增分类
        </template>
      </t-button>
    </div>
    <t-table
      row-key="id"
      :data="data"
      :columns="columns"
      stripe
      hover
      :height="height - 286"
      table-layout="fixed"
      size="small"
      :pagination="pagination"
      cell-empty-content="-"
      hide-sort-tips
      @sort-change="sortChange"
    >
      <template #type_id="{ row }">
        {{ typeData.find(item => item.id === row.type_id)?.type_name }}
      </template>
      <template #price_from="{ row }">
        {{ row.price_from === 0 ? '摆摊' : '商人' }}
      </template>
      <template #price="{ row }">
        <span :style="colorizeMoney(row.price)">{{ row.price }}</span>
      </template>
      <template #min="{ row }">
        <span :style="colorizeMoney(row.min)">{{ row.min }}</span>
      </template>
      <!-- <template #avg="{ row }">
        <span :style="colorizeMoney(row.avg)">{{ row.avg.toFixed(0) }}</span>
      </template> -->
      <template #max="{ row }">
        <span :style="colorizeMoney(row.max)">{{ row.max }}</span>
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
          @click="handleItemEdit(slotProps)"
          style="padding: 0;"
          >编辑</t-button
        >
        <t-button
          variant="text"
          v-if="user.isLogin || !user.user_auth_type"
          theme="warning"
          style="padding: 0;padding-left: 5px;"
          @click="deleteItemById(slotProps.row.id)"
          >删除</t-button
        >
      </template>
    </t-table>
  </div>

  <t-dialog
    v-model:visible="modal.visible"
    :header="modal.title"
    :on-confirm="submitType"
    @close="resetModalContent"
  >
    <template #body>
      <t-form>
        <t-form-item label="分类名称" name="type_name">
          <t-input v-model:value="modalContent.type_name"></t-input>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>

  <t-dialog
    v-model:visible="mhxyItems.visible"
    :header="mhxyItems.title"
    :on-confirm="submitMhxyItems"
    @close="resetMhxyItemsContent"
  >
    <template #body>
      <t-form>
        <t-form-item label="物品名称" name="item_name">
          <t-input v-model:value="mhxyItemsContent.item_name" placeholder="物品名称"></t-input>
        </t-form-item>
        <t-form-item label="物品分类" name="type_id">
          <t-select v-model="mhxyItemsContent.type_id" placeholder="物品分类" clearable filterable>
            <t-option v-for="item in typeData" :key="item.id" :label="item.type_name" :value="item.id" />
          </t-select>
        </t-form-item>
        <t-form-item label="价格" name="price">
          <t-input v-model:value="mhxyItemsContent.price" placeholder="价格"></t-input>
        </t-form-item>
        <t-form-item label="渠道" name="price_from">
          <t-select v-model="mhxyItemsContent.price_from" placeholder="渠道">
            <t-option key="0" label="摆摊" :value="0" />
            <t-option key="1" label="商人" :value="1" />
          </t-select>
        </t-form-item>
        <t-form-item>
          <t-button v-show="mhxyItems.title === '新增'" @click="OpenBulkCreate">批量新增(不稳定)</t-button>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>


  <t-dialog
    v-model:visible="bulkModal.visible"
    width="80%"
    header="批量新增"
    :on-confirm="submitBulkCreate"
    top="50px"
  >
    <template #body>
      <t-textarea
        v-model="bulkModal.textInput"
        placeholder="demo：金刚石/定魂珠130 龙鳞42 避水珠5夜光珠80"
        name="description"
        :autosize="{ minRows: 3, maxRows: 5 }"
      />
      <div class="mt-3 flex items-center">
        <span class="mr-3">大项分隔符:</span>
        <t-input style="width: 30px;" class="mr-3" v-model="bulkModal.splitItem" placeholder="大项分隔符" />
        <span class="mr-3">分隔符:</span>
        <t-input style="width: 30px;" class="mr-3" v-model="bulkModal.splitText" placeholder="子项分隔符" />
        <!-- <t-select style="width: 160px" class="mr-3" v-model="bulkModal.moneyIndex">
          <t-option key="0" label="钱在最后面" value="0" />
          <t-option key="1" label="钱在最前面" value="1" />
        </t-select> -->
        <t-checkbox v-model="bulkModal.wToZero" class="mr-3" >w自动解析并补充0000</t-checkbox>
        <t-button @click="parseText" class="mr-3">解析文字(不稳定)</t-button>
        <t-button @click="syncFirstType" class="mr-3">同步第一条分类</t-button>
        <t-button @click="changeName">自动改名</t-button>
      </div>
      <div class="h-52 overflow-y-scroll mt-3">
        <div v-for="item in bulkModal.generateItems" class="flex mt-1">
          <t-input v-model:value="item.item_name" placeholder="物品名称"></t-input>
          <t-select v-model="item.type_id" placeholder="物品分类" class="ml-2" filterable>
            <t-option v-for="item in typeData" :key="item.id" :label="item.type_name" :value="item.id" />
          </t-select>
          <t-input class="ml-2" v-model:value="item.price" placeholder="价格"></t-input>
        </div>
      </div>
    </template>
  </t-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, computed } from "vue";
import axios from "../../utils/axios";
import { useUserStore } from "../../store/userInfo";
import { MessagePlugin, DialogPlugin } from "tdesign-vue-next";
import { useWindowSize } from '@vueuse/core'
import { nameMap } from '../constant/nameMap'

const { width, height } = useWindowSize()

const data = ref([]);

const { user } = useUserStore();

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

const colorizeMoney = (val: number) => {
  if (val < 10000) {
    return ''
  } else if (val < 100000) {
    return 'color: blue'
  } else if (val < 1000000) {
    return 'color: green'
  } else if (val < 10000000) {
    return 'color: red'
  } else {
    return 'color: purple'
  }
}

const columns = computed(() => {
  if (width.value <= 500) {
    return [
      {
        colKey: "item_name",
        title: "物品名称"
      },
      {
        colKey: "price",
        title: "价格",
        sortType: "all",
        sorter: true,
        cell: "price",
      },
    ]
  }
  return [
    {
      colKey: "item_name",
      title: "物品名称"
    },
    {
      colKey: "type_id",
      title: "物品分类",
      cell: "type_id",
    },
    {
      colKey: "price",
      title: "价格",
      sortType: "all",
      sorter: true,
      cell: "price",
    },
    {
      colKey: "min",
      title: "最低价格",
      sortType: "all",
      sorter: true,
      cell: "min",
    },
    // {
    //   colKey: "avg",
    //   title: "平均价格",
    //   sortType: "all",
    //   sorter: true,
    //   cell: "avg",
    // },
    {
      colKey: "max",
      title: "最高价格",
      sortType: "all",
      sorter: true,
      cell: "max",
    },
    {
      colKey: "price_from",
      title: "渠道",
      cell: "price_from",
    },
    {
      colKey: "updatedAt",
      title: "更新时间"
    },
    {
      colKey: "op",
      width: 90,
      title: "op-column",
      cell: "op",
      fixed: "right",
    },
  ];
})

const pagination = reactive({
  defaultCurrent: 1,
  defaultPageSize: 20,
  total: 0,
  showPageNumber: true,
  showPageSize: true,
});

const modalContent = reactive({
  type_name: "",
});

const resetModalContent = () => {
  modalContent.type_name = "";
};

const submitType = () => {
  axios
    .post("/mhxyItemTypes", modalContent)
    .then(() => {
      modal.visible = false;
      MessagePlugin.success("新增分类成功");
      query();
    });
};

const typeData = ref([]);

const queryParams = reactive({
  type_id: undefined,
  item_name: "",
  price_from: "-1"
});

const query = () => {
  const params:any = {}
  if (queryParams.type_id !== undefined) {
    params['type_id'] = queryParams.type_id
  }
  if (queryParams.item_name !== "") {
    params['item_name'] = queryParams.item_name
  }
  if (queryParams.price_from !== "-1") {
    params['price_from'] = queryParams.price_from
  }
  axios.get("/mhxyItems", {
    params
  }).then((res: any) => {
    const itemPriceMap = {}
    res.data.data.forEach((item: any) => {
      if (itemPriceMap[item.item_name]) {
        itemPriceMap[item.item_name].max = Math.max(itemPriceMap[item.item_name].max, item.price)
        itemPriceMap[item.item_name].min = Math.min(itemPriceMap[item.item_name].min, item.price)
        itemPriceMap[item.item_name].avg = (itemPriceMap[item.item_name].avg * itemPriceMap[item.item_name].times + item.price) / (itemPriceMap[item.item_name].times + 1)
        itemPriceMap[item.item_name].times += 1
      } else {
        itemPriceMap[item.item_name] = {
          max: item.price,
          min: item.price,
          avg: item.price,
          times: 1
        }
      }
    })
    data.value = res.data.data.map((item: any) => {
      return {
        ...item,
        max: itemPriceMap[item.item_name].max,
        min: itemPriceMap[item.item_name].min,
        avg: itemPriceMap[item.item_name].avg,
      };
    });
    pagination.total = data.value.length;
  });
  axios.get("/mhxyItemTypes").then((res: any) => {
    const temp = res.data.data;
    typeData.value = temp
  })
};

const newType = () => {
  modal.visible = true;
  modal.title = "新增";
};

const deleteItemById = (id: number) => {
  const confirmD = DialogPlugin.confirm({
    header: '确认删除',
    confirmBtn: 'ok',
    cancelBtn: 'cancel',
    onConfirm: () => {
      axios.delete(`/mhxyItems/${id}`).then(query);
      confirmD.destroy()
    },
    onClose: () => {
      confirmD.hide();
    },
  });
  
};

const modal = reactive({
  visible: false,
  title: "新增",
});



const mhxyItems = reactive({
  visible: false,
  title: "新增",
});

const newItem = () => {
  mhxyItems.visible = true;
  mhxyItems.title = "新增";
}

const handleItemEdit = (props: any) => {
  mhxyItems.visible = true;
  mhxyItems.title = "编辑";
  mhxyItemsContent.item_name = props.row.item_name;
  mhxyItemsContent.type_id = props.row.type_id;
  mhxyItemsContent.price = props.row.price;
  mhxyItemsContent.price_from = props.row.price_from;
  mhxyItemsContent.id = props.row.id;
}

const mhxyItemsContent = reactive({
  item_name: "",
  type_id: undefined,
  price: 0,
  price_from: 0,
  id: -1
});

const resetMhxyItemsContent = () => {
  mhxyItemsContent.item_name = "";
  mhxyItemsContent.type_id = undefined;
  mhxyItemsContent.price = 0;
  mhxyItemsContent.price_from = 0;
  mhxyItemsContent.id = -1;
};

const submitMhxyItems = () => {
  if (mhxyItems.title !== "新增") { 
    axios
      .put("/mhxyItems/" + mhxyItemsContent.id, mhxyItemsContent)
      .then((res) => {
        MessagePlugin.info(res.data.msg);
      })
      .finally(() => {
        mhxyItems.visible = false;
        resetMhxyItemsContent();
        query();
      });
  } else {
    axios
      .post("/mhxyItems", {
        ...mhxyItemsContent,
        id: undefined
      })
      .then((res) => {
        MessagePlugin.info(res.data.msg);
      })
      .finally(() => {
        mhxyItems.visible = false;
        resetMhxyItemsContent();
        query();
      });
  }
};


const bulkModal = reactive({
  visible: false,
  textInput: '',
  generateItems: [],
  splitText: '/',
  moneyIndex: '0',
  wToZero: true,
  splitItem: ' '
})

const OpenBulkCreate = () => {
  bulkModal.visible = true
  bulkModal.wToZero = true
  bulkModal.textInput = ''
  bulkModal.moneyIndex = '0'
  bulkModal.generateItems = []
  bulkModal.splitText = '/'
  bulkModal.splitItem = ' '
}

const parseText = () => {
  const text = bulkModal.textInput
  const item = splitText(text, bulkModal.splitItem)
  const generateItems = []
  item.map((sub) => {
    const temp = sub[0].split(bulkModal.splitText)
    const money = sub[1]
    for (let i = 0; i < temp.length; i++) {
      generateItems.push({
        item_name: temp[i],
        type_id: undefined,
        price: bulkModal.wToZero ? Number(money) * 10000 : money,
        price_from: 0
      })
    }
  })
  bulkModal.generateItems = generateItems
}

const splitText = (text, delimiter = '') => {
    // 使用正则表达式匹配中文字符和数字
    let regex = new RegExp(`(\\d+)([^\\d${delimiter}]+)|([^\\d${delimiter}]+)(\\d+)`, 'g');
    let match;
    let result = [];

    // 使用正则表达式的exec方法循环匹配字符串
    while ((match = regex.exec(text)) !== null) {
        // 检查数字是在前面还是在后面，并将匹配到的中文字符和数字分别作为数组的元素，然后添加到结果数组中
        if (match[1]) {
            result.push([match[2], parseInt(match[1])]);
        } else {
            result.push([match[3], parseInt(match[4])]);
        }
    }

    return result;
}



const syncFirstType = () => {
  bulkModal.generateItems.map((item) => {
    item.type_id = bulkModal.generateItems[0].type_id
  })
}

const changeName = () => {
  bulkModal.generateItems.map((item) => {
    item.item_name = nameMap[item.item_name] || item.item_name
  })
}

const submitBulkCreate = () => {
  if (bulkModal.generateItems.length === 0) {
    MessagePlugin.info('请先解析文字')
    return
  }
  if (!bulkModal.generateItems.every((item) => item.item_name && item.price && item.type_id !== undefined)) {
    MessagePlugin.info('请先把内容填完整')
    return
  }
  axios.post('/mhxyItemBulk', bulkModal.generateItems).then((res) => {
    MessagePlugin.info(res.data.msg);
    if (res.data.status === 0) {
      bulkModal.visible = false;
      mhxyItems.visible = false;
      resetMhxyItemsContent();
      query();
    }
  })
}

onMounted(() => {
  query();
});
</script>
