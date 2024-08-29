// account: https//172.16.29.244:12000
// gongpai: https//172.16.29.244:11000
// customservice: https//172.16.29.244:11100

const map: any = {
  '//localhost:8849/#': `${window.location.protocol}//${window.location.hostname}:11000/#`, // 生产环境下走其他仓库应用 工牌
  '//localhost:8850/#': `${window.location.protocol}//${window.location.hostname}:11100/#`, // 生产环境下走其他仓库应用 坐席 
}
export default function hostMap(host: string) {
  if (process.env.NODE_ENV === 'production') return map[host]
  return host
}
// 解决二次进入样式丢失插件
export const plugins = [
  {
    patchElementHook(element: any, iframeWindow: any) {
      if (element.nodeName === "STYLE") {
        element.insertAdjacentElement = function (_position, ele) {
          iframeWindow.document.head.appendChild(ele);
        };
      }
    }
  }
]