<template>
  <div class="wujie-vue">
    <WujieGongpai :name="name" :alive="true"></WujieGongpai>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted } from "vue";
// import wujieVue from "wujie-vue3";
// import hostMap from "@/utils/wujie/hostMap";
import WujieGongpai from "@/views/app_gongpai/components/WujieGongpai.vue";
// 需要保活的尽量少用 否则会带来性能负担
defineOptions({
  name: "KeepAlive_gp"
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
