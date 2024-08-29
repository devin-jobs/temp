<template>
  <el-breadcrumb class="select-none vab-breadcrumb" separator="">
    <el-breadcrumb-item v-for="item in levelList" :key="item.path">
      <span class="vab-breadcrumb-span" v-if="item.children?.length == null">
        <template v-if="item.meta.back">
          <div class="title-back" @click="backRouter()">
            <IconifyIconOffline :icon="Back" class="icon" />
            <span>{{ item.meta.title }}</span>
          </div>
        </template>
        <template v-else>
          <template v-if="item.meta.detail && backShow">
            <div class="title-back" @click="backRouter(item.meta.detail)">
              <IconifyIconOffline :icon="Back" class="icon" />
              <span>{{ item.meta.title }}</span>
            </div>
          </template>
          <template v-else>
            <span>{{ item.meta.title }}</span>
          </template>
        </template>
        <div style="margin-top: 10px; color: #808899; font-size: 14px; font-weight: 400">
          {{ item.meta.tips }}
        </div>
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import Back from "@iconify-icons/ep/back";
import { isEqual } from "@pureadmin/utils";
import { useRoute, useRouter } from "vue-router";
import { ref, watch, onMounted, toRaw } from "vue";
import { getParentPaths, findRouteByPath } from "@/router/utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import WujieVue from "wujie-vue3";

const route = useRoute();
const levelList = ref([]);
const router = useRouter();
const routes: any = router.options.routes;
const multiTags: any = useMultiTagsStoreHook().multiTags;

const { bus } = WujieVue;
let backShow = ref(false);
bus.$on("routerChange", (routerObj: any) => {
  // console.log("获取存储的值", routerObj);
  if (routerObj.params.id) {
    backShow.value = true;
  } else {
    backShow.value = false;
  }
});

const getBreadcrumb = (): void => {
  // 当前路由信息
  let currentRoute;

  if (Object.keys(route.query).length > 0) {
    multiTags.forEach(item => {
      if (isEqual(route.query, item?.query)) {
        currentRoute = toRaw(item);
      }
    });
  } else if (Object.keys(route.params).length > 0) {
    multiTags.forEach(item => {
      if (isEqual(route.params, item?.params)) {
        currentRoute = toRaw(item);
      }
    });
  } else {
    currentRoute = findRouteByPath(router.currentRoute.value.path, routes);
  }

  // 当前路由的父级路径组成的数组
  const parentRoutes = getParentPaths(router.currentRoute.value.name as string, routes, "name");
  // 存放组成面包屑的数组
  const matched = [];

  // 获取每个父级路径对应的路由信息
  parentRoutes.forEach(path => {
    if (path !== "/") matched.push(findRouteByPath(path, routes));
  });

  matched.push(currentRoute);

  matched.forEach((item, index) => {
    if (currentRoute?.query || currentRoute?.params) return;
    if (item?.children) {
      item.children.forEach(v => {
        if (v?.meta?.title === item?.meta?.title) {
          matched.splice(index, 1);
        }
      });
    }
  });

  levelList.value = matched.filter(item => item?.meta && item?.meta.title !== false);
};

let sessionBox = ref("");
const backRouter = (detail?: string) => {
  if (detail === "qcReport") {
    sessionStorage.setItem("paeamsBox", "");
    sessionBox.value = sessionStorage.getItem("paramsBox");
    router.back();
    backShow.value = false;
  } else {
    router.back();
  }
};

const handleLink = item => {
  const { redirect, name, path } = item;
  if (redirect) {
    router.push(redirect as any);
  } else {
    if (name) {
      if (item.query) {
        router.push({
          name,
          query: item.query
        });
      } else if (item.params) {
        router.push({
          name,
          params: item.params
        });
      } else {
        router.push({ name });
      }
    } else {
      router.push({ path });
    }
  }
};

onMounted(() => {
  getBreadcrumb();
});

watch(
  () => route.path,
  () => {
    getBreadcrumb();
  },
  {
    deep: true
  }
);
</script>
<style lang="scss" scoped>
.vab-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  // height: var(--el-nav-height);
  padding-top: 26px;

  :deep() {
    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        font-weight: normal;
      }
    }
  }
  .vab-breadcrumb-span {
    font-weight: 500;
    font-size: 20px;
    color: var(--hd-title-text-color);
    opacity: 0.8;
    .icon {
      font-size: 24px;
    }

    .title-back {
      display: grid;
      grid-template-columns: 20px 1fr;
      grid-gap: 10px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
  .vab-breadcrumb-span:hover {
    opacity: 1;
  }
}
:deep() {
  .el-breadcrumb__separator {
    margin: 0;
  }
}
</style>
