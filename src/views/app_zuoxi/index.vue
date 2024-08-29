<template>
  <div class="wujie-vue">
    <WujieZuoxi />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import hostMap from "@/utils/wujie/hostMap";
import WujieZuoxi from "@/views/app_zuoxi/components/WujieZuoxi.vue";
defineOptions({
  name: "Zuoxi"
});
onMounted(() => {
  console.log("app2外部", process.env.NODE_ENV);
});
</script>

<style lang="scss" scoped>
.wujie-vue {
  width: 100%;
  height: 100%;
}
</style>
