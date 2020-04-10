/**
 * @fileoverview 初始化一个 axios 实例, 初始化一些实例的配置, 请求响应拦截器
 * 
 * @author zouzhuQcom@163.com
 * @time   2020.04.08
 */
import axios from "axios"



const initAxios = axios.create({          // 初始化一个 axios 实例
    timeout: 1000 * 12
});
initAxios.defaults.headers.post['Content-Type'] = 'application/json';       // 对实例的响应头进行配置


/**
 * @description 实例响应拦截器
 */
initAxios.interceptors.response.use(           
    function(res){                      // 1.正常拦截
        res.status == 200 ? Promise.resolve(res) : Promise.reject(res); 
    },
    function(error){                    // 2.错误拦截
        const {response} = error;
        if (response) {
            errorHandler(response.status, response.data.message);
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
            // store.commit('changeNetwork', false);
        }
    }
);


/**
 * @description 统一错误的错误处理
 * @param {*} statusCode 响应的状态码 401，403，404
 * @param {*} message    服务器返回的错误消息
 */
const errorHandler = (statusCode, message) => {
    switch(statusCode){
        case 401: console.log("未登录状态"); break;
        case 403: console.log("登录过期, 需要重新登录"); break;
        default: console.log(message);
    }
}



export default initAxios;