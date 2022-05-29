import tools from "@/common/tools";

const API_PRE = tools.isH5 ? "" : "http://localhost:3000";

export const adsReq = (data) => {
  return tools.request({
    url: `${API_PRE}/ads/adventist`,
    params: data,
  });
};

export const airportCityListReq = (data) => {
  return tools.request({
    url: `${API_PRE}/city/airportList`,
    params: data,
  });
};

export const flightListReq = (data) => {
  return tools.request({
    url: `${API_PRE}/list/singleList`,
    params: data,
  });
};

export const loginReq = (data) => {
  return tools.request({
    url: `${API_PRE}/login`,
    method: "post",
    params: data,
  });
};

export const orderReq = (data) => {
  return tools.request({
    url: `${API_PRE}/order/orderList`,
    method: "post",
    params: data,
  });
};

export const orderListReq = (data) => {
  return tools.request({
    url: `${API_PRE}/order/getOrderList`,
    method: "post",
    params: data,
  });
};
