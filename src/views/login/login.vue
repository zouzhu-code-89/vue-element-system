<!--
    @fileoverview 登录页面
    
    @author zouzhuqcom@163.com (邹柱)
    @time 2020.04.02 23:38
-->
<template>
    <div class="loginContainer">
        <!-- 登录头部标题: 密码登录和验证码登录 -->
        <HeadTop :head-title="loginWay ? '登录':'密码登录'" goBack="true">
            <span slot="changeLoginType" class="change_login_type_img" @click="changeLoginWay"> <!-- 切换箭头 -->
                <i class="el-icon-sort"></i>
            </span>
        </HeadTop>

        <!-- 手机验证码登录表单 -->
        <form class="loginForm" v-if="loginWay">
            <!-- 
                1.输入手机号 : @param {phoneNumber} 绑定用户输入的电话号码 
                              @param {rightPhoneNumber} 号码格式是否正确，正确的情况下应用样式 right_phone_number
                              @param {computedTime} 验证码倒计数, 只有当等于 0 时，才重新显示发送验证码按钮
                              @func getVerifyCode 获取验证码函数
            -->
            <section class="input_container phone_number"> 
                <input type="text" placeholder="请输入11位手机号" maxlength="11" name="phone" v-model="phoneNumber">
                <button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">
                    获取验证码
                </button>
                <button @click.prevent v-show="computedTime">已发送({{computedTime}}s)</button>
            </section>
            <!-- 2.输入手机验证码 : @param {str} mobileCode 双向绑定用户输入的验证码 -->
            <section class="input_container">
                <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="mobileCode">
            </section>
        </form>

        <!-- 密码登录表单 -->
        <form class="loginForm" v-else>
            <!-- 
                1.用户名: lazy 会同步到 change 事件中, 只有聚焦和失去焦点才会更新数据
            -->
            <section class="input_container"> 
                <input type="text" placeholder="账号" v-model.lazy="userAccount">
            </section>
            <!-- 
                2.密码: 还有一个控制开发是否显示密码   @param {boolean} showPassword 表示状态,是否显示用户密码
                                                     @param {string} passWord 记录用户输入的值
            -->
            <section class="input_container"> 
                <input v-if="!showPassword" type="password" placeholder="密码"  v-model="passWord">
                <input v-else type="text" placeholder="密码" v-model="passWord">
                <div class="button_switch" :class="{change_to_text: showPassword}"> <!-- 控制开关按钮 -->
                    <div class="circle_button" :class="{trans_to_right: showPassword}" @click="changePassWordType"></div>
                    <span>abc</span>
                    <span>...</span>
                </div>
            </section>
            <!-- 
                3.图形验证码 @param {string} codeNumber 绑定当前输入的验证码
                            @param {string} captchaCodeImg 验证码图片地址
                            @func getCaptchaCode 更新新的验证码
             -->
            <section class="input_container captcha_code_container">
                <input type="text" placeholder="验证码" maxlength="4" v-model="codeNumber">
                <div class="img_change_img">
                    <img v-show="captchaCodeImg" :src="captchaCodeImg">
                    <div class="change_img" @click="getCaptchaCode">
                        <p>看不清</p>
                        <p>换一张</p>
                    </div>
                </div>
            </section>
        </form>

        <!-- 提示标语 -->
        <p class="login_tips">
            温馨提示 : 未注册过的账号, 登录时将自动注册
        </p>
        <p class="login_tips">
            注册过的用户可凭账号密码登录
        </p>
        <!-- 登录按钮 -->
        <div class="login_container" @click="mobileLogin">登录</div>
        <router-link to="/forget" class="to_forget" v-if="!loginWay">重置密码？</router-link>

        <!-- 用户登录提示组件: 对用户的输入做出反应 -->
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>


<script>
import HeadTop from "@/components/header/HeadTop"
import AlertTip from "@/components/common/AlertTip"
import {localapi, proapi, imgBaseUrl} from '@/config/env'
import {mapState, mapMutations} from 'vuex'
//import { mobileCode, checkExsis, sendLogin, getcaptchas, accountLogin } from '../../services/getData';

import { getcaptchas,accountLogin } from '../../services/getData';

