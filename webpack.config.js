const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const glob = require('glob');
const config = require("./config");
const copyWebpackPlugin = require("copy-webpack-plugin");
const babelPolyfill = require('babel-polyfill');

process.env.NODE_ENV = 'prod';

function getHtmlChunk(globSrc) {
  return globSrc.match(/src\/pages\/(.+)/)[1].slice(0, -5).replace('/', '_');
}

function getJsChunk (globSrc) {
  return globSrc.match(/src\/pages\/(.+)/)[1].slice(0, -3).replace('/', '_');
}

let entry = {
  polyfill: ['babel-polyfill'],
  vendor: path.join(__dirname, 'src', 'common.js')
};

let htmlFiles = glob.sync("src/pages/**/*.html") || [];
let jsFiles = glob.sync("src/pages/**/*.js") || [];

let htmlPlugins = [
  new CleanWebpackPlugin(['dist']),
  new ExtractTextPlugin({
    filename: ('css/[name].[chunkhash].css')
    // allChunks: true,
  }),
  // copy custom static assets
  new copyWebpackPlugin([
    {
      from: path.resolve(__dirname, 'static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    }
  ])
];
jsFiles.forEach((item, index)=>{
  entry[getJsChunk(item)] = path.resolve(__dirname, item);
});

htmlFiles.forEach((item, index)=>{
  let chunks = [];
  if (entry[getHtmlChunk(item)]) {
    if (config.build.polyfill) {
      chunks = ["polyfill", "vendor", getHtmlChunk(item)];
    } else {
      chunks = ["vendor", getHtmlChunk(item)];
    }

  } else {
    if (config.build.polyfill) {
      chunks = ["polyfill", "vendor"];
    } else {
      chunks = ["vendor"];
    }
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
    sourceMap: config.build.jsSourceMap,
    parallel: true
  })
);


module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: ('js/[name].[chunkhash].js'),
    chunkFilename: ('js/[id].[chunkhash].js'),
    publicPath: config.build.assetsPublicPath
  },
  devtool: "#source-map",
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
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: config.build.cssSourceMap
            }
          }, config.prodPostCssLoader, {
            loader: 'less-loader',
            options: {
              sourceMap: config.build.cssSourceMap
            }
          }]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: config.build.cssSourceMap
            }
          }, config.prodPostCssLoader]
        })
      }
    ].concat(config.commonRules)
  },
  plugins: htmlPlugins
};
