import { http } from "@/utils/http";
import { baseUrlApi_acount, baseUrlApi_gongpai, baseUrlApi_zuoxi } from "./utils";
// 坐席列表 查询有权限的团队列表
export const getAccessaCompanyList = (params?: object) => {
  return http.request<any>("get", baseUrlApi_zuoxi("/api/company/getAccessableList"), {
    params,
  });
}