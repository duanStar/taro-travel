import dayjs from "dayjs";
/**
 * 将对象解析成为url参数
 * @param {Object} obj
 * @returns url参数
 */
export function objectToString(obj) {
  let searchKeys = [];
  if (
    Object.prototype.toString.call(obj) === "[object Object]" &&
    Object.keys(obj).length
  ) {
    for (let key in obj) {
      searchKeys.push(`${key}=${obj[key]}`);
    }
  }
  return searchKeys.join("&");
}

export const weekDay = (date = "") => {
  const day = dayjs(date).day();
  switch (day) {
    case 1:
      return "周一";
    case 2:
      return "周二";
    case 3:
      return "周三";
    case 4:
      return "周四";
    case 5:
      return "周五";
    case 6:
      return "周六";
    case 0:
      return "周日";
    default:
      return "";
  }
};

/**
 * 防抖
 * @param {Function} fn 函数
 * @param {Number} delay 延迟毫秒数
 * @returns {Function} 防抖函数
 */
export const debounce = (fn, delay) => {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
