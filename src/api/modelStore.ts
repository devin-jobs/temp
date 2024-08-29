import { http } from "@/utils/http";
// 模型商店列表
export const getListOfModelShops = (params?: object) => {
  return http.request<any>("get", '/api/v1/modelStore/list', {
    params,
  });
}