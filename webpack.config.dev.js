// node ./node_modules/webpack/bin/webpack.js --config ./webpack.config.dev.js
// https://webpack.js.org/configuration/

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var htmlPath = path.resolve(__dirname, "src/index.html");
module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8801',
    'webpack/hot/only-dev-server',
    "./src/app.jsx"
  ],
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".jsx", ".js"]
  },
  resolveLoader: {
    root: path.resolve(__dirname, "node_modules")
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot', 'babel']
      },
      {
        test: /.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /.(png|jpg|jpeg|svg|gif)$/,
        loader: "file-loader"
      }
    ]
  },
  devServer: {
    contentBase: __dirname,
    port: 8801,
    noInfo: false,
    stats: { colors: true },
    historyApiFallback: true,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: htmlPath,
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: "sourcemap",
  debug: true
}