module.exports = {
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