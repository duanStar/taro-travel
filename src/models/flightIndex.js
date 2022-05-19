import dayjs from "dayjs";

const INIT_STATE = {
  dptCityId: 2,
  dptCityName: "上海",
  dptAirportName: "虹桥机场",
  arrCityId: 1,
  arrCityName: "北京",
  arrAirportName: "大兴机场",
  cityType: "depart", // depart出发 arrive到达
  dptDate: dayjs().format("YYYY-MM-DD"),
};

export default {
  namespace: "flightIndex",
  state: {
    ...INIT_STATE,
  },
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  effects: {},
};
