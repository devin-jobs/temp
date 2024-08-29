<template>
  <el-dialog
    :title="isValidate ? '验证声纹' : '录入声纹'"
    v-model="centerDialogVisible"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
    :show-close="true"
    width="500"
    height="600"
    @open="getRoot"
    @closed="close"
    class="voice-dialog loading-class"
  >
    <main v-if="!successfulEntry">
      <!-- <vab-alert type="warning" show-icon>
        <template #title>
          <span class="alert-title">注意事项</span>
        </template>
        <div class="alert-height">1. 首次录入声纹时间需保持6秒以上</div>
        <div class="alert-height">2. 请对准麦克风阅读文字进行声纹录入</div>
      </vab-alert> -->
      <div class="read-text">
        <span>{{ readText[curentIndex] }}</span>
        <span>请对准麦克风朗读文字进行声纹录入</span>
      </div>
      <Soundbyte v-model:isRecording="isRecording" />
      <div style="width: 100%; text-align: center">
        {{ showTime }}
      </div>
      <template v-if="!isRecordPage">
        <audio ref="audioRef" @ended="onAudioEnded">
          <source :src="mp3BlobUrl" />
        </audio>
      </template>
    </main>
    <footer v-else>
      <div class="pay-top-content">
        <!-- <vab-icon class="pay-success" icon="checkbox-circle-line" /> -->
        <p>{{ isValidate ? "声纹验证成功" : "声纹录入成功" }}</p>
      </div>
    </footer>
    <template #footer v-if="!successfulEntry">
      <div class="dialog-footer">
        <el-button
          @click="playListener"
          :disabled="pageLoading"
          style="background-color: rgba(54, 115, 245, 0.15); border: none"
        >
          <img
            style="width: 16px; height: 16px"
            v-if="chatRadioActive"
            :src="volumePng"
          />
          <img style="width: 16px; height: 16px" v-else :src="erjiPng" />
          试听
        </el-button>
        <el-avatar
          class="start-read"
          @click="startRecord"
          :src="isRecording ? soundEnd : soundRed"
          :size="56"
          alt=""
        />
        <template v-if="isValidate">
          <el-button
            type="primary"
            @click="save"
            :disabled="isRecording"
            style="margin-left: 10px"
          >
            {{ "确认验证" }}
          </el-button>
        </template>
        <template v-else>
          <el-button
            v-if="isRecording"
            type="primary"
            :disabled="pageLoading || (isRecording && curentIndex >= 1)"
            @click="nextText"
            style="margin-left: 10px"
          >
            {{ curentIndex < 1 ? "下一条" : "确认验证" }}
          </el-button>
          <el-button
            v-else
            type="primary"
            :disabled="pageLoading"
            @click="save"
          >
            {{ "确认录入" }}
          </el-button>
        </template>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  toRaw,
  onMounted,
  onBeforeUnmount,
  defineEmits,
  computed
} from "vue";
import { ElLoading, ElMessage } from "element-plus";
import Recorder from "js-audio-recorder";
import { corpus, voiceCheck, voiceRegister } from "@/api/system";
import soundEnd from "@/assets/login/sound-end.png";
import soundRed from "@/assets/login/sound-red.png";
import volumePng from "@/assets/login/volume.png";
import erjiPng from "@/assets/login/erji.png";
import Soundbyte from "./Soundbyte.vue";
// import { useUserStore } from "@/store/modules/user";

import { storeToRefs } from "pinia";
import { useUserStoreHook } from "@/store/modules/user";

import { convertToMp3 } from "@/utils/file/messageInputUtils";
import { blobToBase64 } from "@/utils/file/shiftType";
import { uuid as generateUUID } from "@/utils/file/fileUtil";
defineOptions({
  name: "PhoneAuthDialog"
});
const centerDialogVisible = ref(false);
const pageLoading = ref(false);
const mediaDownpath = ref(""); //录音地址文件
const chatRadioActive = ref(false); //是否正在播放
const isRecordPage = ref<any>(true); //是否z在录制页面
const isRecording = ref<any>(false); //是否正在录制
const mp3Blob = ref<any>(""); //mp3
const mp3BlobUrl = ref<any>(""); //录音本地地址
const duration = ref("00:00:00"); //录音时长
const { verifyStatus, userMessage } = storeToRefs(useUserStoreHook());
const form = ref<any>({
  readText: "未告知客户关键资费信息，导致客户理解出错，属于二级不规范行为。",
  // 录音文件base64
  mp3Base64: ""
});

