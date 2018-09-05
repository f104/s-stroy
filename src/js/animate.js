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