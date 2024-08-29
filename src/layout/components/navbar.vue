<template>
  <div class="navbar" :style="getSectionStyle">
    <!-- <div class="navbar bg-[#fff] shadow-sm shadow-[rgba(0,21,41,0.08)]"> -->
    <!-- <topCollapse
      v-if="device === 'mobile'"
      class="hamburger-container"
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    /> -->

    <Breadcrumb v-if="layout !== 'mix' && device !== 'mobile'" class="breadcrumb-container" />

    <mixNav v-if="layout === 'mix'" />

    <div v-if="layout === 'vertical'" class="vertical-header-right">
      <!-- 菜单搜索 -->
      <Search v-if="showSearch" id="header-search" />
      <!-- 全屏 -->
      <FullScreen v-if="showFullScreen" id="full-screen" />
      <!-- 消息通知 -->
      <Notice v-if="showNotice" id="header-notice" />
      <span v-if="showTheme" class="set-icon navbar-bg-hover" title="打开系统配置" @click="onPanel">
        <IconifyIconOffline :icon="Setting" />
      </span>
      <!-- 退出登录 正儿八经的 -->
      <el-dropdown trigger="click" @command="handleCommand">
        <span v-if="!false" class="el-dropdown-link navbar-bg-hover select-none">
          <img :src="userAvatar" :style="avatarsStyle" />
          <p v-if="username" class="dark:text-white">{{ username }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <!-- <el-dropdown-item command="personalCenter">
              <IconifyIconOffline :icon="UserIcon" class="mr-1" />
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="changePassword">
              <IconifyIconOffline :icon="Unlock" class="mr-1" />
              修改密码
            </el-dropdown-item> -->
            <!-- divided -->
            <el-dropdown-item command="logout">
              <IconifyIconOffline :icon="LogoutCircleRLine" class="mr-1" />
              退出系统
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      v-model="passwordDialogVisible"
      width="600px"
      :show-close="!defaultPsd"
      :close-on-click-modal="!defaultPsd"
      :close-on-press-escape="!defaultPsd"
      :before-close="handlePasswordClose"
      append-to-body
    >
      <el-form
        ref="changePasswordForm"
        class="input-40"
        :model="passwordForm"
        :rules="rulesPassword"
        label-width="120px"
      >
        <el-form-item v-if="!defaultPsd" label="原登录密码" prop="oldPassword">
          <el-input
            placeholder="密码"
            v-model="passwordForm.oldPassword"
            :type="showPassword1 ? 'text' : 'password'"
          >
            <template #suffix>
              <i @click="switchPassword(1)">
                <img
                  v-if="showPassword1"
                  class="input_icon"
                  src="@/assets/login/password_show.png"
                />
                <img v-else class="input_icon" src="@/assets/login/password_hide.png" />
              </i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="新登录密码" prop="newPassword">
          <el-input
            placeholder="密码"
            v-model="passwordForm.newPassword"
            :type="showPassword2 ? 'text' : 'password'"
          >
            <template #suffix>
              <i @click="switchPassword(2)">
                <img
                  v-if="showPassword2"
                  class="input_icon"
                  src="@/assets/login/password_show.png"
                />
                <img v-else class="input_icon" src="@/assets/login/password_hide.png" />
              </i>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="再次输入新密码" prop="checkNewPassword">
          <el-input
            placeholder="密码"
            v-model="passwordForm.checkNewPassword"
            :type="showPassword3 ? 'text' : 'password'"
          >
            <template #suffix>
              <i @click="switchPassword(3)">
                <img
                  v-if="showPassword3"
                  class="input_icon"
                  src="@/assets/login/password_show.png"
                />
                <img v-else class="input_icon" src="@/assets/login/password_hide.png" />
              </i>
            </template>
          </el-input>
        </el-form-item>
        <span style="color: red"
          >*注:密码至少8位,必须是大写字母,小写字母,特殊符号和数字至少3种组合</span
        >
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-show="!defaultPsd" @click="handlePasswordClose">取 消</el-button>
          <el-button type="primary" @click="onConfirmClickPwd">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import Search from "./search/index.vue";
import Notice from "./notice/index.vue";
import mixNav from "./sidebar/mixNav.vue";
import { useNav } from "@/layout/hooks/useNav";
import FullScreen from "./sidebar/fullScreen.vue";
import Breadcrumb from "./sidebar/breadCrumb.vue";
import topCollapse from "./sidebar/topCollapse.vue";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import Setting from "@iconify-icons/ri/settings-3-line";
import Unlock from "@iconify-icons/ep/unlock";
import UserIcon from "@iconify-icons/ep/user";
import { getConfig } from "@/config";
import { nextTick, ref, computed } from "vue";
import { updatePassword, changePasswordApi } from "@/api/login";
import { message } from "@/utils/message";
import { useUserStoreHook } from "@/store/modules/user";
import WujieVue from "wujie-vue3";
import { useRoute, useRouter } from "vue-router";
const {
  layout,
  device,
  logout,
  onPanel,
  pureApp,
  username,
  userAvatar,
  avatarsStyle,
  toggleSideBar
} = useNav();
const { showTheme, showSearch, showFullScreen, showNotice } = getConfig();
const handleCommand = async (command: any) => {
  switch (command) {
    case "logout":
      await logout(false);
      break;
    case "personalCenter":
      router.push({
        path: "/personCenter"
      });
      break;
    case "changePassword":
      changePassword();
      break;
  }
};
// 无界
// 临时方法建议不要使用
const { setupApp, preloadApp, bus } = WujieVue;
const router = useRouter();
const route = useRoute();
const getSectionStyle = computed(() => {
  return [`height:${route.meta.tips ? "var(--el-nav-height)" : "var(--el-nav-min-height)"}`];
});
bus.$on("routerChange", (routerObj: any) => {
  router.push({
    path: routerObj.path,
    params: routerObj.params
  });
  if (routerObj.params) {
    sessionStorage.setItem("paramsBox", routerObj.params.id ? routerObj.params.id : "");
  } else {
    sessionStorage.setItem("paramsBox", "");
  }
});
// 子应用调取退出
bus.$on("logOut", (outObj: any) => {
  // foreground 是否是前端退出；popMsg：退出弹出信息
  const { foreground, popMsg } = outObj;
  if (popMsg) {
    message(popMsg, {
      type: "error"
    });
  }
  /** foreground:true前端登出（不调用接口） false 后台登出（调用接口） */
  useUserStoreHook().logOut(foreground);
});
// 修改密码start
const passwordDialogVisible = ref<boolean>(false);
const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
  checkNewPassword: ""
});

