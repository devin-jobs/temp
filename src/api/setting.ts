import { http } from "@/utils/http";
import { baseUrlApi_acount, baseUrlApi_gongpai, baseUrlApi_zuoxi } from "./utils";
// 功能启用配置-列表查询
export const getEnabledConfigurationList = (data?: object) => {
  return http.request<any>("post", baseUrlApi_zuoxi("/api/functionEnableConfig/page"), {
    data,
  });
}
// 功能启用配置-删除
export const deleteEnabledConfiguration = (params?: object) => {
  return http.request<any>("get", baseUrlApi_zuoxi("/api/functionEnableConfig/remove"), {
    params,
  });
}
// 功能启用配置-修改
export const updateEnabledConfiguration = (data?: object) => {
  return http.request<any>("post", baseUrlApi_zuoxi("/api/functionEnableConfig/update"), {
    data,
  });
}