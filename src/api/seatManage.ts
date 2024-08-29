import { http } from "@/utils/http";
const baseUrlApi_account = "/api/account/api";
const baseUrlApi_gongpai = "/api/gongpai/api";
const baseUrlApi_customservice = "/api/customservice/api";

// 绑定坐席和管理员
export function addUserAdminMap(data: any) {
  return http.request(
    "post",
    `${baseUrlApi_customservice}/user/addUserAdminMap`,
    { data }
  );
}
//取消绑定坐席和管理员
export function cancelUserAdminMap(data: any) {
  return http.request(
    "post",
    `${baseUrlApi_customservice}/user/cancelUserAdminMap`,
    { data }
  );
}
//
export const selectZuoXiList = (params?: object) => {
  return http.request<any>(
    "get",
    `${baseUrlApi_customservice}/user/selectZuoXiList`,
    { params }
  );
};

export const updateStatus = (params?: object) => {
  return http.request<any>(
    "get",
    `${baseUrlApi_customservice}/user/updateStatus`,
    { params }
  );
};

// 标签数
export function tagTree(params: any) {
  return http.request<any>("get", `${baseUrlApi_customservice}/tag/tagTree`, {
    params
  });
}

// 坐席打标
export function setUserTags(data: any) {
  return http.request<any>(
    "post",
    `${baseUrlApi_customservice}/tag/setUserTags`,
    {
      data
    }
  );
}

// 查询坐席标签
export function getMyTags(params: any) {
  return http.request<any>(
    "get",
    `${baseUrlApi_customservice}/tag/getUserTags`,
    {
      params
    }
  );
}

// 查询个人信息
export function selectUserById() {
  return http.request<any>(
    "get",
    `${baseUrlApi_customservice}/user/selectUserInfo`
  );
}

// 查询工作经历
export function workExperienceByUserId() {
  return http.request<any>(
    "get",
    `${baseUrlApi_customservice}/user/workExperienceByToken`
  );
}
