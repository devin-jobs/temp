<template>
  <el-dialog
    :title="isValidate ? '面容验证' : '面容录入'"
    v-model="centerDialogVisible"
    :close-on-click-modal="true"
    append-to-body
    destroy-on-close
    :show-close="true"
    width="500"
    height="600"
    @open="getRoot"
    @closed="close"
    class="face-dialog loading-class"
  >
    <main v-if="!successfulEntry">
      <!-- <vab-alert type="warning" show-icon>
        <template #title>
          <span class="alert-title">注意事项</span>
        </template>
        <div class="alert-height">请确保当前光线不要过暗或过亮，并正脸面向摄像头</div>
      </vab-alert> -->
      <div class="alert-height">
        请确保当前光线不要过暗或过亮，并正脸面向摄像头
      </div>
      <TakePhotos
        ref="TakePhotosRef"
        @outputFile="outputFile"
        :isValidate="isValidate"
      />
    </main>
    <footer v-else>
      <div class="pay-top-content">
        <!-- <vab-icon class="pay-success" icon="checkbox-circle-line" /> -->
        <p>{{ isValidate ? "面容验证成功" : "面容录入成功" }}</p>
      </div>
    </footer>
    <!-- <template #footer v-if="!successfulEntry">
      <div class="dialog-footer">
        <el-button :loading="pageLoading" type="primary" @click="save">{{ isValidate ? '确认验证' : '确认录入' }}</el-button>
      </div>
    </template> -->
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
  nextTick,
  computed
} from "vue";
import { ElLoading, ElMessage } from "element-plus";
import { faceRegister, faceeCheck, uploadFace } from "@/api/system";
import { uploadIdcard } from "@/api/sysUser";
import { storeToRefs } from "pinia";
import { useUserStoreHook } from "@/store/modules/user";
import TakePhotos from "./TakePhotos.vue";
defineOptions({
  name: "FaceAuthDialog"
});
const props = defineProps({
  isUploadFace: {
    type: Boolean,
    default: false
  } //是否是仅上传面容
});
const centerDialogVisible = ref(false);
const pageLoading = ref(false);
const userStore = useUserStoreHook();
const { verifyStatus, userMessage } = storeToRefs(userStore);
const emit = defineEmits(["faceVerifyFn", "faceVerifyFnReg", "uploadFn"]);
const isValidate = ref(false); //是否是验证
const TakePhotosRef = ref<any>();
const showEdit = ({ validate = false }: any) => {
  centerDialogVisible.value = true;
  pageLoading.value = false;
  isValidate.value = validate;
  nextTick(() => {
    TakePhotosRef.value.onStartOrEnd();
  });
};
const getRoot = () => {};
const close = async () => {
  // 重置
  centerDialogVisible.value = false;
  successfulEntry.value = false;
};
const successfulEntry = ref(false);
const outputFile = async (file: File) => {
  // const formData = {
  //   file: file,
  //   userId: verifyStatus.value.userId
  // };
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "userId",
    verifyStatus.value.userId ? verifyStatus.value.userId : userMessage.value.id
  );
  if (file) {
    pageLoading.value = true;
    const loading = ElLoading.service({
      target: ".loading-class"
    });
    if (props.isUploadFace) {
      const formData1 = new FormData();
      formData1.append("file", file);
      formData1.append("type", "0");
      // 仅上传面容 走上传接口（该上传仅上传面容）
      try {
        const res = await uploadFace(formData);
        console.log("rrrr", res);

        if (res) {
          // $baseMessage('上传成功', 'success', 'vab-hey-message-success')
          close();
          emit("uploadFn", res);
        } else {
          ElMessage.error("上传失败，请检查网络");
        }
        pageLoading.value = false;
        loading.close();
      } catch (error) {
        pageLoading.value = false;
        loading.close();
      }
    } else {
      // isValidate true : 验证  false: 录入
      let api = isValidate.value ? faceeCheck : faceRegister; //校验||录入
      try {
        const { code, data, message } = await api(formData);
        if (code === 200) {
          close();
          if (isValidate.value) {
            // 校验
            ElMessage.success("校验成功");
            verifyStatus.value.faceVerify = true;
            emit("faceVerifyFn");
          } else {
            // 录入
            ElMessage.success("录入成功");
            verifyStatus.value.faceInput = true;
            emit("faceVerifyFnReg");
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
    }
  } else {
    ElMessage.error("请先拍照");
  }
};
// 波浪图
// const list = new Array(20).fill(0)

defineExpose({
  showEdit
});
</script>
<style lang="scss">
.face-dialog {
  background-image: url("@/assets/background_images/shengwen-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .el-dialog__header {
    height: 40px !important;
  }
}
</style>
<style scoped lang="scss">
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-weight: 400;
  font-size: 14px;
  color: #808899;
  line-height: 16px;
  width: 100%;
  text-align: center;
}
.el-form-item__content {
  line-height: 24px !important;
}
.start-read {
  cursor: pointer;
  border-radius: 50%;
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
