const path = require("path")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
module.exports = {
    devServer: {
        open: true
    },
    configureWebpack: {
        mode: 'development',
        devtool: 'source-map',
        entry: {
            "contents": path.resolve(__dirname, 'plugin/contents'),
            "ajx": path.resolve(__dirname, 'plugin/ajx')
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins: [
          new CleanWebpackPlugin({
              cleanOnceBeforeBuildPatterns: ['**/*', '!manifest.json','!background.html',"!background.js"],
          })
        ]
    },
    lintOnSave: false,
    publicPath: '/',
    chainWebpack:config =>{
        config.module
          .rule('test')
          .test(/background\.js|contents\.js/)
          .end()
    }
}
