/**
 * 字典表 常量 话加
 * 双状态带切换功能第一个用启用
 */

// 任务配置 任务状态
// 0：未配置 1：暂停中 2可执行 3：外呼中4.已完成5：已暂停任务被终
export const TASK_STATUS = [
  { label: '未配置', value: 0, background: 'rgba(255,120,0,0.1)', border: '1px solid rgba(255,120,0,0.24)', color: '#FF7800' },
  { label: '暂停中', value: 1, background: '#FDEEEE', border: '1px solid rgba(241,91,90,0.25)', color: '#F15B5A' },
  { label: '可执行', value: 2, background: '#E5F8F4', border: '1px solid rgba(115,221,195,0.68)', color: '#00C193' },
  { label: '外呼中', value: 3, background: 'rgba(51,112,255,0.15)', border: '1px solid rgba(51,112,255,0.25)', color: '#3370FF' },
  { label: '已完成', value: 4, background: '#00C193', border: '1px solid #00C193', color: '#FFFFFF' },
  { label: '已终止', value: 5, background: '#F3F3F3', border: '1px solid rgba(128,136,153,0.25)', color: '#808899' },
]
//坐席列表状态
// 0:冻结中, 1:启用中, 2:已离职, 3:已辞退
export const SEAT_STATUS: any = [
  { label: '冻结中', value: 0, type: 'warning' },
  { label: '启用中', value: 1, type: 'success' },
  { label: '已离职', value: 2, type: 'info' },
  { label: '已辞退', value: 3, type: 'danger' },
]
// 账号管理状态
// status 否 Integer 状态：1:启用中 0:禁用
export const ACCOUNT_STATUS: any = [
  { label: '启用中', value: 1, type: 'success', switchLable: '禁用', switchValue: 0 },
  { label: '禁用', value: 0, type: 'danger', switchLable: '启用', switchValue: 1 },
]
// 团队管理状态
// 团队管理 状态（status 否 Integer 状态：1:启用中 0:停用）
export const TEAM_STATUS: any = [
  { label: '启用中', value: 1, type: 'success', switchLable: '停用', switchValue: 0 },
  { label: '停用', value: 0, type: 'danger', switchLable: '启用', switchValue: 1 },
]

// 坐席管理 声纹登录状态 状态（status 否 Integer 状态：1:启用中 0:停用）
export const SEAT_VOICE_STATUS: any = [
  { label: '启用中', value: 1, type: 'success', switchLable: '关闭声纹登录', switchValue: 0 },
  { label: '停用', value: 0, type: 'danger', switchLable: '启用声纹登录', switchValue: 1 },
]
// 坐席管理 面容登录状态 状态（status 否 Integer 状态：1:启用中 0:停用）
export const SEAT_FACE_STATUS: any = [
  { label: '启用中', value: 1, type: 'success', switchLable: '关闭面容登录', switchValue: 0 },
  { label: '停用', value: 0, type: 'danger', switchLable: '启用面容登录', switchValue: 1 },
]
// 性别
export const GENDER_STATUS: any = [
  { label: '男', id: 1 },
  { label: '女', id: 2 },
  { label: '未知', id: -1 },
]
// 验证方式 1：声纹验证 2:面部验证
export const VERIFY_TYPE: any = [
  { label: '声纹验证', value: '1' },
  { label: '面部验证', value: '2' },
]
// 声纹录入状态
// `type` int(11) DEFAULT '1' COMMENT '类型  1: 录入, 2: 验证 ,3-16k实时录音对比样本文件录入，4-16k实时录音对比',
export const VOICE_STATUS: any = [
  { label: '录入', value: 1 },
  { label: '验证', value: 2 },
  { label: '16k实时录音对比样本文件录入', value: 3 },
  { label: '16k实时录音对比', value: 4 },
]

// 下方为新常量表
