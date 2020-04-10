// /**
//  * @name action.js
//  * @description 操控全局状态方法, action 里面的函数都是异步, 不会发生堵塞
//  *
//  * @author zouzhuqcom@163.com
//  * @time 2020.04.01 - 13.00
//  */
// import {
// 	getUser,
// 	getAddressList
// } from '../services/getData'

// import {
// 	GET_USERINFO,
// 	SAVE_ADDRESS
// } from './mutation-types.js'

export default {
    /**
     * 
     * @param {*} param0 
     */
	async getUserInfo({commit,state}) {
		// let res = await getUser();
		// commit(GET_USERINFO, res)
    },

	// async saveAddress({commit,state}){
	// 	if(state.removeAddress.length > 0) return;

	// 	let addres = await getAddressList(state.userInfo.user_id);
	// 	commit(SAVE_ADDRESS, addres);
	// },
}
