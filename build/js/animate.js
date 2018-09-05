$(document).ready(function () {
    app.initialize();
});

appAnimate = {
    delay: 200,
    wrapperSelector: '.js-an__hover',
    svgSelector: '.js-an__svg',

    initialize: function () {
        $(this.wrapperSelector).each(function ($wrapper) {
            var $svg = $wrapper.find(appAnimate.svgSelector);
            if ($svg.length === 0 || typeof $svg.data('type') === 'undefined') {
                return;
            }
            var timerIn, timerOut;
            $wrapper.hover(function () {
                // mouse in
                clearTimeout(timerOut);
                if ($svg.hasClass('_animated')) {
                    timerIn = setTimeout(appAnimate.animateIn, 200, $svg);
                } else {
                    appAnimate.animateIn($svg);
                }
            }, function () {
                // mouse out
                clearTimeout(timerIn);
                if ($svg.hasClass('_animated')) {
                    timerOut = setTimeout(appAnimate.animateOut, 200, $svg);
                } else {
                    appAnimate.animateOut($svg);
                }
            });
        });
    },

    animateIn: function ($svg) {
        if ($svg.hasClass('_up')) {
            return;
        }
        $svg.addClass('_animated');
        appAnimate.animateSvgIn($svg[0], $svg.data('type'))
        $svg.addClass('_up');
        $svg.removeClass('_animated');
    },

    animateOut: function ($svg) {
        if (!$svg.hasClass('_up')) {
            return;
        }
        $svg.addClass('_animated');
        appAnimate.animateSvgOut($svg[0], $svg.data('type'))
        $svg.removeClass('_up');
        $svg.removeClass('_animated');
    },
    
    animateSvgIn: function (svg, type) {
        console.log(type);
        switch (type) {
            case 'price':
                break;
        }
    },
    
    animateSvgOut: function (svg, type) {
        console.log(type);
        switch (type) {
            case 'price':
                break;
        }
    },
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhbmltYXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIGFwcC5pbml0aWFsaXplKCk7XHJcbn0pO1xyXG5cclxuYXBwQW5pbWF0ZSA9IHtcclxuICAgIGRlbGF5OiAyMDAsXHJcbiAgICB3cmFwcGVyU2VsZWN0b3I6ICcuanMtYW5fX2hvdmVyJyxcclxuICAgIHN2Z1NlbGVjdG9yOiAnLmpzLWFuX19zdmcnLFxyXG5cclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHRoaXMud3JhcHBlclNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uICgkd3JhcHBlcikge1xyXG4gICAgICAgICAgICB2YXIgJHN2ZyA9ICR3cmFwcGVyLmZpbmQoYXBwQW5pbWF0ZS5zdmdTZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIGlmICgkc3ZnLmxlbmd0aCA9PT0gMCB8fCB0eXBlb2YgJHN2Zy5kYXRhKCd0eXBlJykgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHRpbWVySW4sIHRpbWVyT3V0O1xyXG4gICAgICAgICAgICAkd3JhcHBlci5ob3ZlcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBtb3VzZSBpblxyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyT3V0KTtcclxuICAgICAgICAgICAgICAgIGlmICgkc3ZnLmhhc0NsYXNzKCdfYW5pbWF0ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVySW4gPSBzZXRUaW1lb3V0KGFwcEFuaW1hdGUuYW5pbWF0ZUluLCAyMDAsICRzdmcpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHBBbmltYXRlLmFuaW1hdGVJbigkc3ZnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gbW91c2Ugb3V0XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXJJbik7XHJcbiAgICAgICAgICAgICAgICBpZiAoJHN2Zy5oYXNDbGFzcygnX2FuaW1hdGVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lck91dCA9IHNldFRpbWVvdXQoYXBwQW5pbWF0ZS5hbmltYXRlT3V0LCAyMDAsICRzdmcpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHBBbmltYXRlLmFuaW1hdGVPdXQoJHN2Zyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBhbmltYXRlSW46IGZ1bmN0aW9uICgkc3ZnKSB7XHJcbiAgICAgICAgaWYgKCRzdmcuaGFzQ2xhc3MoJ191cCcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgJHN2Zy5hZGRDbGFzcygnX2FuaW1hdGVkJyk7XHJcbiAgICAgICAgYXBwQW5pbWF0ZS5hbmltYXRlU3ZnSW4oJHN2Z1swXSwgJHN2Zy5kYXRhKCd0eXBlJykpXHJcbiAgICAgICAgJHN2Zy5hZGRDbGFzcygnX3VwJyk7XHJcbiAgICAgICAgJHN2Zy5yZW1vdmVDbGFzcygnX2FuaW1hdGVkJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGFuaW1hdGVPdXQ6IGZ1bmN0aW9uICgkc3ZnKSB7XHJcbiAgICAgICAgaWYgKCEkc3ZnLmhhc0NsYXNzKCdfdXAnKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRzdmcuYWRkQ2xhc3MoJ19hbmltYXRlZCcpO1xyXG4gICAgICAgIGFwcEFuaW1hdGUuYW5pbWF0ZVN2Z091dCgkc3ZnWzBdLCAkc3ZnLmRhdGEoJ3R5cGUnKSlcclxuICAgICAgICAkc3ZnLnJlbW92ZUNsYXNzKCdfdXAnKTtcclxuICAgICAgICAkc3ZnLnJlbW92ZUNsYXNzKCdfYW5pbWF0ZWQnKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGFuaW1hdGVTdmdJbjogZnVuY3Rpb24gKHN2ZywgdHlwZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHR5cGUpO1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdwcmljZSc6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBhbmltYXRlU3ZnT3V0OiBmdW5jdGlvbiAoc3ZnLCB0eXBlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codHlwZSk7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3ByaWNlJzpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbn0iXSwiZmlsZSI6ImFuaW1hdGUuanMifQ==
