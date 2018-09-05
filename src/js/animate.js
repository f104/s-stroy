$(document).ready(function () {
    if ($(window).outerWidth() > appConfig.breakpoint.lg) {
        appAnimate.initialize();
    }
});

appAnimate = {
    delay: 300,
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
                var r = el.children()[1];
                r.animate(300, '<>', 0).width(192);
                g.animate(600, '<', 0).x(100);
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
                var r = el.children()[1];
                r.animate(600, '<>', 0).width(90);
                g.animate(300, '>', 0).x(0);
                break;
        }
    },
}