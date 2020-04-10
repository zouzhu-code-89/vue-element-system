<!--
    @fileoverview 用户输入提示警告组件
    @author zouzhuqcom@163.com (邹柱)
    @time 2020.04.04 15.33
-->
<template>
    <div class="alert_container">
        <section class="tip_text_container">
            <!-- 感叹号警示图标 -->
            <div class="tip_icon">
                <span></span>
                <span></span>
            </div>
            <!-- 提示文字 -->
            <p class="tip_text">{{ alertText }}</p>
            <!-- 确认按钮 -->
            <div class="confrim" @click="closeTip">确认</div>
        </section>
    </div>
</template>


<script>
export default {
    name: "alert-tip",
    data(){
        return{
            positionY: 0,         
            timer: null,
        }
    },
    mounted() {
        
    },
    props: ['alertText'],
    methods: {
        closeTip(){
            this.$emit('closeTip');
        }
    }
}
</script>


<style lang="scss" scope>
    @import "../../style/mixin";

    @keyframes tipMove{
        0%   { transform: scale(1) }
        35%  { transform: scale(0.8) }
        70%  { transform: scale(1.1) }
        100% { transform: scale(1) }
    }
    .alert_container{           // 遮罩层
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 200;
    }
    .tip_text_container{        // 内容层
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -6rem;
        margin-left: -6rem;
        width: 12rem;
        animation: tipMove .4s;
        background-color: rgba(255,255,255,1);
        border: 1px;
        padding-top: 0.6rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 0.25rem;
        .tip_icon{              // 警告图标
            @include width-height(3rem, 3rem);
            border: 0.15rem solid #f8cb86;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            span:nth-of-type(1){
                @include width-height(.12rem, 1.5rem);
                background-color: #f8cb86;
            }
            span:nth-of-type(2){
                @include width-height(0.2rem, .2rem);
                border: 1px;
                border-radius: 50%;
                margin-top: .2rem;
                background-color: #f8cb86;
            }
        }
        .tip_text{             // 警告提示文字
            @include font-size-color(0.7rem, #333);
            line-height: 0.9rem;
            text-align: center;
            margin-top: 0.8rem;
            padding: 0 0.4rem;
        }
        .confrim{               // 确认按钮
            @include width-height(0.8rem, #fff);
            font-weight: bold;
            margin-top: 0.8rem;
            background-color: #4cd964;
            width: 100%;
            text-align: center;
            line-height: 1.8rem;
            border: 1px;
            border-bottom-left-radius: 0.25rem;
            border-bottom-right-radius: 0.25rem;
        }
    }
</style>