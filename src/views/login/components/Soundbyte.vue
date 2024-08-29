<template>
  <div style="width: 100%; padding-bottom: 30px">
    <div v-if="isRecording" class="container">
      <div class="content">
        <span v-for="(_, index) in list" :key="index" :class="`span${index}`" />
      </div>
    </div>
    <div v-else class="container-2">
      <div class="content">
        <span v-for="(_, index) in list" :key="index" :class="`span${index}`" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Soundbyte"
});

const props = defineProps({
  isRecording: {
    type: Boolean,
    default: false
  },
  // 波浪条数
  waveNum: {
    type: Number,
    default: 16
  }
});
const list = new Array(props.waveNum).fill(0);
</script>

<style scoped lang="scss">
// 波浪图
$spanNum: 16;
.container {
  width: 100%;
  // height: 360px;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-image: linear-gradient(to right, #04182c, #000c17, #04182c);

  $height: 100px;

  .content {
    display: flex;
    align-items: center;
    height: $height;
    position: relative;

    $spanWidth: 6px;

    @for $i from 0 to $spanNum {
      .span#{$i} {
        width: $spanWidth;
        height: 10%;
        border-radius: calc($height * 0.2 * 0.5);
        // background-image: linear-gradient(to right, #618cc7 0%, #70aaf0 100%);
        background: var(--el-color-primary);
        animation: loading 2.5s infinite linear;
        $delay: calc(floor(abs(calc($spanNum / 2 - $i))));
        animation-delay: calc(0.2s * $delay);

        &:not(:first-child) {
          margin-left: 8px;
        }
      }
    }

    @keyframes loading {
      0% {
        // background-image: linear-gradient(to right, #618cc7 0%, #70aaf0 100%);
        background: var(--el-color-primary);
        height: 10%;
        border-radius: calc($height * 0.2 * 0.5);
      }

      50% {
        // background-image: linear-gradient(to top, #618cc7 0%, #70aaf0 100%);
        background: var(--el-color-primary);
        height: 100%;
        border-radius: calc($height * 1 * 0.5);
      }

      100% {
        // background-image: linear-gradient(to top, #618cc7 0%, #70aaf0 100%);
        background: var(--el-color-primary);
        height: 10%;
        border-radius: calc($height * 0.2 * 0.5);
      }
    }
  }
}
.container-2 {
  width: 100%;
  // height: 360px;
  display: flex;
  justify-content: center;
  align-items: center;
  $height: 100px;

  .content {
    display: flex;
    align-items: center;
    height: $height;
    position: relative;
    $spanWidth: 6px;

    @for $i from 0 to $spanNum {
      .span#{$i} {
        width: $spanWidth;
        height: 10%;
        border-radius: calc($height * 0.2 * 0.5);
        // background-image: linear-gradient(to right, #618cc7 0%, #70aaf0 100%);
        background: var(--el-color-primary);
        &:not(:first-child) {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
