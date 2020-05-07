<!--
    Home 组件完成后, 就会跳转到 City 组件, Home 组件是获取城市定位, 而 City 组件则是获取用户的详细地址
-->
<template>
    <!-- City 组件容器 -->
  	<div class="city_container">

        <!-- HeadTop 头部组件 -->
        <HeadTop :head-title="cityname" go-back='true'>
            <router-link to="/home" slot="changecity" class="change_city">切换城市</router-link>
        </HeadTop>

        <!-- 用户输入模糊地址、通过腾讯地图获取精准定位 -->
        <form class="city_form" v-on:submit.prevent>
            <div>
                <!-- required : 这一项是必须要填写的 -->
                <input type="search" name="city" placeholder="输入学校、商务楼、地址" class="city_input input_style" required v-model='inputVaule'>
            </div>
            <div>
                <input type="submit" name="submit" class="city_submit input_style" @click='postpois' value="提交">
            </div>
        </form>

        <!-- 用户搜索地址历史: 当我们没有点击提交时、显示搜索记录、点击提交后显示搜索结果 -->
        <header v-if="historytitle" class="pois_search_history">搜索历史</header>
        <ul class="getpois_ul">
            <li v-for="(item, index) in placelist" @click='nextpage(index, item.geohash)' :key="index">
                <h4 class="pois_name ellipsis">{{item.name}}</h4>
                <p class="pois_address ellipsis">{{item.address}}</p>
            </li>
        </ul>
        <!-- 当显示搜索历史或者历史列表不为空时、显示清空所有 -->
        <footer v-if="historytitle&&placelist.length" class="clear_all_history" @click="clearAll">清空所有</footer>

        <!-- 显示结果区域 -->
        <div class="search_none_place" v-if="placeNone">很抱歉！无搜索结果</div>
    </div>
</template>


<script>
    import HeadTop from '@/components/header/HeadTop'
    import {currentCity, searchplace} from '@/services/getData'
    import {getStore, setStore, removeStore} from '@/config/mUtils'

    export default {
    	data(){
            return{
                inputVaule:'',          // 搜索地址
                cityid:'',              // 当前城市id
                cityname:'',            // 当前城市名字
                placelist:[],           // 搜索城市列表
                placeHistory:[],        // 历史搜索记录
                historytitle: true,     // 默认显示搜索历史头部，点击搜索后隐藏
                placeNone: false,       // 搜索无结果，显示提示信息
            }
        },

        mounted(){
            // 通过路径获取城市 ID
            this.cityid = this.$route.params.cityid;
            // 通过 getData 发起数据请求、获取当前城市名字
            currentCity(this.cityid).then(res => {
                this.cityname = res.name;
            })
            // 获取缓存的搜索记录
            this.initData();
        },

        components:{
            HeadTop
        },

        computed:{

        },

        methods:{
            /**初始化搜索记录
             * @method inidData
             * @description 当再次访问这个组件的时候、会重新获取本地缓存的用户搜索记录 Cookie
             */
            initData(){
                // 从本地 Cookie、获取搜索历史记录
                if (getStore('placeHistory')) {
                    this.placelist = JSON.parse(getStore('placeHistory'));
                }else{
                    this.placelist = [];
                }
            },

            /**地址搜索信息 inputValue
             * @method posipois
             * @description 当用户输入非空的地址、点击提交就会触发这个事件、用户获取精准定位
             */
            postpois(){
                // 输入值不为空时才发送信息请求
                if (this.inputVaule) {
                    searchplace(this.cityid, this.inputVaule).then(res => {
                        this.historytitle = false;
                        this.placelist = res;
                        this.placeNone = res.length? false : true;
                    })
                }
            },

            /**进入下一个页面 history 模式
             * @method nextpage
             * @description 点击搜索结果进入下一页面时、进行判断是否 history 已经有一样的历史纪录、
             *              如果没有则新增、如果有则不做重复存储、判断完成后进入下一页
             * @param {Number} index 下一页的步数 go(index)
             * @param {String} geohash 历史搜索列表里面的某一个地址
             */
            nextpage(index, geohash){
                let history = getStore('placeHistory');
                let choosePlace = this.placelist[index];
                if (history) {
                    let checkrepeat = false;
                    this.placeHistory = JSON.parse(history);
                    this.placeHistory.forEach(item => {
                        if (item.geohash == geohash) {
                            checkrepeat = true;
                        }
                    })
                    if (!checkrepeat) {
                        this.placeHistory.push(choosePlace)
                    }
                }else {
                    this.placeHistory.push(choosePlace)
                }
                setStore('placeHistory',this.placeHistory)
                this.$router.push({path:'/msite', query:{geohash}})
            },

            /**清除全部历史信息
             * @method clearAll
             * @description 当出发这个函数、本地的缓存数据将被清除 removeStore
             *              并重新初始化 initData
             */
            clearAll(){
                removeStore('placeHistory');
                this.initData();
            }
        }
    }

</script>

<style lang="scss" scoped>
    @import '@/style/mixin';
    .city_container{
        padding-top: 2.35rem;
    }
    .change_city{
        right: 0.4rem;
        @include font-size-color(0.6rem, #fff);
        @include top-buttom-center;
    }
    .city_form{
        background-color: #fff;
        border-top: 1px solid $bc;
        border-bottom: 1px solid $bc;
        padding-top: 0.4rem;
        div{
            width: 90%;
            margin: 0 auto;
            text-align: center;
            .input_style{
                border-radius: 0.1rem;
                margin-bottom: 0.4rem;
                @include width-height(100%, 1.4rem);
            }
            .city_input{
                border: 1px solid $bc;
                padding: 0 0.3rem;
                @include font-size-color(0.65rem, #333);
            }
            .city_submit{
                background-color: $blue;
                @include font-size-color(0.65rem, #fff);
            }
        }
    }
    .pois_search_history{
        border-top: 1px solid $bc;
        border-bottom: 1px solid $bc;
        padding-left: 0.5rem;
        @include font(0.475rem, 0.8rem);
    }
    .getpois_ul{
        background-color: #fff;
        border-top: 1px solid $bc;
        li{
            margin: 0 auto;
            padding-top: 0.65rem;
            border-bottom: 1px solid $bc;
            .pois_name{
                margin: 0 auto 0.35rem;
                width: 90%;
               @include font-size-color(0.65rem, #333);
            }
            .pois_address{
                width: 90%;
                margin: 0 auto 0.55rem;
                @include font-size-color(0.45rem, #999);
            }
        }
    }
    .search_none_place{
        margin: 0 auto;
        @include font(0.65rem, 1.75rem);
        color: #333;
        background-color: #fff;
        text-indent: 0.5rem;
    }
    .clear_all_history{
        @include font-size-color(0.7rem, #666);
        text-align: center;
        line-height: 2rem;
        background-color: #fff;
    }
</style>
