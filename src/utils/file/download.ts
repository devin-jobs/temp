import { tokenTableName } from '/@/config'
import { useUserStore } from '/@/store/modules/user'
const userStore = useUserStore()
const { token } = userStore
// 导出表格
export async function downloadFile(
  params: any,
  apiUrl: any,
  fileName = '导出数据.xlsx',
  type = 'application/vnd.ms-excel',
  isSingleGetUrl = false
) {
  let url = ''
  await apiUrl(params).then((res: any) => {
    const link = document.createElement('a')
    const blob = new Blob([res], { type })
    if (!isSingleGetUrl) {
      link.style.display = 'none'
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    url = URL.createObjectURL(blob)
  })
  return url
}
export async function download(data: any, name: String, type: any) {
  // data 二进制文件blob
  // name 文件名
  // type 文件格式 .xlsx
  let reportTitle = name
  const blob = new Blob([data], { type: 'application/vnd.ms-excel' })
  const href = URL.createObjectURL(blob) // 创建新的URL表示指定的blob对象
  const a = document.createElement('a') // 创建a标签
  a.style.display = 'none'
  a.href = href // 指定下载链接
  //设置指定元素上的某个属性值。如果属性已经存在，则更新该值
  a.setAttribute('download', reportTitle + type)
  a.click() // 触发下载
  URL.revokeObjectURL(a.href) // 释放URL对象
}
// 根据地址下载文件
export async function downloadUrl(url: any, filename = '文件', type = 'audio/wav') {
  fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: <any>{
      [tokenTableName]: token,
    },
  })
    .then((response) => response.arrayBuffer())
    .then((wavData) => {
      const blob = new Blob([wavData], { type })
      const downloadUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      // 模拟点击链接进行下载
      link.click()
      // 清理临时链接
      URL.revokeObjectURL(downloadUrl)
    })
}
