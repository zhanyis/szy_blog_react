<template>
  <div class="tdesign-layout">
    <t-layout>
      <t-header class="sticky top-0 z-50">
        <t-head-menu value="item1" height="120px">
          <template #logo>
            <logo style="transform: translate(50px, -24px)" />
          </template>
          <template #operations>
            <a href="javascript:;"
              ><t-icon
                class="t-menu__operations-icon"
                name="home"
                @click="herfTo('/')"
            /></a>
            <a href="javascript:;"
              ><t-icon
                @click="drawer.visible = true"
                class="t-menu__operations-icon"
                name="user"
            /></a>
            <a v-if="width <= 500" href="javascript:;"
              ><BulletpointIcon
                @click="menuDrawer.visible = true"
                size="26px"
              />
            </a>
          </template>
        </t-head-menu>
      </t-header>
      <t-layout>
        <t-aside
          style="border-top: 1px solid var(--component-border)"
          v-if="width > 500"
        >
          <t-menu
            theme="light"
            :value="selectedValue"
            style="margin-right: 50px"
          >
            <t-menu-item
              :value="item.key"
              v-for="item in menuArr"
              @click="handleItemClick(item)"
            >
              <template #icon>
                <t-icon :name="item.icon" />
              </template>
              {{ item.name }}
            </t-menu-item>
          </t-menu>
        </t-aside>
        <t-layout>
          <t-content
            :style="{ 
              width: width <= 500 ? '100vw' : 'calc(100vw - 232px)',
            }"
            style="height: calc(var(--vh, 1vh) * 100 - 4rem - 64px);"
            class="p-3 overflow-auto"
          >
            <router-view />
          </t-content>
        </t-layout>
      </t-layout>
    </t-layout>
  </div>

  <t-drawer v-model:visible="drawer.visible" :footer="false" size="300px">
    <t-form
      v-if="!user.isLogin || user.user_auth_type"
      ref="form"
      :data="formData"
      :colon="true"
      :label-width="0"
    >
      <t-form-item name="user_name">
        <t-input
          v-model="formData.user_name"
          clearable
          placeholder="请输入账户名"
        >
          <template #prefix-icon>
            <t-icon name="desktop-icon" />
          </template>
        </t-input>
      </t-form-item>
      <t-form-item name="user_password">
        <t-input
          v-model="formData.user_password"
          type="password"
          clearable
          placeholder="请输入密码"
        >
          <template #prefix-icon>
            <t-icon name="lock-on-icon" />
          </template>
        </t-input>
      </t-form-item>
      <t-form-item style="padding-top: 8px" v-if="!user.user_auth_type">
        <t-button theme="primary" @click="login" block>登录</t-button>
      </t-form-item>
      <t-form-item style="padding-top: 8px" v-if="user.user_auth_type">
        <t-button @click="register" theme="default" variant="outline" block
          >注册</t-button
        >
      </t-form-item>
      <t-form-item style="padding-top: 8px" v-if="user.isLogin">
        <t-button @click="logout" theme="default" variant="outline" block
          >登出</t-button
        >
      </t-form-item>
    </t-form>
    <div v-else>user: {{ user.user_name }}
      <t-button @click="logout" theme="default" variant="outline" block
        >登出</t-button
      >
    </div>
  </t-drawer>

  <!-- <t-drawer
    v-model:visible="menuDrawer.visible"
    placement="top"
    :footer="false"
  >
    <div
      :value="item.key"
      v-for="item in menuArr"
      @click="handleItemClick(item)"
      class="h-6 mx-auto my-4 underline"
    >
      <icon :name="item.icon" />
      {{ item.name }}
    </div>
  </t-drawer> -->
  <van-action-sheet v-model:show="menuDrawer.visible" :actions="menuArr" @select="handleItemClick" cancel-text="取消"
  close-on-click-action />
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, watch, reactive, computed, onUnmounted } from "vue";
import axios from "../utils/axios";
import { MessagePlugin } from "tdesign-vue-next";
import { useUserStore } from "../store/userInfo";
import { useWindowSize } from "@vueuse/core";
import { BulletpointIcon } from "tdesign-icons-vue-next";

