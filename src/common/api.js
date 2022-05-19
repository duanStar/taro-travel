import tools from "@/common/tools";

const API_PRE = "http://localhost:3000";

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
