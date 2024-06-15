import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

// You can name the return value of `defineStore()` anything you want, but it's best to use the name of the store and surround it with `use` and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useUserBehaviorStore = defineStore('userBehavior', () => {

  const watchedVideoId = ref<Array<number>>([])

  const addWatchVideoId = (id: number) => {
    if (watchedVideoId.value.includes(id)) return;
    watchedVideoId.value.push(id);
  }

  const propertyUnitPage = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    showPageNumber: false,
    showPageSize: false,
    onChange(pageInfo: {current: number, pageSize:number}) {
      propertyUnitPage.current = pageInfo.current
      propertyUnitPage.pageSize = pageInfo.pageSize
    }
  });

  return {
    watchedVideoId,
    addWatchVideoId,
    propertyUnitPage
  }
})