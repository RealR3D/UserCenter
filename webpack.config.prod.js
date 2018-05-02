// node ./node_modules/webpack/bin/webpack.js --config ./webpack.config.prod.js
// https://webpack.js.org/configuration/

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var htmlPath = path.resolve(__dirname, "src/index.html");
module.exports = {
    entry: './src/app.jsx',
    output: {
      path: path.resolve(__dirname, "build"),
      publicPath: '',
      filename: '[name].[chunkhash:8].min.js',
      chunkFilename: '[name].[chunkhash:8].chunk.min.js',
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
          loader: "babel-loader"
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
    plugins: [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
      new HtmlWebpackPlugin({
        inject: true,
        template: htmlPath,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin()
    ],
    bail: true
}