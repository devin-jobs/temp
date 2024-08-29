// location.search的参数转为对象
export const parseSearchObj = (locationSearch: string) => {
  // 将查询字符串转换为URLSearchParams对象
  const params = new URLSearchParams(locationSearch);
  // 遍历params对象，将键值对存入obj对象
  const obj = {};
  for (const [key, value] of params) {
    obj[key] = value;
  }
  return obj;
}