export default {
    name: "login",
    components: {
        HeadTop,
        AlertTip
    },
    data(){
        return{
            loginWay: false,            // 登录方式，默认短信登陆
            showPassword: false,        // 是否显示密码
            phoneNumber: null,          // 电话号码
            mobileCode: null,           // 短信验证码
            validate_token: null,       // 获取短信时返回的验证码，登录时需要
            computedTime: 0,            // 验证码倒计时数字
            userInfo: null,             // 获取到用户的信息 : 如果用户登录成功，将保存用户信息 ------
            userAccount: null,          // 用户名
            passWord: null,             // 密码
            captchaCodeImg: null,       // 验证码地址
            codeNumber: null,           // 验证码
            showAlert: false,           // 显示提示组件
            alertText: null             // 提示的内容
        }
    },
    created() {
        /**
         * 页面未渲染时, 提前获取图形验证码
         */
        this.getCaptchaCode();
    },
    computed: {
        /**
         * 判断用户输入的手机号码格式是否正确, 因为关联了 data -> phoneNumber 
         * 所以它也有动态更新状态的效果
         */
        rightPhoneNumber: function (){
            return /^1\d{10}$/gi.test(this.phoneNumber)
        }
    },
    methods: {
        ...mapMutations([
            'RECORD_USERINFO',
        ]),
        changeLoginWay(){ 
            /**
             * 改变登录的方式
             *  */                                  
            this.loginWay = !this.loginWay;
        },
        changePassWordType(){
            /**
             * 是否显示密码
             *  */                               
            this.showPassword = !this.showPassword;
        },
        async getCaptchaCode(){ 
            /**
             * 获取图形验证码，线上环境使用固定的图片，生产环境使用真实的验证码
             **/
            let res = await getcaptchas();
            this.captchaCodeImg = res.code;
        },
        // async getVerifyCode(){
        //     /**
        //      * 获取短信验证码
        //      */
        //     if(this.rightPhoneNumber){              // 1.判断是否是有效的电话号码
        //         console.log(".... 开始获取验证码");
        //         this.computedTime = 30;             // 2.倒计时 30 秒
        //         this.timer = setInterval(()=>{
        //             this.computedTime--;
        //             if(this.computedTime == 0){
        //                 clearInterval(this.timer);
        //             }
        //         },1000);
        //     }
        //     // 3.判断用户是否存在
        //     let exsis = await checkExsis(this.phoneNumber, "mobile");  
        //     if(exsis.message){
        //         this.showAlert = true;
        //         this.alertText = exsis.message;
        //         return;
        //     }else if(!exsis.is_exists){
        //         this.showAlert = true;
        //         this.alertText = '您输入的手机号尚未绑定';
        //         return;
        //     }
        //     // 4.发送短信验证码
        //     let res = await mobileCode(this.phoneNumber);
        //     if(res.message){
        //         this.showAlert = true;
        //         this.alertText = res.message;
        //         return;
        //     }
        //     this.validate_token = res.validate_token;
        // },

        /**登录函数
         * @time  2020-04-12 
        *  @description 用户输入了用户名和密码、验证码点击确认后将触发这个函数、发送登录请求
        * 
        *  1.先检查登录的方式是账号密码登录还是短信登陆
        *  2.检查手机号码和验证码的正则表达式是否正确
        *  3.发送axios账号登陆请求,检查账号是否存在
        *  4.登录错误就将错误消息传递给提示组件
        *  5.登录成功获取用户信息，保存到Store，更新Store的登陆状态
        *  6.返回到首页
        */
        async mobileLogin(){                                
            // 判断登录方式
            if(this.loginWay){
                // 检测手机号码和验证码格式是否正确,错误则显示错误提示框showAlert
                if(!this.rightPhoneNumber){
                    this.showAlert = true;
                    this.alertText = '手机号码不正确';
                    return;
                }else if(!(/^\d{6}$/gi.test(this.mobileCode))){
                    this.showAlert = true;
                    this.alertText = '短信验证码不正确';
                    return;
                }
                // 手机验证码登录请求
                //this.userInfo = await sengLogin(this.mobileCode, this.phoneNumber, this.validate_token);
            }else{
                if(!this.userAccount){
                    this.showAlert = true;
                    this.alertText = '请输入手机号/邮箱/用户名';
                    return;
                }else if(!this.passWord){
                    this.showAlert = true;
                    this.alertText = '请输入密码';
                    return;
                }else if(!this.codeNumber){
                    this.showAlert = true;
                    this.alertText = '请输入验证码';
                    return;
                }
                // 账号密码登录请求
                this.userInfo = await accountLogin(this.userAccount, this.passWord, this.codeNumber);
            }
            console.log(this.userInfo);
            // 判断是否查询到该用户USER_ID,如果没有查到就将返回的错误消息传递给提示框组件
            if(!this.userInfo.user_id){
                this.showAlert = true;
                this.alertText = this.userInfo.message;
                // 如果登录失败则重新刷新验证码
                if(!this.loginWay) this.getCaptchaCode();
            }else{
                // 登录成功就将用户信息保存到Store，并由mutation将userinfo保存到localstorage
                this.RECORD_USERINFO(this.userInfo);
                // 返回到上一个页面首页
                this.$router.go(-1);
            }
        },
        closeTip(){
            this.showAlert = false;
        }
    }
}
</script>