// 是否显示密码
const showPassword1 = ref(false);
const showPassword2 = ref(false);
const showPassword3 = ref(false);
const changePasswordForm = ref();
const rulesPassword = ref<any>({
  oldPassword: [
    {
      required: true,
      message: "请输入原密码",
      trigger: "blur"
    }
  ],
  newPassword: [
    {
      required: true,
      message: "请输入新密码",
      trigger: "blur"
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === "") {
          callback(new Error("请输入新密码"));
        } else {
          if (passwordForm.value.checkNewPassword !== "") {
            changePasswordForm.value.validateField("checkNewPassword");
          }
          callback();
        }
      }
    }
  ],
  checkNewPassword: [
    {
      required: true,
      message: "请输入确认密码",
      trigger: "blur"
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== passwordForm.value.newPassword) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      }
    }
  ]
});
const changePassword = () => {
  passwordDialogVisible.value = true;
  nextTick(() => {
    changePasswordForm.value.clearValidate();
  });
};
// 关闭
const handlePasswordClose = () => {
  passwordDialogVisible.value = false;
  passwordForm.value = {
    oldPassword: "",
    newPassword: "",
    checkNewPassword: ""
  };
};
// 点击显示隐藏
const switchPassword = (num: Number) => {
  if (num == 1) {
    showPassword1.value = !showPassword1.value;
  } else if (num == 2) {
    showPassword2.value = !showPassword2.value;
  } else if (num == 3) {
    showPassword3.value = !showPassword3.value;
  }
};
const onConfirmClickPwd = () => {
  changePasswordForm.value.validate(async (valid: boolean) => {
    if (valid) {
      // changePasswordApi
      try {
        let api = defaultPsd.value ? updatePassword : changePasswordApi;
        const { success, message: msg } = await api({
          oldPassword: passwordForm.value.oldPassword ? passwordForm.value.oldPassword : undefined,
          newPassword: passwordForm.value.newPassword,
          confirmNewPassword: passwordForm.value.checkNewPassword
        });
        if (success) {
          message("修改成功,请重新登录", {
            type: "success"
          });
          // handlePasswordClose()
          logout();
        } else {
          message(msg, {
            type: "error"
          });
        }
      } catch (error) {}
    }
  });
};
const defaultPsd = computed(() => {
  return useUserStoreHook().isDefaultPassword;
});

if (defaultPsd.value) {
  changePassword();
}
// 修改密码end
</script>
<style lang="scss" scoped>
.navbar {
  width: 100%;
  overflow: hidden;
  background-color: var(--el-nav-background);

  // .hamburger-container {
  //   float: left;
  //   height: 100%;
  //   line-height: var(--el-nav-height);
  //   cursor: pointer;
  // }

  .vertical-header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 280px;
    height: 48px;
    color: #000000d9;

    .el-dropdown-link {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 48px;
      padding: 10px;
      color: #000000d9;
      cursor: pointer;
      margin-right: 10px;

      p {
        font-size: 14px;
      }

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 20px;
  }

  .logout {
    width: 120px;

    ::v-deep(.el-dropdown-menu__item) {
      display: inline-flex;
      flex-wrap: wrap;
      min-width: 100%;
    }
  }
}
.input_icon {
  cursor: pointer;
  width: 24px;
  padding-top: 8px;
  padding-right: 6px;
}
.input-40 {
  :deep() {
    .el-input__wrapper {
      height: 40px !important;
    }
  }
}
</style>
