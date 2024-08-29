<template>
  <div class="select-none">
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <!-- <div class="img">
        <component :is="toRaw(illustration)" />
      </div> -->
      <div class="login-form">
        <!-- <avatar class="avatar" /> -->
        <div class="title">登录</div>
        <!-- <Motion>
          <h2 class="outline-none">{{ title }}</h2>
        </Motion> -->
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="loginRules" size="large">
          <Motion :delay="100">
            <el-form-item prop="username">
              <el-input
                v-model="ruleForm.username"
                clearable
                placeholder="账号"
                :prefix-icon="useRenderIcon(User)"
              />
            </el-form-item>
          </Motion>

          <Motion :delay="150">
            <el-form-item prop="password">
              <el-input
                v-model="ruleForm.password"
                clearable
                show-password
                placeholder="密码"
                :prefix-icon="useRenderIcon(Lock)"
              />
            </el-form-item>
          </Motion>
          <Motion :delay="200">
            <el-form-item prop="captcha">
              <el-row :gutter="10">
                <el-col :span="14">
                  <el-input
                    v-model="ruleForm.captcha"
                    clearable
                    placeholder="验证码"
                    :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
                  >
                  </el-input>
                </el-col>
                <el-col :span="10">
                  <el-image class="code" :src="captchaURL" @click="getCaptchaURL"></el-image>
                </el-col>
              </el-row>
            </el-form-item>
          </Motion>
          <Motion :delay="250">
            <el-form-item prop="">
              <HdDragVerify @sliderNo="slide" />
            </el-form-item>
          </Motion>
          <Motion :delay="300">
            <el-button
              class="login-btn"
              size="default"
              type="primary"
              :loading="loading"
              @click="onLogin(ruleFormRef)"
            >
              登录
            </el-button>
          </Motion>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { useNav } from "@/layout/hooks/useNav";
import { ElMessage, type FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { initRouter, getTopMenu } from "@/router/utils";
import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { setToken } from "@/utils/auth";
import { addPathMatch } from "@/router/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";
import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import HdDragVerify from "@/views/login/components/HdDragVerify.vue";
import PhoneAuthDialog from "@/views/login/components/PhoneAuthDialog.vue";
import FaceAuthDialog from "@/views/login/components/FaceAuthDialog.vue";
import { loginApi } from "@/api/login";
import { getVoiceFaceStatus } from "@/api/system";
import { storeToRefs } from "pinia";
import { useUserStoreHook } from "@/store/modules/user";
const { verifyStatus } = storeToRefs(useUserStoreHook());
defineOptions({
  name: "Login"
});

const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, dataThemeChange } = useDataThemeChange();
dataThemeChange();
const { title } = useNav();

const ruleForm = reactive({
  username: "",
  password: "",
  captcha: "", //验证码
  captchaId: "" //验证码对应的id
});
const randomCaptchaId: any = () => {
  return Math.floor(Math.random() * 999999);
};
const captchaURL = ref("");
const getCaptchaURL = () => {
  ruleForm.captchaId = randomCaptchaId();
  captchaURL.value = `/api/sessions/captcha?captchaId=${ruleForm.captchaId}`;
};
getCaptchaURL();
const onLogin = async (formEl: FormInstance | undefined) => {
  //临时免登录
  setToken({
    username: "test",
    nickname: "test",
    roles: [],
    accessToken: "test-token",
    userMessage: {},
    isDefaultPassword: false,
    attributeTypeIds: [2]
  } as any);
  usePermissionStoreHook().handleWholeMenus([]);
  addPathMatch();
  router.push("/");
  return;
  //临时免登录
  if (!isPass.value) {
    message("请先通过滑动验证", { type: "error" });
    return;
  }
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      goLogin();
      return;
    } else {
      loading.value = false;
      return fields;
    }
  });
};

const goLogin = () => {
  loginApi({
    username: ruleForm.username,
    password: ruleForm.password
  })
    .then(res => {
      const { success, message: msg, data } = res;
      if (success) {
        const {
          token,
          user,
          isDefaultPassword,
          permissions,
          nickname,
          attributeTypeIds //首页跳那个1、公客 2、全客
        } = data;
        setToken({
          username: user?.accountName,
          nickname,
          roles: permissions,
          accessToken: token,
          userMessage: user,
          isDefaultPassword,
          attributeTypeIds
        } as any);

        usePermissionStoreHook().handleWholeMenus([]);
        addPathMatch();
        router.push("/");
        message("登录成功", { type: "success" });
      } else {
        message(msg, { type: "error" });
        getCaptchaURL();
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

// 滑块验证
const isPass = ref(false);
const slide = (vfcStatu: any) => {
  /**
这里可以做一些自定义验证
- vfcStatu.statu有2状态，必须赋值状态
- success 验证成功状态
- tail 验证失败状态
- 可配合后端验证
*/
  const statu = vfcStatu;
  if (statu) {
    isPass.value = true;
  } else {
    isPass.value = false;
  }
};
/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    onLogin(ruleFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
.login-container {
  overflow: hidden;
  background-image: url("@/assets/login/login-bgcx.png");
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  :deep() {
    .el-input__wrapper {
      border-radius: 10px;
    }
  }

  .login-form {
    position: absolute;
    width: 432px;
    height: 520px;
    padding: 4.5vh;
    margin: auto;
    overflow: hidden;
    background: var(--el-color-white);
    background-size: 100% 100%;
    border-radius: 30px;
    position: absolute;
    // transform: translateY(-50%);
    top: 50%;
    // right: 10%;

    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 42px;

    :deep() {
      .title {
        height: 54px;
        font-size: 36px;
        font-weight: bold;
        color: #000000;
        line-height: 47px;
        letter-spacing: 3px;
        text-align: center;
        margin-top: 58px;
      }

      .title_sub {
        height: 21px;
        font-weight: 400;
        line-height: 21px;
        letter-spacing: 1px;
        text-align: center;
        margin-top: 8px;
        font-weight: 400;
        font-size: 15px;
        color: #808899;
      }

      .login-btn {
        width: 100%;
        height: 50px;
      }

      .el-form-item {
        margin: 20px 0;

        &__error {
          position: absolute;
          font-size: var(--el-font-size-small);
          line-height: 18px;
          color: var(--el-color-error);
        }

        .el-input {
          width: 100%;
          height: 48px;
          line-height: 48px;
        }
      }

      .code {
        cursor: pointer;
        border-radius: var(--el-border-radius-base);
        // width: 100%;
        height: 82%;
      }
    }
  }
}
</style>
