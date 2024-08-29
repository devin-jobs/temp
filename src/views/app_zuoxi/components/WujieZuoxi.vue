<template>
  <WujieVue
    height="100%"
    :name="name"
    :url="otherUrl"
    :sync="false"
    :alive="alive"
    :beforeLoad="beforeLoad"
    :loadError="loadError"
    :beforeMount="beforeMount"
    :afterMount="afterMount"
    :beforeUnmount="beforeUnmount"
    :afterUnmount="afterUnmount"
    :activated="activated"
    :deactivated="deactivated"
    :props="{ jump, verifyStatus, userMessage }"
    :plugins="plugins"
  ></WujieVue>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStoreHook } from "@/store/modules/user";
const { verifyStatus, userMessage } = storeToRefs(useUserStoreHook());
import hostMap, { plugins } from "@/utils/wujie/hostMap";
defineOptions({
  name: ""
});
// 分割工牌和坐席wujie组件为了以后更好定制
const props = defineProps({
  name: {
    type: String,
    default: "Zuoxi"
  },
  alive: {
    type: Boolean,
    default: false
  }
});
const route = useRoute();
const router = useRouter();
const otherUrl = computed(() => {
  return hostMap("//localhost:8850/#") + `${route.path}`;
});
// console.log("otherUrl", otherUrl.value);
const jump = (location: any, query: any) => {
  router.push(location);
  const url = new URL(window.location.href);
  url.search = query;
  // 手动的挂载url查询参数
  window.history.replaceState(null, "", url.href);
};
// 子应用开始加载静态资源前触发
const beforeLoad = (appWindow: any) => {
  console.log(`${appWindow.__WUJIE.id} beforeLoad 生命周期`);
};
// 子应用渲染（调用window.__WUJIE_MOUNT）前触发
const beforeMount = (appWindow: any) => {
  console.log(`${appWindow.__WUJIE.id} beforeMount 生命周期`);
};
// 子应用渲染（调用window.__WUJIE_MOUNT）后触发
const afterMount = (appWindow: any) => {
  console.log(`${appWindow.__WUJIE.id} afterMount 生命周期`);
};
// 子应用卸载（调用window.__WUJIE_UNMOUNT）前触发
const beforeUnmount = (appWindow: any) => {
  console.log(`${appWindow.__WUJIE.id} beforeUnmount 生命周期`);
};
// 子应用卸载（调用window.__WUJIE_UNMOUNT）后触发
const afterUnmount = (appWindow: any) => {
  console.log(`${appWindow.__WUJIE.id} afterUnmount 生命周期`);
};
// 子应用保活模式下，进入时触发
const activated = (appWindow: any) => {
  console.log(appWindow);
  console.log(`${appWindow.__WUJIE.id} activated 生命周期`);
  if (appWindow.__WUJIE.id === "agent") {
    appWindow.$wujie.bus.$emit("activate");
  }
};
// 子应用保活模式下，离开时触发
const deactivated = (appWindow: any) => {
  console.log(`${appWindow.__WUJIE.id} deactivated 生命周期`);
};
// 子应用加载资源失败后触发
const loadError = (url: any, e: any) => {
  console.log(`${url} 加载失败`, e);
};
onMounted(() => {
  console.log("app1 mounted", process.env.NODE_ENV);
});
</script>
<style lang="scss" scoped></style>
