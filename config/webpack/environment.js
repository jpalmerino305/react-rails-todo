const { environment } = require('@rails/webpacker')

const merge = require('webpack-merge')

const myCssLoaderOptions = {
  modules: {
    localIdentName: '[name]__[local]___[hash:base64:5]'
  },
  sourceMap: true,
}

const CSSLoader = environment.loaders.get('sass').use.find(el => el.loader === 'css-loader')

CSSLoader.options = merge(CSSLoader.options, myCssLoaderOptions)

module.exports = environment
