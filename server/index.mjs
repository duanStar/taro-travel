import express from "express";
import chalk from "chalk";
import models from "./models/index.mjs";
import expressCors from "express-cors";

const app = express();

app.use(
  expressCors({
    allowedOrigins: ["*"],
  })
);
app.use(express.json({}));
app.use(
  express.urlencoded({
    extended: false,
  })
);
models(app);

const port = 3000;
app.listen(port, () => {
  console.log("listening on", chalk.blueBright(`localhost:${port}`));
});
