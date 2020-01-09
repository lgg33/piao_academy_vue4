const path = require('path')
function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set('@svg', resolve('./src/icons/svg'));
    config.module.rules.delete('svg'); // 重点:删除默认配置中处理svg,
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include
      .add(resolve('src/icons/svg')) // 处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      });
  },
  configureWebpack: {
    devServer: {
      // open: process.platform === 'darwin',
      // host: '0.0.0.0',
      port: 8080,
      https: false,
      hotOnly: false,
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:9000',
      //     pathRewrite: {
      //       '^/api': ''
      //     }
      //     //target: 'http://127.0.0.1:50201'
      //   }
      // }, // 设置代理
      // before: app => {}
    },
    // resolve: {
    //   alias: {
    //     'assets': '@/assets',
    //     'common': '@/common',
    //     'components': '@/components',
    //     'network': '@/network',
    //     'views': '@/views',
    //   }
    // }
  },

};

