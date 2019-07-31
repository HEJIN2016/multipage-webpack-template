module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {}
  },
  build: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
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