const emit = defineEmits(["voiceVerifyFn", "voiceVerifyFnReg"]);
let recorder: any = "";
const isValidate = ref(false); //是否是验证
const showEdit = async ({ validate = false, immediate }: any) => {
  centerDialogVisible.value = true;
  isValidate.value = validate;
  // 语音消息模块
  recorder = new Recorder({
    // 采样位数，支持 8 或 16，默认是16
    sampleBits: 16,
    // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值
    sampleRate: 16000,
    // 声道，支持 1 或 2， 默认是1
    numChannels: 1,
    // 是否边录边转换，默认是false
    compiling: false
  }); //实例
  pageLoading.value = true;
  const { code, data } = await corpus();
  if (code == 200) {
    resetData();
    readText.value = isValidate.value ? [data[0]] : data;
    pageLoading.value = false;
  }
};
const resetData = () => {
  curentIndex.value = 0;
};
// 朗读文本
const readText = ref([
  "用这生命中的每一秒，给自己一个不后悔的未来",
  "天生我材必有用，千金散尽还复来。",
  "天经风雨有彩虹,人经风雨有精彩。"
]);

const curentIndex = ref(0);
const nextText = () => {
  if (curentIndex.value < 1) {
    curentIndex.value++;
  }
};
// 获取权限
const getRoot = () => {
  (Recorder as any).getPermission().then(
    () => {
      console.log("获取录音权限成功");
    },
    (error: any) => {
      console.log(`${error.name} : ${error.message}`);
    }
  );
};
// 时间
let currentTime = ref(0);
let totalTime = ref(60);
let timer = <any>ref(null);
const startRecording = () => {
  currentTime.value = 0;
  resetData();
  timer.value = setInterval(() => {
    currentTime.value++;

    if (currentTime.value >= totalTime.value) {
      // clearInterval(timer.value);
      // stopRecord()
    }
  }, 1000);
};
const showTime = computed(() => {
  const minutes = Math.floor(currentTime.value / 60);
  const remainingSeconds = currentTime.value % 60;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  // return `${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
});
// 录音开始||录音结束
const startRecord = () => {
  if (isRecording.value) {
    // 结束
    if (!isValidate.value && curentIndex.value < 1) {
      ElMessage.error("需录完2条声纹");
      return;
    }
    if (currentTime.value < 6) {
      ElMessage.error("录入时间需保持6秒以上");
      return;
    }
    isRecording.value = !isRecording.value;
    isRecordPage.value = true;
    stopRecorder();
    isRecordPage.value = false;
  } else {
    isRecording.value = !isRecording.value;
    isRecordPage.value = true;
    // 开始录制
    recorder.start().then(
      () => {
        console.log("正在录音中...");
        startRecording();
      },
      (error: any) => {
        // 出错了
        console.log(`${error.name} : ${error.message}`);
      }
    );
  }
};
const uuid = ref(""); //uuid
// 结束录制
const stopRecorder = async () => {
  timer.value && clearInterval(timer.value);
  recorder.stop();
  const WavBlob = recorder.getWAV();
  uuid.value = generateUUID();
  mp3Blob.value = convertToMp3(WavBlob, recorder, uuid.value + ".mp3"); //转换成功的mp3Blob
  mp3BlobUrl.value = URL.createObjectURL(mp3Blob.value);
  await blobToBase64(mp3Blob.value).then((res: any) => {
    form.value.mp3Base64 = res;
    // console.log('form.value.mp3Base64', form.value.mp3Base64, mp3Blob.value, mp3BlobUrl.value, WavBlob)
  });
  destroyRecorder();
  // console.log('mp3BlobUrl', getMp3Duration(mp3BlobUrl.value))
  getMp3Duration(mp3BlobUrl.value);
};
// 销毁录音
const destroyRecorder = () => {
  recorder.destroy().then(() => {
    console.log("销毁成功");
  });
};
const close = async () => {
  // 重置
  centerDialogVisible.value = false;
  isRecording.value = false;
  isRecordPage.value = true;
  successfulEntry.value = false;
  await stopRecorder();
  form.value.mp3Base64 = "";
  currentTime.value = 0;
};
const audioRef = ref();
// 播放暂停
const playListener = () => {
  if (!audioRef.value) return;
  if (audioRef.value.paused) {
    audioRef.value.play();
    chatRadioActive.value = true;
  } else {
    audioRef.value.pause();
    chatRadioActive.value = false;
  }
};
// 播放完成
const onAudioEnded = () => {
  console.log("播放完成");

  chatRadioActive.value = false;
};
const getMp3Duration = (mp3Url: any) => {
  const audio = new Audio(mp3Url);
  audio.addEventListener("loadedmetadata", () => {
    // console.log(audio.duration, formatDuration(audio.duration))
    duration.value = formatDuration(audio.duration);
  });
};
const formatDuration = (seconds: any) => {
  seconds = Math.round(seconds);
  if (seconds < 60) {
    return `00:00:${formatSeconds(seconds)}`;
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `00:${formatSeconds(minutes)}:00'`;
    } else {
      return `00:${formatSeconds(minutes)}'${formatSeconds(remainingSeconds)}"`;
    }
  }
};
// 小于10的话前面补0
const formatSeconds = (seconds: any) => {
  seconds = Math.round(seconds);
  if (seconds < 10) {
    return `0${seconds}`;
  }
};
const successfulEntry = ref(false);
const save = async () => {
  console.log("save", form.value.mp3Base64);
  if (form.value.mp3Base64) {
    pageLoading.value = true;
    const loading = ElLoading.service({
      target: ".loading-class"
    });
    let param = {
      fileStr: form.value.mp3Base64,
      userId: verifyStatus.value.userId
        ? verifyStatus.value.userId
        : userMessage.value.id
    };
    let api = isValidate.value ? voiceCheck : voiceRegister;
    try {
      const { code, data, message } = await api(param);
      if (code === 200) {
        close();
        // successfulEntry.value = true
        if (isValidate.value) {
          // 校验
          ElMessage.success("校验成功");
          verifyStatus.value.voiceVerify = true;
          emit("voiceVerifyFn");
        } else {
          // 录入
          ElMessage.success("录入成功");
          verifyStatus.value.voiceInput = true;
          emit("voiceVerifyFnReg");
        }
      } else {
        ElMessage.error(message);
      }
      pageLoading.value = false;
      loading.close();
    } catch (error) {
      pageLoading.value = false;
      loading.close();
    }
  } else {
    ElMessage.error("请先录制");
  }
};
defineExpose({
  showEdit
});
</script>
<style lang="scss">
.voice-dialog {
  background-image: url("@/assets/background_images/shengwen-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .el-dialog__header {
    height: 40px !important;
  }
}
.el-loading-mask {
  border-radius: 20px;
}
</style>
<style scoped lang="scss">
.dialog-footer {
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  display: grid;
  grid-template-columns: 88px 1fr 88px;
  align-items: center;
  justify-items: center;
}
.icon {
  margin-right: 4px;
}
.alert-title {
  font-size: 15px;
  font-weight: 600;
}
.alert-height {
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
}
.el-form-item__content {
  line-height: 24px !important;
}
.start-read {
  cursor: pointer;
  border-radius: 50%;
}
.read-text {
  span {
    display: inline-block;
    width: 100%;
    text-align: center;
    &:nth-child(1) {
      font-weight: 500;
      font-size: 16px;
      color: #454c5c;
      line-height: 22px;
    }
    &:nth-child(2) {
      font-weight: 400;
      font-size: 14px;
      color: #b0b0bc;
      line-height: 16px;
      height: 32px;
      line-height: 32px;
      margin-bottom: 27px;
    }
  }
}
.pay-top-content {
  text-align: center;

  .pay-success {
    display: block;
    margin: var(--el-margin) auto 5px auto;
    font-size: 40px;
    color: var(--el-color-success);
  }
}
</style>
