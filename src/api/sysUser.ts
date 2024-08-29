// import { loginRSA } from "/@/config";
// import { encryptedData } from "/@/utils/encrypt";
// import request from "/@/utils/request";

import { http } from "@/utils/http";
const baseUrlApi_acount = "/api/account/api";
const baseUrlApi_gongpai = "/api/gongpai/api";

// 校验手机号唯一性
export function validatePhone({ phone, userId }: any) {
  return http.request("get", `${baseUrlApi_acount}/user/validatePhone`, {
    params: { phone, userId }
  });
}
// 校验身份证号唯一性
export function validateIdcard({ idcard, userId }: any) {
  return http.request("get", `${baseUrlApi_acount}/user/validateIdcard`, {
    params: { idcard, userId }
  });
}
//获取加密身份照片
export function getIdCardImg(params: any) {
  return http.request("get", `${baseUrlApi_acount}/user/getIdCardImg`, {
    params,
    responseType: "blob"
  });
}
// 登录后检查账号的必填项
export function checkUserInfo(params: any) {
  return http.request("get", `${baseUrlApi_acount}/user/checkUserInfo`, {
    params
  });
}
// 提交账户信息
export function saveUserInfo(data: any) {
  return http.request("post", `${baseUrlApi_acount}/user/saveUserInfo`, {
    data
  });
}
// 身份证照片识别
export function uploadIdcard(data: any) {
  return http.request("post", `${baseUrlApi_acount}/user/uploadIdcard`, {
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

// 获取年龄
export function getAge(params: any) {
  return http.request("get", `${baseUrlApi_acount}/user/getAge`, {
    params
  });
}
