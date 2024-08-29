<template>
  <div style="width: 100%" v-loading="openLoading">
    <div class="container">
      <div class="content">
        <div
          class="videoBox"
          :style="{
            width: `${photoSizeInfo[photoSize].width}px`,
            height: `${photoSizeInfo[photoSize].height}px`
          }"
        >
          <video
            class="recordVideo"
            :style="{
              width: `${photoSizeInfo[photoSize].width}px`,
              height: `${photoSizeInfo[photoSize].height}px`
            }"
            muted
            autoPlay
            x5-video-player-fullscreen="true"
            x5-playsinline="true"
            playsInline
            webkit-playsinline="true"
            crossOrigin="anonymous"
            ref="videoRef"
          ></video>
          <canvas ref="canvasRef" style="border-radius: 20px">
            {{ "您的浏览器版本过低，请更新浏览器或使用其他浏览器" }}
          </canvas>
          <div
            v-if="videoStatus !== VideoStatus.inRecording && !imageUrl"
            class="mask-not"
          >
            <img src="@/assets/login/shexiangtou-1.png" alt="" />
            <span>请确保您的摄像头正常工作</span>
          </div>
          <div v-else class="mask-layer">
            <div class="son"></div>
          </div>
        </div>
        <div class="btns">
          <el-button
            v-if="videoStatus === VideoStatus.inRecording"
            type="primary"
            @click="onStartOrEnd"
          >
            <!-- {{ videoStatus === VideoStatus.inRecording ? '拍照' : imageUrl ? '重新拍照' : '重新检测' }} -->
            {{ "拍照" }}
          </el-button>
          <el-button
            v-else
            type="primary"
            @click="onStartOrEnd"
            style=""
            :class="{ 'line-btn': imageUrl }"
          >
            {{ imageUrl ? "重新拍照" : "重新检测" }}
          </el-button>

          <!-- <a :download="fileName" :href="imageUrl" v-if="!!imageUrl">下载</a> -->
          <el-button
            v-if="videoStatus !== VideoStatus.inRecording && imageUrl"
            @click="confirm"
            type="primary"
          >
            {{ isValidate ? "完成校验" : "完成录入" }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { getCanvasImgDataByVideo } from "@/utils/file/fileUtil";
import { dataURLtoFile } from "@/utils/file/messageInputUtils";
enum VideoStatus {
  "noInit",
  "loading",
  "ready",
  "inRecording"
}
const props = defineProps({
  isValidate: {
    type: Boolean,
    default: false
  }
});
const photoSizeInfo = {
  1: { width: 230, height: 230 },
  2: { width: 413, height: 579 }
};

let ctxRef: CanvasRenderingContext2D | null = null;
let stream: MediaStream | null = null;
let frameId: number = 0;

const videoRef = ref<HTMLVideoElement>();
const canvasRef = ref<HTMLCanvasElement>();

const photoSize = ref<"1" | "2">("1");
const imageUrl = ref<string>("");
const fileName = ref<string>("");
const videoStatus = ref<VideoStatus>(VideoStatus.noInit);
const openLoading = ref<boolean>(false);
watch(
  () => videoStatus.value,
  val => {
    console.log("videoStatus1", val);

    if (val == 1) {
      // 无法使用
      // openLoading.value = true
      openLoading.value = false;
    } else {
      openLoading.value = false;
    }
  },
  {
    immediate: true
  }
);
// 将video每帧数据处理后绘制到canvas上
const draw = async () => {
  if (videoStatus.value !== VideoStatus.inRecording) return;
  if (videoRef.value && ctxRef) {
    const { width, height } = photoSizeInfo[photoSize.value];
    const imageData = getCanvasImgDataByVideo(videoRef.value, width, height);
    if (imageData) {
      ctxRef.putImageData(imageData, 0, 0);
      frameId = window.requestAnimationFrame(draw);
    }
  }
};
const isSupported = ref(true);
const loadAssets = async () => {
  // videoStatus.value = VideoStatus.loading //不loading
  // 创建ctx对象
  const { width, height } = photoSizeInfo[photoSize.value];
  if (canvasRef.value) {
    canvasRef.value.width = width;
    canvasRef.value.height = height;
    const ctx = canvasRef.value.getContext("2d") as CanvasRenderingContext2D;
    ctxRef = ctx;
  }

  // 打开摄像头
  const constraints = {
    video: {
      width: photoSizeInfo[photoSize.value].width,
      height: photoSizeInfo[photoSize.value].height,
      facingMode: "user", // 强制使用前置摄像头
      frameRate: 60 // 每秒60帧
    }
  };
  isSupported.value = true;
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((newStream: MediaStream) => {
        if (videoRef.value && newStream) {
          stream = newStream;
        }
        if (videoRef.value && stream) {
          videoRef.value.srcObject = stream;
        }
        videoStatus.value = VideoStatus.inRecording;
        draw();
      })
      .catch(e => {
        isSupported.value = false;
        if (e.message && e.message.includes("not found")) {
          ElMessage.error("请求的设备未找到");
        } else {
          ElMessage.error(
            "授权失败，请点击设置->隐私设置和安全->网站设置->摄像头，打开允许使用"
          );
        }
      });
  } else {
    isSupported.value = false;
    ElMessage.error("浏览器不支持getUserMedia");
  }
};

