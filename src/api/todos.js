/**
 * @fileoverview 封装着一些请求的业务逻辑
 * @author       zouzhuQcom@163.com
 * @time         2020-04-08
 */
import base from "./base";
const httpAxios = require("./http");

 /**发送请求
  * 
  * @description 1.判断请求的类型 2.拼装URL路径 3.发送请求
  * @param {*} url    请求的路径
  * @param {*} data   请求的数据
  * @param {*} type   请求的类型
  * @param {*} method 请求的方法
  */
const todos = (url = '', data = {}, type = "GET") => {
    return new Promise(function(resolve, reject){
                url = base.baseUrl + url;
                // GET请求
                if (type == "GET"){
                    let param = '';
                    Object.keys(data).forEach(key => {
                    param += `${key}=${data[key]}&`;
                });
                if (param !== '') {
                    param = param.substr(0, param.lastIndexOf('&'));
                    url = url + '?' + param;
                }
                console.log("request url: ", url);
                httpAxios.get(url).then(function(response){
                    console.log(response.data);
                    resolve(response.data);
                });
            }
    
            // POST请求
            if (type == "POST") {
                httpAxios.post(url, data).then(function(response){
                    console.log(response.data);
                    resolve(response.data);
                });
            }
    });
};

export default todos;