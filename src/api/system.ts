import { http } from "@/utils/http";
const baseUrlApi_acount = "/api/account/api";
const baseUrlApi_gongpai = "/api/gongpai/api";

type Result = {
  success: boolean;
  data?: Array<any>;
};

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 系统管理-用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return http.request<Result>("get", "/list-all-role");
};

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (data?: object) => {
  return http.request<Result>("post", "/list-role-ids", { data });
};

/** 获取系统管理-角色管理列表 */
export const getRoleList = (data?: any) => {
  return http.request<any>(
    "get",
    `${baseUrlApi_acount}/role/list?roleName=${data?.roleName}&attributeId=${data?.attributeId}&pageSize=${data?.pageSize}&pageNum=${data?.pageNum}`
  );
};

/** 获取系统管理-新增角色 */
export const addRole = (data?: object) => {
  return http.request<any>("post", `${baseUrlApi_acount}/role/add`, { data });
};

/** 获取系统管理-编辑角色 */
export const updateRole = (data?: object, roleId?: any) => {
  return http.request<any>(
    "post",
    `${baseUrlApi_acount}/role/update/${roleId}`,
    {
      data
    }
  );
};
/** 删除角色 */
export const deleteRoleApi = (roleId?: any) => {
  return http.request<any>(
    "delete",
    `${baseUrlApi_acount}/role/remove/${roleId}`
  );
};
/** 获取系统管理-菜单管理列表 */
export const getMenuList = (data?: object) => {
  return http.request<Result>("post", "/menu", { data });
};

/** 获取系统管理-部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<Result>("post", "/dept", { data });
};

/** 获取地市下拉接口 */
export const getCitysList = (data?: any) => {
  return http.request<ResultTable>(
    "get",
    `${baseUrlApi_acount}/city/select/citys?parentIds=${data?.parentIds}`
  );
};
/** 获取角色下拉接口 */
export const getRoleSelectList = (data?: any) => {
  return http.request<ResultTable>(
    "get",
    `${baseUrlApi_acount}/role/select/roles`
  );
};
/** 获取门店下拉接口 */
export const getShopSelectList = (data?: any) => {
  return http.request<ResultTable>(
    "get",
    `${baseUrlApi_gongpai}/param/select/shop?countys=${data?.countys}`
  );
};
/** 账号管理 编辑新增账号门店下拉 */
export const getShopSelectListAccount = (data?: any) => {
  return http.request<ResultTable>(
    "get",
    `${baseUrlApi_gongpai}/param/select/shop/valid/open?countys=${data?.countys}`
  );
};

/** 添加-用户 */
export const addUser = (data?: object) => {
  return http.request<any>("post", `${baseUrlApi_acount}/user/add`, {
    data
  });
};
/** 编辑-用户 */
export const editUser = (data?: object, accountName?: any) => {
  return http.request<any>(
    "post",
    `${baseUrlApi_acount}/user/${accountName}/updateInfo`,
    {
      data
    }
  );
};
/** 获取-用户列表 */
export const getUserList = (data?: any) => {
  return http.request<any>("post", `${baseUrlApi_acount}/user/list`, {
    data
  });
};
/** 更改用户状态*/
export const updateUserStatus = (data?: any) => {
  return http.request<any>(
    "post",
    `${baseUrlApi_acount}/user/update/user/status`,
    {
      data
    }
  );
};
/** 重置密码 */
export const resetPasswordApi = (accountName?: any) => {
  return http.request<any>(
    "post",
    `${baseUrlApi_acount}/user/${accountName}/password/reset`
  );
};

/** 获取系统监控-在线用户列表 */
export const getOnlineLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/online-logs", { data });
};

/** 获取系统监控-登录日志列表 */
export const getLoginLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/login-logs", { data });
};

/** 获取系统监控-操作日志列表 */
export const getOperationLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/operation-logs", { data });
};

/** 获取系统监控-系统日志列表 */
export const getSystemLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/system-logs", { data });
};

/** 获取系统监控-系统日志-根据 id 查日志详情 */
export const getSystemLogsDetail = (data?: object) => {
  return http.request<Result>("post", "/system-logs-detail", { data });
};

/** 获取角色管理-权限-菜单权限 */
export const getRoleMenu = (data?: object) => {
  return http.request<Result>("get", `${baseUrlApi_acount}/permission/tree`);
};

/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
export const getRoleMenuIds = (data?: object) => {
  return http.request<Result>("post", "/role-menu-ids", { data });
};
/** 角色管理- 获取角色属性下拉 */
export const getRoleTypeList = () => {
  return http.request<any>(
    "get",
    `${baseUrlApi_acount}/role/select/role/attribute`
  );
};

// 登录前判断校验声纹面容
export function getVoiceFaceStatus(data) {
  return http.request<any>("post", `/api/sessions/checkFaceAndVoice`, {
    data
  });
}

// 声纹语料库
export function corpus() {
  return http.request("get", `/api/voice/corpus`);
}
// 声纹录入
export function voiceRegister(data: any) {
  return http.request("post", "/api/voice/voiceRegister", { data });
}

// 声纹验证
export function voiceCheck(data: any) {
  return http.request("post", "/api/voice/voiceCheck", { data });
}
// 面容校验
export function faceeCheck(data: any) {
  return http.request("post", "/api/face/faceeCheck", {
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}
// 面容录入（直接录入到面容库）
export function faceRegister(data: any) {
  return http.request("post", "/api/face/faceRegister", {
    data,
    headers: {
      "Content-Type": "multipart/form-data"
      // "Content-Type": "application/json"
    }
  });
}
// 面容录入（仅上传面容照片，未录入）
export function uploadFace(data: any) {
  return http.request("post", `${baseUrlApi_acount}/user/uploadFace`, {
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

// 地市列表
export const selectCityAll = (params?: object) => {
  return http.request<any>(
    "get",
    `${baseUrlApi_gongpai}/param/select/allCity`,
    { params }
  );
};
// 可访问的地市列表
export const accessibleCities = (params?: object) => {
  return http.request<any>(
    "get",
    `${baseUrlApi_gongpai}/param/select/accessible/cities`,
    { params }
  );
};
