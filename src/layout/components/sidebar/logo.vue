<template>
  <div class="sidebar-logo-container" :class="{ collapses: props.collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="props.collapse"
        key="props.collapse"
        :title="getLogoObj.title"
        class="sidebar-logo-link"
        :to="getTopMenu()?.path ?? '/'"
      >
        <img :src="getLogoObj.logo" alt="logo" />
        <!-- <span class="sidebar-title">{{ title }}</span> -->
      </router-link>
      <router-link
        v-else
        key="expand"
        :title="getLogoObj.title"
        class="sidebar-logo-link"
        :to="getTopMenu()?.path ?? '/'"
      >
        <!-- <img :src="getLogoObj.logo" alt="logo" /> -->
        <span class="sidebar-title">{{ getLogoObj.title }}</span>
      </router-link>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getTopMenu } from "@/router/utils";
import { useNav } from "@/layout/hooks/useNav";
import { useUserStoreHook } from "@/store/modules/user";

const type = ref(1); //1公客 2全客

if (useUserStoreHook().attributeTypeIds && useUserStoreHook().attributeTypeIds.length > 0) {
  type.value = useUserStoreHook().attributeTypeIds[0];
}
const getLogoObj = computed(() => {
  //1公客 2全客
  let obj = {
    logo: "/logo.svg",
    title: "系统"
  };
  // if (type.value == 2) {
  //   obj = {
  //     logo: "/logo.svg",
  //     title: "作业人员管理系统"
  //   };
  // }
  return obj;
});
const props = defineProps({
  collapse: Boolean,
  isActive: Boolean
});

const { title, getLogo } = useNav();
</script>

<style lang="scss" scoped>
.gklogo2 {
  height: 14px !important;
}
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 48px;
  overflow: hidden;

  .sidebar-logo-link {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    height: 100%;
    img {
      display: inline-block;
      height: 32px;
    }

    .sidebar-title {
      display: inline-block;
      height: 32px;
      margin: 2px 0 0 4px;
      overflow: hidden;
      font-size: 17px;
      font-weight: 600;
      line-height: 32px;
      color: #3370ff;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-family: AlimamaShuHeiTi-Bold; // padding-left: 10px;
    }
  }
}
</style>
