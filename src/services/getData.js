/**
 * @fileoverview 用于获取 fetch(向服务器发起请求，返回数据) 模块返回的数据
 * @author zouzhuqcom@163.com
 * @time 2020.03.29 19:39
 */

import api from "../api/index";



/*===================== 获取地域城市相关数据 ====================*/

/**
 * @description 获取定位获取当前所在城市
 * @return {object} 获取定位的城市信息 CityInfo
 */
export const cityGuess = async () => await api('/v1/cities', {
	type: 'guess'
});


/**
 * @description 获取首页热门城市信息
 * @returns {[Object]} 热门城市信息数组[{CityInfo}]
 */
export const hostCity = async () => await api('/v1/cities', {
  type: 'hot' 
});


/**
 * @description 获取所有城市信息
 * @return {[Object]} 全部的城市信息[{CityInfo1}, {CityInfo1},...a]
 */
export const groupCity = () => api('/v1/cities', {
  type: 'group'
});


/**
 * @description 根据当前的城市ID (id:1)ShangHai 获取城市信息 CityInfo.
 * @param {*} cityid 当前城市ID
 * @return {Object} 返回当前城市信息对象 CityInfo
 */
export const currentCity = cityid => api('/v1/cities/' + cityid);


/**
 * @description 获取搜索的详细地址
 * @param {*} cityid 当前用户所在城市的ID (id:1)ShangHai
 * @param {*} value  用户输入的地点
 * @return {[string]} 返回的是一个地点集合，比如我们搜索学校，就会返回武汉附近所有的学校
 */
export const searchplace = (cityid, value) => api('/v1/pois', {
	type: 'search',
	city_id: cityid,
	keyword: value
});











/*========================= 账号登陆区域 ======================*/
/**
 * 获取图形验证码
 */
export const getcaptchas = () => api('/v1/captchas', {}, 'POST');

/**
 * 获取短信验证码
 * @param {str} phone 输入的手机号码 
 */
export const mobileCode = phone => api('/v4/mobile/verify_code/send', {
	mobile: phone,
	scene: 'login',
	type: 'sms'
}, 'POST');

/**
 * 
 * @param {str} checkNumber 检测的手机号码 
 * @param {str} type 检测的类型(手机账户号, 用户账号) mobile(手机账号类型) 
 */
export const checkExsis = (checkNumber, type) => api('/v1/users/exists', {
	[type]: checkNumber,
	type
});

/**
 * 账号密码登录
 * @param {str} username 用户名
 * @param {str} password 密码
 * @param {str} captcha_code 验证码
 */
export const accountLogin = (username, password, captcha_code) => api('/v2/login', {username, password, captcha_code}, 'POST');

// /**
//  * 手机号短信验证登陆
//  * @param {*} code 验证码
//  * @param {*} mobile 手机号码
//  * @param {*} validate_token 验证的令牌
//  */
// export const sendLogin = (code, mobile, validate_token) => fetch('/v1/login/app_mobile', {
// 	code,
// 	mobile,
// 	validate_token
// }, 'POST');

// /**
//  * 修改当前账户的密码
//  * @param {*} username 用户名
//  * @param {*} oldpassWord 旧密码
//  * @param {*} newpassword 新密码
//  * @param {*} confirmpassword 确认新密码
//  * @param {*} captcha_code 验证码
//  */
// export const changePassword = (username, oldpassWord, newpassword, confirmpassword, captcha_code) => fetch('/v2/changepassword', {username, oldpassWord, newpassword, confirmpassword, captcha_code}, 'POST');

// /**
//  * 退出当前账号
//  */
// export const signout = () => fetch('/v2/signout');




/*========================= 账号登陆成功-用户信息获取 ======================*/
// /**
//  * 获取用户信息
//  */
// export const getUser = () => fetch('/v1/user', { user_id: getStore('user_id') });

// /**
//  * 个人中心里编辑地址
//  * @param {str} user_id 用户 ID
//  */
// export const getAddressList = (user_id) => fetch('/v1/users/' + user_id + '/addresses');








// import fetch from '../config/fetch'
// import {getStore} from '../config/mUtils'

// /**
//  * 获取首页默认地址
//  */

// export const cityGuess = () => fetch('/v1/cities', {
// 	type: 'guess'
// });


// /**
//  * 获取首页热门城市
//  */

// export const hotcity = () => fetch('/v1/cities', {
// 	type: 'hot'
// });


// /**
//  * 获取首页所有城市
//  */

// export const groupcity = () => fetch('/v1/cities', {
// 	type: 'group'
// });


// /**
//  * 获取当前所在城市
//  */

// export const currentcity = number => fetch('/v1/cities/' + number);




