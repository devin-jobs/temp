<template>
  <div class="wujie-vue">
    <WujieZuoxi :name="name" :alive="true" />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
// import hostMap from "@/utils/wujie/hostMap";
import WujieZuoxi from "@/views/app_zuoxi/components/WujieZuoxi.vue";
defineOptions({
  name: "KeepAlive_zx"
});
const route = useRoute();
const name: any = computed(() => route.name);
onMounted(() => {});
</script>

<style lang="scss" scoped>
.wujie-vue {
  width: 100%;
  height: 100%;
}
</style>
