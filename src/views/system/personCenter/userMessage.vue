<template>
  <el-dialog
    title="用户信息"
    v-model="centerDialogVisible"
    :close-on-click-modal="true"
    append-to-body
    destroy-on-close
    center
    width="500"
    class="user-message-dialog"
  >
    <header></header>
    <main>
      <div v-if="showType == 1" class="audio-class">
        <audio controls :src="voiceUrl"></audio>
      </div>
      <div v-if="showType == 2">
        <img :src="obverseUrl" alt="" />
      </div>
      <div v-if="showType == 3" class="img-class">
        <img :src="faceUrl" alt="" />
      </div>
    </main>
    <footer></footer>
    <template #footer>
      <div class="dialog-footer">
        <!-- <el-button type="primary" @click="close">关闭</el-button> -->
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  defineOptions,
  defineComponent,
  defineEmits
} from "vue";
import { ElMessage } from "element-plus";
defineOptions({
  name: "userMessage"
});
const props = defineProps({
  currentShowMessage: {
    type: <any>Object,
    default: () => ({})
  } //当前用户信息
});
const emits = defineEmits([]);
const centerDialogVisible = ref(false);
const showType = ref(1);
const voiceUrl = ref("");
const faceUrl = ref("");
const obverseUrl = ref("");
const showEdit = ({ type }: any) => {
  centerDialogVisible.value = true;
  const { userVoice, userFace, userIdcard } = props.currentShowMessage;
  showType.value = 0;
  showType.value = type;
  voiceUrl.value = userVoice?.voiceUrl;
  faceUrl.value = userFace?.faceUrl;
  obverseUrl.value = userIdcard?.obverseUrl;
};
const close = () => {
  centerDialogVisible.value = false;
};
defineExpose({
  showEdit
});
</script>
<style lang="scss">
.user-message-dialog {
  background-image: url("@/assets/background_images/yonghuxinxi-bg1.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .el-dialog__header {
    height: 40px !important;
  }
}
</style>
<style scoped lang="scss">
.dialog-footer {
  width: 100%;
  text-align: right;
}
.audio-class {
  width: 100%;
  text-align: center;
}
.img-class {
  width: 100%;
  text-align: center;
  img {
    width: 200px;
    height: 200px;
    border-radius: 20px;
  }
}
</style>