const router = useRouter();
const route = useRoute();
const { width } = useWindowSize();

const { changeLogin, user } = useUserStore();

const menuArr = computed(() => {
  if (!user.isLogin) return [
    {
      name: "看房记录",
      icon: "",
      key: "propertyNew",
      url: "/admin/property",
    },
    {
      name: "昭君台物价指数",
      icon: "",
      key: "mhxy",
      url: "/admin/mhxy",
    }
  ]
  let temp = [
  ]
  if (user.user_auth_type === 0 || user.user_auth_type === 1) {
    temp.push(
      {
        name: "看房记录",
        icon: "",
        key: "propertyNew",
        url: "/admin/property",
      },
      {
        name: "昭君台物价指数",
        icon: "",
        key: "mhxy",
        url: "/admin/mhxy",
      },
      {
        name: "看房记录old",
        icon: "",
        key: "propertyUnit",
        url: "/admin/propertyUnit",
      },
      {
        name: "楼盘评价",
        icon: "",
        key: "property",
        url: "/admin/propertyOld",
      },
      {
        name: "吾日三省吾身",
        icon: "",
        key: "diary",
        url: "/admin/diary",
      },
      {
        name: "账单分割",
        icon: "",
        key: "bill",
        url: "/admin/bill",
      },
    )
  }
  if (user.user_auth_type === 1) {
    temp.push({
      name: "留言板管理",
      icon: "",
      key: "comment",
      url: "/admin/comment",
    },
    {
      name: "文件上传",
      icon: "",
      key: "upload",
      url: "/admin/upload",
    })
  }
  return temp
});

const drawer = reactive({
  visible: false,
});

const formData = reactive({
  user_name: "",
  user_password: "",
});

const login = () => {
  axios
    .post("/user/login", {
      ...formData,
    })
    .then((res) => {
      formData.user_name = "";
      formData.user_password = "";
      changeLogin(res.data.data.user_name, res.data.data.token, res.data.data.user_id, res.data.data.user_auth_type);
      drawer.visible = false;
      console.log(user)
      window.localStorage.setItem('jwt', 'Bearer ' + res.data.data.token);
      MessagePlugin.info(res.data.msg);
    });
};

const register = () => {
  axios
    .post("/user/register", {
      ...formData,
    })
    .then((res) => {
      MessagePlugin.info(res.data.msg);
    });
};

const logout = () => {
  window.localStorage.removeItem('jwt')
  changeLogin('', '', -100, 0, false);
}

const checkLogin = () => {
  return axios.get('/checkLogin').then(res => {
    if (res.data.status === 200) {
      changeLogin(res.data.data.user_name, res.data.data.token, res.data.data.user_id, res.data.data.user_auth_type);
    } else {
      changeLogin('', '', -100, 0, false);
    }
  })
}

const menuDrawer = reactive({
  visible: false,
});

const selectedValue = ref("");

onMounted(() => {
  checkLogin().then(() => {
    let target = menuArr.value.find(
      (item: any) => item.url === route.path
    );
    if (target) {
      selectedValue.value = target.key
    } else {
      selectedValue.value = menuArr.value[0].url;
      router.push(menuArr.value[0].url)
    }
  });

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

watch(
  () => route.path,
  () => {
    let target = menuArr.value.find(
      (item: any) => item.url === route.path
    );
    console.log(target)
    if (target) {
      selectedValue.value = target.key;
    }
  },
);

const handleItemClick = (item: any) => {
  menuDrawer.visible = false
  selectedValue.value = item.key;
  herfTo(item.url);
};

const herfTo = (name: string) => {
  router.push(name);
};
</script>

<style scoped>
.tdesign-layout {
  position: relative;
}
</style>
