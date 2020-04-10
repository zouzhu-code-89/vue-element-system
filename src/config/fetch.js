/**
 * @fileoverview 封装向后端服务器发起数据请求的模块, 主要用于发起请求, 返回数据
 *               原作者是利用 javascript XMLHttpRequest
 *               我这里使用 axios
 *
 * @author zouzhuqcom@163.com
 * @time 2020.03.29  16.00
 */

import axios from 'axios'
import { baseUrl } from './env'

export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {
  /**
     * 异步服务器请求
     *
     * @param {string} "url     请求的路径"
     * @param {Object} "data    请求携带的数据"
     * @param {String} "type    请求的方式, 默认是GET请求"
     * @param {String} "method  请求的方法, 默认是 fetch"
     */
  type = type.toUpperCase()
  url = 'http://127.0.0.1:9000' + url

  if (type == 'GET') {
    const getConfig = {
      data: data,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      proxy: {
        host: '127.0.0.1',
        port: 9000
      }
    }
    return new Promise(function (resole, reject) {
      axios.get(url, getConfig).then(function (res) {
        resole(res.data)
      })
    })
  }

  if (type == 'POST') {
    const postConfig = {
      responseType: 'json',
      responseEncoding: 'utf8',
      proxy: {
        host: '127.0.0.1',
        port: 9000
      }
    }
    axios.get('url', postConfig)
  }
}
