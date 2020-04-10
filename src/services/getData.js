/**
 * @fileoverview 用于获取 fetch(向服务器发起请求，返回数据) 模块返回的数据
 * @author zouzhuqcom@163.com
 * @time 2020.03.29 19:39
 */
import fetch from '../config/fetch'
import { getStore } from '../config/mUtils'


import api from "../api";

const $todos = api.todosApi;


/*===================== 获取地域城市相关数据 ====================*/
/**
 * 获取定位获取当前所在城市
 */
export const cityGuess = () => $todos('/v1/cities/axios', {
    type: 'guess'
});

/**
 * 获取首页热门城市
 */
export const hostcity = () => fetch('/v1/cities', {
  type: 'host'
});

/**
 * 获取首页所有城市
 */
export const groupcity = () => fetch('/v1/cities', {
  type: 'group'
});




/*========================= 账号登陆区域 ======================*/
/**
 * 获取图形验证码
 */
export const getcaptchas = () => fetch('/v1/captchas', {}, 'POST');

/**
 * 获取短信验证码
 * @param {str} phone 输入的手机号码 
 */
export const mobileCode = phone => fetch('/v4/mobile/verify_code/send', {
	mobile: phone,
	scene: 'login',
	type: 'sms'
}, 'POST');

/**
 * 
 * @param {str} checkNumber 检测的手机号码 
 * @param {str} type 检测的类型(手机账户号, 用户账号) mobile(手机账号类型) 
 */
export const checkExsis = (checkNumber, type) => fetch('/v1/users/exists', {
	[type]: checkNumber,
	type
});

/**
 * 账号密码登录
 * @param {str} username 用户名
 * @param {str} password 密码
 * @param {str} captcha_code 验证码
 */
export const accountLogin = (username, password, captcha_code) => fetch('/v2/login', {username, password, captcha_code}, 'POST');

/**
 * 手机号短信验证登陆
 * @param {*} code 验证码
 * @param {*} mobile 手机号码
 * @param {*} validate_token 验证的令牌
 */
export const sendLogin = (code, mobile, validate_token) => fetch('/v1/login/app_mobile', {
	code,
	mobile,
	validate_token
}, 'POST');

/**
 * 修改当前账户的密码
 * @param {*} username 用户名
 * @param {*} oldpassWord 旧密码
 * @param {*} newpassword 新密码
 * @param {*} confirmpassword 确认新密码
 * @param {*} captcha_code 验证码
 */
export const changePassword = (username, oldpassWord, newpassword, confirmpassword, captcha_code) => fetch('/v2/changepassword', {username, oldpassWord, newpassword, confirmpassword, captcha_code}, 'POST');

/**
 * 退出当前账号
 */
export const signout = () => fetch('/v2/signout');




/*========================= 账号登陆成功-用户信息获取 ======================*/
/**
 * 获取用户信息
 */
export const getUser = () => fetch('/v1/user', { user_id: getStore('user_id') });

/**
 * 个人中心里编辑地址
 * @param {str} user_id 用户 ID
 */
export const getAddressList = (user_id) => fetch('/v1/users/' + user_id + '/addresses');