/*========================= msite 页面相关资源的获取 ======================*/

/**
 * 获取 msite 页面地址信息
 * @param {*} geohash 
 */
export const msiteAddress = geohash => api('/v2/pois/' + geohash);

/**
 * 获取 msite 页面食品分类列表
 * @param {*} geohash 
 */
export const msiteFoodTypes = geohash => api('/v2/index_entry', {
	geohash,
	group_type: '1',
	'flags[]': 'F'
});

/**
 * 获取 msite 商铺列表
 */
export const shopList = (latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', delivery_mode = '', support_ids = []) => {
	let supportStr = '';
	support_ids.forEach(item => {
		if (item.status) {
			supportStr += '&support_ids[]=' + item.id;
		}
	});
	let data = {
		latitude,
		longitude,
		offset,
		limit: '20',
		'extras[]': 'activities',
		keyword: '',
		restaurant_category_id,
		'restaurant_category_ids[]': restaurant_category_ids,
		order_by,
		'delivery_mode[]': delivery_mode + supportStr
	};
	return fetch('/shopping/restaurants', data);
};


// /**
//  * 获取search页面搜索结果
//  */

// export const searchRestaurant = (geohash, keyword) => fetch('/v4/restaurants', {
// 	'extras[]': 'restaurant_activity',
// 	geohash,
// 	keyword,
// 	type: 'search'
// });


// /**
//  * 获取food页面的 category 种类列表
//  */

// export const foodCategory = (latitude, longitude) => fetch('/shopping/v2/restaurant/category', {
// 	latitude,
// 	longitude
// });


// /**
//  * 获取food页面的配送方式
//  */

// export const foodDelivery = (latitude, longitude) => fetch('/shopping/v1/restaurants/delivery_modes', {
// 	latitude,
// 	longitude,
// 	kw: ''
// });


// /**
//  * 获取food页面的商家属性活动列表
//  */

// export const foodActivity = (latitude, longitude) => fetch('/shopping/v1/restaurants/activity_attributes', {
// 	latitude,
// 	longitude,
// 	kw: ''
// });


// /**
//  * 获取shop页面商铺详情
//  */

// export const shopDetails = (shopid, latitude, longitude) => fetch('/shopping/restaurant/' + shopid, {
// 	latitude,
// 	longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
// });



// /**
//  * 获取shop页面菜单列表
//  */

// export const foodMenu = restaurant_id => fetch('/shopping/v2/menu', {
// 	restaurant_id
// });


// /**
//  * 获取商铺评价列表
//  */

// export const getRatingList = (shopid, offset, tag_name = '') => fetch('/ugc/v2/restaurants/' + shopid + '/ratings', {
// 	has_content: true,
// 	offset,
// 	limit: 10,
// 	tag_name
// });


// /**
//  * 获取商铺评价分数
//  */

// export const ratingScores = shopid => fetch('/ugc/v2/restaurants/' + shopid + '/ratings/scores');


// /**
//  * 获取商铺评价分类
//  */

// export const ratingTags = shopid => fetch('/ugc/v2/restaurants/' + shopid + '/ratings/tags');


// /**
//  * 获取短信验证码
//  */

// export const mobileCode = phone => fetch('/v4/mobile/verify_code/send', {
// 	mobile: phone,
// 	scene: 'login',
// 	type: 'sms'
// }, 'POST');


// /**
//  * 获取图片验证码
//  */

// export const getcaptchas = () => fetch('/v1/captchas', {},'POST');


// /**
//  * 检测帐号是否存在
//  */

// export const checkExsis = (checkNumber, type) => fetch('/v1/users/exists', {
// 	[type]: checkNumber,
// 	type
// });


// /**
//  * 发送帐号
//  */

// export const sendMobile = (sendData, captcha_code, type, password) => fetch('/v1/mobile/verify_code/send', {
// 	action: "send",
// 	captcha_code,
// 	[type]: sendData,
// 	type: "sms",
// 	way: type,
// 	password,
// }, 'POST');


// /**
//  * 确认订单
//  */

// export const checkout = (geohash, entities, shopid) => fetch('/v1/carts/checkout', {
// 	come_from: "web",
// 	geohash,
// 	entities,
// 	restaurant_id: shopid,
// }, 'POST');


// /**
//  * 获取快速备注列表
//  */

// export const getRemark = (id, sig) => fetch('/v1/carts/' + id + '/remarks', {
// 	sig
// });


// /**
//  * 获取地址列表
//  */

// export const getAddress = (id, sig) => fetch('/v1/carts/' + id + '/addresses', {
// 	sig
// });


// /**
//  * 搜索地址
//  */

