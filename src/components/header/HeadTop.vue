<!--
    @name : 头部组件
    @description : 包括用户登录注册, 当前登录的用户, 当前的城市相关信息都在头部组件上显示
    @author : zouzhuqcom@163.com（邹柱）
-->
<template>
    <header id='head-top'>
        <slot name="logo"></slot>     <!-- logo -->
        <slot name="search"></slot>   <!-- 搜索 -->

        <!-- 箭头: 代表页面回退, 进入店铺详情页, 将显示出来 -->
        <section class="head-goback" v-if="goBack" @click="$router.go(-1)">
            <i class="el-icon-arrow-left"></i>
        </section>

        <!-- 跳转到用户信息 || 登录页面 : 且只在首页显示, 如果用户已经登陆, 则显示用户图标-->
        <router-link :to="userInfo? '/profile':'login'" v-if="signinUp" class="head-login"> 
            <i class="el-icon-s-custom user_avatar" v-if="userInfo"></i>
            <span class="login_span" v-else>登录|注册</span>
        </router-link> 

        <!-- 头部标题: 长江大学西校区 -->
        <section class="title_head ellipsis" v-if="headTitle">  
            <span class="title_text">{{headTitle}}</span>
            <slot name="changeLoginType"></slot>  <!-- 登录方式切换 -->  
        </section>

        

        <slot name="edit"></slot>               <!-- 编辑 -->
        <slot name="msite-title"></slot>        <!-- 位置标题 -->
        <slot name="changecity"></slot>         <!-- 更改城市 -->
        <slot name="changeLogin"></slot>        <!-- 更改用户 -->
    </header>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'head-top',
  data () {
    return {

    }
  },
  mounted () {
    this.getUserInfo() // 获取用户信息
  },
  props: ['signinUp', 'headTitle', 'goBack'],
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ])
  }
}
</script>

<style lang="scss" scope>
    @import "../../style/mixin";

    #head-top{
        background-color: $blue;
        position: fixed;
        z-index: 100;
        left: 0;
        top: 0;
        @include width-height(100%, 1.95rem);
    }
    .head-goback{                                     // 1.箭头
        left: 0.4rem;
        @include width-height(0.6rem, 1rem);
        line-height: 2.2rem;
        margin-left: .4rem;
    }
    .head-login{                                      // 2.登录区域
        right: 0.55rem;
        @include font-size-color(0.65rem, #fff);
        @include top-buttom-center;
        .login_span{      // 登录注册 
          color: #fff;
        }
        .user_avatar{     // 用户图标
          fill: #fff;
          @include width-height(.8rem, .8rem);
        }
    }
    .title_head{                                      // 3.标题
        @include center;
        width: 50%;
        color: #fff;
        text-align: center;
        .title_text{    // 正文
            @include font-size-color(0.8rem, #fff);
            text-align: center;
            font-weight: bold;
        }
    }
</style>
