const path = require('path')
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  filenameHashing: false,
  productionSourceMap: false,
  transpileDependencies: true,
  css: {
    extract: true
  },
  configureWebpack: {
    devtool: 'inline-cheap-source-map',
    entry: {
      app: './src/main.js',
      background: './src/background.js'
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  },
  chainWebpack: (config) => {
    config.plugins.delete('html')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
})