const HOST = "0.0.0.0";
const PORT = 3200;
const path = require('path');
const portfinder = require("portfinder");
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const glob = require('glob');
const webpack = require("webpack");
const config = require("./config");
const os = require('os');
const copyWebpackPlugin = require("copy-webpack-plugin");
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

process.env.NODE_ENV = 'dev';

function getHtmlChunk(globSrc) {
  return globSrc.match(/src\/pages\/(.+)/)[1].slice(0, -5).replace('/', '_');
}

function getJsChunk (globSrc) {
  return globSrc.match(/src\/pages\/(.+)/)[1].slice(0, -3).replace('/', '_');
}

function resolve (dir) {
  return path.join(__dirname, '', dir)
}

function getIPAdress() {
  let interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

let entry = {

};

let htmlFiles = glob.sync("src/pages/**/*.html") || [];
let jsFiles = glob.sync("src/pages/**/*.js") || [];

let htmlPlugins = [
  new ExtractTextPlugin({
    filename: 'css/[name].css',
    allChunks: false,
    publicPath: "../"
    // use: ['css-loader', 'postcss-loader', 'less-loader']
  }),
  // copy custom static assets
  new copyWebpackPlugin([
    {
      from: path.resolve(__dirname, 'static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    }
  ])
  // new webpack.optimize.CommonsChunkPlugin({
  //   name: 'vendor',
  //   filename: 'common.js',
  //   minChunks: 2
  // }),
];

jsFiles.forEach((item, index)=>{
  entry[getJsChunk(item)] = path.resolve(__dirname, item);
});
entry.vendor = path.join(__dirname, 'src', 'common.js');

htmlFiles.forEach((item, index)=>{
  let chunks = [];
  if (entry[getHtmlChunk(item)]) {
    chunks = ["vendor", getHtmlChunk(item)];
  } else {
    chunks = ["vendor"];
  }
  htmlPlugins.push(new htmlWebpackPlugin({
    template: item,
    filename: item.match(/src\/pages\/(.+)/)[1],
    favicon:'./src/assets/favicon.ico',
    inject: true,
    chunks,
    chunksSortMode: 'manual',
    minify: {
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      truecollapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true
    }
  }))
});
htmlPlugins.push(
  new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        warnings: false
      }
    },
    sourceMap: true,
    parallel: true
  })
);

let pocssLoader = {

};

let devWebpackConfig = {
  entry,
  output: {
    path: path.join(__dirname, 'src'),
    filename: 'js/[name].js',
    publicPath: config.dev.assetsPublicPath
  },
  devtool: "#cheap-module-eval-source-map",
  plugins: htmlPlugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        },
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', config.dev.postCssLoader, 'less-loader']
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', config.dev.postCssLoader]
        })
      }
    ].concat(config.commonRules)
  },
  devServer: config.dev.devServer
};

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = PORT;
  portfinder.getPort((err, port) => {
    if (err) reject(err);
    else {
      devWebpackConfig.devServer.port = port;

      let messages;
      let host = devWebpackConfig.devServer.host;
      if (host === "0.0.0.0") {
        messages = [`Your application is running here: http://${getIPAdress()}:${port} or http://localhost:${port}`]
      } else {
        messages = [`Your application is running here: http://${host}:${port}`]
      }
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages,
        }
      }));
      resolve(devWebpackConfig);
    }
  })
});
