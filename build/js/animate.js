$(document).ready(function () {
    if ($(window).outerWidth() > appConfig.breakpoint.lg) {
        appAnimate.initialize();
    }
});

appAnimate = {
    delay: 150,
    wrapperSelector: '.js-an__hover',
    svgSelector: '.js-an__svg',

    initialize: function () {
        $(this.wrapperSelector).each(function () {
            var $svg = $(this).find(appAnimate.svgSelector);
            if ($svg.length === 0 || typeof $svg.data('type') === 'undefined') {
                return;
            }
            var timerIn, timerOut;
            $(this).hover(function () {
                // mouse in
                clearTimeout(timerOut);
                timerIn = setTimeout(appAnimate.animateIn, appAnimate.delay, $svg);
            }, function () {
                // mouse out
                clearTimeout(timerIn);
                appAnimate.animateOut($svg);
            });
        });
    },

    animateIn: function ($svg) {
        if ($svg.hasClass('_up')) {
            return;
        }
        $svg.addClass('_animated');
        appAnimate.animateSvgIn($svg[0], $svg.data('type'));
        $svg.addClass('_up');
        $svg.removeClass('_animated');
    },

    animateOut: function ($svg) {
        if (!$svg.hasClass('_up')) {
            return;
        }
        $svg.addClass('_animated');
        appAnimate.animateSvgOut($svg[0], $svg.data('type'));
        $svg.removeClass('_up');
        $svg.removeClass('_animated');
    },

    animateSvgIn: function (svg, type) {
        var el = SVG(svg);
        switch (type) {
            case 'price':
                var g = el.children()[0];
                var o = g.children()[1];
                g.animate(500, '<>', 0).x(127);
                o.animate(500, '<>', 0).rotate(170);
                break;
            case 'delivery':
                var g = el.children()[0];
                var s = g.children()[1]; // шлейф
                var r = el.children()[1]; // дорога
                r.animate(300, '<>', 0).width(192);
                g.animate(600, '<', 0).x(100);
                s.animate(200, '<', 0).opacity(1);
                break;
            case 'clock':
                var g = el.children()[0];
                var s = g.children()[1]; // часы
                var r = el.children()[1]; // дорога
                r.animate(300, '<>', 0).width(192);
                g.animate(600, '<', 0).x(100);
                s.animate(600, '<', 0).rotate(360);
                break;
        }
    },

    animateSvgOut: function (svg, type) {
        var el = SVG(svg);
        switch (type) {
            case 'price':
                var g = el.children()[0];
                var o = g.children()[1];
                g.animate(500, '<>', 0).x(0);
                o.rotate(0).animate(500, '<>', 0).rotate(170).reverse()
                break;
            case 'delivery':
                var g = el.children()[0];
                var s = g.children()[1]; // шлейф
                var r = el.children()[1]; // дорога
                r.animate(600, '<>', 0).width(90);
                g.animate(300, '>', 0).x(0);
                s.animate(200, '<', 0).opacity(0);
                break;
            case 'clock':
                var g = el.children()[0];
                var s = g.children()[1];
                var r = el.children()[1]; // дорога
                r.animate(600, '<>', 0).width(90);
                g.animate(300, '>', 0).x(0);
                s.rotate(0).animate(300, '<', 0).rotate(360).reverse();
                break;
        }
    },
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhbmltYXRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICgkKHdpbmRvdykub3V0ZXJXaWR0aCgpID4gYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcpIHtcclxuICAgICAgICBhcHBBbmltYXRlLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5hcHBBbmltYXRlID0ge1xyXG4gICAgZGVsYXk6IDE1MCxcclxuICAgIHdyYXBwZXJTZWxlY3RvcjogJy5qcy1hbl9faG92ZXInLFxyXG4gICAgc3ZnU2VsZWN0b3I6ICcuanMtYW5fX3N2ZycsXHJcblxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQodGhpcy53cmFwcGVyU2VsZWN0b3IpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHN2ZyA9ICQodGhpcykuZmluZChhcHBBbmltYXRlLnN2Z1NlbGVjdG9yKTtcclxuICAgICAgICAgICAgaWYgKCRzdmcubGVuZ3RoID09PSAwIHx8IHR5cGVvZiAkc3ZnLmRhdGEoJ3R5cGUnKSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgdGltZXJJbiwgdGltZXJPdXQ7XHJcbiAgICAgICAgICAgICQodGhpcykuaG92ZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gbW91c2UgaW5cclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lck91dCk7XHJcbiAgICAgICAgICAgICAgICB0aW1lckluID0gc2V0VGltZW91dChhcHBBbmltYXRlLmFuaW1hdGVJbiwgYXBwQW5pbWF0ZS5kZWxheSwgJHN2Zyk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIG1vdXNlIG91dFxyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySW4pO1xyXG4gICAgICAgICAgICAgICAgYXBwQW5pbWF0ZS5hbmltYXRlT3V0KCRzdmcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgYW5pbWF0ZUluOiBmdW5jdGlvbiAoJHN2Zykge1xyXG4gICAgICAgIGlmICgkc3ZnLmhhc0NsYXNzKCdfdXAnKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRzdmcuYWRkQ2xhc3MoJ19hbmltYXRlZCcpO1xyXG4gICAgICAgIGFwcEFuaW1hdGUuYW5pbWF0ZVN2Z0luKCRzdmdbMF0sICRzdmcuZGF0YSgndHlwZScpKTtcclxuICAgICAgICAkc3ZnLmFkZENsYXNzKCdfdXAnKTtcclxuICAgICAgICAkc3ZnLnJlbW92ZUNsYXNzKCdfYW5pbWF0ZWQnKTtcclxuICAgIH0sXHJcblxyXG4gICAgYW5pbWF0ZU91dDogZnVuY3Rpb24gKCRzdmcpIHtcclxuICAgICAgICBpZiAoISRzdmcuaGFzQ2xhc3MoJ191cCcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgJHN2Zy5hZGRDbGFzcygnX2FuaW1hdGVkJyk7XHJcbiAgICAgICAgYXBwQW5pbWF0ZS5hbmltYXRlU3ZnT3V0KCRzdmdbMF0sICRzdmcuZGF0YSgndHlwZScpKTtcclxuICAgICAgICAkc3ZnLnJlbW92ZUNsYXNzKCdfdXAnKTtcclxuICAgICAgICAkc3ZnLnJlbW92ZUNsYXNzKCdfYW5pbWF0ZWQnKTtcclxuICAgIH0sXHJcblxyXG4gICAgYW5pbWF0ZVN2Z0luOiBmdW5jdGlvbiAoc3ZnLCB0eXBlKSB7XHJcbiAgICAgICAgdmFyIGVsID0gU1ZHKHN2Zyk7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3ByaWNlJzpcclxuICAgICAgICAgICAgICAgIHZhciBnID0gZWwuY2hpbGRyZW4oKVswXTtcclxuICAgICAgICAgICAgICAgIHZhciBvID0gZy5jaGlsZHJlbigpWzFdO1xyXG4gICAgICAgICAgICAgICAgZy5hbmltYXRlKDUwMCwgJzw+JywgMCkueCgxMjcpO1xyXG4gICAgICAgICAgICAgICAgby5hbmltYXRlKDUwMCwgJzw+JywgMCkucm90YXRlKDE3MCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZGVsaXZlcnknOlxyXG4gICAgICAgICAgICAgICAgdmFyIGcgPSBlbC5jaGlsZHJlbigpWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHMgPSBnLmNoaWxkcmVuKClbMV07IC8vINGI0LvQtdC50YRcclxuICAgICAgICAgICAgICAgIHZhciByID0gZWwuY2hpbGRyZW4oKVsxXTsgLy8g0LTQvtGA0L7Qs9CwXHJcbiAgICAgICAgICAgICAgICByLmFuaW1hdGUoMzAwLCAnPD4nLCAwKS53aWR0aCgxOTIpO1xyXG4gICAgICAgICAgICAgICAgZy5hbmltYXRlKDYwMCwgJzwnLCAwKS54KDEwMCk7XHJcbiAgICAgICAgICAgICAgICBzLmFuaW1hdGUoMjAwLCAnPCcsIDApLm9wYWNpdHkoMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnY2xvY2snOlxyXG4gICAgICAgICAgICAgICAgdmFyIGcgPSBlbC5jaGlsZHJlbigpWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHMgPSBnLmNoaWxkcmVuKClbMV07IC8vINGH0LDRgdGLXHJcbiAgICAgICAgICAgICAgICB2YXIgciA9IGVsLmNoaWxkcmVuKClbMV07IC8vINC00L7RgNC+0LPQsFxyXG4gICAgICAgICAgICAgICAgci5hbmltYXRlKDMwMCwgJzw+JywgMCkud2lkdGgoMTkyKTtcclxuICAgICAgICAgICAgICAgIGcuYW5pbWF0ZSg2MDAsICc8JywgMCkueCgxMDApO1xyXG4gICAgICAgICAgICAgICAgcy5hbmltYXRlKDYwMCwgJzwnLCAwKS5yb3RhdGUoMzYwKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYW5pbWF0ZVN2Z091dDogZnVuY3Rpb24gKHN2ZywgdHlwZSkge1xyXG4gICAgICAgIHZhciBlbCA9IFNWRyhzdmcpO1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdwcmljZSc6XHJcbiAgICAgICAgICAgICAgICB2YXIgZyA9IGVsLmNoaWxkcmVuKClbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgbyA9IGcuY2hpbGRyZW4oKVsxXTtcclxuICAgICAgICAgICAgICAgIGcuYW5pbWF0ZSg1MDAsICc8PicsIDApLngoMCk7XHJcbiAgICAgICAgICAgICAgICBvLnJvdGF0ZSgwKS5hbmltYXRlKDUwMCwgJzw+JywgMCkucm90YXRlKDE3MCkucmV2ZXJzZSgpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZGVsaXZlcnknOlxyXG4gICAgICAgICAgICAgICAgdmFyIGcgPSBlbC5jaGlsZHJlbigpWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHMgPSBnLmNoaWxkcmVuKClbMV07IC8vINGI0LvQtdC50YRcclxuICAgICAgICAgICAgICAgIHZhciByID0gZWwuY2hpbGRyZW4oKVsxXTsgLy8g0LTQvtGA0L7Qs9CwXHJcbiAgICAgICAgICAgICAgICByLmFuaW1hdGUoNjAwLCAnPD4nLCAwKS53aWR0aCg5MCk7XHJcbiAgICAgICAgICAgICAgICBnLmFuaW1hdGUoMzAwLCAnPicsIDApLngoMCk7XHJcbiAgICAgICAgICAgICAgICBzLmFuaW1hdGUoMjAwLCAnPCcsIDApLm9wYWNpdHkoMCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnY2xvY2snOlxyXG4gICAgICAgICAgICAgICAgdmFyIGcgPSBlbC5jaGlsZHJlbigpWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHMgPSBnLmNoaWxkcmVuKClbMV07XHJcbiAgICAgICAgICAgICAgICB2YXIgciA9IGVsLmNoaWxkcmVuKClbMV07IC8vINC00L7RgNC+0LPQsFxyXG4gICAgICAgICAgICAgICAgci5hbmltYXRlKDYwMCwgJzw+JywgMCkud2lkdGgoOTApO1xyXG4gICAgICAgICAgICAgICAgZy5hbmltYXRlKDMwMCwgJz4nLCAwKS54KDApO1xyXG4gICAgICAgICAgICAgICAgcy5yb3RhdGUoMCkuYW5pbWF0ZSgzMDAsICc8JywgMCkucm90YXRlKDM2MCkucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxufSJdLCJmaWxlIjoiYW5pbWF0ZS5qcyJ9
