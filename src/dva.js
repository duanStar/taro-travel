import { create } from "dva-core";

let app;
let store;
let dispatch;

const createApp = (opts) => {
  app = create(opts);
  // 确保model只注册一次
  if (!global.registered) {
    opts.models.forEach((model) => app.model(model));
  }
  global.registered = true;
  app.start();
  store = app._store;
  // 用函数返回，确保每次拿到最新的store
  app.getStore = () => store;
  dispatch = store.dispatch;
  app.dispatch = dispatch;
  return app;
};

export default createApp;
