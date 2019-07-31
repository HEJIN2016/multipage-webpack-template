const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const glob = require('glob');
const postcss = require('./postcss.config');

process.env.NODE_ENV = 'prod';

function getHtmlChunk(globSrc) {
  return globSrc.match(/src\/pages\/(.+)/)[1].slice(0, -5).replace('/', '_');
}

function getJsChunk (globSrc) {
  return globSrc.match(/src\/pages\/(.+)/)[1].slice(0, -3).replace('/', '_');
}

let entry = {
  vendor: path.join(__dirname, 'src', 'common.js')
};

let htmlFiles = glob.sync("src/pages/**/*.html") || [];
let jsFiles = glob.sync("src/pages/**/*.js") || [];

let htmlPlugins = [
  new CleanWebpackPlugin(['dist']),
  new ExtractTextPlugin({
    filename: ('css/[name].[hash:8].css')
    // allChunks: true,
    // use: ['css-loader', 'postcss-loader', 'less-loader']
  })
];
jsFiles.forEach((item, index)=>{
  entry[getJsChunk(item)] = path.resolve(__dirname, item);
});

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
    chunksSortMode: "dependency",
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


module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash:8].js'
    // globalObject: 'this' // 兼容node和浏览器运行，避免window is not undefined情况
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
          use: ['css-loader', {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({ }),
                require('postcss-url')({}),
                // require('postcss-preset-env')(),
                require('cssnano')(),
                require('autoprefixer')()
              ]
            }}, 'less-loader']
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', "postcss-loader"]
        })
      }
    ]
  },
  plugins: htmlPlugins
};