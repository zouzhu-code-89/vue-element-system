import axios from "./http";
import base from "./base";
/**
 * @fileoverview 封装着一些请求的业务逻辑
 * @author       zouzhuQcom@163.com
 * @time         2020-04-08
 */

 /**
  * 异步数据请求调用
  * @param {*} url       请求的路径
  * @param {*} data      请求的数据
  * @param {*} type      请求的类型
  * @param {*} method    请求的方法
  */
const todos = async (url = '', data = {}, type = "GET", method = "fetch") => {
    if (type == "GET") {                                // GET Request                   
        var paramstr = '';
        Object.keys(data).forEach(key => {              // GET: 拼接请求后面的参数
            paramstr += `${key}=${data[key]}&`;
        });

        if (paramstr !== '') {                           // GET: 拼接请求的完整路径
			paramstr = paramstr.substr(0, paramstr.lastIndexOf('&'));
			url = base.baseUrl + url + '?' + paramstr;
        };

        axios.get(url).then(function(response){         // GET: 发送资源请求  
            return Promise.resolve(response.data);
        });
    }

    if (type == "POST"){                                // POST Responst
        
    }

};

export default todos;