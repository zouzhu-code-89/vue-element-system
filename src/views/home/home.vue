<!--
    @fileoverfile 首页, 用户首次进入的页面 home
    @author zouzhuqcom@163.com（邹柱）
    @time 2020.03.29  15.00
-->
<template>
    <div>
        <!-- 头部组件 -->
        <HeadTop signin-up='home'>
            <span slot='logo' class="head_logo"  @click="reload">ele.me</span>
        </HeadTop>

        <!-- 城市定位导航 -->
        <nav class="city_nav">
            <div class="city_tip">
                <span>当前定位城市：</span>
                <span>定位不准时，请在城市列表中选择</span>
            </div>
            <!--
                1.将从服务器定位到的城市数据, 渲染到页面
                2.如果点击这个城市数据链接 router-link => /city/:cityId  跳转到输入该城市的详细地址
            -->
            <router-link :to="'/city/' + guessCityid" class="guess_city">
                <span>荆州</span>  <!-- 定位到的当前城市 {{guessCity}}-->
                <i class="el-icon-arrow-right arrow_right"></i>  <!-- svg 图标箭头 -->
            </router-link>
        </nav>

        <!-- 热门城市选择 -->
        <section id="hot_city_container">
            <h4 class="city_title">热门城市</h4>
            <ul class="citylistul clear">  <!-- 同样跳转到输入该城市的详细地址-->
                <li>武汉</li><li>荆州</li><li>北京</li><li>武汉</li>
                <li>武汉</li><li>荆州</li><li>北京</li><li>武汉</li>
                <router-link tag="li" v-for="item in hotcity" :to="'/city/' + item.id" :key="item.id">
                    武汉<!-- {{item.name}} -->
                </router-link>
            </ul>
        </section>

        <!-- 按字符选择城市 -->
        <section class="group_city_container">
            <ul class="letter_classify">
                <li v-for="(value, key, index) in sortgroupcity" :key="key" class="letter_classify_li">
                    <h4 class="city_title">{{key}} <!-- 第一列 : A（按字母排序）后面都只显示字母 B,C,D,E -->
                        <span v-if="index == 0">（按字母排序）</span>
                    </h4>
                    <ul class="groupcity_name_container citylistul clear"> <!-- 同样跳转到输入该城市的详细地址 -->
                        <router-link tag="li" v-for="item in value" :to="'/city/' + item.id" :key="item.id" class="ellipsis">
                            {{item.name}}
                        </router-link>
                    </ul>
                </li>
            </ul>
        </section>

    </div>
</template>


<script>
import { cityGuess, hostcity, groupcity } from '@/services/getData'
import HeadTop from '@/components/header/HeadTop'

export default {
  name: 'home',
  components: {
    HeadTop
  },
  data () {
    return {
      guessCity: '',          // 当前城市
      guessCityid: '',        // 当前城市 id
      hotcity: [],            // 热门城市列表
      groupcity: {}           // 所有城市列表
    }
  },

  mounted () {
    // 获取当前城市
    cityGuess().then(res => {
      this.guessCity = res.name
      this.guessCityid = res.id
    })

    // 获取热门城市
    hostcity().then(res => {
      this.hotcity = res
    })

    // 获取所有城市
    groupcity().then(res => {
      this.groupcity = res
    })
  },

  computed: {
    // 将获取的数据按照 A-Z 字母开头排序
    sortgroupcity () {
      const sortobj = {}
      for (let i = 65; i <= 90; i++) {
        if (this.groupcity[String.fromCharCode(i)]) {
          sortobj[String.fromCharCode(i)] = this.groupcity[String.fromCharCode(i)]
        }
      }
      return sortobj
    }
  },

  methods: {
    // 点击图标刷新页面
    reload () {
      window.location.reload()
    }
  }
}
</script>


<style lang="scss" scope>
    @import "../../style/mixin";

    .head_logo{                               // ele.mi
      left: 0.4rem;
      font-weight: 400;
      @include font-size-color(0.7rem, #fff);
      @include width-height(2.3rem, 0.7rem);
      @include top-buttom-center;
    }
    .city_nav{                               // 城市定位导航 
      padding-top: 2.35rem;
      border-top: 1px solid $bc;
      background-color: #fff;
      margin-bottom: 0.4rem;
      .city_tip{        // 定位提示信息
        @include fj;
        line-height: 1.45rem;
        padding: 0 0.45rem;
        span:nth-of-type(1){
          @include font-size-color(0.55rem, #666);
        }
        span:nth-of-type(2){
          font-weight: 900;
          @include font-size-color(0.475rem, #9f9f9f);
        }
      }
    }
    .guess_city{                            // 定位到的城市
        @include fj;
        align-items: center;
        height: 1.8rem;
        padding: 0 0.45rem;
        border-top: 1px solid $bc;
        border-bottom: 2px solid $bc;
        @include font(0.75rem, 1.8rem);
        span:nth-of-type(1){
            color: $blue;
        }
        .arrow_right{
            @include width-height(.6rem, .6rem);
            // fill: #999;
            fill: red;
        }
    }

    /*========================
      热门城市
      ========================*/
    h4.city_title{
        color: #666;
        font-weight: 400;
        text-indent: 0.45rem;
        border-top: 2px solid $bc;
        border-bottom: 1px solid $bc;
        @include font(0.55rem, 1.45rem, "Helvetica Neue");

        // span{
        //     @include sc(0.475rem, #999);
        // }
    }
    #hot_city_container{                         
        background-color: #fff;
        margin-bottom: 0.4rem;
    }
    .citylistul{
        li{
            float: left;
            text-align: center;
            color: $blue;
            border-bottom: 0.025rem solid $bc;
            border-right: 0.025rem solid $bc;
            @include width-height(25%, 1.75rem);
            @include font(0.6rem, 1.75rem);
        }
        li:nth-of-type(4n){
            border-right: none;
        }
    }
    /*=============================
      按字符城市排序
      =============================*/
    .letter_classify_li{
        margin-bottom: 0.4rem;
        background-color: #fff;
        border-bottom: 1px solid $bc;
        .groupcity_name_container{
            li{
                color: #666;
            }
        }
    }
</style>