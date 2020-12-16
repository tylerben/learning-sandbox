const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.config.base");

module.exports = merge(baseConfig, {
  mode: "development",
  devServer: {
    contentBase: "./dist",
    open: true,
    port: 9000,
  },
  devtool: "source-map",
});
