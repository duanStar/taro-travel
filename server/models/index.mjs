import ads from "./ads.mjs";
import airportList from "./airportList.mjs";

export default (app) => {
  app.use("/ads", ads);
  app.use("/city", airportList);
};
