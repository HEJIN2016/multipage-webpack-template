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

process.env.NODE_ENV = 'dev';

function getHtmlChunk(globSrc) {
  return globSrc.match(/src\/pages\/(.+)/)[1].slice(0, -5).replace('/', '_');
}

function getJsChunk (globSrc) {
  return globSrc.match(/src\/pages\/(.+)/)[1].slice(0, -3).replace('/', '_');
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
const myHost = getIPAdress();


let entry = {

};

let htmlFiles = glob.sync("src/pages/**/*.html") || [];
let jsFiles = glob.sync("src/pages/**/*.js") || [];

let htmlPlugins = [
  new ExtractTextPlugin({
    filename: 'css/[name].css',
    allChunks: false,
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
    filename: 'js/[name].js'
  },
  devtool: "#cheap-module-eval-source-map",
  plugins: htmlPlugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', config.devPostCssLoader, 'less-loader']
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', config.devPostCssLoader]
        })
      }
    ]
  },
  devServer: {
    // contentBase: path.join(__dirname, "src"),
    clientLogLevel: 'warning',
    hot: true,
    compress: true,
    host: myHost,
    port: PORT,
    open: false,
    inline: true,
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