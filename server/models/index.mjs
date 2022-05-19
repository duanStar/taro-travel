import ads from "./ads.mjs";
import airportList from "./airportList.mjs";
import flightList from "./list.mjs";

export default (app) => {
  app.use("/ads", ads);
  app.use("/city", airportList);
  app.use("/list", flightList);
};
