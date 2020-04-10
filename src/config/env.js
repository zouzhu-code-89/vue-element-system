/**
 * @fileoverview 上线环境的相关资源路径配置
 *
 * @author zouzhuqcom@163.com
 * @time 2020.03.29   16.00
 *
 * @param {baseUrl} : 域名地址
 * @param {routerMode} : 路由模式(开发模式，生产模式)配置
 * @param {imgBaseUrl} : 图片所在域名地址
 */

let baseUrl = ''
const routerMode = 'hash'
let imgBaseUrl = ''

/**
  * @description webpack 为开发模式, 则图片路径为根 /img/
  *                      为产品模式, 则图片路径为域名
  */
if (process.env.NODE_ENV == 'development') {
  imgBaseUrl = '/img/'
}

if (process.env.NODE_ENV == 'production') {
  baseUrl = '//127.0.0.1:9090'
  imgBaseUrl = '//127.0.0.1:9090/img/'
}

export {
  baseUrl,
  routerMode,
  imgBaseUrl
}
