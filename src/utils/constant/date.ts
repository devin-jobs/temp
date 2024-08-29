import dayjs from "dayjs";
// 单日期选择快捷键
export const shortcuts = [
  {
    text: "今天",
    value: new Date()
  },
  {
    text: "昨天",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    }
  },
  {
    text: "一周前",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    }
  }
];
// 日期段快捷键
export const shortcutsLong = [
  {
    text: "最近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "最近一个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  },
  {
    text: "最近三个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
  }
];
// 日期段快捷键2
export const shortcutsLongSt = [
  {
    text: "今日",
    value: () => {
      const end = new Date();
      const start = getCustomTime(0, "startDay");
      return [start, end];
    }
  },
  {
    text: "最近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "当月",
    value: () => {
      const end = new Date();
      const start = getCustomTime(0, "startMonth");
      return [start, end];
    }
  }
];
// 日期段快捷键3;
export const shortcutsLong3 = [
  {
    text: "今日",
    value: () => {
      const end = new Date();
      const start = getCustomTime(0, "startDay");
      console.log(start, end);
      return [start, end];
    }
  },
  {
    text: "本周",
    value: () => {
      //获取当前时间
      var currentDate = new Date();
      //返回date是一周中的某一天
      var week = currentDate.getDay();
      //返回date是一个月中的某一天
      var month = currentDate.getDate();
      //一天的毫秒数
      var millisecond = 1000 * 60 * 60 * 24;
      //减去的天数
      var minusDay = week != 0 ? week - 1 : 6;
      //alert(minusDay);
      //本周 周一
      var monday = new Date(currentDate.getTime() - minusDay * millisecond);
      console.log(dayjs(monday).format("YYYY-MM-DD"), currentDate);
      dayjs(monday).format("YYYY-MM-DD"); // '25/01/2019'
      return [dayjs(monday).format("YYYY-MM-DD") + "00:00:00", currentDate];
    }
  },
  {
    text: "本月",
    value: () => {
      const end = new Date();
      const start = getCustomTime(0, "startMonth");
      console.log(start, end);
      return [start, end];
    }
  },
  {
    text: "累计",
    value: () => {
      return ["", ""];
    }
  }
];
// 单日期选择禁止选之后
export const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

// 自定义获取时间
/**
 *
 * @param {Number} num 以当前时间为参考 多少小时或分钟前
 * @param {String} type 类型
 * @param {String} format 时间格式
 * @returns {String}
 */
export const getCustomTime = (num = 0, type = "hour", format = "YYYY-MM-DD HH:mm:ss") => {
  if (type == "hour") {
    // 以当前时间为参照，获取num小时前的时间，时分秒是当前的时间 可获取当前时间
    return dayjs().subtract(num, "hour").format(format);
  } else if (type == "startDay") {
    // 以当前时间为参照，获取num天前的时间，时间是xxxx-xx-xx 00:00:00
    return dayjs().subtract(num, "day").startOf("day").format(format);
  } else if (type == "endDay") {
    // 以当前时间为参照，获取num天前的时间，时间是xxxx-xx-xx 23:59:59
    return dayjs().subtract(num, "day").endOf("day").format(format);
  } else if (type == "startMonth") {
    // 以当前时间为参照，获取num月前的时间，时间是xxxx-xx-01 00:00:00
    return dayjs().subtract(num, "month").startOf("month").format(format);
  } else if (type == "startMonth") {
    // 以当前时间为参照，获取num月前的时间，时间是xxxx-xx-01 00:00:00
    return dayjs().subtract(num, "month").startOf("month").format(format);
  }
};
// 将毫秒转化为时分秒
export const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
export function getAgeByBirthday(birthday: any) {
  if (birthday) {
    // const age = dayjs().diff(dayjs(birthday), 'year')
    const age =
      Number(dayjs().format("YYYY")) - Number(dayjs(birthday).format("YYYY"));
    return age;
  } else {
    return "未知";
  }
}
