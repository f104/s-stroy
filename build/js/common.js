jQuery.expr[':'].focus = function (elem) {
    return elem === document.activeElement && (elem.type || elem.href);
};

$(document).ready(function () {
    app.initialize();
});

var app = {
    initialized: false,

    initialize: function () {
        if (navigator.userAgent.indexOf('Mac') > 0) {
            var elemHTML = document.getElementsByTagName('html')[0];
            elemHTML.className += " mac-os";
            if (navigator.userAgent.indexOf('Safari') > 0)
                elemHTML.className += " mac-safari";
            if (navigator.userAgent.indexOf('Chrome') > 0)
                elemHTML.className += " mac-chrome";
        }
        this.initSliders(); // must be first!
        this.initMenu();
        this.initFooter();
        this.initCut();
        this.initHover();
        this.initScrollbar();
        this.initCatalog();
        this.initSearch();
        this.initPopup();
        this.initFormLabel();
        this.initRegionSelect();
        this.initTabs();
        this.initQA();
        this.initIMmenu();
        this.initSelects();
        this.initMask();
        this.initRange();
        this.initFilter();
        this.initCreatePrice();
        $(window).on('resize', function () {
            app.initHover();
        });

        this.initialized = true;
    },

    initMenu: function () {
        $('.js-menu-toggler').on('click', function (e) {
            var href = $(this).attr('href');
            $('.js-menu-toggler[href="' + href + '"]').toggleClass('_active');
            $(href).toggleClass('_active');
            $('.js-menu._active').length == 0 ? $('.js-menu-overlay').hide() : $('.js-menu-overlay').show();
            return false;
        });
        $('.js-menu-overlay').on('click', function (e) {
            $('.js-menu-toggler, .js-menu').removeClass('_active');
            $(this).hide()
        });

        var $header = $('header');
        var headerHeight = $header.outerHeight();
        var q = 3;
        var action = 0;
        var pinHeader = function () {
            if (document.readyState !== "complete") {
                return;
            }
            if ($(this).scrollTop() > headerHeight * q) {
                if (action == 1) {
                    return;
                }
                action = 1;
                $header.stop();
                $('body').css({'padding-top': headerHeight});
                $header.css({'top': -headerHeight})
                        .addClass('_fixed')
                        .animate({'top': 0}, 1000);
            } else {
                if (action == 2 || !$header.hasClass('_fixed')) {
                    return;
                }
                action = 2;
                $header.animate({'top': -headerHeight}, "fast", function () {
                    $header.css({'top': 0});
                    $('body').css({'padding-top': 0});
                    $header.removeClass('_fixed');
                });
            }
        }
        if (window.innerWidth >= appConfig.breakpoint.lg) {
            window.onload = pinHeader();
            $(window).on('scroll', pinHeader);
        }
        $(window).on('resize', function () {
            if (window.innerWidth >= appConfig.breakpoint.lg) {
                headerHeight = $header.outerHeight();
                $(window).on('scroll', pinHeader);
                $('.js-menu').removeClass('_active');
                $('.js-menu-overlay').hide();
            } else {
                $(window).off('scroll', pinHeader);
                $('body').removeAttr('style');
                $header.removeClass('_fixed');
            }
        });
    },

    initFooter: function () {
        window.onload = function () {
            fixMenu();
        };
        $(window).on('resize', function () {
            fixMenu();
        });

        var fixMenu = function () {
            if ($(window).outerWidth() >= appConfig.breakpoint.md && $(window).outerWidth() < appConfig.breakpoint.lg) {
                $('.footer__menu-second').css('left', $('.footer__menu .menu > li:nth-child(3)').offset().left);
            } else {
                $('.footer__menu-second').css('left', 0);
            }
        }
    },

    initCut: function () {
        $('.js-cut').each(function () {
            $(this).find('.js-cut__trigger').on('click', function () {
                var $content = $(this).siblings('.js-cut__content'),
                        textShow = $(this).data('textshow') || 'show text',
                        textHide = $(this).data('texthide') || 'hide text';
                $(this).text($content.is(':visible') ? textShow : textHide);
                $(this).toggleClass('_opened');
                $(this).siblings('.js-cut__content').slideToggle();
                return false;
            })
        })
    },

    initSliders: function () {
        $('.js-main-slider').slick({
            dots: true,
            arrows: false,
            infinite: true,
            mobileFirst: true,
            responsive: [
                {
                    breakpoint: appConfig.breakpoint.md - 1,
                    settings: {
                        arrows: true,
                    }
                },
            ]
        });
        $('.js-slider').each(function () {
            var slides = $(this).data('slides');
            $(this).slick({
                dots: false,
                arrows: true,
                infinite: false,
                slidesToShow: slides.sm || 1,
                slidesToScroll: 1,
                centerMode: false,
//                variableWidth: true,
                mobileFirst: true,
                responsive: [
                    {
                        breakpoint: appConfig.breakpoint.md - 1,
                        settings: {
                            slidesToShow: slides.md || 1,
                        }
                    },
                    {
                        breakpoint: appConfig.breakpoint.lg - 1,
                        settings: {
                            slidesToShow: slides.lg || 1,
                        }
                    },
                ]
            })
        });
        $('.js-nav-slider__main').slick({
            dots: false,
            arrows: false,
            infinite: true,
            asNavFor: '.js-nav-slider__nav',
        });
        var responsive = {
            product: [
                {
                    breakpoint: appConfig.breakpoint.lg - 1,
                    settings: {
                        vertical: true,
                        verticalSwiping: true,
                        slidesToShow: 5,
                    }
                },
            ],
            content: [
                {
                    breakpoint: appConfig.breakpoint.md - 1,
                    settings: {
                        vertical: true,
                        verticalSwiping: true,
                        slidesToShow: 4,
                    }
                },
                {
                    breakpoint: appConfig.breakpoint.lg - 1,
                    settings: {
                        vertical: true,
                        verticalSwiping: true,
                        slidesToShow: 5,
                    }
                },
            ],
        }
        $('.js-nav-slider__nav').each(function () {
            $(this).slick({
                dots: false,
                arrows: true,
                infinite: true,
                asNavFor: '.js-nav-slider__main',
                slidesToShow: 3,
                slidesToScroll: 1,
                focusOnSelect: true,
                mobileFirst: true,
                responsive: responsive[$(this).data('responsive')],
            });
        });
    },

    initHover: function () {
        $('.js-hover').unbind('mouseenter mouseleave');
        if ($(window).outerWidth() >= appConfig.breakpoint.lg) {
            $('.js-hover').each(function () {
                var $this, $parent, $wrap, $hover, h, w;
                $(this).on('mouseenter', function () {
                    $this = $(this);
                    if ($this.hasClass('_hover')) {
                        return;
                    }
                    var offset = $this.offset();
                    $parent = $this.parent();
                    $parent.css({
                        'height': $parent.outerHeight()
                    });
                    h = $this.outerHeight();
                    w = $this.outerWidth();
                    $this.css({
                        'width': w,
                        'height': h,
                    });
                    $wrap = $('<div/>')
                            .appendTo('body')
                            .css({
                                'position': 'absolute',
                                'top': offset.top,
                                'left': offset.left,
                                'width': w,
                                'height': h,
                            });
                    $hover = $('<div/>').appendTo($wrap);
                    $hover.addClass('hover');
                    $this.appendTo($wrap).addClass('_hover');
                    $hover.animate({
                        top: '-10px',
                        left: '-10px',
                        right: '-10px',
                        bottom: '-10px',
                    }, 200);
                    $wrap.on('mouseleave', function () {
                        $hover.animate({
                            top: '0',
                            left: '0',
                            right: '0',
                            bottom: '0',
                        }, 200, function () {
                            $this
                                    .appendTo($parent)
                                    .removeClass('_hover')
                                    .removeAttr('style');
                            $parent.removeAttr('style');
                            $wrap.remove();
                        });
                    });
                });
            });
        }
    },

    initScrollbar: function () {
        $('.js-scrollbar').scrollbar();
    },

    initSearch: function () {
        var $input = $('.js-search-form__input');
        $input.on('focus', function () {
            $(this).siblings('.js-search-res').addClass('_active');
        });
        $input.on('blur', function () {
            $(this).siblings('.js-search-res').removeClass('_active');
        });
//        $(window).on('scroll', function () {
//            $input.blur();
//        });
    },

    initCatalog: function () {
        var isMobile = $(window).outerWidth() < appConfig.breakpoint.lg,
                $slide = $('.js-cm__slide'),
                $slideTrigger = $('.js-cm__slide__trigger'),
                $menu = $('.js-cm__menu'),
                $scrollbar = $('.js-cm__scrollbar'),
                $mobileToggler = $('.js-cm__mobile-toggler'),
                $secondLink = $('.js-cm__second-link'),
                $secondClose = $('.js-cm__menu-second__close'),
                $wrapper = $('.js-cm__menu-wrapper');

        var slideMenu = function () {
            $slide.slideToggle();
            $menu.toggleClass('_opened');
            return false;
        }

        var showSecond = function () {
            $(this).siblings('.js-cm__menu-second').addClass('_active');
            return false;
        }

        var hoverIcon = function () {
            var $icon = $(this).find('.sprite');
            $icon.addClass($icon.data('hover'));
        }

        var unhoverIcon = function () {
            var $icon = $(this).find('.sprite');
            $icon.removeClass($icon.data('hover'));
        }

        var initScrollbar = function () {
            $scrollbar.scrollbar();
            $scrollbar.css({'height': $(window).outerHeight() - $('.header').outerHeight()});
        }

        var destroyScrollbar = function () {
            $scrollbar.scrollbar('destroy');
        }

        if (!isMobile) {
            $slideTrigger.on('click', slideMenu);
            $secondLink.parent().hover(hoverIcon, unhoverIcon)
        } else {
            $secondLink.on('click', showSecond);
            initScrollbar();
        }
        $mobileToggler.on('click', function () {
            $wrapper.toggleClass('_active');
            return false;
        });
        $secondClose.on('click', function () {
            $(this).parents('.js-cm__menu-second').removeClass('_active');
            return false;
        });

        if (!isMobile && !$menu.hasClass('_opened')) {
            $slide.slideUp();
        }

        var checkMenu = function () {
            var newSize = $(window).outerWidth() < appConfig.breakpoint.lg;
            if (newSize != isMobile) {
                isMobile = newSize;
                if (isMobile) {
                    $slide.show();
                    $menu.addClass('_opened');
                    $slideTrigger.off('click', slideMenu);
                    $secondLink.on('click', showSecond);
                    $secondLink.off('mouseenter mouseleave');
                    $secondLink.parent().off('mouseenter mouseleave');
                    initScrollbar();
                } else {
                    $wrapper.removeClass('_active');
                    $slideTrigger.on('click', slideMenu);
                    $secondLink.off('click', showSecond);
                    $secondLink.parent().hover(hoverIcon, unhoverIcon);
                    destroyScrollbar();
                    if ($wrapper.hasClass('_absolute')) {
                        $menu.removeClass('_opened');
                        $slide.slideUp();
                    }
                }
            }
            if (newSize) {
                $scrollbar.css({'height': $(window).outerHeight() - $('.header').outerHeight()});
            }
        }
        $(window).on('resize', function () {
            checkMenu();
        });

        // toggle catalog list view
        $('.js-catalog-view-toggler').on('click', function () {
            $('.js-catalog-view-toggler').toggleClass('_active');
            $('.js-catalog-list .js-catalog-list__item, .js-catalog-list .js-catalog-list__item .catalog-list__item__content').toggleClass('_card');
            return false;
        });
    },

    initPopup: function () {
        var options = {
            baseClass: '_popup',
            autoFocus: false,
        };
        $('.js-popup').on('click', function () {
            $.fancybox.close();
        }).fancybox(options);
        if (window.location.hash) {
            var $cnt = $(window.location.hash);
            if ($cnt.length && $cnt.hasClass('popup')) {
                $.fancybox.open($cnt, options);
            }
        }
    },

    initFormLabel: function () {
        var $inputs = $('.js-form__label').find('input:not([required])');
        $inputs
                .on('focus', function () {
                    $(this).siblings('label').removeClass('form__label__empty');
                })
                .on('blur', function () {
                    if (!$(this).val()) {
                        $(this).siblings('label').addClass('form__label__empty');
                    }
                })
                .filter('[value=""], :not([value])').siblings('label').addClass('form__label__empty');
    },

    initRegionSelect: function () {
        $('.js-region-toggler').on('click', function () {
            var sel = $(this).data('toggle');
            if (sel) {
                $(sel).slideToggle();
            }
            return false;
        });
        $('.js-region-closer').on('click', function () {
            $(this).parents('.region-select').slideUp();
        });
        var $headerRegionSelect = $('.header .region-select');
        $(window).on('scroll', function () {
            if ($headerRegionSelect.is(':visible')) {
                $headerRegionSelect.slideUp();
            }
        });
    },

    initTabs: function () {
        var isMobile = $(window).outerWidth() < appConfig.breakpoint.md,
                $tabs = $('.js-tabs__tab'),
                $togglers = $('.js-tabs__tab .tabs__tab__toggler'),
                $content = $('.js-tabs__tab .tabs__tab__content');
        if (!$tabs.length)
            return;

        $togglers.on('click', function () {
            $(this).toggleClass('_opened');
            $(this).siblings('.tabs__tab__content').slideToggle();

        });

        var initEtabs = function () {
            var newSize = $(window).outerWidth() < appConfig.breakpoint.md;
            if (newSize != isMobile) {
                isMobile = newSize;
            }
            if (isMobile) {
                $tabs.show();
                $togglers.removeClass('_opened');
                $content.hide();
            } else {
                $tabs.hide();
                $content.show();
                $('.js-tabs').easytabs({
                    updateHash: false
                }).bind('easytabs:midTransition', function (event, $clicked, $targetPanel, settings) {
                    var $under = $(this).find('.js-tabs__under');
                    $under.css({
                        left: $clicked.parent().position().left,
                        width: $clicked.width(),
                    });
                });
                $tabs.filter('.active').show();
            }
        };

        var initUnder = function () {
            $('.js-tabs').each(function () {
                var $under = $(this).find('.js-tabs__under'),
                        $activeLink = $(this).find('.tabs__list .active a'),
                        top = $activeLink.outerHeight() - $under.outerHeight();
                if ($activeLink.length) {
                    $under.css({
                        display: 'block',
                        bottom: 'auto',
                        top: top,
                        left: $activeLink.parent().position().left,
                        width: $activeLink.width(),
                    });
                }
            });
        };

        $(window).on('load resize', initEtabs);
        $(window).on('load resize', initUnder);
    },

    initQA: function () {
        $('.js-qa:not(._active) .qa__a').slideUp();
        $('.js-qa').each(function () {
            var $this = $(this),
                    $toggler = $this.find('.qa__q .qa__h'),
                    $answer = $this.find('.qa__a');
            $toggler.on('click', function () {
                $this.toggleClass('_active');
                $answer.slideToggle();
            });
        });
    },

    initIMmenu: function () {
        $('.js-im-menu__toggler:not(._opened)').siblings('.js-im-menu__slide').slideUp();
        $('.js-im-menu__toggler').on('click', function () {
            $(this).toggleClass('_opened');
            $(this).siblings('.js-im-menu__slide').slideToggle();
        });
    },

    initSelects: function () {
        var isMobile = $(window).outerWidth() < appConfig.breakpoint.md,
                $selects = $('.js-select');
        if (!$selects.length)
            return;
        var init = function () {
            $selects.styler();
        };
        var destroy = function () {
            $selects.styler('destroy');
        };
        var refresh = function () {
            var newSize = $(window).outerWidth() < appConfig.breakpoint.md;
            if (newSize != isMobile) {
                isMobile = newSize;
                if (!isMobile) {
                    init();
                } else {
                    destroy();
                }
            }
        };

        if (!isMobile) {
            init();
        }
        $(window).on('resize', refresh);
    },

    initMask: function () {
        Inputmask.extendAliases({
            'numeric': {
                autoUnmask: true,
                showMaskOnHover: false,
                radixPoint: ",",
                groupSeparator: " ",
                digits: 0,
                allowMinus: false,
                autoGroup: true,
                rightAlign: false,
                unmaskAsNumber: true
            }
        });
        $('.js-mask').inputmask();
    },

    initRange: function () {
        $('.js-range').each(function () {
            var slider = $(this).find('.js-range__target')[0],
                    $inputs = $(this).find('input'),
                    from = $inputs.first()[0],
                    to = $inputs.last()[0];
            if (slider && from && to) {
                var minV = parseInt(from.value) || 0,
                        maxV = parseInt(to.value) || 0;
                var min = parseInt(from.dataset.min) || 0,
                        max = parseInt(to.dataset.max) || 0;
                noUiSlider.create(slider, {
                    start: [
                        minV,
                        maxV
                    ],
                    connect: true,
                    range: {
                        'min': min,
                        'max': max
                    }
                });
                var snapValues = [from, to];
                slider.noUiSlider.on('update', function (values, handle) {
                    snapValues[handle].value = Math.round(values[handle]);
                });
                from.addEventListener('change', function () {
                    slider.noUiSlider.set([this.value, null]);
                });
                from.addEventListener('blur', function () {
                    slider.noUiSlider.set([this.value, null]);
                });
                to.addEventListener('change', function () {
                    slider.noUiSlider.set([null, this.value]);
                });
                to.addEventListener('blur', function () {
                    slider.noUiSlider.set([null, this.value]);
                });
            }
        });

    },

    initFilter: function () {
        $('.js-filter-fieldset').each(function () {
            var $trigger = $(this).find('.js-filter-fieldset__trigger'),
                    $slide = $(this).find('.js-filter-fieldset__slide');
            $trigger.on('click', function () {
                $(this).toggleClass('_closed');
                $slide.slideToggle();
            });
        });

        var isMobile = $(window).outerWidth() < appConfig.breakpoint.lg,
                $scrollbar = $('.js-filter__scrollbar'),
                $mobileToggler = $('.js-filter__mobile-toggler'),
                $wrapper = $('.js-filter');

        var initScrollbar = function () {
            $scrollbar.scrollbar();
            $scrollbar.css({'height': $(window).outerHeight() - $('.header').outerHeight()});
        }

        var destroyScrollbar = function () {
            $scrollbar.scrollbar('destroy');
        }

        if (isMobile) {
            initScrollbar();
        }
        $mobileToggler.on('click', function () {
            $wrapper.toggleClass('_active');
            return false;
        });

        var check = function () {
            var newSize = $(window).outerWidth() < appConfig.breakpoint.lg;
            if (newSize != isMobile) {
                isMobile = newSize;
                if (isMobile) {
                    initScrollbar();
                } else {
                    $wrapper.removeClass('_active');
                    destroyScrollbar();
                }
            }
            if (newSize) {
                $scrollbar.css({'height': $(window).outerHeight() - $('.header').outerHeight()});
            }
        }
        $(window).on('resize', function () {
            check();
        });
    },

    initCreatePrice: function () {
        var $items = $('.js-create-price__item'),
                $parents = $('.js-create-price__parent'),
                $counter = $('.js-create-price__counter'),
                $all = $('.js-create-price__all'),
                $clear = $('.js-create-price__clear'),
                decl1 = ['Выбрана: ', 'Выбрано: ', 'Выбрано: '],
                decl2 = [' катeгория', ' категории', ' категорий'],
                isMobile = $(window).outerWidth() < appConfig.breakpoint.md;
        if ($items.length == 0)
            return;
        var count = function () {
            var total = $items.filter(':checked').length;
            $counter.text(app.getNumEnding(total, decl1) + total + app.getNumEnding(total, decl2));
        };
        count();
        $items.on('change', count);
        $parents.on('change', function () {
            var $childs = $(this).parents('.js-create-price__wrapper').find('.js-create-price__item');
            $childs.prop('checked', $(this).prop('checked'));
            count();
        });
        $all.on('click', function () {
            $items.prop('checked', true);
            $parents.prop('checked', true);
            count();
        })
        $clear.on('click', function () {
            $items.prop('checked', false);
            $parents.prop('checked', false);
            count();
        })
        // fix header
        var $head = $('.catalog-create-head._foot');
        var breakpoint, wHeight;
        fixInit = function () {
            breakpoint = $head.offset().top;
            wHeight = $(window).outerHeight();
            fixHead();
            $(window).on('scroll', fixHead);
        }
        fixHead = function () {
            if ($(window).scrollTop() + wHeight < breakpoint) {
                $head.addClass('_fixed');
            } else {
                $head.removeClass('_fixed');
            }
        }
        if (isMobile) {
            fixInit();
        }
        $(window).on('resize', function () {
            var newSize = $(window).outerWidth() < appConfig.breakpoint.lg;
            if (newSize != isMobile) {
                isMobile = newSize;
                if (isMobile) {
                    fixInit();
                } else {
                    $(window).off('scroll', fixHead);
                    $head.removeClass('_fixed');
                }
            }
        });
    },

    /**
     * Функция возвращает окончание для множественного числа слова на основании числа и массива окончаний
     * param  iNumber Integer Число на основе которого нужно сформировать окончание
     * param  aEndings Array Массив слов или окончаний для чисел (1, 4, 5),
     *         например ['яблоко', 'яблока', 'яблок']
     * return String
     * 
     * https://habrahabr.ru/post/105428/
     */
    getNumEnding: function (iNumber, aEndings) {
        var sEnding, i;
        iNumber = iNumber % 100;
        if (iNumber >= 11 && iNumber <= 19) {
            sEnding = aEndings[2];
        } else {
            i = iNumber % 10;
            switch (i)
            {
                case (1):
                    sEnding = aEndings[0];
                    break;
                case (2):
                case (3):
                case (4):
                    sEnding = aEndings[1];
                    break;
                default:
                    sEnding = aEndings[2];
            }
        }
        return sEnding;
    }

}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsialF1ZXJ5LmV4cHJbJzonXS5mb2N1cyA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICByZXR1cm4gZWxlbSA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiAoZWxlbS50eXBlIHx8IGVsZW0uaHJlZik7XHJcbn07XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuaW5pdGlhbGl6ZSgpO1xyXG59KTtcclxuXHJcbnZhciBhcHAgPSB7XHJcbiAgICBpbml0aWFsaXplZDogZmFsc2UsXHJcblxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01hYycpID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgZWxlbUhUTUwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaHRtbCcpWzBdO1xyXG4gICAgICAgICAgICBlbGVtSFRNTC5jbGFzc05hbWUgKz0gXCIgbWFjLW9zXCI7XHJcbiAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1NhZmFyaScpID4gMClcclxuICAgICAgICAgICAgICAgIGVsZW1IVE1MLmNsYXNzTmFtZSArPSBcIiBtYWMtc2FmYXJpXCI7XHJcbiAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZScpID4gMClcclxuICAgICAgICAgICAgICAgIGVsZW1IVE1MLmNsYXNzTmFtZSArPSBcIiBtYWMtY2hyb21lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5pdFNsaWRlcnMoKTsgLy8gbXVzdCBiZSBmaXJzdCFcclxuICAgICAgICB0aGlzLmluaXRNZW51KCk7XHJcbiAgICAgICAgdGhpcy5pbml0Rm9vdGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q3V0KCk7XHJcbiAgICAgICAgdGhpcy5pbml0SG92ZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRTY3JvbGxiYXIoKTtcclxuICAgICAgICB0aGlzLmluaXRDYXRhbG9nKCk7XHJcbiAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XHJcbiAgICAgICAgdGhpcy5pbml0UG9wdXAoKTtcclxuICAgICAgICB0aGlzLmluaXRGb3JtTGFiZWwoKTtcclxuICAgICAgICB0aGlzLmluaXRSZWdpb25TZWxlY3QoKTtcclxuICAgICAgICB0aGlzLmluaXRUYWJzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0UUEoKTtcclxuICAgICAgICB0aGlzLmluaXRJTW1lbnUoKTtcclxuICAgICAgICB0aGlzLmluaXRTZWxlY3RzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0TWFzaygpO1xyXG4gICAgICAgIHRoaXMuaW5pdFJhbmdlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RmlsdGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q3JlYXRlUHJpY2UoKTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXBwLmluaXRIb3ZlcigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdE1lbnU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtbWVudS10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgICAgJCgnLmpzLW1lbnUtdG9nZ2xlcltocmVmPVwiJyArIGhyZWYgKyAnXCJdJykudG9nZ2xlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgJChocmVmKS50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKCcuanMtbWVudS5fYWN0aXZlJykubGVuZ3RoID09IDAgPyAkKCcuanMtbWVudS1vdmVybGF5JykuaGlkZSgpIDogJCgnLmpzLW1lbnUtb3ZlcmxheScpLnNob3coKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5qcy1tZW51LW92ZXJsYXknKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAkKCcuanMtbWVudS10b2dnbGVyLCAuanMtbWVudScpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQodGhpcykuaGlkZSgpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciAkaGVhZGVyID0gJCgnaGVhZGVyJyk7XHJcbiAgICAgICAgdmFyIGhlYWRlckhlaWdodCA9ICRoZWFkZXIub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgICB2YXIgcSA9IDM7XHJcbiAgICAgICAgdmFyIGFjdGlvbiA9IDA7XHJcbiAgICAgICAgdmFyIHBpbkhlYWRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09IFwiY29tcGxldGVcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLnNjcm9sbFRvcCgpID4gaGVhZGVySGVpZ2h0ICogcSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gMTtcclxuICAgICAgICAgICAgICAgICRoZWFkZXIuc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLmNzcyh7J3BhZGRpbmctdG9wJzogaGVhZGVySGVpZ2h0fSk7XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLmNzcyh7J3RvcCc6IC1oZWFkZXJIZWlnaHR9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ19maXhlZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hbmltYXRlKHsndG9wJzogMH0sIDEwMDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PSAyIHx8ICEkaGVhZGVyLmhhc0NsYXNzKCdfZml4ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGFjdGlvbiA9IDI7XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLmFuaW1hdGUoeyd0b3AnOiAtaGVhZGVySGVpZ2h0fSwgXCJmYXN0XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaGVhZGVyLmNzcyh7J3RvcCc6IDB9KTtcclxuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKHsncGFkZGluZy10b3AnOiAwfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnX2ZpeGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcpIHtcclxuICAgICAgICAgICAgd2luZG93Lm9ubG9hZCA9IHBpbkhlYWRlcigpO1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIHBpbkhlYWRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlckhlaWdodCA9ICRoZWFkZXIub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgcGluSGVhZGVyKTtcclxuICAgICAgICAgICAgICAgICQoJy5qcy1tZW51JykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICQoJy5qcy1tZW51LW92ZXJsYXknKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykub2ZmKCdzY3JvbGwnLCBwaW5IZWFkZXIpO1xyXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdfZml4ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0Rm9vdGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZml4TWVudSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZpeE1lbnUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIGZpeE1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykub3V0ZXJXaWR0aCgpID49IGFwcENvbmZpZy5icmVha3BvaW50Lm1kICYmICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5sZykge1xyXG4gICAgICAgICAgICAgICAgJCgnLmZvb3Rlcl9fbWVudS1zZWNvbmQnKS5jc3MoJ2xlZnQnLCAkKCcuZm9vdGVyX19tZW51IC5tZW51ID4gbGk6bnRoLWNoaWxkKDMpJykub2Zmc2V0KCkubGVmdCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuZm9vdGVyX19tZW51LXNlY29uZCcpLmNzcygnbGVmdCcsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0Q3V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLWN1dCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5qcy1jdXRfX3RyaWdnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGNvbnRlbnQgPSAkKHRoaXMpLnNpYmxpbmdzKCcuanMtY3V0X19jb250ZW50JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTaG93ID0gJCh0aGlzKS5kYXRhKCd0ZXh0c2hvdycpIHx8ICdzaG93IHRleHQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0SGlkZSA9ICQodGhpcykuZGF0YSgndGV4dGhpZGUnKSB8fCAnaGlkZSB0ZXh0JztcclxuICAgICAgICAgICAgICAgICQodGhpcykudGV4dCgkY29udGVudC5pcygnOnZpc2libGUnKSA/IHRleHRTaG93IDogdGV4dEhpZGUpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmpzLWN1dF9fY29udGVudCcpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFNsaWRlcnM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtbWFpbi1zbGlkZXInKS5zbGljayh7XHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IGFwcENvbmZpZy5icmVha3BvaW50Lm1kIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJvd3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5qcy1zbGlkZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHNsaWRlcyA9ICQodGhpcykuZGF0YSgnc2xpZGVzJyk7XHJcbiAgICAgICAgICAgICQodGhpcykuc2xpY2soe1xyXG4gICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhcnJvd3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IHNsaWRlcy5zbSB8fCAxLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZSxcclxuLy8gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiBzbGlkZXMubWQgfHwgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiBhcHBDb25maWcuYnJlYWtwb2ludC5sZyAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IHNsaWRlcy5sZyB8fCAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcuanMtbmF2LXNsaWRlcl9fbWFpbicpLnNsaWNrKHtcclxuICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgICAgICBhc05hdkZvcjogJy5qcy1uYXYtc2xpZGVyX19uYXYnLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciByZXNwb25zaXZlID0ge1xyXG4gICAgICAgICAgICBwcm9kdWN0OiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN3aXBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogNSxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBjb250ZW50OiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN3aXBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogNCxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IGFwcENvbmZpZy5icmVha3BvaW50LmxnIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWxTd2lwaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDUsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnLmpzLW5hdi1zbGlkZXJfX25hdicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNsaWNrKHtcclxuICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhc05hdkZvcjogJy5qcy1uYXYtc2xpZGVyX19tYWluJyxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMyxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgZm9jdXNPblNlbGVjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogcmVzcG9uc2l2ZVskKHRoaXMpLmRhdGEoJ3Jlc3BvbnNpdmUnKV0sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0SG92ZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtaG92ZXInKS51bmJpbmQoJ21vdXNlZW50ZXIgbW91c2VsZWF2ZScpO1xyXG4gICAgICAgIGlmICgkKHdpbmRvdykub3V0ZXJXaWR0aCgpID49IGFwcENvbmZpZy5icmVha3BvaW50LmxnKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1ob3ZlcicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICR0aGlzLCAkcGFyZW50LCAkd3JhcCwgJGhvdmVyLCBoLCB3O1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkdGhpcyA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0aGlzLmhhc0NsYXNzKCdfaG92ZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSAkdGhpcy5vZmZzZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAkcGFyZW50ID0gJHRoaXMucGFyZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHBhcmVudC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJHBhcmVudC5vdXRlckhlaWdodCgpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaCA9ICR0aGlzLm91dGVySGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdyA9ICR0aGlzLm91dGVyV2lkdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiB3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogaCxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAkd3JhcCA9ICQoJzxkaXYvPicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJ2JvZHknKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndG9wJzogb2Zmc2V0LnRvcCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbGVmdCc6IG9mZnNldC5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6IHcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6IGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAkaG92ZXIgPSAkKCc8ZGl2Lz4nKS5hcHBlbmRUbygkd3JhcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhvdmVyLmFkZENsYXNzKCdob3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmFwcGVuZFRvKCR3cmFwKS5hZGRDbGFzcygnX2hvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhvdmVyLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICctMTBweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICctMTBweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAnLTEwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3R0b206ICctMTBweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcclxuICAgICAgICAgICAgICAgICAgICAkd3JhcC5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGhvdmVyLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDIwMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKCRwYXJlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnX2hvdmVyJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcGFyZW50LnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkd3JhcC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0U2Nyb2xsYmFyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLXNjcm9sbGJhcicpLnNjcm9sbGJhcigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0U2VhcmNoOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyICRpbnB1dCA9ICQoJy5qcy1zZWFyY2gtZm9ybV9faW5wdXQnKTtcclxuICAgICAgICAkaW5wdXQub24oJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuanMtc2VhcmNoLXJlcycpLmFkZENsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGlucHV0Lm9uKCdibHVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuanMtc2VhcmNoLXJlcycpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgfSk7XHJcbi8vICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICAgICAkaW5wdXQuYmx1cigpO1xyXG4vLyAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRDYXRhbG9nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGlzTW9iaWxlID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50LmxnLFxyXG4gICAgICAgICAgICAgICAgJHNsaWRlID0gJCgnLmpzLWNtX19zbGlkZScpLFxyXG4gICAgICAgICAgICAgICAgJHNsaWRlVHJpZ2dlciA9ICQoJy5qcy1jbV9fc2xpZGVfX3RyaWdnZXInKSxcclxuICAgICAgICAgICAgICAgICRtZW51ID0gJCgnLmpzLWNtX19tZW51JyksXHJcbiAgICAgICAgICAgICAgICAkc2Nyb2xsYmFyID0gJCgnLmpzLWNtX19zY3JvbGxiYXInKSxcclxuICAgICAgICAgICAgICAgICRtb2JpbGVUb2dnbGVyID0gJCgnLmpzLWNtX19tb2JpbGUtdG9nZ2xlcicpLFxyXG4gICAgICAgICAgICAgICAgJHNlY29uZExpbmsgPSAkKCcuanMtY21fX3NlY29uZC1saW5rJyksXHJcbiAgICAgICAgICAgICAgICAkc2Vjb25kQ2xvc2UgPSAkKCcuanMtY21fX21lbnUtc2Vjb25kX19jbG9zZScpLFxyXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIgPSAkKCcuanMtY21fX21lbnUtd3JhcHBlcicpO1xyXG5cclxuICAgICAgICB2YXIgc2xpZGVNZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2xpZGUuc2xpZGVUb2dnbGUoKTtcclxuICAgICAgICAgICAgJG1lbnUudG9nZ2xlQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNob3dTZWNvbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJy5qcy1jbV9fbWVudS1zZWNvbmQnKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaG92ZXJJY29uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJGljb24gPSAkKHRoaXMpLmZpbmQoJy5zcHJpdGUnKTtcclxuICAgICAgICAgICAgJGljb24uYWRkQ2xhc3MoJGljb24uZGF0YSgnaG92ZXInKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdW5ob3Zlckljb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkaWNvbiA9ICQodGhpcykuZmluZCgnLnNwcml0ZScpO1xyXG4gICAgICAgICAgICAkaWNvbi5yZW1vdmVDbGFzcygkaWNvbi5kYXRhKCdob3ZlcicpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbml0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLnNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLmNzcyh7J2hlaWdodCc6ICQod2luZG93KS5vdXRlckhlaWdodCgpIC0gJCgnLmhlYWRlcicpLm91dGVySGVpZ2h0KCl9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBkZXN0cm95U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLnNjcm9sbGJhcignZGVzdHJveScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAkc2xpZGVUcmlnZ2VyLm9uKCdjbGljaycsIHNsaWRlTWVudSk7XHJcbiAgICAgICAgICAgICRzZWNvbmRMaW5rLnBhcmVudCgpLmhvdmVyKGhvdmVySWNvbiwgdW5ob3Zlckljb24pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHNlY29uZExpbmsub24oJ2NsaWNrJywgc2hvd1NlY29uZCk7XHJcbiAgICAgICAgICAgIGluaXRTY3JvbGxiYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJG1vYmlsZVRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkd3JhcHBlci50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJHNlY29uZENsb3NlLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuanMtY21fX21lbnUtc2Vjb25kJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoIWlzTW9iaWxlICYmICEkbWVudS5oYXNDbGFzcygnX29wZW5lZCcpKSB7XHJcbiAgICAgICAgICAgICRzbGlkZS5zbGlkZVVwKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgY2hlY2tNZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3U2l6ZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5sZztcclxuICAgICAgICAgICAgaWYgKG5ld1NpemUgIT0gaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gbmV3U2l6ZTtcclxuICAgICAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzbGlkZS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1lbnUuYWRkQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2xpZGVUcmlnZ2VyLm9mZignY2xpY2snLCBzbGlkZU1lbnUpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWNvbmRMaW5rLm9uKCdjbGljaycsIHNob3dTZWNvbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWNvbmRMaW5rLm9mZignbW91c2VlbnRlciBtb3VzZWxlYXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNlY29uZExpbmsucGFyZW50KCkub2ZmKCdtb3VzZWVudGVyIG1vdXNlbGVhdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICBpbml0U2Nyb2xsYmFyKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICR3cmFwcGVyLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlVHJpZ2dlci5vbignY2xpY2snLCBzbGlkZU1lbnUpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWNvbmRMaW5rLm9mZignY2xpY2snLCBzaG93U2Vjb25kKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2Vjb25kTGluay5wYXJlbnQoKS5ob3Zlcihob3Zlckljb24sIHVuaG92ZXJJY29uKTtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0cm95U2Nyb2xsYmFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR3cmFwcGVyLmhhc0NsYXNzKCdfYWJzb2x1dGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWVudS5yZW1vdmVDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2xpZGUuc2xpZGVVcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobmV3U2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjcm9sbGJhci5jc3MoeydoZWlnaHQnOiAkKHdpbmRvdykub3V0ZXJIZWlnaHQoKSAtICQoJy5oZWFkZXInKS5vdXRlckhlaWdodCgpfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNoZWNrTWVudSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyB0b2dnbGUgY2F0YWxvZyBsaXN0IHZpZXdcclxuICAgICAgICAkKCcuanMtY2F0YWxvZy12aWV3LXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1jYXRhbG9nLXZpZXctdG9nZ2xlcicpLnRvZ2dsZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQoJy5qcy1jYXRhbG9nLWxpc3QgLmpzLWNhdGFsb2ctbGlzdF9faXRlbSwgLmpzLWNhdGFsb2ctbGlzdCAuanMtY2F0YWxvZy1saXN0X19pdGVtIC5jYXRhbG9nLWxpc3RfX2l0ZW1fX2NvbnRlbnQnKS50b2dnbGVDbGFzcygnX2NhcmQnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0UG9wdXA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgYmFzZUNsYXNzOiAnX3BvcHVwJyxcclxuICAgICAgICAgICAgYXV0b0ZvY3VzOiBmYWxzZSxcclxuICAgICAgICB9O1xyXG4gICAgICAgICQoJy5qcy1wb3B1cCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJC5mYW5jeWJveC5jbG9zZSgpO1xyXG4gICAgICAgIH0pLmZhbmN5Ym94KG9wdGlvbnMpO1xyXG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCkge1xyXG4gICAgICAgICAgICB2YXIgJGNudCA9ICQod2luZG93LmxvY2F0aW9uLmhhc2gpO1xyXG4gICAgICAgICAgICBpZiAoJGNudC5sZW5ndGggJiYgJGNudC5oYXNDbGFzcygncG9wdXAnKSkge1xyXG4gICAgICAgICAgICAgICAgJC5mYW5jeWJveC5vcGVuKCRjbnQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0Rm9ybUxhYmVsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyICRpbnB1dHMgPSAkKCcuanMtZm9ybV9fbGFiZWwnKS5maW5kKCdpbnB1dDpub3QoW3JlcXVpcmVkXSknKTtcclxuICAgICAgICAkaW5wdXRzXHJcbiAgICAgICAgICAgICAgICAub24oJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJ2xhYmVsJykucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2xhYmVsX19lbXB0eScpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5vbignYmx1cicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISQodGhpcykudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5hZGRDbGFzcygnZm9ybV9fbGFiZWxfX2VtcHR5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoJ1t2YWx1ZT1cIlwiXSwgOm5vdChbdmFsdWVdKScpLnNpYmxpbmdzKCdsYWJlbCcpLmFkZENsYXNzKCdmb3JtX19sYWJlbF9fZW1wdHknKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFJlZ2lvblNlbGVjdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1yZWdpb24tdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHNlbCA9ICQodGhpcykuZGF0YSgndG9nZ2xlJyk7XHJcbiAgICAgICAgICAgIGlmIChzZWwpIHtcclxuICAgICAgICAgICAgICAgICQoc2VsKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcuanMtcmVnaW9uLWNsb3NlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcucmVnaW9uLXNlbGVjdCcpLnNsaWRlVXAoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgJGhlYWRlclJlZ2lvblNlbGVjdCA9ICQoJy5oZWFkZXIgLnJlZ2lvbi1zZWxlY3QnKTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCRoZWFkZXJSZWdpb25TZWxlY3QuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICRoZWFkZXJSZWdpb25TZWxlY3Quc2xpZGVVcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRUYWJzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGlzTW9iaWxlID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50Lm1kLFxyXG4gICAgICAgICAgICAgICAgJHRhYnMgPSAkKCcuanMtdGFic19fdGFiJyksXHJcbiAgICAgICAgICAgICAgICAkdG9nZ2xlcnMgPSAkKCcuanMtdGFic19fdGFiIC50YWJzX190YWJfX3RvZ2dsZXInKSxcclxuICAgICAgICAgICAgICAgICRjb250ZW50ID0gJCgnLmpzLXRhYnNfX3RhYiAudGFic19fdGFiX19jb250ZW50Jyk7XHJcbiAgICAgICAgaWYgKCEkdGFicy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgJHRvZ2dsZXJzLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcudGFic19fdGFiX19jb250ZW50Jykuc2xpZGVUb2dnbGUoKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBpbml0RXRhYnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdTaXplID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50Lm1kO1xyXG4gICAgICAgICAgICBpZiAobmV3U2l6ZSAhPSBpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgaXNNb2JpbGUgPSBuZXdTaXplO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgJHRhYnMuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJHRvZ2dsZXJzLnJlbW92ZUNsYXNzKCdfb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAkY29udGVudC5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkdGFicy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAkY29udGVudC5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAkKCcuanMtdGFicycpLmVhc3l0YWJzKHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVIYXNoOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSkuYmluZCgnZWFzeXRhYnM6bWlkVHJhbnNpdGlvbicsIGZ1bmN0aW9uIChldmVudCwgJGNsaWNrZWQsICR0YXJnZXRQYW5lbCwgc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJHVuZGVyID0gJCh0aGlzKS5maW5kKCcuanMtdGFic19fdW5kZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkdW5kZXIuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJGNsaWNrZWQucGFyZW50KCkucG9zaXRpb24oKS5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJGNsaWNrZWQud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgJHRhYnMuZmlsdGVyKCcuYWN0aXZlJykuc2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGluaXRVbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnLmpzLXRhYnMnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkdW5kZXIgPSAkKHRoaXMpLmZpbmQoJy5qcy10YWJzX191bmRlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkYWN0aXZlTGluayA9ICQodGhpcykuZmluZCgnLnRhYnNfX2xpc3QgLmFjdGl2ZSBhJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA9ICRhY3RpdmVMaW5rLm91dGVySGVpZ2h0KCkgLSAkdW5kZXIub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIGlmICgkYWN0aXZlTGluay5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkdW5kZXIuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAnYXV0bycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogdG9wLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAkYWN0aXZlTGluay5wYXJlbnQoKS5wb3NpdGlvbigpLmxlZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAkYWN0aXZlTGluay53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oJ2xvYWQgcmVzaXplJywgaW5pdEV0YWJzKTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ2xvYWQgcmVzaXplJywgaW5pdFVuZGVyKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFFBOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLXFhOm5vdCguX2FjdGl2ZSkgLnFhX19hJykuc2xpZGVVcCgpO1xyXG4gICAgICAgICQoJy5qcy1xYScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICR0b2dnbGVyID0gJHRoaXMuZmluZCgnLnFhX19xIC5xYV9faCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICRhbnN3ZXIgPSAkdGhpcy5maW5kKCcucWFfX2EnKTtcclxuICAgICAgICAgICAgJHRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHRoaXMudG9nZ2xlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICRhbnN3ZXIuc2xpZGVUb2dnbGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRJTW1lbnU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtaW0tbWVudV9fdG9nZ2xlcjpub3QoLl9vcGVuZWQpJykuc2libGluZ3MoJy5qcy1pbS1tZW51X19zbGlkZScpLnNsaWRlVXAoKTtcclxuICAgICAgICAkKCcuanMtaW0tbWVudV9fdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuanMtaW0tbWVudV9fc2xpZGUnKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0U2VsZWN0czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpc01vYmlsZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5tZCxcclxuICAgICAgICAgICAgICAgICRzZWxlY3RzID0gJCgnLmpzLXNlbGVjdCcpO1xyXG4gICAgICAgIGlmICghJHNlbGVjdHMubGVuZ3RoKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzZWxlY3RzLnN0eWxlcigpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzZWxlY3RzLnN0eWxlcignZGVzdHJveScpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIHJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdTaXplID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50Lm1kO1xyXG4gICAgICAgICAgICBpZiAobmV3U2l6ZSAhPSBpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgaXNNb2JpbGUgPSBuZXdTaXplO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCFpc01vYmlsZSkge1xyXG4gICAgICAgICAgICBpbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgcmVmcmVzaCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRNYXNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgSW5wdXRtYXNrLmV4dGVuZEFsaWFzZXMoe1xyXG4gICAgICAgICAgICAnbnVtZXJpYyc6IHtcclxuICAgICAgICAgICAgICAgIGF1dG9Vbm1hc2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzaG93TWFza09uSG92ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcmFkaXhQb2ludDogXCIsXCIsXHJcbiAgICAgICAgICAgICAgICBncm91cFNlcGFyYXRvcjogXCIgXCIsXHJcbiAgICAgICAgICAgICAgICBkaWdpdHM6IDAsXHJcbiAgICAgICAgICAgICAgICBhbGxvd01pbnVzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGF1dG9Hcm91cDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJpZ2h0QWxpZ246IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdW5tYXNrQXNOdW1iZXI6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5qcy1tYXNrJykuaW5wdXRtYXNrKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRSYW5nZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1yYW5nZScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgc2xpZGVyID0gJCh0aGlzKS5maW5kKCcuanMtcmFuZ2VfX3RhcmdldCcpWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICRpbnB1dHMgPSAkKHRoaXMpLmZpbmQoJ2lucHV0JyksXHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbSA9ICRpbnB1dHMuZmlyc3QoKVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0byA9ICRpbnB1dHMubGFzdCgpWzBdO1xyXG4gICAgICAgICAgICBpZiAoc2xpZGVyICYmIGZyb20gJiYgdG8pIHtcclxuICAgICAgICAgICAgICAgIHZhciBtaW5WID0gcGFyc2VJbnQoZnJvbS52YWx1ZSkgfHwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4ViA9IHBhcnNlSW50KHRvLnZhbHVlKSB8fCAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1pbiA9IHBhcnNlSW50KGZyb20uZGF0YXNldC5taW4pIHx8IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heCA9IHBhcnNlSW50KHRvLmRhdGFzZXQubWF4KSB8fCAwO1xyXG4gICAgICAgICAgICAgICAgbm9VaVNsaWRlci5jcmVhdGUoc2xpZGVyLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluVixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4VlxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICByYW5nZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbWluJzogbWluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbWF4JzogbWF4XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc25hcFZhbHVlcyA9IFtmcm9tLCB0b107XHJcbiAgICAgICAgICAgICAgICBzbGlkZXIubm9VaVNsaWRlci5vbigndXBkYXRlJywgZnVuY3Rpb24gKHZhbHVlcywgaGFuZGxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc25hcFZhbHVlc1toYW5kbGVdLnZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZXNbaGFuZGxlXSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGZyb20uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5ub1VpU2xpZGVyLnNldChbdGhpcy52YWx1ZSwgbnVsbF0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBmcm9tLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVyLm5vVWlTbGlkZXIuc2V0KFt0aGlzLnZhbHVlLCBudWxsXSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXIubm9VaVNsaWRlci5zZXQoW251bGwsIHRoaXMudmFsdWVdKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdG8uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXIubm9VaVNsaWRlci5zZXQoW251bGwsIHRoaXMudmFsdWVdKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0RmlsdGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLWZpbHRlci1maWVsZHNldCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRyaWdnZXIgPSAkKHRoaXMpLmZpbmQoJy5qcy1maWx0ZXItZmllbGRzZXRfX3RyaWdnZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAkc2xpZGUgPSAkKHRoaXMpLmZpbmQoJy5qcy1maWx0ZXItZmllbGRzZXRfX3NsaWRlJyk7XHJcbiAgICAgICAgICAgICR0cmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ19jbG9zZWQnKTtcclxuICAgICAgICAgICAgICAgICRzbGlkZS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIGlzTW9iaWxlID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50LmxnLFxyXG4gICAgICAgICAgICAgICAgJHNjcm9sbGJhciA9ICQoJy5qcy1maWx0ZXJfX3Njcm9sbGJhcicpLFxyXG4gICAgICAgICAgICAgICAgJG1vYmlsZVRvZ2dsZXIgPSAkKCcuanMtZmlsdGVyX19tb2JpbGUtdG9nZ2xlcicpLFxyXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIgPSAkKCcuanMtZmlsdGVyJyk7XHJcblxyXG4gICAgICAgIHZhciBpbml0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLnNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLmNzcyh7J2hlaWdodCc6ICQod2luZG93KS5vdXRlckhlaWdodCgpIC0gJCgnLmhlYWRlcicpLm91dGVySGVpZ2h0KCl9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBkZXN0cm95U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLnNjcm9sbGJhcignZGVzdHJveScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgIGluaXRTY3JvbGxiYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJG1vYmlsZVRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkd3JhcHBlci50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBjaGVjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1NpemUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubGc7XHJcbiAgICAgICAgICAgIGlmIChuZXdTaXplICE9IGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpc01vYmlsZSA9IG5ld1NpemU7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbml0U2Nyb2xsYmFyKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICR3cmFwcGVyLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdHJveVNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChuZXdTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAkc2Nyb2xsYmFyLmNzcyh7J2hlaWdodCc6ICQod2luZG93KS5vdXRlckhlaWdodCgpIC0gJCgnLmhlYWRlcicpLm91dGVySGVpZ2h0KCl9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2hlY2soKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdENyZWF0ZVByaWNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyICRpdGVtcyA9ICQoJy5qcy1jcmVhdGUtcHJpY2VfX2l0ZW0nKSxcclxuICAgICAgICAgICAgICAgICRwYXJlbnRzID0gJCgnLmpzLWNyZWF0ZS1wcmljZV9fcGFyZW50JyksXHJcbiAgICAgICAgICAgICAgICAkY291bnRlciA9ICQoJy5qcy1jcmVhdGUtcHJpY2VfX2NvdW50ZXInKSxcclxuICAgICAgICAgICAgICAgICRhbGwgPSAkKCcuanMtY3JlYXRlLXByaWNlX19hbGwnKSxcclxuICAgICAgICAgICAgICAgICRjbGVhciA9ICQoJy5qcy1jcmVhdGUtcHJpY2VfX2NsZWFyJyksXHJcbiAgICAgICAgICAgICAgICBkZWNsMSA9IFsn0JLRi9Cx0YDQsNC90LA6ICcsICfQktGL0LHRgNCw0L3QvjogJywgJ9CS0YvQsdGA0LDQvdC+OiAnXSxcclxuICAgICAgICAgICAgICAgIGRlY2wyID0gWycg0LrQsNGCZdCz0L7RgNC40Y8nLCAnINC60LDRgtC10LPQvtGA0LjQuCcsICcg0LrQsNGC0LXQs9C+0YDQuNC5J10sXHJcbiAgICAgICAgICAgICAgICBpc01vYmlsZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5tZDtcclxuICAgICAgICBpZiAoJGl0ZW1zLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIGNvdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdG90YWwgPSAkaXRlbXMuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aDtcclxuICAgICAgICAgICAgJGNvdW50ZXIudGV4dChhcHAuZ2V0TnVtRW5kaW5nKHRvdGFsLCBkZWNsMSkgKyB0b3RhbCArIGFwcC5nZXROdW1FbmRpbmcodG90YWwsIGRlY2wyKSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb3VudCgpO1xyXG4gICAgICAgICRpdGVtcy5vbignY2hhbmdlJywgY291bnQpO1xyXG4gICAgICAgICRwYXJlbnRzLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkY2hpbGRzID0gJCh0aGlzKS5wYXJlbnRzKCcuanMtY3JlYXRlLXByaWNlX193cmFwcGVyJykuZmluZCgnLmpzLWNyZWF0ZS1wcmljZV9faXRlbScpO1xyXG4gICAgICAgICAgICAkY2hpbGRzLnByb3AoJ2NoZWNrZWQnLCAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSk7XHJcbiAgICAgICAgICAgIGNvdW50KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGFsbC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRpdGVtcy5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICRwYXJlbnRzLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgY291bnQoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICRjbGVhci5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRpdGVtcy5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAkcGFyZW50cy5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICBjb3VudCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLy8gZml4IGhlYWRlclxyXG4gICAgICAgIHZhciAkaGVhZCA9ICQoJy5jYXRhbG9nLWNyZWF0ZS1oZWFkLl9mb290Jyk7XHJcbiAgICAgICAgdmFyIGJyZWFrcG9pbnQsIHdIZWlnaHQ7XHJcbiAgICAgICAgZml4SW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYnJlYWtwb2ludCA9ICRoZWFkLm9mZnNldCgpLnRvcDtcclxuICAgICAgICAgICAgd0hlaWdodCA9ICQod2luZG93KS5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICBmaXhIZWFkKCk7XHJcbiAgICAgICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZml4SGVhZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpeEhlYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyB3SGVpZ2h0IDwgYnJlYWtwb2ludCkge1xyXG4gICAgICAgICAgICAgICAgJGhlYWQuYWRkQ2xhc3MoJ19maXhlZCcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGhlYWQucmVtb3ZlQ2xhc3MoJ19maXhlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICAgICAgICBmaXhJbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3U2l6ZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5sZztcclxuICAgICAgICAgICAgaWYgKG5ld1NpemUgIT0gaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gbmV3U2l6ZTtcclxuICAgICAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpeEluaXQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9mZignc2Nyb2xsJywgZml4SGVhZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhlYWQucmVtb3ZlQ2xhc3MoJ19maXhlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTRg9C90LrRhtC40Y8g0LLQvtC30LLRgNCw0YnQsNC10YIg0L7QutC+0L3Rh9Cw0L3QuNC1INC00LvRjyDQvNC90L7QttC10YHRgtCy0LXQvdC90L7Qs9C+INGH0LjRgdC70LAg0YHQu9C+0LLQsCDQvdCwINC+0YHQvdC+0LLQsNC90LjQuCDRh9C40YHQu9CwINC4INC80LDRgdGB0LjQstCwINC+0LrQvtC90YfQsNC90LjQuVxyXG4gICAgICogcGFyYW0gIGlOdW1iZXIgSW50ZWdlciDQp9C40YHQu9C+INC90LAg0L7RgdC90L7QstC1INC60L7RgtC+0YDQvtCz0L4g0L3Rg9C20L3QviDRgdGE0L7RgNC80LjRgNC+0LLQsNGC0Ywg0L7QutC+0L3Rh9Cw0L3QuNC1XHJcbiAgICAgKiBwYXJhbSAgYUVuZGluZ3MgQXJyYXkg0JzQsNGB0YHQuNCyINGB0LvQvtCyINC40LvQuCDQvtC60L7QvdGH0LDQvdC40Lkg0LTQu9GPINGH0LjRgdC10LsgKDEsIDQsIDUpLFxyXG4gICAgICogICAgICAgICDQvdCw0L/RgNC40LzQtdGAIFsn0Y/QsdC70L7QutC+JywgJ9GP0LHQu9C+0LrQsCcsICfRj9Cx0LvQvtC6J11cclxuICAgICAqIHJldHVybiBTdHJpbmdcclxuICAgICAqIFxyXG4gICAgICogaHR0cHM6Ly9oYWJyYWhhYnIucnUvcG9zdC8xMDU0MjgvXHJcbiAgICAgKi9cclxuICAgIGdldE51bUVuZGluZzogZnVuY3Rpb24gKGlOdW1iZXIsIGFFbmRpbmdzKSB7XHJcbiAgICAgICAgdmFyIHNFbmRpbmcsIGk7XHJcbiAgICAgICAgaU51bWJlciA9IGlOdW1iZXIgJSAxMDA7XHJcbiAgICAgICAgaWYgKGlOdW1iZXIgPj0gMTEgJiYgaU51bWJlciA8PSAxOSkge1xyXG4gICAgICAgICAgICBzRW5kaW5nID0gYUVuZGluZ3NbMl07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaSA9IGlOdW1iZXIgJSAxMDtcclxuICAgICAgICAgICAgc3dpdGNoIChpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICgxKTpcclxuICAgICAgICAgICAgICAgICAgICBzRW5kaW5nID0gYUVuZGluZ3NbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICgyKTpcclxuICAgICAgICAgICAgICAgIGNhc2UgKDMpOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAoNCk6XHJcbiAgICAgICAgICAgICAgICAgICAgc0VuZGluZyA9IGFFbmRpbmdzWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBzRW5kaW5nID0gYUVuZGluZ3NbMl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNFbmRpbmc7XHJcbiAgICB9XHJcblxyXG59Il0sImZpbGUiOiJjb21tb24uanMifQ==
