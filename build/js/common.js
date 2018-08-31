jQuery.expr[':'].focus = function (elem) {
    return elem === document.activeElement && (elem.type || elem.href);
};

$(document).ready(function () {
    app.initialize();
});

var app = {
    initialized: false,

    initialize: function () {
        var elemHTML = document.getElementsByTagName('html')[0];
        if (navigator.userAgent.indexOf('Mac') > 0) {
            elemHTML.className += " mac-os";
            if (navigator.userAgent.indexOf('Safari') > 0)
                elemHTML.className += " mac-safari";
            if (navigator.userAgent.indexOf('Chrome') > 0)
                elemHTML.className += " mac-chrome";
        }
        if (navigator.userAgent.indexOf('Edge') > 0 || navigator.userAgent.indexOf('Trident') > 0) {
            elemHTML.className += " ie";
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
        this.initQuantity();
        this.initCart();
        this.initSP();
        this.initTags();
        this.initContacts();
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
        var q = 1;
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
            pinHeader();
            $(window).on('load scroll', pinHeader);
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
        var fixMenu = function () {
            if ($(window).outerWidth() >= appConfig.breakpoint.md && $(window).outerWidth() < appConfig.breakpoint.lg) {
                $('.footer__menu-second').css('left', $('.footer__menu .menu > li:nth-child(3)').offset().left);
            } else {
                $('.footer__menu-second').css('left', 0);
            }
        }
        fixMenu();
        $(window).on('load resize', fixMenu);
    },

    initCut: function () {
        $('.js-cut').each(function () {
            $(this).find('.js-cut__trigger').on('click', function () {
                var $content = $(this).siblings('.js-cut__content'),
                        textShow = $(this).data('textshow') || 'show text',
                        textHide = $(this).data('texthide') || 'hide text';
                $(this).text($content.is(':visible') ? textShow : textHide);
                $(this).toggleClass('_opened');
                $(this).siblings('.js-cut__content').slideToggle(function () {
                    $('.js-filter__counter').trigger("sticky_kit:recalc");
                });
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
            var slides = $(this).data('slides') || {};
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
        $(window).on('load', function () {
            $('.js-nav-slider__main.slick-initialized').slick('setPosition');
        });

        // only sm sliders
        var isMobile = false;
        var initSmSlider = function () {
            $('.js-sm-slider').slick({
                dots: true,
                arrows: true,
                infinite: false
            });
        };
        var destroySmSlider = function () {
            $('.js-sm-slider.slick-initialized').slick('unslick');
        };
        var isMobile = $(window).outerWidth() < appConfig.breakpoint.md;
        var checkSmSlider = function () {
            var newSize = $(window).outerWidth() < appConfig.breakpoint.md;
            if (newSize != isMobile) {
                isMobile = newSize;
            }
            if (isMobile) {
                initSmSlider();
            } else {
                destroySmSlider();
            }
        }
        $(window).on('load resize', function () {
            checkSmSlider();
        });
    },

    initTags: function () {
        $('.js-tag').on('click', function () {
            $(this).toggleClass('_active');
            return true;
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
                    }, 100);
                    $wrap.on('mouseleave', function () {
                        $hover.animate({
                            top: '0',
                            left: '0',
                            right: '0',
                            bottom: '0',
                        }, 10, function () {
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
        $('.js-scrollbar').scrollbar({
            disableBodyScroll: true
        });
    },

    /**
     *
     */
    initSearch: function () {
        var $input = $('.js-search-form__input');
        $input.on('click', function (e) {
            e.stopPropagation();
        });
        $input.on('focus', function () {
            $(this).siblings('.js-search-res').addClass('_active');
        });
        $(window).on('click', function () {
            $('.js-search-res').removeClass('_active');
        });

        /**
         *
         * Строка поиска
         *
         */
        let searchAll = $('.j-search-show_all');
        let searchString = searchAll.attr('data-page');

        $('.search-form__submit').on('click', function () {
           searchAll.trigger('click');
        });
        /**
         * обработчик нажатия
         */
        $input.on('input', this.debounce(function(e) {
            searchAll.hide();
            if ($(this).val().length > 2) {
                searchAll.attr('href', searchString + '?q=' + $(this).val());
                $.ajax({
                    url: '/baseinfo/search.php',
                    type: 'post',
                    dataType: 'json',
                    data: $(this).parent().serialize(),
                    success: function success(data) {
                        $('.j-top-search-wraper').html(data.html);
                        if(data.html) {
                            searchAll.show();
                        }
                    }
                });
            }
        }, 300));
    },

    /**
     *
     * @param func
     * @param wait
     * @param immediate
     * @returns {Function}
     *
     */
    debounce: function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
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
            $slide.slideToggle(function () {
                $('.js-filter__counter').trigger("sticky_kit:recalc");
            });
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
            $slide.slideUp(function () {
                $('.js-filter__counter').trigger("sticky_kit:recalc");
            });
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
            touch: false,
            afterShow: function (instance, slide) {
                slide.$slide.find('.slick-initialized').slick('setPosition');
                var $shipping = slide.$slide.find('.js-shipping');
                if ($shipping.length && !$shipping.data('init')) {
                    app.shipping.init($shipping);
                }
            }
        };
        $('.js-popup').on('click', function () {
            $.fancybox.close();
        }).fancybox(options);
        if (window.location.hash && window.location.hash !== '#') {
            var $cnt = $(window.location.hash);
            if ($cnt.length && $cnt.hasClass('popup')) {
                $.fancybox.open($cnt, options);
            }
        }
    },

    initFormLabel: function () {
        var $inputs = $('.js-form__label').find(':not([required])');
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
            $(this).siblings('.tabs__tab__content').slideToggle(function () {
                $(this).is(':visible')
                        ? $(this).trigger('tabs_slide_open', $(this))
                        : $(this).trigger('tabs_slide_close', $(this));
            });

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

        initEtabs();
        initUnder();
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
//        $('.js-select_always').styler();
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
        $('.js-mask__tel').inputmask({
            mask: '+9 (999) 999-99-99'
        });
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
        $('html:not(.ie) .js-mask').inputmask();
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
                    step: 10,
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
        } else {
            $('.js-filter__counter').stick_in_parent({offset_top: 100})
        }

        $mobileToggler.on('click', function () {
            $wrapper.toggleClass('_active');
            return false;
        });

        $('.js-filter-fieldset').each(function () {
            var $trigger = $(this).find('.js-filter-fieldset__trigger'),
                    $slide = $(this).find('.js-filter-fieldset__slide');
            $trigger.on('click', function () {
                $(this).toggleClass('_closed');
                $slide.slideToggle(function () {
                    $('.js-filter__counter').trigger("sticky_kit:recalc");
                });
            });
        });

        var check = function () {
            var newSize = $(window).outerWidth() < appConfig.breakpoint.lg;
            if (newSize != isMobile) {
                isMobile = newSize;
                if (isMobile) {
                    initScrollbar();
                    $('.js-filter__counter').trigger("sticky_kit:detach");
                } else {
                    $wrapper.removeClass('_active');
                    destroyScrollbar();
                    $('.js-filter__counter').stick_in_parent({offset_top: 100})
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
        $items.on('change', function () {
            var $wrapper = $(this).parents('.js-create-price__wrapper');
            if ($wrapper) {
                var $items = $wrapper.find('.js-create-price__item'),
                        $parent = $wrapper.find('.js-create-price__parent');
                $parent.prop('checked', $items.filter(':checked').length !== 0);
            }
            count();
        });
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
     * 
     * @param $ $wrapper
     */
    initShippingCalc: function ($wrapper) {
        var $slider = $wrapper.find('.js-shipping__car-slider'),
                $radio = $wrapper.find('.js-shipping__car-radio');
        if ($slider.length) {
            $slider.slick({
                dots: false,
                arrows: false,
                draggable: false,
                fade: true
            });
            $radio.on('click', function () {
                var index = $(this).parents('.js-shipping__car-label').index();
                $slider.slick('slickGoTo', index);
            })
        }
        var $dateinputWrapper = $wrapper.find('.js-shipping__date-input'),
                $dateinput = $wrapper.find('.js-shipping__date-input__input'),
                disabledDays = [0, 6];
        $dateinput.datepicker({
            position: 'top right',
            offset: 40,
            navTitles: {
                days: 'MM'
            },
            minDate: new Date(new Date().getTime() + 86400 * 1000 * 2),
            onRenderCell: function (date, cellType) {
                if (cellType == 'day') {
                    var day = date.getDay(),
                            isDisabled = disabledDays.indexOf(day) != -1;

                    return {
                        disabled: isDisabled
                    }
                }
            },
            onSelect: function (formattedDate, date, inst) {
                inst.hide();
                $dateinputWrapper.removeClass('_empty');
            }
        });
        var datepicker = $dateinput.datepicker().data('datepicker');
        $wrapper.find('.js-shipping__datepicker-toggler').on('click', function () {
            datepicker.show();
        });

        // map
        var map, $routeAddress = $wrapper.find('.js-shipping__route-address'),
                $routeDistance = $wrapper.find('.js-shipping__route-distance');
        var initMap = function () {
            var balloonLayout = ymaps.templateLayoutFactory.createClass(
                    "<div>", {
                        build: function () {
                            this.constructor.superclass.build.call(this);
                        }
                    }
            );
            var multiRoute = new ymaps.multiRouter.MultiRoute({
                // Описание опорных точек мультимаршрута.
                referencePoints: [
                    appConfig.shipping.from.geo,
                    appConfig.shipping.to.geo,
                ],
                params: {
                    results: 3
                }
            }, {
                boundsAutoApply: true,
                wayPointStartIconContentLayout: ymaps.templateLayoutFactory.createClass(
                        appConfig.shipping.from.text
                        ),
                wayPointFinishDraggable: true,
                balloonLayout: balloonLayout
            });
            multiRoute.model.events.add('requestsuccess', function () {
                setDistance(multiRoute.getActiveRoute());
                var point = multiRoute.getWayPoints().get(1);
                ymaps.geocode(point.geometry.getCoordinates()).then(function (res) {
                    var o = res.geoObjects.get(0);
                    var address = o.getAddressLine().replace('Нижегородская область, ', '');
                    $routeAddress.val(address);
                    multiRoute.options.set('wayPointFinishIconContentLayout',
                            ymaps.templateLayoutFactory.createClass(address));
                })
            });
            multiRoute.events.add('activeroutechange', function () {
                setDistance(multiRoute.getActiveRoute());
            });
            map = new ymaps.Map("shipping_map", {
                center: appConfig.shipping.from.geo,
                zoom: 13,
                autoFitToViewport: 'always',
                controls: []
            });
            map.geoObjects.add(multiRoute);
        }
        var setDistance = function (route) {
            if (route) {
                var distance = Math.round(route.properties.get('distance').value / 1000);
                $routeDistance.val(distance);
            }
        }
        if (typeof (ymaps) === 'undefined') {
            $.ajax({
                url: '//api-maps.yandex.ru/2.1/?lang=ru_RU&mode=debug',
                dataType: "script",
                cache: true,
                success: function () {
                    ymaps.ready(initMap);
                }
            });
        } else {
            ymaps.ready(initMap);
        }
        $wrapper.find('.js-shipping__map-toggler').on('click', function () {
            $(this).toggleClass('_opened');
            $wrapper.find('.js-shipping__map').slideToggle();
            return false;
        });
        $(window).on('resize', function () {
            if (window.innerWidth >= appConfig.breakpoint.md) {
                $wrapper.find('.js-shipping__map-toggler').addClass('_opened');
                $wrapper.find('.js-shipping__map').slideDown();
            }
        });
        $wrapper.data('init', true);
    },

    initQuantity: function () {
        $('.js-quantity-shift.js-quantity-up, .js-quantity-shift.js-quantity-down').on('click', function (e) {
            e.preventDefault();
            var $quantityInput = $(this).siblings('.js-quantity')[0];
            if ($quantityInput) {
                var cur = parseInt($quantityInput.value),
                        shiftUp = $(this).hasClass('js-quantity-up'),
                        limit = $($quantityInput).attr(shiftUp ? 'max' : 'min'),
                        val = shiftUp ? cur + 1 : cur - 1;
                if (!limit || (shiftUp && val <= parseInt(limit)) || (!shiftUp && val >= parseInt(limit))) {
                    $quantityInput.value = val;
                    $($quantityInput).change();
                }
            }
        });
    },

    /**
     * init map in container
     * @param string cnt id
     * @return Map 
     */
    mapInit: function (cnt) {
        var map = new ymaps.Map(cnt, {
            center: [56.326887, 44.005986],
            zoom: 11,
            controls: []
        }, {
            suppressMapOpenBlock: true,
        });
        map.controls.add('zoomControl', {
            size: 'small'
        });
        return map;
    },

    /**
     * add placemarks on map
     * @param Map map
     * @param $ items with data-attr
     * @return array of GeoObject
     */
    mapAddPlacemarks: function (map, $items) {
        var placemarks = [];
        var tplPlacemark = ymaps.templateLayoutFactory.createClass(
                '<div class="placemark {{ properties.type }}"><i class="sprite {{ properties.type }}"></i></div>'
                ),
                tplBalloon = ymaps.templateLayoutFactory.createClass(
                        '<div class="pickup-balloon">{{ properties.text }}<span class="arrow"></span></div>', {
                            /**
                             * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
                             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
                             * @function
                             * @name build
                             */
                            build: function () {
                                this.constructor.superclass.build.call(this);
                                this._$element = $('.pickup-balloon', this.getParentElement());
                            },

                            /**
                             * Используется для автопозиционирования (balloonAutoPan).
                             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
                             * @function
                             * @name getClientBounds
                             * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
                             */
                            getShape: function () {
                                if (!this._isElement(this._$element)) {
                                    return tplBalloon.superclass.getShape.call(this);
                                }

                                var position = this._$element.position();

                                return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                                    [position.left, position.top], [
                                        position.left + this._$element[0].offsetWidth,
                                        position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
                                    ]
                                ]));
                            },

                            /**
                             * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
                             * @function
                             * @private
                             * @name _isElement
                             * @param {jQuery} [element] Элемент.
                             * @returns {Boolean} Флаг наличия.
                             */
                            _isElement: function (element) {
                                return element && element[0];
                            }
                        });
        $items.each(function (index) {
            var geo = $(this).data('geo'),
                    text = $(this).data('text') || 'САКСЭС',
                    type = $(this).data('type') || 'geo-office';
            if (geo) {
                geo = geo.split(',');
                geo[0] = parseFloat(geo[0]);
                geo[1] = parseFloat(geo[1]);
                var placemark = new ymaps.Placemark(geo,
                        {
                            text: text,
                            type: type
                        },
                        {
                            iconLayout: tplPlacemark,
                            iconImageSize: [40, 50],
                            hideIconOnBalloonOpen: false,
                            balloonLayout: tplBalloon,
                            balloonCloseButton: false,
                            pane: 'balloon',
                            balloonPanelMaxMapArea: 0
                        });
                map.geoObjects.add(placemark);
                placemarks.push(placemark);
            }
        });
        return placemarks;
    },

    /**
     * Set bounds on all geo objects on map
     * @param Map map
     * @returns void
     */
    mapSetBounds: function (map) {
        map.setBounds(map.geoObjects.getBounds(), {
            checkZoomRange: true,
            zoomMargin: 50
        });
    },

    initCart: function () {
        $('.js-cart-info__radio').on('click', function () {
            $('.js-cart-info__hidden').hide();
            var delivery = $(this).data('delivery');
            var $target = $('.js-cart-info__hidden[data-delivery="' + delivery + '"]');
            $target.show();
            $target.find('.js-select_always').styler();
        });

        // pickup
        var $wrapper = $('.js-pickup'), map = null;
        if ($wrapper.length == 0) {
            return;
        }

        // popups in pickup popup
        var closePhotoPopup = function () {
            $('.js-pickup__popup').fadeOut().removeClass('_active');
            $('.js-pickup__popup-open').removeClass('_active');
            return false;
        }
        $('.js-pickup__popup-open').on('click', function () {
            if ($(this).hasClass('_active'))
                return;
            $('.js-pickup__popup-open').removeClass('_active');
            var $popup = $(this).siblings('.js-pickup__popup');
            if ($('.js-pickup__popup._active').length) {
                $('.js-pickup__popup._active').removeClass('_active').fadeOut(function () {
                    $popup.fadeIn().addClass('_active');
                });
            } else {
                $popup.fadeIn().addClass('_active');
            }
            $(this).addClass('_active');
            return false;
        });
        $('.js-pickup__popup-close').on('click', closePhotoPopup);

        var closePickup = function () {
            map.balloon.close();
            $('.js-pickup__map__item').removeClass('_active');
            $('.js-pickup__submit').prop('disabled', true);
            closePhotoPopup();
            $.fancybox.close();
            return false;
        }

        // submit
        $('.js-pickup__submit').on('click', function () {
            var $selected = $('.js-pickup__map__item._active');
            $('.js-pickup__target__text').text($selected.find('.js-pickup__map__item__text').text());
            $('.js-pickup__target__time').text($selected.find('.js-pickup__map__item__time').text() || '');
            $('.js-pickup__target__input').val($selected.data('id') || 0);
            closePickup();
        });

        // cancel
        $('.js-pickup__cancel').on('click', closePickup);

        // map
        var initMap = function () {
            map = app.mapInit('pickup_map');
            var placemarks = app.mapAddPlacemarks(map, $('.js-pickup__map__item'));
            app.mapSetBounds(map);
            // click
            $('.js-pickup__map__item').on('click', function () {
                placemarks[$(this).index()].balloon.open();
                $('.js-pickup__map__item').removeClass('_active');
                $(this).addClass('_active');
                $('.js-pickup__submit').prop('disabled', false);
            });

            $wrapper.data('init', true);

        };

        // init map on fb.open
        $(document).on('afterShow.fb', function (e, instance, slide) {
            var $pickup = slide.$slide.find('.js-pickup');
            if ($pickup.length && !$pickup.data('init')) {
                if (typeof (ymaps) === 'undefined') {
                    $.ajax({
                        url: '//api-maps.yandex.ru/2.1/?lang=ru_RU&mode=debug',
                        dataType: "script",
                        cache: true,
                        success: function () {
                            ymaps.ready(initMap);
                        }
                    });
                } else {
                    ymaps.ready(initMap);
                }
            }
        });

    },

    initSP: function () {
        if ($('.js-sp').length == 0) {
            return;
        }
        if (typeof (ymaps) === 'undefined') {
            $.ajax({
                url: '//api-maps.yandex.ru/2.1/?lang=ru_RU&mode=debug',
                dataType: "script",
                cache: true,
                success: function () {
                    ymaps.ready(initMap);
                }
            });
        } else {
            ymaps.ready(initMap);
        }
        var initMap = function () {
            var map = app.mapInit('sp_map');
            app.mapAddPlacemarks(map, $('.js-sp__map-item'));
            // масштабируем при открытии страницы, таба и слайда
            if ($('#sp_map').is(':visible')) {
                app.mapSetBounds(map);
            } else {
                $('.js-sp .js-tabs').one('easytabs:after', function () {
                    app.mapSetBounds(map);
                });
                $('.js-sp .js-sp__map-tab').on('tabs_slide_open', function () {
                    app.mapSetBounds(map);
                });
            }
        }
    },

    initContacts: function () {
        if ($('.js-contacts').length == 0) {
            return;
        }
        $('.js-contacts__map').stick_in_parent({
            offset_top: 90
        });
        if (typeof (ymaps) === 'undefined') {
            $.ajax({
                url: '//api-maps.yandex.ru/2.1/?lang=ru_RU&mode=debug',
                dataType: "script",
                cache: true,
                success: function () {
                    ymaps.ready(initMap);
                }
            });
        } else {
            ymaps.ready(initMap);
        }
        var initMap = function () {
            var $items = $('.js-contacts__map-item');
            map = app.mapInit('contacts_map');
            var placemarks = app.mapAddPlacemarks(map, $items);
            app.mapSetBounds(map);
            $items.each(function (idx) {
                $(this).on('click', function () {
                    var type = $(this).data('type');
                    $('.placemark.' + type).show();
                    $('.js-contacts__map .js-tag').filter('[data-type="'+ type + '"]').addClass('_active');
//                    console.log(placemarks[idx]);
                    map.setCenter(placemarks[idx].geometry.getCoordinates(), 13, {
                        duration: 300
                    }).then(function(){
                        placemarks[idx].balloon.open();
                    });
                });
            });
            // click on tag
            $('.js-contacts__map .js-tag').on('click', function() {
                map.balloon.close();
                var $pm = $('.placemark.' + $(this).data('type'));
                $(this).hasClass('_active') ? $pm.show() : $pm.hide();
                return false;
            });
        }
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
    },

}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsialF1ZXJ5LmV4cHJbJzonXS5mb2N1cyA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgcmV0dXJuIGVsZW0gPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgKGVsZW0udHlwZSB8fCBlbGVtLmhyZWYpO1xufTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIGFwcC5pbml0aWFsaXplKCk7XG59KTtcblxudmFyIGFwcCA9IHtcbiAgICBpbml0aWFsaXplZDogZmFsc2UsXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlbGVtSFRNTCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdodG1sJylbMF07XG4gICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01hYycpID4gMCkge1xuICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIG1hYy1vc1wiO1xuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignU2FmYXJpJykgPiAwKVxuICAgICAgICAgICAgICAgIGVsZW1IVE1MLmNsYXNzTmFtZSArPSBcIiBtYWMtc2FmYXJpXCI7XG4gICAgICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdDaHJvbWUnKSA+IDApXG4gICAgICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIG1hYy1jaHJvbWVcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdFZGdlJykgPiAwIHx8IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignVHJpZGVudCcpID4gMCkge1xuICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIGllXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0U2xpZGVycygpOyAvLyBtdXN0IGJlIGZpcnN0IVxuICAgICAgICB0aGlzLmluaXRNZW51KCk7XG4gICAgICAgIHRoaXMuaW5pdEZvb3RlcigpO1xuICAgICAgICB0aGlzLmluaXRDdXQoKTtcbiAgICAgICAgdGhpcy5pbml0SG92ZXIoKTtcbiAgICAgICAgdGhpcy5pbml0U2Nyb2xsYmFyKCk7XG4gICAgICAgIHRoaXMuaW5pdENhdGFsb2coKTtcbiAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG4gICAgICAgIHRoaXMuaW5pdFBvcHVwKCk7XG4gICAgICAgIHRoaXMuaW5pdEZvcm1MYWJlbCgpO1xuICAgICAgICB0aGlzLmluaXRSZWdpb25TZWxlY3QoKTtcbiAgICAgICAgdGhpcy5pbml0VGFicygpO1xuICAgICAgICB0aGlzLmluaXRRQSgpO1xuICAgICAgICB0aGlzLmluaXRJTW1lbnUoKTtcbiAgICAgICAgdGhpcy5pbml0U2VsZWN0cygpO1xuICAgICAgICB0aGlzLmluaXRNYXNrKCk7XG4gICAgICAgIHRoaXMuaW5pdFJhbmdlKCk7XG4gICAgICAgIHRoaXMuaW5pdEZpbHRlcigpO1xuICAgICAgICB0aGlzLmluaXRDcmVhdGVQcmljZSgpO1xuICAgICAgICB0aGlzLmluaXRRdWFudGl0eSgpO1xuICAgICAgICB0aGlzLmluaXRDYXJ0KCk7XG4gICAgICAgIHRoaXMuaW5pdFNQKCk7XG4gICAgICAgIHRoaXMuaW5pdFRhZ3MoKTtcbiAgICAgICAgdGhpcy5pbml0Q29udGFjdHMoKTtcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBhcHAuaW5pdEhvdmVyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBpbml0TWVudTogZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCcuanMtbWVudS10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBocmVmID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG4gICAgICAgICAgICAkKCcuanMtbWVudS10b2dnbGVyW2hyZWY9XCInICsgaHJlZiArICdcIl0nKS50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xuICAgICAgICAgICAgJChocmVmKS50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmpzLW1lbnUuX2FjdGl2ZScpLmxlbmd0aCA9PSAwID8gJCgnLmpzLW1lbnUtb3ZlcmxheScpLmhpZGUoKSA6ICQoJy5qcy1tZW51LW92ZXJsYXknKS5zaG93KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuanMtbWVudS1vdmVybGF5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICQoJy5qcy1tZW51LXRvZ2dsZXIsIC5qcy1tZW51JykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykuaGlkZSgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciAkaGVhZGVyID0gJCgnaGVhZGVyJyk7XG4gICAgICAgIHZhciBoZWFkZXJIZWlnaHQgPSAkaGVhZGVyLm91dGVySGVpZ2h0KCk7XG4gICAgICAgIHZhciBxID0gMTtcbiAgICAgICAgdmFyIGFjdGlvbiA9IDA7XG4gICAgICAgIHZhciBwaW5IZWFkZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiBoZWFkZXJIZWlnaHQgKiBxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWN0aW9uID0gMTtcbiAgICAgICAgICAgICAgICAkaGVhZGVyLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKHsncGFkZGluZy10b3AnOiBoZWFkZXJIZWlnaHR9KTtcbiAgICAgICAgICAgICAgICAkaGVhZGVyLmNzcyh7J3RvcCc6IC1oZWFkZXJIZWlnaHR9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdfZml4ZWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFuaW1hdGUoeyd0b3AnOiAwfSwgMTAwMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT0gMiB8fCAhJGhlYWRlci5oYXNDbGFzcygnX2ZpeGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhY3Rpb24gPSAyO1xuICAgICAgICAgICAgICAgICRoZWFkZXIuYW5pbWF0ZSh7J3RvcCc6IC1oZWFkZXJIZWlnaHR9LCBcImZhc3RcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkaGVhZGVyLmNzcyh7J3RvcCc6IDB9KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmNzcyh7J3BhZGRpbmctdG9wJzogMH0pO1xuICAgICAgICAgICAgICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdfZml4ZWQnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcpIHtcbiAgICAgICAgICAgIHBpbkhlYWRlcigpO1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkIHNjcm9sbCcsIHBpbkhlYWRlcik7XG4gICAgICAgIH1cbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcpIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJIZWlnaHQgPSAkaGVhZGVyLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBwaW5IZWFkZXIpO1xuICAgICAgICAgICAgICAgICQoJy5qcy1tZW51JykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkKCcuanMtbWVudS1vdmVybGF5JykuaGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykub2ZmKCdzY3JvbGwnLCBwaW5IZWFkZXIpO1xuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAgICAgICAgICAgICAgICRoZWFkZXIucmVtb3ZlQ2xhc3MoJ19maXhlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgaW5pdEZvb3RlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZml4TWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykub3V0ZXJXaWR0aCgpID49IGFwcENvbmZpZy5icmVha3BvaW50Lm1kICYmICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5sZykge1xuICAgICAgICAgICAgICAgICQoJy5mb290ZXJfX21lbnUtc2Vjb25kJykuY3NzKCdsZWZ0JywgJCgnLmZvb3Rlcl9fbWVudSAubWVudSA+IGxpOm50aC1jaGlsZCgzKScpLm9mZnNldCgpLmxlZnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuZm9vdGVyX19tZW51LXNlY29uZCcpLmNzcygnbGVmdCcsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZpeE1lbnUoKTtcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkIHJlc2l6ZScsIGZpeE1lbnUpO1xuICAgIH0sXG5cbiAgICBpbml0Q3V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5qcy1jdXQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLmpzLWN1dF9fdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGNvbnRlbnQgPSAkKHRoaXMpLnNpYmxpbmdzKCcuanMtY3V0X19jb250ZW50JyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U2hvdyA9ICQodGhpcykuZGF0YSgndGV4dHNob3cnKSB8fCAnc2hvdyB0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRIaWRlID0gJCh0aGlzKS5kYXRhKCd0ZXh0aGlkZScpIHx8ICdoaWRlIHRleHQnO1xuICAgICAgICAgICAgICAgICQodGhpcykudGV4dCgkY29udGVudC5pcygnOnZpc2libGUnKSA/IHRleHRTaG93IDogdGV4dEhpZGUpO1xuICAgICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ19vcGVuZWQnKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuanMtY3V0X19jb250ZW50Jykuc2xpZGVUb2dnbGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuanMtZmlsdGVyX19jb3VudGVyJykudHJpZ2dlcihcInN0aWNreV9raXQ6cmVjYWxjXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIGluaXRTbGlkZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5qcy1tYWluLXNsaWRlcicpLnNsaWNrKHtcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IGFwcENvbmZpZy5icmVha3BvaW50Lm1kIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuanMtc2xpZGVyJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2xpZGVzID0gJCh0aGlzKS5kYXRhKCdzbGlkZXMnKSB8fCB7fTtcbiAgICAgICAgICAgICQodGhpcykuc2xpY2soe1xuICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiBzbGlkZXMuc20gfHwgMSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiBhcHBDb25maWcuYnJlYWtwb2ludC5tZCAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogc2xpZGVzLm1kIHx8IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IGFwcENvbmZpZy5icmVha3BvaW50LmxnIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiBzbGlkZXMubGcgfHwgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmpzLW5hdi1zbGlkZXJfX21haW4nKS5zbGljayh7XG4gICAgICAgICAgICBkb3RzOiBmYWxzZSxcbiAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgICAgIGFzTmF2Rm9yOiAnLmpzLW5hdi1zbGlkZXJfX25hdicsXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgcmVzcG9uc2l2ZSA9IHtcbiAgICAgICAgICAgIHByb2R1Y3Q6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IGFwcENvbmZpZy5icmVha3BvaW50LmxnIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWxTd2lwaW5nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiA1LFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBjb250ZW50OiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiBhcHBDb25maWcuYnJlYWtwb2ludC5tZCAtIDEsXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsU3dpcGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogNCxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiBhcHBDb25maWcuYnJlYWtwb2ludC5sZyAtIDEsXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsU3dpcGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogNSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9XG4gICAgICAgICQoJy5qcy1uYXYtc2xpZGVyX19uYXYnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcykuc2xpY2soe1xuICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhc05hdkZvcjogJy5qcy1uYXYtc2xpZGVyX19tYWluJyxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDMsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgICAgICAgZm9jdXNPblNlbGVjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiByZXNwb25zaXZlWyQodGhpcykuZGF0YSgncmVzcG9uc2l2ZScpXSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLmpzLW5hdi1zbGlkZXJfX21haW4uc2xpY2staW5pdGlhbGl6ZWQnKS5zbGljaygnc2V0UG9zaXRpb24nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gb25seSBzbSBzbGlkZXJzXG4gICAgICAgIHZhciBpc01vYmlsZSA9IGZhbHNlO1xuICAgICAgICB2YXIgaW5pdFNtU2xpZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLmpzLXNtLXNsaWRlcicpLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZGVzdHJveVNtU2xpZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLmpzLXNtLXNsaWRlci5zbGljay1pbml0aWFsaXplZCcpLnNsaWNrKCd1bnNsaWNrJyk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBpc01vYmlsZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5tZDtcbiAgICAgICAgdmFyIGNoZWNrU21TbGlkZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbmV3U2l6ZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5tZDtcbiAgICAgICAgICAgIGlmIChuZXdTaXplICE9IGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgaXNNb2JpbGUgPSBuZXdTaXplO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgaW5pdFNtU2xpZGVyKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlc3Ryb3lTbVNsaWRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgICQod2luZG93KS5vbignbG9hZCByZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaGVja1NtU2xpZGVyKCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBpbml0VGFnczogZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCcuanMtdGFnJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgXG4gICAgaW5pdEhvdmVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5qcy1ob3ZlcicpLnVuYmluZCgnbW91c2VlbnRlciBtb3VzZWxlYXZlJyk7XG4gICAgICAgIGlmICgkKHdpbmRvdykub3V0ZXJXaWR0aCgpID49IGFwcENvbmZpZy5icmVha3BvaW50LmxnKSB7XG4gICAgICAgICAgICAkKCcuanMtaG92ZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMsICRwYXJlbnQsICR3cmFwLCAkaG92ZXIsIGgsIHc7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHRoaXMuaGFzQ2xhc3MoJ19ob3ZlcicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldCA9ICR0aGlzLm9mZnNldCgpO1xuICAgICAgICAgICAgICAgICAgICAkcGFyZW50ID0gJHRoaXMucGFyZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICRwYXJlbnQuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAkcGFyZW50Lm91dGVySGVpZ2h0KClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGggPSAkdGhpcy5vdXRlckhlaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICB3ID0gJHRoaXMub3V0ZXJXaWR0aCgpO1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogdyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiBoLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJHdyYXAgPSAkKCc8ZGl2Lz4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbygnYm9keScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0b3AnOiBvZmZzZXQudG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbGVmdCc6IG9mZnNldC5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiB3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogaCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJGhvdmVyID0gJCgnPGRpdi8+JykuYXBwZW5kVG8oJHdyYXApO1xuICAgICAgICAgICAgICAgICAgICAkaG92ZXIuYWRkQ2xhc3MoJ2hvdmVyJyk7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmFwcGVuZFRvKCR3cmFwKS5hZGRDbGFzcygnX2hvdmVyJyk7XG4gICAgICAgICAgICAgICAgICAgICRob3Zlci5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogJy0xMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICctMTBweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodDogJy0xMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogJy0xMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgJHdyYXAub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkaG92ZXIuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJzAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAnMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJHBhcmVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnX2hvdmVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwYXJlbnQucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkd3JhcC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGluaXRTY3JvbGxiYXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnLmpzLXNjcm9sbGJhcicpLnNjcm9sbGJhcih7XG4gICAgICAgICAgICBkaXNhYmxlQm9keVNjcm9sbDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBpbml0U2VhcmNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciAkaW5wdXQgPSAkKCcuanMtc2VhcmNoLWZvcm1fX2lucHV0Jyk7XG4gICAgICAgICRpbnB1dC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSk7XG4gICAgICAgICRpbnB1dC5vbignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuanMtc2VhcmNoLXJlcycpLmFkZENsYXNzKCdfYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKHdpbmRvdykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLmpzLXNlYXJjaC1yZXMnKS5yZW1vdmVDbGFzcygnX2FjdGl2ZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICog0KHRgtGA0L7QutCwINC/0L7QuNGB0LrQsFxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IHNlYXJjaEFsbCA9ICQoJy5qLXNlYXJjaC1zaG93X2FsbCcpO1xuICAgICAgICBsZXQgc2VhcmNoU3RyaW5nID0gc2VhcmNoQWxsLmF0dHIoJ2RhdGEtcGFnZScpO1xuXG4gICAgICAgICQoJy5zZWFyY2gtZm9ybV9fc3VibWl0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICBzZWFyY2hBbGwudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQvtCx0YDQsNCx0L7RgtGH0LjQuiDQvdCw0LbQsNGC0LjRj1xuICAgICAgICAgKi9cbiAgICAgICAgJGlucHV0Lm9uKCdpbnB1dCcsIHRoaXMuZGVib3VuY2UoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgc2VhcmNoQWxsLmhpZGUoKTtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICBzZWFyY2hBbGwuYXR0cignaHJlZicsIHNlYXJjaFN0cmluZyArICc/cT0nICsgJCh0aGlzKS52YWwoKSk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2Jhc2VpbmZvL3NlYXJjaC5waHAnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6ICQodGhpcykucGFyZW50KCkuc2VyaWFsaXplKCksXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmotdG9wLXNlYXJjaC13cmFwZXInKS5odG1sKGRhdGEuaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLmh0bWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hBbGwuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDMwMCkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBmdW5jXG4gICAgICogQHBhcmFtIHdhaXRcbiAgICAgKiBAcGFyYW0gaW1tZWRpYXRlXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuICAgICAqXG4gICAgICovXG4gICAgZGVib3VuY2U6IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgICAgICB2YXIgdGltZW91dDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICAgICAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICB9LFxuXG5cbiAgICBpbml0Q2F0YWxvZzogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaXNNb2JpbGUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcsXG4gICAgICAgICAgICAgICAgJHNsaWRlID0gJCgnLmpzLWNtX19zbGlkZScpLFxuICAgICAgICAgICAgICAgICRzbGlkZVRyaWdnZXIgPSAkKCcuanMtY21fX3NsaWRlX190cmlnZ2VyJyksXG4gICAgICAgICAgICAgICAgJG1lbnUgPSAkKCcuanMtY21fX21lbnUnKSxcbiAgICAgICAgICAgICAgICAkc2Nyb2xsYmFyID0gJCgnLmpzLWNtX19zY3JvbGxiYXInKSxcbiAgICAgICAgICAgICAgICAkbW9iaWxlVG9nZ2xlciA9ICQoJy5qcy1jbV9fbW9iaWxlLXRvZ2dsZXInKSxcbiAgICAgICAgICAgICAgICAkc2Vjb25kTGluayA9ICQoJy5qcy1jbV9fc2Vjb25kLWxpbmsnKSxcbiAgICAgICAgICAgICAgICAkc2Vjb25kQ2xvc2UgPSAkKCcuanMtY21fX21lbnUtc2Vjb25kX19jbG9zZScpLFxuICAgICAgICAgICAgICAgICR3cmFwcGVyID0gJCgnLmpzLWNtX19tZW51LXdyYXBwZXInKTtcblxuICAgICAgICB2YXIgc2xpZGVNZW51ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHNsaWRlLnNsaWRlVG9nZ2xlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtZmlsdGVyX19jb3VudGVyJykudHJpZ2dlcihcInN0aWNreV9raXQ6cmVjYWxjXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkbWVudS50b2dnbGVDbGFzcygnX29wZW5lZCcpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNob3dTZWNvbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuanMtY21fX21lbnUtc2Vjb25kJykuYWRkQ2xhc3MoJ19hY3RpdmUnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBob3Zlckljb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJGljb24gPSAkKHRoaXMpLmZpbmQoJy5zcHJpdGUnKTtcbiAgICAgICAgICAgICRpY29uLmFkZENsYXNzKCRpY29uLmRhdGEoJ2hvdmVyJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHVuaG92ZXJJY29uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRpY29uID0gJCh0aGlzKS5maW5kKCcuc3ByaXRlJyk7XG4gICAgICAgICAgICAkaWNvbi5yZW1vdmVDbGFzcygkaWNvbi5kYXRhKCdob3ZlcicpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbml0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHNjcm9sbGJhci5zY3JvbGxiYXIoKTtcbiAgICAgICAgICAgICRzY3JvbGxiYXIuY3NzKHsnaGVpZ2h0JzogJCh3aW5kb3cpLm91dGVySGVpZ2h0KCkgLSAkKCcuaGVhZGVyJykub3V0ZXJIZWlnaHQoKX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlc3Ryb3lTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkc2Nyb2xsYmFyLnNjcm9sbGJhcignZGVzdHJveScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc01vYmlsZSkge1xuICAgICAgICAgICAgJHNsaWRlVHJpZ2dlci5vbignY2xpY2snLCBzbGlkZU1lbnUpO1xuICAgICAgICAgICAgJHNlY29uZExpbmsucGFyZW50KCkuaG92ZXIoaG92ZXJJY29uLCB1bmhvdmVySWNvbilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzZWNvbmRMaW5rLm9uKCdjbGljaycsIHNob3dTZWNvbmQpO1xuICAgICAgICAgICAgaW5pdFNjcm9sbGJhcigpO1xuICAgICAgICB9XG4gICAgICAgICRtb2JpbGVUb2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICR3cmFwcGVyLnRvZ2dsZUNsYXNzKCdfYWN0aXZlJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICAkc2Vjb25kQ2xvc2Uub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuanMtY21fX21lbnUtc2Vjb25kJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFpc01vYmlsZSAmJiAhJG1lbnUuaGFzQ2xhc3MoJ19vcGVuZWQnKSkge1xuICAgICAgICAgICAgJHNsaWRlLnNsaWRlVXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQoJy5qcy1maWx0ZXJfX2NvdW50ZXInKS50cmlnZ2VyKFwic3RpY2t5X2tpdDpyZWNhbGNcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGVja01lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbmV3U2l6ZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5sZztcbiAgICAgICAgICAgIGlmIChuZXdTaXplICE9IGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgaXNNb2JpbGUgPSBuZXdTaXplO1xuICAgICAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2xpZGUuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkbWVudS5hZGRDbGFzcygnX29wZW5lZCcpO1xuICAgICAgICAgICAgICAgICAgICAkc2xpZGVUcmlnZ2VyLm9mZignY2xpY2snLCBzbGlkZU1lbnUpO1xuICAgICAgICAgICAgICAgICAgICAkc2Vjb25kTGluay5vbignY2xpY2snLCBzaG93U2Vjb25kKTtcbiAgICAgICAgICAgICAgICAgICAgJHNlY29uZExpbmsub2ZmKCdtb3VzZWVudGVyIG1vdXNlbGVhdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgJHNlY29uZExpbmsucGFyZW50KCkub2ZmKCdtb3VzZWVudGVyIG1vdXNlbGVhdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgaW5pdFNjcm9sbGJhcigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICR3cmFwcGVyLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICRzbGlkZVRyaWdnZXIub24oJ2NsaWNrJywgc2xpZGVNZW51KTtcbiAgICAgICAgICAgICAgICAgICAgJHNlY29uZExpbmsub2ZmKCdjbGljaycsIHNob3dTZWNvbmQpO1xuICAgICAgICAgICAgICAgICAgICAkc2Vjb25kTGluay5wYXJlbnQoKS5ob3Zlcihob3Zlckljb24sIHVuaG92ZXJJY29uKTtcbiAgICAgICAgICAgICAgICAgICAgZGVzdHJveVNjcm9sbGJhcigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHdyYXBwZXIuaGFzQ2xhc3MoJ19hYnNvbHV0ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbWVudS5yZW1vdmVDbGFzcygnX29wZW5lZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlLnNsaWRlVXAoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChuZXdTaXplKSB7XG4gICAgICAgICAgICAgICAgJHNjcm9sbGJhci5jc3MoeydoZWlnaHQnOiAkKHdpbmRvdykub3V0ZXJIZWlnaHQoKSAtICQoJy5oZWFkZXInKS5vdXRlckhlaWdodCgpfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaGVja01lbnUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gdG9nZ2xlIGNhdGFsb2cgbGlzdCB2aWV3XG4gICAgICAgICQoJy5qcy1jYXRhbG9nLXZpZXctdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5qcy1jYXRhbG9nLXZpZXctdG9nZ2xlcicpLnRvZ2dsZUNsYXNzKCdfYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcuanMtY2F0YWxvZy1saXN0IC5qcy1jYXRhbG9nLWxpc3RfX2l0ZW0sIC5qcy1jYXRhbG9nLWxpc3QgLmpzLWNhdGFsb2ctbGlzdF9faXRlbSAuY2F0YWxvZy1saXN0X19pdGVtX19jb250ZW50JykudG9nZ2xlQ2xhc3MoJ19jYXJkJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBpbml0UG9wdXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBiYXNlQ2xhc3M6ICdfcG9wdXAnLFxuICAgICAgICAgICAgYXV0b0ZvY3VzOiBmYWxzZSxcbiAgICAgICAgICAgIHRvdWNoOiBmYWxzZSxcbiAgICAgICAgICAgIGFmdGVyU2hvdzogZnVuY3Rpb24gKGluc3RhbmNlLCBzbGlkZSkge1xuICAgICAgICAgICAgICAgIHNsaWRlLiRzbGlkZS5maW5kKCcuc2xpY2staW5pdGlhbGl6ZWQnKS5zbGljaygnc2V0UG9zaXRpb24nKTtcbiAgICAgICAgICAgICAgICB2YXIgJHNoaXBwaW5nID0gc2xpZGUuJHNsaWRlLmZpbmQoJy5qcy1zaGlwcGluZycpO1xuICAgICAgICAgICAgICAgIGlmICgkc2hpcHBpbmcubGVuZ3RoICYmICEkc2hpcHBpbmcuZGF0YSgnaW5pdCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcC5zaGlwcGluZy5pbml0KCRzaGlwcGluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAkKCcuanMtcG9wdXAnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkLmZhbmN5Ym94LmNsb3NlKCk7XG4gICAgICAgIH0pLmZhbmN5Ym94KG9wdGlvbnMpO1xuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggJiYgd2luZG93LmxvY2F0aW9uLmhhc2ggIT09ICcjJykge1xuICAgICAgICAgICAgdmFyICRjbnQgPSAkKHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcbiAgICAgICAgICAgIGlmICgkY250Lmxlbmd0aCAmJiAkY250Lmhhc0NsYXNzKCdwb3B1cCcpKSB7XG4gICAgICAgICAgICAgICAgJC5mYW5jeWJveC5vcGVuKCRjbnQsIG9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGluaXRGb3JtTGFiZWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRpbnB1dHMgPSAkKCcuanMtZm9ybV9fbGFiZWwnKS5maW5kKCc6bm90KFtyZXF1aXJlZF0pJyk7XG4gICAgICAgICRpbnB1dHNcbiAgICAgICAgICAgICAgICAub24oJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCdsYWJlbCcpLnJlbW92ZUNsYXNzKCdmb3JtX19sYWJlbF9fZW1wdHknKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5vbignYmx1cicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkKHRoaXMpLnZhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCdsYWJlbCcpLmFkZENsYXNzKCdmb3JtX19sYWJlbF9fZW1wdHknKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZpbHRlcignW3ZhbHVlPVwiXCJdLCA6bm90KFt2YWx1ZV0pJykuc2libGluZ3MoJ2xhYmVsJykuYWRkQ2xhc3MoJ2Zvcm1fX2xhYmVsX19lbXB0eScpO1xuICAgIH0sXG5cbiAgICBpbml0UmVnaW9uU2VsZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5qcy1yZWdpb24tdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWwgPSAkKHRoaXMpLmRhdGEoJ3RvZ2dsZScpO1xuICAgICAgICAgICAgaWYgKHNlbCkge1xuICAgICAgICAgICAgICAgICQoc2VsKS5zbGlkZVRvZ2dsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmpzLXJlZ2lvbi1jbG9zZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJy5yZWdpb24tc2VsZWN0Jykuc2xpZGVVcCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyICRoZWFkZXJSZWdpb25TZWxlY3QgPSAkKCcuaGVhZGVyIC5yZWdpb24tc2VsZWN0Jyk7XG4gICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCRoZWFkZXJSZWdpb25TZWxlY3QuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAkaGVhZGVyUmVnaW9uU2VsZWN0LnNsaWRlVXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGluaXRUYWJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpc01vYmlsZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5tZCxcbiAgICAgICAgICAgICAgICAkdGFicyA9ICQoJy5qcy10YWJzX190YWInKSxcbiAgICAgICAgICAgICAgICAkdG9nZ2xlcnMgPSAkKCcuanMtdGFic19fdGFiIC50YWJzX190YWJfX3RvZ2dsZXInKSxcbiAgICAgICAgICAgICAgICAkY29udGVudCA9ICQoJy5qcy10YWJzX190YWIgLnRhYnNfX3RhYl9fY29udGVudCcpO1xuICAgICAgICBpZiAoISR0YWJzLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAkdG9nZ2xlcnMub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnX29wZW5lZCcpO1xuICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnRhYnNfX3RhYl9fY29udGVudCcpLnNsaWRlVG9nZ2xlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmlzKCc6dmlzaWJsZScpXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICQodGhpcykudHJpZ2dlcigndGFic19zbGlkZV9vcGVuJywgJCh0aGlzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogJCh0aGlzKS50cmlnZ2VyKCd0YWJzX3NsaWRlX2Nsb3NlJywgJCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgaW5pdEV0YWJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5ld1NpemUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQ7XG4gICAgICAgICAgICBpZiAobmV3U2l6ZSAhPSBpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gbmV3U2l6ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgICR0YWJzLnNob3coKTtcbiAgICAgICAgICAgICAgICAkdG9nZ2xlcnMucmVtb3ZlQ2xhc3MoJ19vcGVuZWQnKTtcbiAgICAgICAgICAgICAgICAkY29udGVudC5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICR0YWJzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAkY29udGVudC5zaG93KCk7XG4gICAgICAgICAgICAgICAgJCgnLmpzLXRhYnMnKS5lYXN5dGFicyh7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUhhc2g6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSkuYmluZCgnZWFzeXRhYnM6bWlkVHJhbnNpdGlvbicsIGZ1bmN0aW9uIChldmVudCwgJGNsaWNrZWQsICR0YXJnZXRQYW5lbCwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICR1bmRlciA9ICQodGhpcykuZmluZCgnLmpzLXRhYnNfX3VuZGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICR1bmRlci5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJGNsaWNrZWQucGFyZW50KCkucG9zaXRpb24oKS5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICRjbGlja2VkLndpZHRoKCksXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICR0YWJzLmZpbHRlcignLmFjdGl2ZScpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgaW5pdFVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLmpzLXRhYnMnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHVuZGVyID0gJCh0aGlzKS5maW5kKCcuanMtdGFic19fdW5kZXInKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICRhY3RpdmVMaW5rID0gJCh0aGlzKS5maW5kKCcudGFic19fbGlzdCAuYWN0aXZlIGEnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA9ICRhY3RpdmVMaW5rLm91dGVySGVpZ2h0KCkgLSAkdW5kZXIub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoJGFjdGl2ZUxpbmsubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICR1bmRlci5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogJ2F1dG8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiB0b3AsXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAkYWN0aXZlTGluay5wYXJlbnQoKS5wb3NpdGlvbigpLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJGFjdGl2ZUxpbmsud2lkdGgoKSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaW5pdEV0YWJzKCk7XG4gICAgICAgIGluaXRVbmRlcigpO1xuICAgICAgICAkKHdpbmRvdykub24oJ2xvYWQgcmVzaXplJywgaW5pdEV0YWJzKTtcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkIHJlc2l6ZScsIGluaXRVbmRlcik7XG4gICAgfSxcblxuICAgIGluaXRRQTogZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCcuanMtcWE6bm90KC5fYWN0aXZlKSAucWFfX2EnKS5zbGlkZVVwKCk7XG4gICAgICAgICQoJy5qcy1xYScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgJHRvZ2dsZXIgPSAkdGhpcy5maW5kKCcucWFfX3EgLnFhX19oJyksXG4gICAgICAgICAgICAgICAgICAgICRhbnN3ZXIgPSAkdGhpcy5maW5kKCcucWFfX2EnKTtcbiAgICAgICAgICAgICR0b2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICRhbnN3ZXIuc2xpZGVUb2dnbGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgaW5pdElNbWVudTogZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCcuanMtaW0tbWVudV9fdG9nZ2xlcjpub3QoLl9vcGVuZWQpJykuc2libGluZ3MoJy5qcy1pbS1tZW51X19zbGlkZScpLnNsaWRlVXAoKTtcbiAgICAgICAgJCgnLmpzLWltLW1lbnVfX3RvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdfb3BlbmVkJyk7XG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuanMtaW0tbWVudV9fc2xpZGUnKS5zbGlkZVRvZ2dsZSgpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgaW5pdFNlbGVjdHM6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAkKCcuanMtc2VsZWN0X2Fsd2F5cycpLnN0eWxlcigpO1xuICAgICAgICB2YXIgaXNNb2JpbGUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQsXG4gICAgICAgICAgICAgICAgJHNlbGVjdHMgPSAkKCcuanMtc2VsZWN0Jyk7XG4gICAgICAgIGlmICghJHNlbGVjdHMubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzZWxlY3RzLnN0eWxlcigpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzZWxlY3RzLnN0eWxlcignZGVzdHJveScpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgcmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuZXdTaXplID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50Lm1kO1xuICAgICAgICAgICAgaWYgKG5ld1NpemUgIT0gaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBpc01vYmlsZSA9IG5ld1NpemU7XG4gICAgICAgICAgICAgICAgaWYgKCFpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBpbml0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIWlzTW9iaWxlKSB7XG4gICAgICAgICAgICBpbml0KCk7XG4gICAgICAgIH1cbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCByZWZyZXNoKTtcbiAgICB9LFxuXG4gICAgaW5pdE1hc2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnLmpzLW1hc2tfX3RlbCcpLmlucHV0bWFzayh7XG4gICAgICAgICAgICBtYXNrOiAnKzkgKDk5OSkgOTk5LTk5LTk5J1xuICAgICAgICB9KTtcbiAgICAgICAgSW5wdXRtYXNrLmV4dGVuZEFsaWFzZXMoe1xuICAgICAgICAgICAgJ251bWVyaWMnOiB7XG4gICAgICAgICAgICAgICAgYXV0b1VubWFzazogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzaG93TWFza09uSG92ZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJhZGl4UG9pbnQ6IFwiLFwiLFxuICAgICAgICAgICAgICAgIGdyb3VwU2VwYXJhdG9yOiBcIiBcIixcbiAgICAgICAgICAgICAgICBkaWdpdHM6IDAsXG4gICAgICAgICAgICAgICAgYWxsb3dNaW51czogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXV0b0dyb3VwOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJpZ2h0QWxpZ246IGZhbHNlLFxuICAgICAgICAgICAgICAgIHVubWFza0FzTnVtYmVyOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAkKCdodG1sOm5vdCguaWUpIC5qcy1tYXNrJykuaW5wdXRtYXNrKCk7XG4gICAgfSxcblxuICAgIGluaXRSYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCcuanMtcmFuZ2UnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzbGlkZXIgPSAkKHRoaXMpLmZpbmQoJy5qcy1yYW5nZV9fdGFyZ2V0JylbMF0sXG4gICAgICAgICAgICAgICAgICAgICRpbnB1dHMgPSAkKHRoaXMpLmZpbmQoJ2lucHV0JyksXG4gICAgICAgICAgICAgICAgICAgIGZyb20gPSAkaW5wdXRzLmZpcnN0KClbMF0sXG4gICAgICAgICAgICAgICAgICAgIHRvID0gJGlucHV0cy5sYXN0KClbMF07XG4gICAgICAgICAgICBpZiAoc2xpZGVyICYmIGZyb20gJiYgdG8pIHtcbiAgICAgICAgICAgICAgICB2YXIgbWluViA9IHBhcnNlSW50KGZyb20udmFsdWUpIHx8IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhWID0gcGFyc2VJbnQodG8udmFsdWUpIHx8IDA7XG4gICAgICAgICAgICAgICAgdmFyIG1pbiA9IHBhcnNlSW50KGZyb20uZGF0YXNldC5taW4pIHx8IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXggPSBwYXJzZUludCh0by5kYXRhc2V0Lm1heCkgfHwgMDtcbiAgICAgICAgICAgICAgICBub1VpU2xpZGVyLmNyZWF0ZShzbGlkZXIsIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pblYsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhWXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA6IDEwLFxuICAgICAgICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ21pbic6IG1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgICdtYXgnOiBtYXhcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBzbmFwVmFsdWVzID0gW2Zyb20sIHRvXTtcbiAgICAgICAgICAgICAgICBzbGlkZXIubm9VaVNsaWRlci5vbigndXBkYXRlJywgZnVuY3Rpb24gKHZhbHVlcywgaGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNuYXBWYWx1ZXNbaGFuZGxlXS52YWx1ZSA9IE1hdGgucm91bmQodmFsdWVzW2hhbmRsZV0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZyb20uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzbGlkZXIubm9VaVNsaWRlci5zZXQoW3RoaXMudmFsdWUsIG51bGxdKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmcm9tLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5ub1VpU2xpZGVyLnNldChbdGhpcy52YWx1ZSwgbnVsbF0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVyLm5vVWlTbGlkZXIuc2V0KFtudWxsLCB0aGlzLnZhbHVlXSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdG8uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVyLm5vVWlTbGlkZXIuc2V0KFtudWxsLCB0aGlzLnZhbHVlXSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSxcblxuICAgIGluaXRGaWx0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlzTW9iaWxlID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50LmxnLFxuICAgICAgICAgICAgICAgICRzY3JvbGxiYXIgPSAkKCcuanMtZmlsdGVyX19zY3JvbGxiYXInKSxcbiAgICAgICAgICAgICAgICAkbW9iaWxlVG9nZ2xlciA9ICQoJy5qcy1maWx0ZXJfX21vYmlsZS10b2dnbGVyJyksXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIgPSAkKCcuanMtZmlsdGVyJyk7XG5cbiAgICAgICAgdmFyIGluaXRTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkc2Nyb2xsYmFyLnNjcm9sbGJhcigpO1xuICAgICAgICAgICAgJHNjcm9sbGJhci5jc3MoeydoZWlnaHQnOiAkKHdpbmRvdykub3V0ZXJIZWlnaHQoKSAtICQoJy5oZWFkZXInKS5vdXRlckhlaWdodCgpfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVzdHJveVNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzY3JvbGxiYXIuc2Nyb2xsYmFyKCdkZXN0cm95Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNNb2JpbGUpIHtcbiAgICAgICAgICAgIGluaXRTY3JvbGxiYXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJy5qcy1maWx0ZXJfX2NvdW50ZXInKS5zdGlja19pbl9wYXJlbnQoe29mZnNldF90b3A6IDEwMH0pXG4gICAgICAgIH1cblxuICAgICAgICAkbW9iaWxlVG9nZ2xlci5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkd3JhcHBlci50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcuanMtZmlsdGVyLWZpZWxkc2V0JykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJHRyaWdnZXIgPSAkKHRoaXMpLmZpbmQoJy5qcy1maWx0ZXItZmllbGRzZXRfX3RyaWdnZXInKSxcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlID0gJCh0aGlzKS5maW5kKCcuanMtZmlsdGVyLWZpZWxkc2V0X19zbGlkZScpO1xuICAgICAgICAgICAgJHRyaWdnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ19jbG9zZWQnKTtcbiAgICAgICAgICAgICAgICAkc2xpZGUuc2xpZGVUb2dnbGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuanMtZmlsdGVyX19jb3VudGVyJykudHJpZ2dlcihcInN0aWNreV9raXQ6cmVjYWxjXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBjaGVjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuZXdTaXplID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50LmxnO1xuICAgICAgICAgICAgaWYgKG5ld1NpemUgIT0gaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBpc01vYmlsZSA9IG5ld1NpemU7XG4gICAgICAgICAgICAgICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGluaXRTY3JvbGxiYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWZpbHRlcl9fY291bnRlcicpLnRyaWdnZXIoXCJzdGlja3lfa2l0OmRldGFjaFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkd3JhcHBlci5yZW1vdmVDbGFzcygnX2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICBkZXN0cm95U2Nyb2xsYmFyKCk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1maWx0ZXJfX2NvdW50ZXInKS5zdGlja19pbl9wYXJlbnQoe29mZnNldF90b3A6IDEwMH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5ld1NpemUpIHtcbiAgICAgICAgICAgICAgICAkc2Nyb2xsYmFyLmNzcyh7J2hlaWdodCc6ICQod2luZG93KS5vdXRlckhlaWdodCgpIC0gJCgnLmhlYWRlcicpLm91dGVySGVpZ2h0KCl9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBpbml0Q3JlYXRlUHJpY2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRpdGVtcyA9ICQoJy5qcy1jcmVhdGUtcHJpY2VfX2l0ZW0nKSxcbiAgICAgICAgICAgICAgICAkcGFyZW50cyA9ICQoJy5qcy1jcmVhdGUtcHJpY2VfX3BhcmVudCcpLFxuICAgICAgICAgICAgICAgICRjb3VudGVyID0gJCgnLmpzLWNyZWF0ZS1wcmljZV9fY291bnRlcicpLFxuICAgICAgICAgICAgICAgICRhbGwgPSAkKCcuanMtY3JlYXRlLXByaWNlX19hbGwnKSxcbiAgICAgICAgICAgICAgICAkY2xlYXIgPSAkKCcuanMtY3JlYXRlLXByaWNlX19jbGVhcicpLFxuICAgICAgICAgICAgICAgIGRlY2wxID0gWyfQktGL0LHRgNCw0L3QsDogJywgJ9CS0YvQsdGA0LDQvdC+OiAnLCAn0JLRi9Cx0YDQsNC90L46ICddLFxuICAgICAgICAgICAgICAgIGRlY2wyID0gWycg0LrQsNGCZdCz0L7RgNC40Y8nLCAnINC60LDRgtC10LPQvtGA0LjQuCcsICcg0LrQsNGC0LXQs9C+0YDQuNC5J10sXG4gICAgICAgICAgICAgICAgaXNNb2JpbGUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQ7XG4gICAgICAgIGlmICgkaXRlbXMubGVuZ3RoID09IDApXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBjb3VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0b3RhbCA9ICRpdGVtcy5maWx0ZXIoJzpjaGVja2VkJykubGVuZ3RoO1xuICAgICAgICAgICAgJGNvdW50ZXIudGV4dChhcHAuZ2V0TnVtRW5kaW5nKHRvdGFsLCBkZWNsMSkgKyB0b3RhbCArIGFwcC5nZXROdW1FbmRpbmcodG90YWwsIGRlY2wyKSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvdW50KCk7XG4gICAgICAgICRpdGVtcy5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICR3cmFwcGVyID0gJCh0aGlzKS5wYXJlbnRzKCcuanMtY3JlYXRlLXByaWNlX193cmFwcGVyJyk7XG4gICAgICAgICAgICBpZiAoJHdyYXBwZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGl0ZW1zID0gJHdyYXBwZXIuZmluZCgnLmpzLWNyZWF0ZS1wcmljZV9faXRlbScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJHBhcmVudCA9ICR3cmFwcGVyLmZpbmQoJy5qcy1jcmVhdGUtcHJpY2VfX3BhcmVudCcpO1xuICAgICAgICAgICAgICAgICRwYXJlbnQucHJvcCgnY2hlY2tlZCcsICRpdGVtcy5maWx0ZXIoJzpjaGVja2VkJykubGVuZ3RoICE9PSAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvdW50KCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkcGFyZW50cy5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRjaGlsZHMgPSAkKHRoaXMpLnBhcmVudHMoJy5qcy1jcmVhdGUtcHJpY2VfX3dyYXBwZXInKS5maW5kKCcuanMtY3JlYXRlLXByaWNlX19pdGVtJyk7XG4gICAgICAgICAgICAkY2hpbGRzLnByb3AoJ2NoZWNrZWQnLCAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSk7XG4gICAgICAgICAgICBjb3VudCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgJGFsbC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkaXRlbXMucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgJHBhcmVudHMucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgY291bnQoKTtcbiAgICAgICAgfSlcbiAgICAgICAgJGNsZWFyLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRpdGVtcy5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgJHBhcmVudHMucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIGNvdW50KCk7XG4gICAgICAgIH0pXG4gICAgICAgIC8vIGZpeCBoZWFkZXJcbiAgICAgICAgdmFyICRoZWFkID0gJCgnLmNhdGFsb2ctY3JlYXRlLWhlYWQuX2Zvb3QnKTtcbiAgICAgICAgdmFyIGJyZWFrcG9pbnQsIHdIZWlnaHQ7XG4gICAgICAgIGZpeEluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBicmVha3BvaW50ID0gJGhlYWQub2Zmc2V0KCkudG9wO1xuICAgICAgICAgICAgd0hlaWdodCA9ICQod2luZG93KS5vdXRlckhlaWdodCgpO1xuICAgICAgICAgICAgZml4SGVhZCgpO1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmaXhIZWFkKTtcbiAgICAgICAgfVxuICAgICAgICBmaXhIZWFkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSArIHdIZWlnaHQgPCBicmVha3BvaW50KSB7XG4gICAgICAgICAgICAgICAgJGhlYWQuYWRkQ2xhc3MoJ19maXhlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkaGVhZC5yZW1vdmVDbGFzcygnX2ZpeGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICAgICAgICBmaXhJbml0KCk7XG4gICAgICAgIH1cbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbmV3U2l6ZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5sZztcbiAgICAgICAgICAgIGlmIChuZXdTaXplICE9IGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgaXNNb2JpbGUgPSBuZXdTaXplO1xuICAgICAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBmaXhJbml0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9mZignc2Nyb2xsJywgZml4SGVhZCk7XG4gICAgICAgICAgICAgICAgICAgICRoZWFkLnJlbW92ZUNsYXNzKCdfZml4ZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gJCAkd3JhcHBlclxuICAgICAqL1xuICAgIGluaXRTaGlwcGluZ0NhbGM6IGZ1bmN0aW9uICgkd3JhcHBlcikge1xuICAgICAgICB2YXIgJHNsaWRlciA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fY2FyLXNsaWRlcicpLFxuICAgICAgICAgICAgICAgICRyYWRpbyA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fY2FyLXJhZGlvJyk7XG4gICAgICAgIGlmICgkc2xpZGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgJHNsaWRlci5zbGljayh7XG4gICAgICAgICAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZhZGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHJhZGlvLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAkKHRoaXMpLnBhcmVudHMoJy5qcy1zaGlwcGluZ19fY2FyLWxhYmVsJykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAkc2xpZGVyLnNsaWNrKCdzbGlja0dvVG8nLCBpbmRleCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHZhciAkZGF0ZWlucHV0V3JhcHBlciA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZS1pbnB1dCcpLFxuICAgICAgICAgICAgICAgICRkYXRlaW5wdXQgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2RhdGUtaW5wdXRfX2lucHV0JyksXG4gICAgICAgICAgICAgICAgZGlzYWJsZWREYXlzID0gWzAsIDZdO1xuICAgICAgICAkZGF0ZWlucHV0LmRhdGVwaWNrZXIoe1xuICAgICAgICAgICAgcG9zaXRpb246ICd0b3AgcmlnaHQnLFxuICAgICAgICAgICAgb2Zmc2V0OiA0MCxcbiAgICAgICAgICAgIG5hdlRpdGxlczoge1xuICAgICAgICAgICAgICAgIGRheXM6ICdNTSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtaW5EYXRlOiBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldFRpbWUoKSArIDg2NDAwICogMTAwMCAqIDIpLFxuICAgICAgICAgICAgb25SZW5kZXJDZWxsOiBmdW5jdGlvbiAoZGF0ZSwgY2VsbFR5cGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT0gJ2RheScpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRheSA9IGRhdGUuZ2V0RGF5KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXNhYmxlZCA9IGRpc2FibGVkRGF5cy5pbmRleE9mKGRheSkgIT0gLTE7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiBpc0Rpc2FibGVkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uIChmb3JtYXR0ZWREYXRlLCBkYXRlLCBpbnN0KSB7XG4gICAgICAgICAgICAgICAgaW5zdC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgJGRhdGVpbnB1dFdyYXBwZXIucmVtb3ZlQ2xhc3MoJ19lbXB0eScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGRhdGVwaWNrZXIgPSAkZGF0ZWlucHV0LmRhdGVwaWNrZXIoKS5kYXRhKCdkYXRlcGlja2VyJyk7XG4gICAgICAgICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZXBpY2tlci10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGF0ZXBpY2tlci5zaG93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIG1hcFxuICAgICAgICB2YXIgbWFwLCAkcm91dGVBZGRyZXNzID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yb3V0ZS1hZGRyZXNzJyksXG4gICAgICAgICAgICAgICAgJHJvdXRlRGlzdGFuY2UgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3JvdXRlLWRpc3RhbmNlJyk7XG4gICAgICAgIHZhciBpbml0TWFwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGJhbGxvb25MYXlvdXQgPSB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoXG4gICAgICAgICAgICAgICAgICAgIFwiPGRpdj5cIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLnN1cGVyY2xhc3MuYnVpbGQuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHZhciBtdWx0aVJvdXRlID0gbmV3IHltYXBzLm11bHRpUm91dGVyLk11bHRpUm91dGUoe1xuICAgICAgICAgICAgICAgIC8vINCe0L/QuNGB0LDQvdC40LUg0L7Qv9C+0YDQvdGL0YUg0YLQvtGH0LXQuiDQvNGD0LvRjNGC0LjQvNCw0YDRiNGA0YPRgtCwLlxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVBvaW50czogW1xuICAgICAgICAgICAgICAgICAgICBhcHBDb25maWcuc2hpcHBpbmcuZnJvbS5nZW8sXG4gICAgICAgICAgICAgICAgICAgIGFwcENvbmZpZy5zaGlwcGluZy50by5nZW8sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0czogM1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBib3VuZHNBdXRvQXBwbHk6IHRydWUsXG4gICAgICAgICAgICAgICAgd2F5UG9pbnRTdGFydEljb25Db250ZW50TGF5b3V0OiB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBDb25maWcuc2hpcHBpbmcuZnJvbS50ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIHdheVBvaW50RmluaXNoRHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGJhbGxvb25MYXlvdXQ6IGJhbGxvb25MYXlvdXRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbXVsdGlSb3V0ZS5tb2RlbC5ldmVudHMuYWRkKCdyZXF1ZXN0c3VjY2VzcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZXREaXN0YW5jZShtdWx0aVJvdXRlLmdldEFjdGl2ZVJvdXRlKCkpO1xuICAgICAgICAgICAgICAgIHZhciBwb2ludCA9IG11bHRpUm91dGUuZ2V0V2F5UG9pbnRzKCkuZ2V0KDEpO1xuICAgICAgICAgICAgICAgIHltYXBzLmdlb2NvZGUocG9pbnQuZ2VvbWV0cnkuZ2V0Q29vcmRpbmF0ZXMoKSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvID0gcmVzLmdlb09iamVjdHMuZ2V0KDApO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWRkcmVzcyA9IG8uZ2V0QWRkcmVzc0xpbmUoKS5yZXBsYWNlKCfQndC40LbQtdCz0L7RgNC+0LTRgdC60LDRjyDQvtCx0LvQsNGB0YLRjCwgJywgJycpO1xuICAgICAgICAgICAgICAgICAgICAkcm91dGVBZGRyZXNzLnZhbChhZGRyZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlSb3V0ZS5vcHRpb25zLnNldCgnd2F5UG9pbnRGaW5pc2hJY29uQ29udGVudExheW91dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKGFkZHJlc3MpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtdWx0aVJvdXRlLmV2ZW50cy5hZGQoJ2FjdGl2ZXJvdXRlY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNldERpc3RhbmNlKG11bHRpUm91dGUuZ2V0QWN0aXZlUm91dGUoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1hcCA9IG5ldyB5bWFwcy5NYXAoXCJzaGlwcGluZ19tYXBcIiwge1xuICAgICAgICAgICAgICAgIGNlbnRlcjogYXBwQ29uZmlnLnNoaXBwaW5nLmZyb20uZ2VvLFxuICAgICAgICAgICAgICAgIHpvb206IDEzLFxuICAgICAgICAgICAgICAgIGF1dG9GaXRUb1ZpZXdwb3J0OiAnYWx3YXlzJyxcbiAgICAgICAgICAgICAgICBjb250cm9sczogW11cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbWFwLmdlb09iamVjdHMuYWRkKG11bHRpUm91dGUpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzZXREaXN0YW5jZSA9IGZ1bmN0aW9uIChyb3V0ZSkge1xuICAgICAgICAgICAgaWYgKHJvdXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5yb3VuZChyb3V0ZS5wcm9wZXJ0aWVzLmdldCgnZGlzdGFuY2UnKS52YWx1ZSAvIDEwMDApO1xuICAgICAgICAgICAgICAgICRyb3V0ZURpc3RhbmNlLnZhbChkaXN0YW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiAoeW1hcHMpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvL2FwaS1tYXBzLnlhbmRleC5ydS8yLjEvP2xhbmc9cnVfUlUmbW9kZT1kZWJ1ZycsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwic2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWUsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB5bWFwcy5yZWFkeShpbml0TWFwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xuICAgICAgICB9XG4gICAgICAgICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fbWFwLXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdfb3BlbmVkJyk7XG4gICAgICAgICAgICAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX21hcCcpLnNsaWRlVG9nZ2xlKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSBhcHBDb25maWcuYnJlYWtwb2ludC5tZCkge1xuICAgICAgICAgICAgICAgICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fbWFwLXRvZ2dsZXInKS5hZGRDbGFzcygnX29wZW5lZCcpO1xuICAgICAgICAgICAgICAgICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fbWFwJykuc2xpZGVEb3duKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAkd3JhcHBlci5kYXRhKCdpbml0JywgdHJ1ZSk7XG4gICAgfSxcblxuICAgIGluaXRRdWFudGl0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCcuanMtcXVhbnRpdHktc2hpZnQuanMtcXVhbnRpdHktdXAsIC5qcy1xdWFudGl0eS1zaGlmdC5qcy1xdWFudGl0eS1kb3duJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciAkcXVhbnRpdHlJbnB1dCA9ICQodGhpcykuc2libGluZ3MoJy5qcy1xdWFudGl0eScpWzBdO1xuICAgICAgICAgICAgaWYgKCRxdWFudGl0eUlucHV0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1ciA9IHBhcnNlSW50KCRxdWFudGl0eUlucHV0LnZhbHVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0VXAgPSAkKHRoaXMpLmhhc0NsYXNzKCdqcy1xdWFudGl0eS11cCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGltaXQgPSAkKCRxdWFudGl0eUlucHV0KS5hdHRyKHNoaWZ0VXAgPyAnbWF4JyA6ICdtaW4nKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHNoaWZ0VXAgPyBjdXIgKyAxIDogY3VyIC0gMTtcbiAgICAgICAgICAgICAgICBpZiAoIWxpbWl0IHx8IChzaGlmdFVwICYmIHZhbCA8PSBwYXJzZUludChsaW1pdCkpIHx8ICghc2hpZnRVcCAmJiB2YWwgPj0gcGFyc2VJbnQobGltaXQpKSkge1xuICAgICAgICAgICAgICAgICAgICAkcXVhbnRpdHlJbnB1dC52YWx1ZSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgJCgkcXVhbnRpdHlJbnB1dCkuY2hhbmdlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogaW5pdCBtYXAgaW4gY29udGFpbmVyXG4gICAgICogQHBhcmFtIHN0cmluZyBjbnQgaWRcbiAgICAgKiBAcmV0dXJuIE1hcCBcbiAgICAgKi9cbiAgICBtYXBJbml0OiBmdW5jdGlvbiAoY250KSB7XG4gICAgICAgIHZhciBtYXAgPSBuZXcgeW1hcHMuTWFwKGNudCwge1xuICAgICAgICAgICAgY2VudGVyOiBbNTYuMzI2ODg3LCA0NC4wMDU5ODZdLFxuICAgICAgICAgICAgem9vbTogMTEsXG4gICAgICAgICAgICBjb250cm9sczogW11cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgc3VwcHJlc3NNYXBPcGVuQmxvY2s6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBtYXAuY29udHJvbHMuYWRkKCd6b29tQ29udHJvbCcsIHtcbiAgICAgICAgICAgIHNpemU6ICdzbWFsbCdcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGFkZCBwbGFjZW1hcmtzIG9uIG1hcFxuICAgICAqIEBwYXJhbSBNYXAgbWFwXG4gICAgICogQHBhcmFtICQgaXRlbXMgd2l0aCBkYXRhLWF0dHJcbiAgICAgKiBAcmV0dXJuIGFycmF5IG9mIEdlb09iamVjdFxuICAgICAqL1xuICAgIG1hcEFkZFBsYWNlbWFya3M6IGZ1bmN0aW9uIChtYXAsICRpdGVtcykge1xuICAgICAgICB2YXIgcGxhY2VtYXJrcyA9IFtdO1xuICAgICAgICB2YXIgdHBsUGxhY2VtYXJrID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicGxhY2VtYXJrIHt7IHByb3BlcnRpZXMudHlwZSB9fVwiPjxpIGNsYXNzPVwic3ByaXRlIHt7IHByb3BlcnRpZXMudHlwZSB9fVwiPjwvaT48L2Rpdj4nXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICB0cGxCYWxsb29uID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwaWNrdXAtYmFsbG9vblwiPnt7IHByb3BlcnRpZXMudGV4dCB9fTxzcGFuIGNsYXNzPVwiYXJyb3dcIj48L3NwYW4+PC9kaXY+Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqINCh0YLRgNC+0LjRgiDRjdC60LfQtdC80L/Qu9GP0YAg0LzQsNC60LXRgtCwINC90LAg0L7RgdC90L7QstC1INGI0LDQsdC70L7QvdCwINC4INC00L7QsdCw0LLQu9GP0LXRgiDQtdCz0L4g0LIg0YDQvtC00LjRgtC10LvRjNGB0LrQuNC5IEhUTUwt0Y3Qu9C10LzQtdC90YIuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHNlZSBodHRwczovL2FwaS55YW5kZXgucnUvbWFwcy9kb2MvanNhcGkvMi4xL3JlZi9yZWZlcmVuY2UvbGF5b3V0LnRlbXBsYXRlQmFzZWQuQmFzZS54bWwjYnVpbGRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAbmFtZSBidWlsZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3Iuc3VwZXJjbGFzcy5idWlsZC5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl8kZWxlbWVudCA9ICQoJy5waWNrdXAtYmFsbG9vbicsIHRoaXMuZ2V0UGFyZW50RWxlbWVudCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICog0JjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDQsNCy0YLQvtC/0L7Qt9C40YbQuNC+0L3QuNGA0L7QstCw0L3QuNGPIChiYWxsb29uQXV0b1BhbikuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHNlZSBodHRwczovL2FwaS55YW5kZXgucnUvbWFwcy9kb2MvanNhcGkvMi4xL3JlZi9yZWZlcmVuY2UvSUxheW91dC54bWwjZ2V0Q2xpZW50Qm91bmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQG5hbWUgZ2V0Q2xpZW50Qm91bmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHJldHVybnMge051bWJlcltdW119INCa0L7QvtGA0LTQuNC90LDRgtGLINC70LXQstC+0LPQviDQstC10YDRhdC90LXQs9C+INC4INC/0YDQsNCy0L7Qs9C+INC90LjQttC90LXQs9C+INGD0LPQu9C+0LIg0YjQsNCx0LvQvtC90LAg0L7RgtC90L7RgdC40YLQtdC70YzQvdC+INGC0L7Rh9C60Lgg0L/RgNC40LLRj9C30LrQuC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRTaGFwZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2lzRWxlbWVudCh0aGlzLl8kZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cGxCYWxsb29uLnN1cGVyY2xhc3MuZ2V0U2hhcGUuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuXyRlbGVtZW50LnBvc2l0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB5bWFwcy5zaGFwZS5SZWN0YW5nbGUobmV3IHltYXBzLmdlb21ldHJ5LnBpeGVsLlJlY3RhbmdsZShbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcG9zaXRpb24ubGVmdCwgcG9zaXRpb24udG9wXSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLmxlZnQgKyB0aGlzLl8kZWxlbWVudFswXS5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3AgKyB0aGlzLl8kZWxlbWVudFswXS5vZmZzZXRIZWlnaHQgKyB0aGlzLl8kZWxlbWVudC5maW5kKCcuYXJyb3cnKVswXS5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiDQn9GA0L7QstC10YDRj9C10Lwg0L3QsNC70LjRh9C40LUg0Y3Qu9C10LzQtdC90YLQsCAo0LIg0JjQlSDQuCDQntC/0LXRgNC1INC10LPQviDQtdGJ0LUg0LzQvtC20LXRgiDQvdC1INCx0YvRgtGMKS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBuYW1lIF9pc0VsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gW2VsZW1lbnRdINCt0LvQtdC80LXQvdGCLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufSDQpNC70LDQsyDQvdCw0LvQuNGH0LjRjy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaXNFbGVtZW50OiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudCAmJiBlbGVtZW50WzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAkaXRlbXMuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBnZW8gPSAkKHRoaXMpLmRhdGEoJ2dlbycpLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gJCh0aGlzKS5kYXRhKCd0ZXh0JykgfHwgJ9Ch0JDQmtCh0K3QoScsXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSAkKHRoaXMpLmRhdGEoJ3R5cGUnKSB8fCAnZ2VvLW9mZmljZSc7XG4gICAgICAgICAgICBpZiAoZ2VvKSB7XG4gICAgICAgICAgICAgICAgZ2VvID0gZ2VvLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgZ2VvWzBdID0gcGFyc2VGbG9hdChnZW9bMF0pO1xuICAgICAgICAgICAgICAgIGdlb1sxXSA9IHBhcnNlRmxvYXQoZ2VvWzFdKTtcbiAgICAgICAgICAgICAgICB2YXIgcGxhY2VtYXJrID0gbmV3IHltYXBzLlBsYWNlbWFyayhnZW8sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0eXBlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MYXlvdXQ6IHRwbFBsYWNlbWFyayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uSW1hZ2VTaXplOiBbNDAsIDUwXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRlSWNvbk9uQmFsbG9vbk9wZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbGxvb25MYXlvdXQ6IHRwbEJhbGxvb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFsbG9vbkNsb3NlQnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYW5lOiAnYmFsbG9vbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFsbG9vblBhbmVsTWF4TWFwQXJlYTogMFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbWFwLmdlb09iamVjdHMuYWRkKHBsYWNlbWFyayk7XG4gICAgICAgICAgICAgICAgcGxhY2VtYXJrcy5wdXNoKHBsYWNlbWFyayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGxhY2VtYXJrcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGJvdW5kcyBvbiBhbGwgZ2VvIG9iamVjdHMgb24gbWFwXG4gICAgICogQHBhcmFtIE1hcCBtYXBcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgbWFwU2V0Qm91bmRzOiBmdW5jdGlvbiAobWFwKSB7XG4gICAgICAgIG1hcC5zZXRCb3VuZHMobWFwLmdlb09iamVjdHMuZ2V0Qm91bmRzKCksIHtcbiAgICAgICAgICAgIGNoZWNrWm9vbVJhbmdlOiB0cnVlLFxuICAgICAgICAgICAgem9vbU1hcmdpbjogNTBcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGluaXRDYXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5qcy1jYXJ0LWluZm9fX3JhZGlvJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLmpzLWNhcnQtaW5mb19faGlkZGVuJykuaGlkZSgpO1xuICAgICAgICAgICAgdmFyIGRlbGl2ZXJ5ID0gJCh0aGlzKS5kYXRhKCdkZWxpdmVyeScpO1xuICAgICAgICAgICAgdmFyICR0YXJnZXQgPSAkKCcuanMtY2FydC1pbmZvX19oaWRkZW5bZGF0YS1kZWxpdmVyeT1cIicgKyBkZWxpdmVyeSArICdcIl0nKTtcbiAgICAgICAgICAgICR0YXJnZXQuc2hvdygpO1xuICAgICAgICAgICAgJHRhcmdldC5maW5kKCcuanMtc2VsZWN0X2Fsd2F5cycpLnN0eWxlcigpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBwaWNrdXBcbiAgICAgICAgdmFyICR3cmFwcGVyID0gJCgnLmpzLXBpY2t1cCcpLCBtYXAgPSBudWxsO1xuICAgICAgICBpZiAoJHdyYXBwZXIubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHBvcHVwcyBpbiBwaWNrdXAgcG9wdXBcbiAgICAgICAgdmFyIGNsb3NlUGhvdG9Qb3B1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3BvcHVwJykuZmFkZU91dCgpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cC1vcGVuJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cC1vcGVuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ19hY3RpdmUnKSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cC1vcGVuJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcbiAgICAgICAgICAgIHZhciAkcG9wdXAgPSAkKHRoaXMpLnNpYmxpbmdzKCcuanMtcGlja3VwX19wb3B1cCcpO1xuICAgICAgICAgICAgaWYgKCQoJy5qcy1waWNrdXBfX3BvcHVwLl9hY3RpdmUnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cC5fYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKS5mYWRlT3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJHBvcHVwLmZhZGVJbigpLmFkZENsYXNzKCdfYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRwb3B1cC5mYWRlSW4oKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmpzLXBpY2t1cF9fcG9wdXAtY2xvc2UnKS5vbignY2xpY2snLCBjbG9zZVBob3RvUG9wdXApO1xuXG4gICAgICAgIHZhciBjbG9zZVBpY2t1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1hcC5iYWxsb29uLmNsb3NlKCk7XG4gICAgICAgICAgICAkKCcuanMtcGlja3VwX19tYXBfX2l0ZW0nKS5yZW1vdmVDbGFzcygnX2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fc3VibWl0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIGNsb3NlUGhvdG9Qb3B1cCgpO1xuICAgICAgICAgICAgJC5mYW5jeWJveC5jbG9zZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3VibWl0XG4gICAgICAgICQoJy5qcy1waWNrdXBfX3N1Ym1pdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkc2VsZWN0ZWQgPSAkKCcuanMtcGlja3VwX19tYXBfX2l0ZW0uX2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fdGFyZ2V0X190ZXh0JykudGV4dCgkc2VsZWN0ZWQuZmluZCgnLmpzLXBpY2t1cF9fbWFwX19pdGVtX190ZXh0JykudGV4dCgpKTtcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3RhcmdldF9fdGltZScpLnRleHQoJHNlbGVjdGVkLmZpbmQoJy5qcy1waWNrdXBfX21hcF9faXRlbV9fdGltZScpLnRleHQoKSB8fCAnJyk7XG4gICAgICAgICAgICAkKCcuanMtcGlja3VwX190YXJnZXRfX2lucHV0JykudmFsKCRzZWxlY3RlZC5kYXRhKCdpZCcpIHx8IDApO1xuICAgICAgICAgICAgY2xvc2VQaWNrdXAoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gY2FuY2VsXG4gICAgICAgICQoJy5qcy1waWNrdXBfX2NhbmNlbCcpLm9uKCdjbGljaycsIGNsb3NlUGlja3VwKTtcblxuICAgICAgICAvLyBtYXBcbiAgICAgICAgdmFyIGluaXRNYXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtYXAgPSBhcHAubWFwSW5pdCgncGlja3VwX21hcCcpO1xuICAgICAgICAgICAgdmFyIHBsYWNlbWFya3MgPSBhcHAubWFwQWRkUGxhY2VtYXJrcyhtYXAsICQoJy5qcy1waWNrdXBfX21hcF9faXRlbScpKTtcbiAgICAgICAgICAgIGFwcC5tYXBTZXRCb3VuZHMobWFwKTtcbiAgICAgICAgICAgIC8vIGNsaWNrXG4gICAgICAgICAgICAkKCcuanMtcGlja3VwX19tYXBfX2l0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcGxhY2VtYXJrc1skKHRoaXMpLmluZGV4KCldLmJhbGxvb24ub3BlbigpO1xuICAgICAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX21hcF9faXRlbScpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3N1Ym1pdCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR3cmFwcGVyLmRhdGEoJ2luaXQnLCB0cnVlKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGluaXQgbWFwIG9uIGZiLm9wZW5cbiAgICAgICAgJChkb2N1bWVudCkub24oJ2FmdGVyU2hvdy5mYicsIGZ1bmN0aW9uIChlLCBpbnN0YW5jZSwgc2xpZGUpIHtcbiAgICAgICAgICAgIHZhciAkcGlja3VwID0gc2xpZGUuJHNsaWRlLmZpbmQoJy5qcy1waWNrdXAnKTtcbiAgICAgICAgICAgIGlmICgkcGlja3VwLmxlbmd0aCAmJiAhJHBpY2t1cC5kYXRhKCdpbml0JykpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvL2FwaS1tYXBzLnlhbmRleC5ydS8yLjEvP2xhbmc9cnVfUlUmbW9kZT1kZWJ1ZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB5bWFwcy5yZWFkeShpbml0TWFwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSxcblxuICAgIGluaXRTUDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCgnLmpzLXNwJykubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogJy8vYXBpLW1hcHMueWFuZGV4LnJ1LzIuMS8/bGFuZz1ydV9SVSZtb2RlPWRlYnVnJyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeW1hcHMucmVhZHkoaW5pdE1hcCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGluaXRNYXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbWFwID0gYXBwLm1hcEluaXQoJ3NwX21hcCcpO1xuICAgICAgICAgICAgYXBwLm1hcEFkZFBsYWNlbWFya3MobWFwLCAkKCcuanMtc3BfX21hcC1pdGVtJykpO1xuICAgICAgICAgICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0YPQtdC8INC/0YDQuCDQvtGC0LrRgNGL0YLQuNC4INGB0YLRgNCw0L3QuNGG0YssINGC0LDQsdCwINC4INGB0LvQsNC50LTQsFxuICAgICAgICAgICAgaWYgKCQoJyNzcF9tYXAnKS5pcygnOnZpc2libGUnKSkge1xuICAgICAgICAgICAgICAgIGFwcC5tYXBTZXRCb3VuZHMobWFwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmpzLXNwIC5qcy10YWJzJykub25lKCdlYXN5dGFiczphZnRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgYXBwLm1hcFNldEJvdW5kcyhtYXApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQoJy5qcy1zcCAuanMtc3BfX21hcC10YWInKS5vbigndGFic19zbGlkZV9vcGVuJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBhcHAubWFwU2V0Qm91bmRzKG1hcCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5pdENvbnRhY3RzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKCcuanMtY29udGFjdHMnKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoJy5qcy1jb250YWN0c19fbWFwJykuc3RpY2tfaW5fcGFyZW50KHtcbiAgICAgICAgICAgIG9mZnNldF90b3A6IDkwXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogJy8vYXBpLW1hcHMueWFuZGV4LnJ1LzIuMS8/bGFuZz1ydV9SVSZtb2RlPWRlYnVnJyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeW1hcHMucmVhZHkoaW5pdE1hcCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGluaXRNYXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJGl0ZW1zID0gJCgnLmpzLWNvbnRhY3RzX19tYXAtaXRlbScpO1xuICAgICAgICAgICAgbWFwID0gYXBwLm1hcEluaXQoJ2NvbnRhY3RzX21hcCcpO1xuICAgICAgICAgICAgdmFyIHBsYWNlbWFya3MgPSBhcHAubWFwQWRkUGxhY2VtYXJrcyhtYXAsICRpdGVtcyk7XG4gICAgICAgICAgICBhcHAubWFwU2V0Qm91bmRzKG1hcCk7XG4gICAgICAgICAgICAkaXRlbXMuZWFjaChmdW5jdGlvbiAoaWR4KSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlID0gJCh0aGlzKS5kYXRhKCd0eXBlJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wbGFjZW1hcmsuJyArIHR5cGUpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWNvbnRhY3RzX19tYXAgLmpzLXRhZycpLmZpbHRlcignW2RhdGEtdHlwZT1cIicrIHR5cGUgKyAnXCJdJykuYWRkQ2xhc3MoJ19hY3RpdmUnKTtcbi8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwbGFjZW1hcmtzW2lkeF0pO1xuICAgICAgICAgICAgICAgICAgICBtYXAuc2V0Q2VudGVyKHBsYWNlbWFya3NbaWR4XS5nZW9tZXRyeS5nZXRDb29yZGluYXRlcygpLCAxMywge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDMwMFxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1hcmtzW2lkeF0uYmFsbG9vbi5vcGVuKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBjbGljayBvbiB0YWdcbiAgICAgICAgICAgICQoJy5qcy1jb250YWN0c19fbWFwIC5qcy10YWcnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBtYXAuYmFsbG9vbi5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIHZhciAkcG0gPSAkKCcucGxhY2VtYXJrLicgKyAkKHRoaXMpLmRhdGEoJ3R5cGUnKSk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5oYXNDbGFzcygnX2FjdGl2ZScpID8gJHBtLnNob3coKSA6ICRwbS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog0KTRg9C90LrRhtC40Y8g0LLQvtC30LLRgNCw0YnQsNC10YIg0L7QutC+0L3Rh9Cw0L3QuNC1INC00LvRjyDQvNC90L7QttC10YHRgtCy0LXQvdC90L7Qs9C+INGH0LjRgdC70LAg0YHQu9C+0LLQsCDQvdCwINC+0YHQvdC+0LLQsNC90LjQuCDRh9C40YHQu9CwINC4INC80LDRgdGB0LjQstCwINC+0LrQvtC90YfQsNC90LjQuVxuICAgICAqIHBhcmFtICBpTnVtYmVyIEludGVnZXIg0KfQuNGB0LvQviDQvdCwINC+0YHQvdC+0LLQtSDQutC+0YLQvtGA0L7Qs9C+INC90YPQttC90L4g0YHRhNC+0YDQvNC40YDQvtCy0LDRgtGMINC+0LrQvtC90YfQsNC90LjQtVxuICAgICAqIHBhcmFtICBhRW5kaW5ncyBBcnJheSDQnNCw0YHRgdC40LIg0YHQu9C+0LIg0LjQu9C4INC+0LrQvtC90YfQsNC90LjQuSDQtNC70Y8g0YfQuNGB0LXQuyAoMSwgNCwgNSksXG4gICAgICogICAgICAgICDQvdCw0L/RgNC40LzQtdGAIFsn0Y/QsdC70L7QutC+JywgJ9GP0LHQu9C+0LrQsCcsICfRj9Cx0LvQvtC6J11cbiAgICAgKiByZXR1cm4gU3RyaW5nXG4gICAgICogXG4gICAgICogaHR0cHM6Ly9oYWJyYWhhYnIucnUvcG9zdC8xMDU0MjgvXG4gICAgICovXG4gICAgZ2V0TnVtRW5kaW5nOiBmdW5jdGlvbiAoaU51bWJlciwgYUVuZGluZ3MpIHtcbiAgICAgICAgdmFyIHNFbmRpbmcsIGk7XG4gICAgICAgIGlOdW1iZXIgPSBpTnVtYmVyICUgMTAwO1xuICAgICAgICBpZiAoaU51bWJlciA+PSAxMSAmJiBpTnVtYmVyIDw9IDE5KSB7XG4gICAgICAgICAgICBzRW5kaW5nID0gYUVuZGluZ3NbMl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpID0gaU51bWJlciAlIDEwO1xuICAgICAgICAgICAgc3dpdGNoIChpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNhc2UgKDEpOlxuICAgICAgICAgICAgICAgICAgICBzRW5kaW5nID0gYUVuZGluZ3NbMF07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgKDIpOlxuICAgICAgICAgICAgICAgIGNhc2UgKDMpOlxuICAgICAgICAgICAgICAgIGNhc2UgKDQpOlxuICAgICAgICAgICAgICAgICAgICBzRW5kaW5nID0gYUVuZGluZ3NbMV07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHNFbmRpbmcgPSBhRW5kaW5nc1syXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc0VuZGluZztcbiAgICB9LFxuXG59Il0sImZpbGUiOiJjb21tb24uanMifQ==
