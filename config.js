const cssSourceMap = true; // 是否开启css sourceMap
const jsSourceMap = true; // 是否开启js sourceMap

module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    devServer: {
      // contentBase: path.join(__dirname, "src"),
      clientLogLevel: 'warning',
      hot: true,
      compress: true,
      host: "0.0.0.0",
      port: 3200,
      open: false,
      inline: true,
      proxy: {} // 反向代理table
      // publicPath: config.dev.assetsPublicPath
    }
  },
  build: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    polyfill: true, // 是否开启babel-polyfill转换
    jsSourceMap,
    cssSourceMap
  },

  commonRules: [
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'img/[name].[hash:7].[ext]'
      }
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'media/[name].[hash:7].[ext]'
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'fonts/[name].[hash:7].[ext]'
      }
    }
  ],

  devPostCssLoader: {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      sourceMap: true,
      plugins: (loader) => [
        require('postcss-import')({}),
        require('postcss-url')({}),
        // require('postcss-preset-env')(),
        // require('cssnano')(),
        require('autoprefixer')()
      ]
    },
  },
  prodPostCssLoader: {
    loader: 'postcss-loader',
    options: {
      sourceMap: cssSourceMap,
      ident: 'postcss',
      plugins: (loader) => [
        require('postcss-import')({}),
        require('postcss-url')({}),
        // require('postcss-preset-env')(),
        require('cssnano')(),
        require('autoprefixer')()
      ]
    },
  }
};
