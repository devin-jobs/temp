import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import {
  type UserResult,
  type RefreshTokenResult,
  getLogin,
  refreshTokenApi
} from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";
import { logoutApi } from "@/api/login";
import WujieVue from "wujie-vue3";
const { setupApp, preloadApp, bus, destroyApp } = WujieVue;

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 头像
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // 昵称
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7,
    userMessage:
      storageLocal().getItem<DataInfo<number>>(userKey)?.userMessage ?? {}, //登录接口中比较全的用户信息
    isDefaultPassword:
      storageLocal().getItem<DataInfo<number>>(userKey)?.isDefaultPassword ??
      false, //是否默认密码
    attributeTypeIds: storageLocal().getItem<DataInfo<number>>(userKey)?.attributeTypeIds ?? [2], //用户属与哪个系统 1公客2全客
    verifyStatus: {
      voiceInput: false,
      voiceVerify: false,
      faceInput: false,
      faceVerify: false,
      userId: ""
    }
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色比较全的信息 */
    SET_USER_MESSAGE(userMessage: any) {
      this.userMessage = userMessage;
    },
    /** 存储是否是默认密码 */
    SET_IS_DEFAULT_PASSWORD(isDefaultPassword: boolean) {
      this.isDefaultPassword = isDefaultPassword;
    },
    /** 存储用户属与哪个系统 */
    SET_ATTRIBUTE_TYPE_IDS(attributeTypeIds: Array<number>) {
      this.attributeTypeIds = attributeTypeIds;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data?.success) setToken(data.data);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** foreground:true前端登出（不调用接口） false 后台登出（调用接口） */
    async logOut(foreground = true) {
      this.username = "";
      this.roles = [];
      if (!foreground) {
        try {
          await logoutApi();
        } catch (error) {
          console.log(error);
        }
      }
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
      this.destroyAllApp()
    },
    // 清除所有保活的子应用
    destroyAllApp() {
      function findKeepAliveNames(data) {
        const result = [];
        function recurse(items) {
          for (const item of items) {
            if (item.meta && item.meta.keepAliveApp) {
              result.push(item.name);
            }
          }
        }
        recurse(data);
        return result;
      }
      const routerList = router.getRoutes();
      if (routerList) {
        const kpNames = findKeepAliveNames(routerList)
        kpNames.forEach(name => {
          destroyApp(name)
        })
      }
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /**
     * @description 设置语音人脸录入或者校验状态
     * @param {*} verifyStatus
     */
    setVerifyStatus(verifyStatus: any) {
      this.verifyStatus = verifyStatus;
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
