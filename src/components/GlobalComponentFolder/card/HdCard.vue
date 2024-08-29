<template>
  <el-card
    :body-class="bodyClass"
    :body-style="bodyStyle"
    class="hd-card"
    :shadow="shadow"
    :title="title"
    v-bind="$attrs"
  >
    <template v-if="$slots.header || title" #header>
      <slot v-if="$slots.header" name="header" />
      <template v-else>
        {{ title }}
      </template>
    </template>
    <el-skeleton
      v-if="skeleton"
      animated
      :loading="skeletonShow"
      :rows="skeletonRows"
    >
      <template #default>
        <slot />
      </template>
    </el-skeleton>
    <slot v-else />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import { ElCard } from "element-plus";
import { ref } from "vue";
import { useTimeoutFn } from "@vueuse/core";

defineOptions({
  name: "HdCard"
});

defineProps({
  ...ElCard.props,
  shadow: {
    type: String,
    default: "never"
  },
  skeleton: {
    type: Boolean,
    default: false
  },
  skeletonRows: {
    type: Number,
    default: 5 //显示的数量会比传入的数量多 1
  },
  title: {
    type: String,
    default: ""
  }
});

const skeletonShow = ref<boolean>(true);

useTimeoutFn(() => {
  skeletonShow.value = false;
}, 500);
</script>

<style lang="scss" scoped>
.hd-card {
  border-radius: 20px;
  border: none;
  :deep() {
    .el-card__header {
      font-weight: 500;

      [class*="ri-"] {
        background: linear-gradient(
          120deg,
          #bd34fe 30%,
          var(--el-color-primary)
        );
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .el-skeleton {
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
