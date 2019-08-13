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
                s.animate(600, '<', 0).rotate(360, 18.417, 19.893);
                break;
            case 'avail':
                var d = 50; // distance
                var g1 = el.children()[0];
                var g2 = el.children()[1];
                var g3 = el.children()[2];
                var g4 = el.children()[3];
                var n = el.children()[4]; // цифры
                n.animate(300, '<>', 0).dx(d);
                g1.animate(300, '<>', 100).dx(d);
                g2.animate(300, '<>', 200).dx(d);
                g3.animate(300, '<>', 300).dx(d);
                g4.animate(300, '<>', 400).dx(d);
                break;
            case 'trolley':
                var d = 40; // distance
                var r = -15; // rotate
                var all = el.children()[0];
                var g = all.children()[0];
                var s = all.children()[1]; // шлейф
                var b = g.children()[1]; // коробка
                g.animate(200, '>', 0).rotate(r, 0, 60);
                s.animate(200, '>', 0).rotate(r, 0, 60);
                all.animate(500, '<>', 100).dx(d);
                s.children()[2].animate(150, '>', 100).opacity(1).animate(50, '>', 250).opacity(0);
                s.children()[1].animate(150, '>', 200).opacity(1).animate(50, '>', 150).opacity(0);
                s.children()[0].animate(150, '>', 300).opacity(1).animate(50, '>', 50).opacity(0);
                b.animate(100, '>', 600).dy(-10).animate(100, '>', 50).dy(10);
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
                s.rotate(0).animate(300, '<', 0).rotate(360, 18.417, 19.893).reverse();
                break;
            case 'avail':
                var d = 50; // distance
                var g1 = el.children()[0];
                var g2 = el.children()[1];
                var g3 = el.children()[2];
                var g4 = el.children()[3];
                var n = el.children()[4]; // цифры
                n.animate(300, '<>', 0).dx(-d);
                g1.animate(300, '<>', 0).dx(-d);
                g2.animate(300, '<>', 0).dx(-d);
                g3.animate(300, '<>', 0).dx(-d);
                g4.animate(300, '<>', 0).dx(-d);
                break;
            case 'trolley':
                var d = 40; // distance
                var all = el.children()[0];
                var g = all.children()[0];
                var s = all.children()[1]; // шлейф
                var b = g.children()[1]; // коробка
                all.animate(500, '<>', 100).dx(-d);
                g.animate(200, '>', 0).rotate(0, 0, 60);
                s.animate(200, '>', 0).rotate(0, 0, 60);
                break;
        }
    },
}