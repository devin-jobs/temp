import type { App } from "vue";
import themeConfig from "./theme.config";
let config: object = {};
const { VITE_PUBLIC_PATH } = import.meta.env;

import { useUserStoreHook } from "@/store/modules/user";

let type = 1; //1公客 2全客

if (
  useUserStoreHook().attributeTypeIds &&
  useUserStoreHook().attributeTypeIds.length > 0
) {
  type = useUserStoreHook().attributeTypeIds[0];
}

const defaultLink = {
  href: "/favicon.ico"
};

function changeFavicon(newIconPath: string) {
  if (!newIconPath) {
    return false;
  }
  let link = defaultLink;
  link = document.querySelector('link[rel="shortcut icon"]');
  if (link && link.href) {
    link.href = newIconPath;
  } else {
    const newLink = document.createElement("link");
    newLink.rel = "shortcut icon";
    newLink.href = newIconPath;
    document.head.appendChild(newLink);
  }
}

// if (type == 1) {
//   changeFavicon("/gkicon.ico");
// } else {
//   changeFavicon("/favicon.ico");
// }

const setConfig = (cfg?: unknown) => {
  config = Object.assign(config, cfg);
};

const getConfig = (key?: string): PlatformConfigs => {
  if (typeof key === "string") {
    const arr = key.split(".");
    if (arr && arr.length) {
      let data = config;
      arr.forEach(v => {
        if (data && typeof data[v] !== "undefined") {
          data = data[v];
        } else {
          data = null;
        }
      });
      return data;
    }
  }
  return config;
};

/** 获取项目动态全局配置=>改为静态存储 */
export const getPlatformConfig = async (app: App): Promise<undefined> => {
  app.config.globalProperties.$config = getConfig();
  return new Promise(resolve => {
    let $config = app.config.globalProperties.$config;
    if (app && $config && typeof themeConfig === "object") {
      $config = Object.assign($config, themeConfig);
      app.config.globalProperties.$config = $config;
      // 设置全局配置
      setConfig($config);
    }
    resolve($config);
  });
};

/** 本地响应式存储的命名空间 */
const responsiveStorageNameSpace = () => getConfig().ResponsiveStorageNameSpace;

export { getConfig, setConfig, responsiveStorageNameSpace };
