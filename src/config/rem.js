/**
 * @description init rem number
 * 
 * @author zouzhuqcom@163.com（邹柱）
 * @time 2020.04.01 21.16
 */
(function(document, window) {
    // 1. 获取整个文档对象
    var docElement = document.documentElement;      
    /* 2. 'orientationchange' in window 这个是判断在 window 对象中是否有 orientationchange 属性,因为 orientationchange
           会遇到兼容性问题, 有的浏览器不支持, 所以这边做了判断来决定是用 orientationchange 还是 resize */
    var resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
    // 3. 针对屏幕宽度设置不同的百分比 rem
    var recalc = function() {
                    var clientWidth = docElement.clientWidth;
                    if (!clientWidth) return;
                    docElement.style.fontSize = 20 * (clientWidth / 320) + 'px';
    };
    // 4. 浏览器是否支持事件监听
    if (!document.addEventListener) return;
    // 5. window 对象添加 resize 事件监听
    window.addEventListener(resizeEvent, recalc, false);
    // 6. window 对象添加 DOMContentLoaded 事件监听 
    document.addEventListener('DOMContentLoaded', recalc, false);
    // 从页面空白到展示出页面内容, 会触发 DOMContentLoaded 事件, 而这段时间就是HTML文档被加载和解析完成
})(document, window);