const onStartOrEnd = async () => {
  if (videoStatus.value === VideoStatus.noInit) {
    // 初始化
    loadAssets();
  } else if (videoStatus.value === VideoStatus.loading) {
    console.log("videoStatus", videoStatus.value, VideoStatus);

    ElMessage.warning("努力加载中");
  } else if (videoStatus.value === VideoStatus.inRecording) {
    // 点击拍照
    if (videoRef.value && canvasRef.value) {
      videoRef.value.srcObject = null;
      frameId && window.cancelAnimationFrame(frameId);
      fileName.value = `${new Date().getTime()}.jpeg`;
      imageUrl.value = canvasRef.value.toDataURL("image/jpeg");
    }
    videoStatus.value = VideoStatus.ready;
  } else {
    // 重新拍照
    if (imageUrl.value) {
      window.URL.revokeObjectURL(imageUrl.value);
      fileName.value = "";
      imageUrl.value = "";
    }
    if (videoRef.value && stream) {
      videoRef.value.srcObject = stream;
      videoStatus.value = VideoStatus.inRecording;
      draw();
    }
  }
};
const emit = defineEmits(["outputFile"]);
const confirm = () => {
  emit("outputFile", dataURLtoFile(imageUrl.value));
};
defineExpose({ videoStatus, imageUrl, onStartOrEnd });
onUnmounted(() => {
  imageUrl.value && window.URL.revokeObjectURL(imageUrl.value);
});
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  padding: 20px;

  .title {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    text-align: center;
    margin-bottom: 20px;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .videoBox {
      box-sizing: border-box;
      position: relative;
      border-radius: 20px;

      .recordVideo {
        position: absolute;
        top: 0;
        left: 0;
        visibility: hidden;
        z-index: 1;
        border-radius: 20px;
      }

      canvas {
        z-index: 2;
      }
    }

    .btns {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 20px;

      .ant-select-selector {
        background-color: transparent !important;
        color: #fff;
      }

      .label {
        margin-left: 16px;
      }

      button {
        margin: 0 20px;
      }
    }
  }
}

$borderWidth: 30px;
.mask-not {
  position: absolute;
  width: 75%;
  height: 75%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  img {
    width: 96px;
    height: auto;
  }
  span {
    color: #b0b0bc;
  }
}
.mask-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-width: $borderWidth;
  border-left-style: solid;
  border-left-color: rgba(0, 0, 0, 0);
  border-right-style: solid;
  border-right-color: rgba(0, 0, 0, 0);
  border-top-style: solid;
  border-top-color: rgba(0, 0, 0, 0);
  border-bottom-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0);
  border-radius: 20px;

  .son {
    width: calc(100% + 20px);
    height: calc(100% + 20px);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // background:
    //   linear-gradient(to bottom, #ffffff 2px, #ffffff 2px, transparent 3px, transparent 100%) left top no-repeat,
    //   linear-gradient(to right, #ffffff 0px, #ffffff 2px, transparent 3px, transparent 100%) left top no-repeat,
    //   linear-gradient(to bottom, #ffffff 0px, #ffffff 2px, transparent 3px, transparent 100%) right top no-repeat,
    //   linear-gradient(to left, #ffffff 0px, #ffffff 2px, transparent 3px, transparent 100%) right top no-repeat,
    //   linear-gradient(to top, #ffffff 0px, #ffffff 2px, transparent 3px, transparent 100%) left bottom no-repeat,
    //   linear-gradient(to right, #ffffff 0px, #ffffff 2px, transparent 3px, transparent 100%) left bottom no-repeat,
    //   linear-gradient(to top, #ffffff 0px, #ffffff 2px, transparent 3px, transparent 100%) right bottom no-repeat,
    //   linear-gradient(to left, #ffffff 0px, #ffffff 2px, transparent 3px, transparent 100%) right bottom no-repeat;
    // background-size: 1.5rem 1.5rem;
    background-image: url("@/assets/background_images/face-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    animation: fade 2.5s infinite;

    @keyframes fade {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 1;
      }
    }
  }
}
</style>
