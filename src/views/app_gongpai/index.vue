<template>
  <div class="wujie-vue">
    <WujieGongpai></WujieGongpai>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import hostMap from "@/utils/wujie/hostMap";
import WujieGongpai from "@/views/app_gongpai/components/WujieGongpai.vue";
defineOptions({
  name: "Gongpai"
});
onMounted(() => {
  console.log("app1外层", process.env.NODE_ENV);
});
</script>

<style lang="scss" scoped>
.wujie-vue {
  width: 100%;
  height: 100%;
}
</style>
