<template>
  <el-upload
    ref="uploadRef"
    class="upload-dio"
    :headers="{
      Authorization: `formatToken(getToken())`,
      'x-auth-token': `getToken()`
    }"
    :action="actionUrl"
    :accept="upLoadFileType"
    :auto-upload="autoUpload"
    :limit="limit"
    :data="uploadData"
    :show-file-list="isShowList"
    v-model:file-list="showFileList"
    :drag="drag"
    multiple
    :on-success="handleSucc"
    :on-error="handleError"
    :before-upload="handleUpload"
    :on-exceed="handleExceed"
    :on-change="changeFile"
    :on-remove="removeFile"
    v-loading="upLoading"
    :disabled="disabled"
  >
    <template #trigger>
      <slot name="trigger"></slot>
    </template>
    <template #tip>
      <slot name="tip" :limitNum="limitNum"></slot>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
// import { getToken } from "/@/utils/token"; //获取token
import { getToken, formatToken } from "@/utils/auth";
import { ref, onMounted, reactive, toRefs, watch } from "vue";
import { ElMessage, ElUpload } from "element-plus";

// alert(111111111);

const props = defineProps({
  limit: {
    type: Number,
    default: 1
  },
  actionUrl: {
    type: String,
    default: "/api/user/uploadFiles"
  },
  isShowList: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: true
  },
  autoUpload: {
    type: Boolean,
    default: true
  }, //是否自动上传
  uploadData: {
    type: Object,
    default: () => {}
  }, //上传额外参数
  upLoadFileType: {
    type: String,
    default: ".xls,.xlsx"
  },
  fileSize: {
    type: Number,
    default: 10
  },
  isUpOverlay: {
    type: Boolean,
    default: false
  },
  drag: {
    type: Boolean,
    default: true
  },
  pubFileList: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
const limitNum = ref(0);
const upLoading = ref(false);
// const $baseMessage = inject<any>("$baseMessage");
const emit = defineEmits([
  "handleSucc",
  "onAdopt",
  "before-upload",
  "changeFile",
  "removeFile"
]);
const handleSucc = (response: any, file: any, fileList: any) => {
  limitNum.value = fileList.length;
  emit("handleSucc", response, file, fileList);
  upLoading.value = false;
};
const handleError = (err: any, file: any, fileList: any) => {
  upLoading.value = false;
  ElMessage.error(`上传失败,清检测网络!`);
};
const handleUpload = (file: File) => {
  if (file.size > 1024 * 1000 * props.fileSize) {
    ElMessage.error(
      `图片大小需要小于${props.fileSize}MB,目前大约${Math.floor(file.size / 1024)}kb`
    );
    emit("before-upload", null);
    return false;
  }
  upLoading.value = true;
  return emit("before-upload", file);
};
const handleExceed = (files: any, fileList: any) => {
  ElMessage.error(`每次只能上传${props.limit}个文件`);
};
// 文件变动
const showFileList = ref<any>([]);
showFileList.value = props.pubFileList;
const changeFile = (file: any, fileList: any) => {
  emit("changeFile", file, fileList);
  if (props.isUpOverlay) {
    if (fileList.length > 1) {
      fileList.splice(0, 1);
    }
    limitNum.value = fileList.length;
  }
  showFileList.value = fileList;
};
// 移除文件
const removeFile = (file: any, fileList: any) => {
  emit("removeFile", file, fileList);
  showFileList.value = fileList;
};
// 清空上传列表
const uploadRef = ref();
const clearFiles = () => {
  limitNum.value = 0;
  uploadRef.value.clearFiles();
};
// 手动上传事件
const submitUpload = () => {
  uploadRef.value!.submit();
};
//
defineExpose({
  clearFiles,
  submitUpload
});
</script>
<style scoped lang="scss">
:deep() {
  .el-upload-dragger {
    border: 1px dashed #87a9eb;
    // 留给使用的组件自行控制
    // width: 200px;
    // height: 169px;
  }
}
</style>
