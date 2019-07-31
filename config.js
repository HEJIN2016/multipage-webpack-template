module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
  },
  build: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
  },
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