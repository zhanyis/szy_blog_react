import { ref } from 'vue'
import { defineStore } from 'pinia'

// You can name the return value of `defineStore()` anything you want, but it's best to use the name of the store and surround it with `use` and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useUserStore = defineStore('userInfo', () => {
  // other options...
  const user = ref({
    user_name: '',
    token: '',
    isLogin: false,
    user_id: -100,
    user_auth_type: 0
  })

  const changeLogin = (user_name: string, token: string, user_id: number, user_auth_type: number, isLogin: boolean = true) => {
    user.value.user_name = user_name
    user.value.token = token
    user.value.isLogin = isLogin
    user.value.user_id = user_id
    user.value.user_auth_type = user_auth_type
  }

  return {
    user,
    changeLogin
  }
})