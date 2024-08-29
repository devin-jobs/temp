import { useUserStoreHook } from "@/store/modules/user";

let type = 1; //1公客 2全客

if (
  useUserStoreHook().attributeTypeIds &&
  useUserStoreHook().attributeTypeIds.length > 0
) {
  type = useUserStoreHook().attributeTypeIds[0];
}
const themeConfig: PlatformConfigs = {
  Version: "1.0.0",
  Title: "xx系统",
  // Title: type == 1 ? "河北联通公客管理系统" : "作业人员管理系统",
  FixedHeader: true,
  HiddenSideBar: false,
  MultiTagsCache: false,
  KeepAlive: true,
  Layout: "vertical",
  Theme: "light",
  DarkMode: false,
  OverallStyle: "light",
  Grey: false,
  Weak: false,
  HideTabs: true,
  HideFooter: false,
  Stretch: false,
  SidebarStatus: true,
  EpThemeColor: "#3673F5",
  ShowLogo: true,
  ShowModel: "smart",
  MenuArrowIconNoTransition: false,
  CachingAsyncRoutes: false,
  TooltipEffect: "light",
  ResponsiveStorageNameSpace: "responsive-",
  MenuSearchHistory: 6,
  tokenTableName: "Authorization", //token name
  // 是否开启主题
  showTheme: false,
  //是否开启搜索组件
  showSearch: false,
  //是否开启全屏组件
  showFullScreen: false,
  //是否开启通知组件
  showNotice: false,
  storage: "sessionStorage"
};
export default themeConfig;
export const {
  Version,
  Title,
  FixedHeader,
  HiddenSideBar,
  MultiTagsCache,
  KeepAlive,
  Layout,
  Theme,
  DarkMode,
  OverallStyle,
  Grey,
  Weak,
  HideTabs,
  HideFooter,
  Stretch,
  SidebarStatus,
  EpThemeColor,
  ShowLogo,
  ShowModel,
  MenuArrowIconNoTransition,
  CachingAsyncRoutes,
  TooltipEffect,
  ResponsiveStorageNameSpace,
  MenuSearchHistory,
  tokenTableName,
  showTheme,
  showSearch,
  showFullScreen,
  showNotice,
  storage
} = themeConfig;
