<template>
  <el-card class="page-header" :style="style">
    <el-avatar class="page-header-avatar hidden-xs-only" :src="userAvatar" />
    <div class="page-header-tip">
      <div class="page-header-tip-title">
        {{ handleTips() }}
      </div>
      <div class="page-header-tip-description" v-html="description"></div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStoreHook } from "@/store/modules/user";
import { useNav } from "@/layout/hooks/useNav";
const { userAvatar } = useNav();
const { avatar, username } = storeToRefs(useUserStoreHook());
let currentUser = ref<any>({});
console.log(avatar, avatar.value);

const description = ref<string>("");

const handleTips = () => {
  const hour = new Date().getHours();
  let showName = "";
  if (currentUser.value.companyName) {
    showName = currentUser.value.companyName + "-" + username.value;
  } else {
    showName = username.value;
  }
  return hour < 8
    ? `早上好 ${showName}。`
    : hour <= 11
      ? `上午好 ${showName}`
      : hour <= 13
        ? `中午好 ${showName}`
        : hour < 18
          ? `下午好 ${showName}`
          : `晚上好 ${showName}`;
};
const fetchData = async () => {
  description.value = "欢迎使用本系统！";
};

onBeforeMount(() => {
  fetchData();
});

const colorFrom = ref<string>("var(--el-color-primary-light-9)");
const colorTo = ref<string>("var(--el-color-white)");
const style = {
  background: `${colorTo.value} linear-gradient(120deg, ${colorFrom.value} 10%, ${colorTo.value}) no-repeat`
};
</script>

<style lang="scss" scoped>
.page-header {
  :deep() {
    .el-card__body {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 120px;
    }
  }

  &-avatar {
    width: 60px;
    height: 60px;
    padding: var(--el-padding);
    margin-right: var(--el-margin);
    border-radius: 50%;
    margin-right: 10px;
  }

  &-tip {
    flex: auto;
    width: calc(100% - 200px);
    min-width: 300px;

    &-title {
      font-size: var(--el-font-size-bigger);
      font-weight: bold;
      line-height: 30px;
    }

    &-description {
      min-height: 25px;
      line-height: 25px;
    }
  }
}
.el-card {
  border-radius: 20px;
}
</style>