// export const searchNearby = keyword => fetch('/v1/pois', {
// 	type: 'nearby',
// 	keyword
// });


// /**
//  * 添加地址
//  */

// export const postAddAddress = (userId, address, address_detail, geohash, name, phone, phone_bk, poi_type, sex, tag, tag_type) => fetch('/v1/users/' + userId + '/addresses', {
// 	address,
// 	address_detail,
// 	geohash,
// 	name,
// 	phone,
// 	phone_bk,
// 	poi_type,
// 	sex,
// 	tag,
// 	tag_type,
// }, 'POST');


// /**
//  * 下订单
//  */

// export const placeOrders = (user_id, cart_id, address_id, description, entities, geohash, sig) => fetch('/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
// 	address_id,
// 	come_from: "mobile_web",
// 	deliver_time: "",
// 	description,
// 	entities,
// 	geohash,
// 	paymethod_id: 1,
// 	sig,
// }, 'POST');


// /**
//  * 重新发送订单验证码
//  */

// export const rePostVerify = (cart_id, sig, type) => fetch('/v1/carts/' + cart_id + '/verify_code', {
// 	sig,
// 	type,
// }, 'POST');



// /**
//  * 下订单
//  */

// export const validateOrders = ({
// 	user_id,
// 	cart_id,
// 	address_id,
// 	description,
// 	entities,
// 	geohash,
// 	sig,
// 	validation_code,
// 	validation_token
// }) => fetch('/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
// 	address_id,
// 	come_from: "mobile_web",
// 	deliver_time: "",
// 	description,
// 	entities,
// 	geohash,
// 	paymethod_id: 1,
// 	sig,
// 	validation_code,
// 	validation_token,
// }, 'POST');


// /**
//  * 重新发送订单验证码
//  */

// export const payRequest = (merchantOrderNo, userId) => fetch('/payapi/payment/queryOrder', {
// 	merchantId: 5,
// 	merchantOrderNo,
// 	source: 'MOBILE_WAP',
// 	userId,
// 	version: '1.0.0',
// });



// /**
//  * 获取服务中心信息
//  */

// export const getService = () => fetch('/v3/profile/explain');



// /**
// *兑换会员卡
// */

// export const vipCart = (id, number, password) => fetch('/member/v1/users/' + id + '/delivery_card/physical_card/bind',{
// 	number,
// 	password
// }, 'POST')



// /**
//  * 获取红包
// */

// export const getHongbaoNum = id => fetch('/promotion/v2/users/' + id + '/hongbaos?limit=20&offset=0');



// /**
//  * 获取过期红包
// */


// export const getExpired = id => fetch('/promotion/v2/users/' + id + '/expired_hongbaos?limit=20&offset=0');


// /**
//  * 兑换红包
// */

// export const exChangeHongbao = (id, exchange_code, captcha_code) => fetch('/v1/users/' + id + '/hongbao/exchange',{
// 	exchange_code,
// 	captcha_code,
// }, 'POST');


// /**
//  * 获取用户信息
//  */

// export const getUser = () => fetch('/v1/user', {user_id: getStore('user_id')});


/**
 * 手机号登录
 */

var sendLogin = (code, mobile, validate_token) => api('/v1/login/app_mobile', {
	code,
	mobile,
	validate_token
}, 'POST');


// /**
//  * 获取订单列表
//  */

// export const getOrderList = (user_id, offset) => fetch('/bos/v2/users/' + user_id + '/orders', {
// 	limit: 10,
// 	offset,
// });


// /**
//  * 获取订单详情
//  */

// export const getOrderDetail = (user_id, orderid) => fetch('/bos/v1/users/' + user_id + '/orders/' + orderid + '/snapshot');


// /**
// *个人中心里编辑地址
// */

// export const getAddressList = (user_id) => fetch('/v1/users/'+user_id+'/addresses')

// /**
// *个人中心里搜索地址
// */

// export const getSearchAddress = (keyword) => fetch('v1/pois',{
// 	keyword:keyword,
// 	type:'nearby'
// })

// /**
// * 删除地址
// */

// export const deleteAddress = (userid, addressid) => fetch( '/v1/users/' + userid + '/addresses/' + addressid, {}, 'DELETE')



// /**
//  * 账号密码登录
//  */
// export const accountLogin = (username, password, captcha_code) => fetch('/v2/login', {username, password, captcha_code}, 'POST');


// /**
//  * 退出登录
//  */
// export const signout = () => fetch('/v2/signout');


// /**
//  * 改密码
//  */
// export const changePassword = (username, oldpassWord, newpassword, confirmpassword, captcha_code) => fetch('/v2/changepassword', {username, oldpassWord, newpassword, confirmpassword, captcha_code}, 'POST');
