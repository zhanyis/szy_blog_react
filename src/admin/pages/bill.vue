<template>
  <div style="height: 100%;">
    <van-tabs v-model:active="active">
      <van-tab title="记账" name="1">
        <BillSubmit v-if="active === '1'" />
      </van-tab>
      <van-tab title="查账"  name="2">
        <BillCheck v-if="active === '2'" />
      </van-tab>
      <!-- <van-tab title="结算">内容 3</van-tab> -->
    </van-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BillSubmit from './billSubmit.vue'
import BillCheck from './billCheck.vue' 
const active = ref("1")
</script>

<style scoped>
</style>