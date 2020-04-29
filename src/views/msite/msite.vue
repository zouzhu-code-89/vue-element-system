<!--店铺详情页面 "/msite" 
    
    这个页面主要有 3 个部分: 1.头部组件 
                            2.活动列表（美食、新店特惠、预定早餐、土豪推荐.....）
                            3.附近商家
                            4.尾部组件（外卖、搜索、订单、我的）
-->     
<template>
    <div>
        <!-- 头部组件: 搜索图标、详细地址、登录注册 -->
    	<HeadTop signin-up='msite'>
			<!-- 搜索图标 -->
    		<router-link :to="'/search/geohash'" class="link_search" slot="search">
	    		<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
	    			<circle cx="8" cy="8" r="7" stroke="rgb(255,255,255)" stroke-width="1" fill="none"/>
	    			<line x1="14" y1="14" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2"/>
	    		</svg>
    		</router-link>
			<!-- 地址标题 -->
			<router-link to="/home" slot="msite-title" class="msite_title">
				<span class="title_text ellipsis">{{msiteTitle}}</span>
			</router-link>
    	</HeadTop>

        <!-- 商品活动列表 -->
    	<nav class="msite_nav">
			<!--如果食物分类列表为真，则渲染食物列表，否则显然一张背景图-->
    		<div class="swiper-container" v-if="foodTypes.length">
		        <div class="swiper-wrapper">
		            <div class="swiper-slide food_types_container" v-for="(item, index) in foodTypes" :key="index">
	            		<router-link :to="{path: '/food', query: {geohash, title: foodItem.title, restaurant_category_id: getCategoryId(foodItem.link)}}" v-for="foodItem in item" :key="foodItem.id" class="link_to_food">
	            			<figure>
	            				<img :src="imgBaseUrl + foodItem.image_url">
	            				<figcaption>{{foodItem.title}}</figcaption>
	            			</figure>
	            		</router-link>
		            </div>
		        </div>
		        <div class="swiper-pagination"></div>
		    </div>
		    <img src="../../images/fl.svg" class="fl_back animation_opactiy" v-else>
    	</nav>

        <!-- 附近店家 -->
    	<div class="shop_list_container">
	    	<header class="shop_header">
	    		<svg class="shop_icon">
	    			<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shop"></use>
	    		</svg>
	    		<span class="shop_header_title">附近商家</span>
	    	</header>
	    	<shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
    	</div>

		<!-- 尾部导航组件 -->
    	<foot-guide></foot-guide>
    </div>    
</template>



<script>
import {mapMutations} from 'vuex'
import {imgBaseUrl} from '@/config/env'
import HeadTop from '@/components/header/HeadTop'
import FootGuide from '@/components/footer/FootGuide'
import shopList from '@/components/common/ShopList'
import {msiteAddress, msiteFoodTypes, cityGuess} from '@/services/getData'
import '@/plugins/swiper.min.js'
import '@/style/swiper.min.css'

export default {
	data(){
        return {
        	geohash: '', 									// city 页面传递过来的地址 geohash
            msiteTitle: '请选择地址...', 				 	 // msite 页面头部标题
            foodTypes: [], 									// 食品分类列表
            hasGetData: false, 								// 是否已经获取地理位置数据，成功之后再获取商铺列表信息
            imgBaseUrl: 'https://fuss10.elemecdn.com', 		// 图片域名地址
        }
	},
	
    async beforeMount(){
		// 1.如果路径中没有 geohash,则重新获取当前用户所在城市
		if (!this.$route.query.geohash) {
			// 根据定位获取当前所在城市
			const address = await cityGuess();		
			// geohash 为返沪数据的经度和纬度
			this.geohash = address.latitude + ',' + address.longitude;
		}else{
			this.geohash = this.$route.query.geohash
		}
		// 2.保存 geohash 到 vuex
		this.SAVE_GEOHASH(this.geohash);
    	// 3.获取位置信息
    	let res = await msiteAddress(this.geohash);
    	this.msiteTitle = res.name;
    	// 4.记录当前经度纬度
		this.RECORD_ADDRESS(res);
		// 5.是否获取到数据
    	this.hasGetData = true;
	},
	
    mounted(){
        // 1.获取导航食品类型列表
       	msiteFoodTypes(this.geohash).then(res => {
       		let resLength = res.length;
       		let resArr = [...res]; 			// 返回一个新的数组
       		let foodArr = [];
    		for (let i = 0, j = 0; i < resLength; i += 8, j++) {
    			foodArr[j] = resArr.splice(0, 8);		// 8位为一个数据段进行切割
    		}
    		this.foodTypes = foodArr;
        }).then(() => {
        	// 初始化 swiper
        	new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        loop: true
		    });
        })
	},
	
    components: {
    	HeadTop,
    	shopList,
    	FootGuide,
	},
	
    computed: {

    },
    methods: {
    	...mapMutations([
    		'RECORD_ADDRESS', 'SAVE_GEOHASH'
		]),
    	// 解码 url 地址，求去 restaurant_category_id 值
    	getCategoryId(url){
    		let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name',''));
    		if (/restaurant_category_id/gi.test(urlData)) {
    			return JSON.parse(urlData).restaurant_category_id.id
    		}else{
    			return ''
    		}
    	}
    },
    watch: {

    }
}
</script>




<style lang="scss" scoped>
    @import '@/style/mixin';
	.link_search{
		left: .8rem;
		@include width-height(.9rem, .9rem);
		@include top-buttom-center;
	}
	.msite_title{
		@include center;
        width: 50%;
        color: #fff;
        text-align: center;
        margin-left: -0.5rem;
        .title_text{
            @include font-size-color(0.8rem, #fff);
            text-align: center;
            display: block;
        }
	}
	.msite_nav{
		padding-top: 2.1rem;
		background-color: #fff;
		border-bottom: 0.025rem solid $bc;
		height: 10.6rem;
		.swiper-container{
			@include width-height(100%, auto);
			padding-bottom: 0.6rem;
			.swiper-pagination{
				bottom: 0.2rem;
			}
		}
		.fl_back{
			@include width-height(100%, 100%);
		}
	}
	.food_types_container{
		display:flex;
		flex-wrap: wrap;
		.link_to_food{
			width: 25%;
			padding: 0.3rem 0rem;
			@include fj(center);
			figure{
				img{
					margin-bottom: 0.3rem;
					@include width-height(1.8rem, 1.8rem);
				}
				figcaption{
					text-align: center;
					@include font-size-color(0.55rem, #666);
				}
			}
		}
	}
	.shop_list_container{
		margin-top: .4rem;
		border-top: 0.025rem solid $bc;
		background-color: #fff;
		.shop_header{
			.shop_icon{
				fill: #999;
				margin-left: 0.6rem;
				vertical-align: middle;
				@include width-height(0.6rem, 0.6rem);
			}
			.shop_header_title{
				color: #999;
				@include font(0.55rem, 1.6rem);
			}
		}
	}

</style>
