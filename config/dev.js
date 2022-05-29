export default {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  mini: {},
  h5: {
    devServer: {
      proxy: [
        {
          context: ["/"],
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      ],
    },
  },
};
