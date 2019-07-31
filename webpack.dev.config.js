const HOST = "0.0.0.0";
const PORT = 3200;
const path = require('path');
const portfinder = require("portfinder");
const htmlWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = 'dev';

let devWebpackConfig = {
  entry: {
    app: path.join(__dirname, 'src', 'common.js')
  },
  output: {
    path: path.join(__dirname, 'src'),
    filename: 'common.js'
    // globalObject: 'this' // 兼容node和浏览器运行，避免window is not undefined情况
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dev"),
    clientLogLevel: 'warning',
    hot: true,
    compress: true,
    host: HOST,
    port: PORT,
    open: false
  }
};

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = PORT;
  portfinder.getPort((err, port) => {
    if (err) reject(err);
    else {
      devWebpackConfig.devServer.port = port;
      resolve(devWebpackConfig);
    }
  })
});