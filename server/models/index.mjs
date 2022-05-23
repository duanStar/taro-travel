import ads from "./ads.mjs";
import airportList from "./airportList.mjs";
import flightList from "./list.mjs";
import login from "./login.mjs";
import order from "./orderList.mjs";

export default (app) => {
  app.use("/ads", ads);
  app.use("/city", airportList);
  app.use("/list", flightList);
  app.use(login);
  app.use("/order", order);
};
