<template>
  <hd-card class="card-left-top">
    <div class="card-header-audio">
      <div>
        <slot name="text"></slot>
      </div>
      <div class="icon-list">
        <el-popover
          placement="bottom"
          popper-class="volume-popover"
          title=""
          :width="40"
          trigger="click"
        >
          <template #reference>
            <IconifyIconOnline
              v-tippy="{
                content: '音量'
              }"
              icon="ri:volume-up-line"
              class="cursor-pointer outline-transparent"
            />
          </template>
          <div>
            <el-slider
              v-model="volume"
              :format-tooltip="formatTooltip"
              :min="0"
              :max="1"
              :step="0.1"
              vertical
              height="50px"
            />
          </div>
        </el-popover>
        <el-dropdown @command="backRateChange" trigger="click">
          <IconifyIconOnline
            v-tippy="{
              content: '倍速'
            }"
            icon="ri:replay-10-line"
            class="cursor-pointer outline-transparent"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="1">
                <span :style="{ color: playbackRate === 1 ? '#3370FF' : '' }"
                  >1.0X</span
                >
              </el-dropdown-item>
              <el-dropdown-item :command="1.5">
                <span :style="{ color: playbackRate === 1.5 ? '#3370FF' : '' }"
                  >1.5X</span
                >
              </el-dropdown-item>
              <el-dropdown-item :command="2">
                <span :style="{ color: playbackRate === 2 ? '#3370FF' : '' }"
                  >2.0X</span
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <IconifyIconOnline
          v-tippy="{
            content: '下载'
          }"
          icon="ri:download-cloud-2-line"
          @click="downloadRecordFn"
          class="cursor-pointer outline-transparent"
        />
        <slot name="icons"></slot>
      </div>
    </div>
    <div class="sudio-container">
      <CustomAudio
        :volume="volume"
        :playbackRate="playbackRate"
        :audioSrc="audioSrcPar"
      />
    </div>
  </hd-card>
</template>
<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "CustomPlayer"
});
const props = defineProps({
  audioSrcPar: {
    type: String,
    default: ""
  } //录音地址
});
// 声音
const volume = ref(1);
const formatTooltip = (val: number) => {
  return val * 100 + "%";
};
const playbackRate = ref(1);
const backRateChange = (command: number) => {
  playbackRate.value = command;
};
// 下载录音文件
const emit = defineEmits(["downloadRecord"]);
const downloadRecordFn = () => {
  // downloadRecord({ radioId: currentId.value }).then((res: any) => {
  //   downloadByData(res, `${currentId.value}.mp3`);
  // });
  emit("downloadRecord");
};
</script>
<style lang="scss" scoped>
.card-left-top {
  height: 120px;
  margin-bottom: 20px;
  display: grid;
  .card-header-audio {
    height: calc(120px - 48px - 40px);
    padding-bottom: 20px;
    font-weight: 500;
    font-size: 16px;
    color: #454c5c;
    display: grid;
    grid-template-columns: 1fr 120px;
    align-items: center;
    .icon-list {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
  .sudio-container {
    width: 100%;
    height: 50px;
  }
}
</style>
<style lang="scss">
.volume-popover {
  min-width: 10px !important;
  padding: 10px 0 !important;
}

.el-slider__button {
  width: 12px;
  height: 12px;
}
</style>
