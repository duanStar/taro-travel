import Taro from "@tarojs/taro";

const init = () => {
  const userInfo = Taro.getStorageSync("userInfo");
  return {
    isLogin: !!userInfo?.userPhone,
    userPhone: userInfo?.userPhone,
    nickName: userInfo?.nickName,
  };
};

export default {
  namespace: "user",
  state: {
    ...init(),
  },
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
