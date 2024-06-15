import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index';
import { createPinia } from 'pinia'
import './index.css';
import 'tdesign-vue-next/es/style/index.css';
import { Lazyload } from 'vant';

const app = createApp(App)
const pinia = createPinia()

app.use(Lazyload);

// 注册时可以配置额外的选项
app.use(Lazyload, {
  lazyComponent: true,
});
app.use(pinia)
app.use(router)
app.mount('#app');