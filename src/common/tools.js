import Taro from "@tarojs/taro";

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
};

export default tools;
