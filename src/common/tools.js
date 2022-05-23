import Taro from "@tarojs/taro";
import { objectToString } from "./utils";

const tools = {
  /**
   * 请求方法
   * @param {Object} opts
   * @returns 请求结果
   */
  request: (opts) => {
    const { url = "", params = {}, method = "GET", ...rest } = opts;
    return new Promise((resolve, reject) => {
      Taro.request({
        url,
        method,
        data: params,
        ...rest,
      })
        .then((res) => {
          const { data } = res;
          if (data?.code === 1) {
            resolve(data);
          } else {
            reject(res);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  /**
   * 显示loading
   * @param {Object|String} params
   */
  showLoading: (params = "加载中...") => {
    let options = {
      title: "加载中...",
      mask: true,
    };
    if (Object.prototype.toString.call(params) === "[object String]") {
      options.title = params;
    } else if (Object.prototype.toString.call(params) === "[object Object]") {
      options = {
        ...options,
        ...params,
      };
    } else {
      throw new Error("参数类型有误,应该是字符串或对象");
    }
    return Taro.showLoading(options);
  },
  /**
   * 关闭loading
   */
  hideLoading: () => {
    Taro.hideLoading();
  },
  /**
   * 显示提示
   * @param {Object|String} params
   */
  showToast: (params = "温馨提示") => {
    let options = {
      title: "温馨提示",
      mask: true,
      icon: "none",
      duration: 2000,
    };
    if (Object.prototype.toString.call(params) === "[object String]") {
      options.title = params;
    } else if (Object.prototype.toString.call(params) === "[object Object]") {
      options = {
        ...options,
        ...params,
      };
    } else {
      throw new Error("参数类型有误,应该是字符串或对象");
    }
    return Taro.showToast(options);
  },
  /**
   * 返回
   * @param {String} 页面url
   * @param {Object} 路径参数data
   */
  navigateTo: ({ url, data }) => {
    const searchStr = objectToString(data);
    Taro.navigateTo({
      url: `${url}?${searchStr}`,
    });
  },
  /**
   * 带过期时间的缓存
   * @param {*} key 键
   * @param {*} value 值
   * @param {*} time 缓存有效时间 单位：s
   */
  setStorageSyncWithTime: (key, value, time) => {
    try {
      const curTime = Date.now();
      const expiredTime = curTime + time * 1000;
      Taro.setStorageSync(key, {
        [key]: value,
        expiredTime,
      });
    } catch (err) {
      console.log(err.toString());
    }
  },
  /**
   * 获取缓存
   * @param {*} key 键
   * @returns
   */
  getStorageSyncWithTime: (key) => {
    try {
      const result = Taro.getStorageSync(key);
      const { expiredTime } = result;
      if (Date.now() > expiredTime) {
        Taro.removeStorageSync(key);
      } else {
        return result[key];
      }
    } catch (err) {
      console.log(err.toString());
    }
  },
  /**
   * 如果登录执行函数
   * @param {Function} fn
   */
  doLogin: (fn) => {
    const userInfo = tools.getStorageSyncWithTime("userInfo");
    if (!userInfo) {
      tools.navigateTo({
        url: "/pages/login/index",
      });
    } else {
      fn?.();
    }
  },
};

export default tools;
