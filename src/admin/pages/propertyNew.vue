<template>
  <!-- <div class="filter">筛选框</div> -->
  <div class="body">
    <div class="mb-2 flex item-center" v-if="pIds">
      <t-switch v-model="onlyRouter" /><span class="pl-2">只看推送内容</span>
    </div>
    <div class="card" v-for="d in computedData" v-show="d.units.length > 0">
      <!-- <div class="card-img"></div> -->
      <div class="card-content p-3">
        <div class="flex justify-between w-full items-center">
          <div>
            <div class="text-xl font-semibold text-zinc-700">
              {{ d.property_name }}
            </div>
            <div class="text-base italic text-zinc-500">
              {{ d.property_location }}
            </div>
          </div>
          <div class="text-2xl font-bold">{{ d.review_score * 4 }}</div>
        </div>
        <div class="flex justify-between w-full items-center mt-2 mb-2">
          <div
            @click="handleActive('video', d.id)"
            class="decoration-2 cursor-pointer underline decoration-indigo-500"
          >
            屋苑单位({{ d.units ? d.units.length : 0 }})
          </div>
          <div
            @click="handleActive('comments', d.id)"
            class="decoration-2 cursor-pointer underline decoration-indigo-500"
          >
            评价({{ d.comments ? d.comments.length : 0 }})
          </div>
        </div>
        <div class="w-full bg-amber-50" v-if="activeBtn.id === d.id">
          <div class="comments" v-if="activeBtn.btn === 'comments'">
            <div class="m-2" v-for="c in d.comments">
              <div class="text-xl">{{ c.user.user_name }}</div>
              <div class="text-stone-500 text-lg py-2 underline">
                {{ c.remark }}
              </div>
              <div class="flex text-sm">
                地区评分:
                <t-rate
                  class="ml-9"
                  allowHalf
                  disabled
                  :value="c.location_score"
                />
              </div>
              <div class="flex text-sm">
                投资价值评分:
                <t-rate
                  class="ml-2"
                  allowHalf
                  disabled
                  :value="c.investment_value_score"
                />
              </div>
              <div class="flex text-sm">
                公共设施评分:
                <t-rate
                  class="ml-2"
                  allowHalf
                  disabled
                  :value="c.property_facility_score"
                />
              </div>
              <div class="flex text-sm">
                房间质量评分:
                <t-rate
                  class="ml-2"
                  allowHalf
                  disabled
                  :value="c.property_indoor_score"
                />
              </div>
              <div class="flex text-sm">
                个人主观评分:
                <t-rate
                  class="ml-2"
                  allowHalf
                  disabled
                  :value="c.personal_score"
                />
              </div>
            </div>
          </div>
          <div class="video" v-if="activeBtn.btn === 'video'">
            <div
              v-for="u in d.units"
              class="flex my-2 justify-between items-center"
            >
              <div class="units-desc ml-2">
                <div class="text-yellow-900 text-base">
                  <span class="mr-2">{{ u.unit }}</span>
                  <span class="mr-2">{{ u.floor }}楼</span>
                  <span class="mr-2">{{ u.towards }}</span>
                </div>
                <div class="text-pink-900 text-lg font-bold">
                  <span class="mr-2">{{ u.feet }}尺</span>
                  <span class="mr-2">{{ u.price }}万</span>
                </div>
                <div class="italic">
                  {{ ((u.price || 0) / (u.feet || 1)).toFixed(2) }}万/尺
                </div>
              </div>
              <div
                @click="
                  handleDialog(
                    `${d.property_name} ${u.unit} ${u.floor}楼`,
                    u.video_link
                  )
                "
                class="mr-4 text-sky-700 cursor-pointer"
              >
                <PlayCircleIcon size="24px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <t-dialog
    v-model:visible="dialog.visible"
    attach="body"
    :header="dialog.title"
    :footer="false"
  >
    <video-player
      style="width: 100%; height: 400px"
      :src="createUrl(dialog.path)"
      controls
      v-if="dialog.visible"
    />
  </t-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from "vue";
import axios from "../../utils/axios";
import { baseURL } from "../../utils/axios";
import { usePropertyComment } from "../../hooks/useProperty";
import { VideoPlayer } from "@videojs-player/vue";
import { PlayCircleIcon } from "tdesign-icons-vue-next";
import { useRouteQuery } from '@vueuse/router';
import { pipe } from "gsap/src/gsap-core";

const pIds = useRouteQuery('pIds')

const data = ref([]);
const units = ref([]);
const comment = ref([]);

const onlyRouter = ref(Boolean(pIds.value));

const computedData = computed(() => {
  return data.value.map((d) => {
    d.units = [];
    d.comments = [];
    for (let u of units.value) {
      if (d.property_name === u.property_name) {
        if (!pIds.value || !onlyRouter.value || pIds.value.split(',').map(Number).includes(u.id)) {
          d.units.push(u);
        }
      }
    }
    for (let c of comment.value) {
      if (d.id === c.property_id) {
        d.comments.push(c);
      }
    }
    return d
  })
})

const activeBtn = reactive({
  btn: "",
  id: 0,
});

const handleActive = (btn: string, id: number) => {
  if (activeBtn.btn === btn && activeBtn.id === id) {
    activeBtn.btn = "";
  } else {
    activeBtn.btn = btn;
  }
  activeBtn.id = id;
};

const dialog = reactive({
  visible: false,
  path: "",
  title: "",
});

const handleDialog = (title, path) => {
  dialog.visible = true;
  dialog.title = title;
  dialog.path = path;
};

const { getAllComment } = usePropertyComment();

const createUrl = (str: string) => `${baseURL}/video?filePath=${str}`;

const queryProperty = () => {
  return axios.get("/property").then((res: any) => {
    data.value = res.data.data.sort((a: { review_score: number }, b : { review_score: number }) => b.review_score - a.review_score);
  });
};

const queryUnit = () => {
  axios.get("/propertyUnit").then((res: any) => {
    units.value = res.data.data;
  });
};

onMounted(() => {
  queryProperty()
  getAllComment().then((c) => {
    comment.value = c
  });
  queryUnit();
});
</script>

<style scoped>
.filter {
  background-color: red;
}

.card {
  width: 100%;
  border-bottom: 1px solid #999;
  display: flex;
  flex-direction: row;
  align-content: center;
  background: #fff;
}

.card-img {
  width: 20%;
}

.card-content {
  width: 100%;
}
</style>