<style lang="scss" scope>
    @import "../../style/mixin.scss";

    .loginContainer{
        padding-top: 1.95rem;
        p, span, input{
            @include font-size-color(.7rem, #666);
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    /*============================
      切换登录方式
      ============================*/
    .change_login_type_img i{
        transform: rotate(90deg);
        @include font-size-color(.8rem, #fff);
        padding: 0 .3rem;
    }
    /*============================
      登录表单
      ============================*/
    .loginForm{
        background-color: #fff;
        margin-top: .6rem;
        .input_container{
            width: 100%;
            padding: .6rem .8rem;
            border: 1px solid #f1f1f1;
            @include fj;
        }
    }
    // 手机验证码登录区域
    .phone_number{
        button{
            @include width-height(4rem, 1rem);
            border-radius: .1rem;
        }
    }
    /*=============================
      密码是否显示按钮
      =============================*/
    .button_switch{
        background-color: #ccc;
        float: rigth;
        display: flex;
        justify-content: center;
        @include width-height(2rem, .7rem);
        padding: 0 .2rem;
        border: 1px;
        border-radius: 0.5rem;
        position: relative;
        .circle_button{
            transition: all .3s;
            position: absolute;
            top: -0.2rem;
            z-index: 1;
            left: -0.3rem;
            @include width-height(1.2rem, 1.2rem);
            box-shadow: 0 0.026667rem 0.053333rem 0 rgba(0,0,0,.1);
            background-color: #f1f1f1;
            border-radius: 50%;
        }
        .trans_to_right{
            transform: translateX(1.3rem);
        }
        span{
            @include font-size-color(.45rem, #fff);
            transform: translateY(.05rem);
            line-height: .6rem;
        }
        span:nth-of-type(2){
            transform: translateY(-.08rem);
        }
    }
    .change_to_text{    // 触发按钮之后的样式
        background-color: #4cd964;
    }
    .to_forget{
        float: right;
        @include font-size-color(.6rem, #3b95e9);
        margin-right: .3rem;
    }
    /*=============================================
      验证码的样式
      =============================================*/
    .captcha_code_container{
        height: 2.2rem;
        .img_change_img{
            display: flex;
            align-items: center;
            img{
                @include width-height(3.5rem, 1.5rem);
                margin-right: .2rem;
            }
            .change_img{
                display: flex;
                flex-direction: column;
                flex-wrap: warp;
                width: 2rem;
                justify-content: center;
            }
            p{
                @include font-size-color(.55rem, #666);
            }
            p:nth-of-type(2){
                color: #3b95e9;
                margin-top: .2rem;
            }
        }
    }
    /*=======================================
      登录区域
      =======================================*/
    p.login_tips{    
        @include font-size-color(.5rem, red);   // 登录提示
        padding: .4rem .6rem;
        line-height: .5rem;
        a{
            color: #3b95e9;
        }
    }
    .login_container{               
        margin: 0 .5rem 1rem;     
        @include font-size-color(.7rem, #fff);  // 登录按钮
        background-color: #4cd964;
        padding: .5rem 0;
        border: 1px;
        border-radius: 0.15rem;
        text-align: center;
    }
    .button_switch{
        background-color: #ccc;
        display: flex;
        justify-content: center;
        @include width-height(2rem, .7rem);
        padding: 0 .2rem;
        border: 1px;
        border-radius: 0.5rem;
        position: relative;
        .circle_button{
            transition: all .3s;
            position: absolute;
            top: -0.2rem;
            z-index: 1;
            left: -0.3rem;
            @include width-height(1.2rem, 1.2rem);
            box-shadow: 0 0.026667rem 0.053333rem 0 rgba(0,0,0,.1);
            background-color: #f1f1f1;
            border-radius: 50%;
        }
        .trans_to_right{
            transform: translateX(1.3rem);
        }
        span{
            @include font-size-color(.45rem, #fff);
            transform: translateY(.05rem);
            line-height: .6rem;
        }
        span:nth-of-type(2){
            transform: translateY(-.08rem);
        }
    }
    .change_to_text{
        background-color: #4cd964;
    }
    .to_forget{
        float: right;
        @include font-size-color(.6rem, #3b95e9);
        margin-right: .3rem;
    }
</style>