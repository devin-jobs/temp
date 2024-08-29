<template>
  <div class="wujie-vue">
    <!-- 工牌系统 -->
    <!-- <WujieGongpai v-if="showSystemType == 1" /> -->
    <!-- 坐席系统 -->
    <!-- <WujieZuoxi v-else-if="showSystemType == 2" /> -->
    <!-- 兜底页面 -->
    <!-- <welcom-top v-else /> -->
    <!-- <welcom-top/> -->
  </div>
</template>
<script setup lang="ts">
import welcomTop from "@/views/welcome/components/welcomTop.vue";
import { useUserStoreHook } from "@/store/modules/user";
import WujieGongpai from "@/views/app_gongpai/components/WujieGongpai.vue";
import WujieZuoxi from "@/views/app_zuoxi/components/WujieZuoxi.vue";
import { ref, computed, onMounted } from "vue";
defineOptions({
  name: "Welcome"
});
const showSystemType = computed(() => {
  // 谨慎点写以防接口意外情况
  let type = 1;
  if (useUserStoreHook().attributeTypeIds && useUserStoreHook().attributeTypeIds.length > 0) {
    type = useUserStoreHook().attributeTypeIds[0];
  }
  return type;
});

onMounted(() => {});
</script>
<style lang="scss" scoped>
.wujie-vue {
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
