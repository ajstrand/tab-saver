const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  mode:"development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "popup.bundle.js",
    publicPath: "/dist"
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [{
        test: /\.js$/,
        exclude: "/node_modules/",
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s[c|a]ss$/,
        exclude: "/node_modules/",
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }

    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css"
    })
  ]
};