import { http } from "@/utils/http";
import { baseUrlApi_login, baseUrlApi_acount } from "./utils";
// 登录接口
export const loginApi = (data?: object) => {
  return http.request<any>("post", baseUrlApi_login("sessions/login"), { data });
};
// 修改默认密码
export const updatePassword = (data?: object) => {
  return http.request<any>("post", baseUrlApi_acount("user/update/password/default"), { data });
};
// 退出登录
export const logoutApi = () => {
  return http.request<any>("post", baseUrlApi_login("sessions/logout"));
};
// 修改密码
export const changePasswordApi = (data?: object) => {
  return http.request<any>("post", baseUrlApi_acount("user/update/info/password"), { data });
}