const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        exclude: /gltf/,
        use: ["file-loader"],
      },
      {
        test: /\.(gltf)$/,
        use: ["gltf-webpack-loader"],
      },
      {
        test: /\.(bin|fbx)$/,
        use: ["file-loader"],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].bundle.js",
  },
};
