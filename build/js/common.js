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
        this.initForm();
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
        this.initUp();
        $(window).on('resize', function () {
            app.initHover();
        });

        this.initialized = true;
    },
    
    initUp: function () {
        var $btn = $(".js-up");
        if (!$btn.length) {
            return;
        }
        var breakpoint = $(window).outerHeight() / 5;
        $(window).on('scroll', function () {
            if ($(this).scrollTop() > breakpoint) {
                $btn.removeClass('_hidden');
            } else {
                $btn.addClass('_hidden');
            }
        });
        $btn.on('click', function () {
            $("html, body").animate({scrollTop: 0}, 500);
        });
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
        var $headerTop = $('.header__top');
        var headerTopHeight = $headerTop.outerHeight();
        var q = 1;
        var action = 0;
        var _pinHeader = function () {
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
        var pinHeader = function () {
            if (document.readyState !== "complete") {
                return;
            }
            if ($(this).scrollTop() > headerTopHeight) {
                $('body').css({'padding-top': headerHeight});
                $header.addClass('_fixed');
            } else {
                if (!$header.hasClass('_fixed')) {
                    return;
                }
                $('body').css({'padding-top': 0});
                $header.removeClass('_fixed');
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
        $('.js-main-slider').each(function(){
            var data = $(this).data();
            if (typeof data.autoplay == 'undefined') {
                data.autoplay = false;
            }
            $(this).slick({
                lazyLoad: 'ondemand',
                dots: true,
                arrows: false,
                infinite: true,
                mobileFirst: true,
                autoplay: data.autoplay,
                autoplaySpeed: data.autoplayspeed || 3000,
                pauseOnDotsHover: true,
                responsive: [
                    {
                        breakpoint: appConfig.breakpoint.md - 1,
                        settings: {
                            arrows: true,
                        }
                    },
                ]
            });
        });
        $('.js-slider').each(function () {
            var slides = $(this).data('slides') || {};
            var autoplaySpeed = $(this).data('autoplayspeed') || 3000;
            var autoplay = $(this).data('autoplay');
            if (typeof autoplay == 'undefined') {
                autoplay = false;
            }
            $(this).slick({
                autoplay: true,
                autoplaySpeed: 1000,
                dots: false,
                arrows: true,
                infinite: autoplay,
                autoplay: autoplay,
                autoplaySpeed: autoplaySpeed,
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
            });
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
                            $parent.css({
                                'height': 'auto'
                            });
                            $wrap.remove();
                        });
                    });
                });
            });
        }
    },

    initScrollbar: function () {
        $('.js-scrollbar').scrollbar({
//            disableBodyScroll: true
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
        /*
         $input.on('focus', function () {
         $(this).siblings('.js-search-res').addClass('_active');
         });*/
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
        let _count = 0;
        $input.on('input', this.debounce(function (e) {
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
                        if (data.html) {
                            searchAll.show();
                            $('.js-search-res').addClass('_active');
                            _count = $('.b-search-count').html();
                            $('.j-search-count').text('(' + _count + ')');
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
    debounce: function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate)
                    func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                func.apply(context, args);
        };
    },

    initCatalog: function () {
        var isMobile = $(window).outerWidth() < appConfig.breakpoint.lg,
                $slide = $('.js-cm__slide'),
                $slideTrigger = $('.js-cm__slide__trigger'),
                $menu = $('.js-cm__menu'),
                $scrollbar = $('.js-cm__scrollbar'),
                $mobileToggler = $('.js-cm__mobile-toggler'),
                $link = $('.js-cm__link'),
                $secondLink = $('.js-cm__second-link'),
                $secondClose = $('.js-cm__menu-second__close'),
                $wrapper = $('.js-cm__menu-wrapper');

        var slideMenu = function () {
            $slide.slideToggle(function () {
                $('.js-filter__counter').trigger("sticky_kit:recalc");
                $menu.toggleClass('_opened');
            });
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
            $link.parent().hover(hoverIcon, unhoverIcon)
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

        var checkMenu = function () {
            var newSize = $(window).outerWidth() < appConfig.breakpoint.lg;
            if (newSize != isMobile) {
                isMobile = newSize;
                if (isMobile) {
                    $slide.show();
//                    $menu.addClass('_opened');
                    $slideTrigger.off('click', slideMenu);
                    $secondLink.on('click', showSecond);
                    $secondLink.off('mouseenter mouseleave');
                    $link.parent().off('mouseenter mouseleave');
                    initScrollbar();
                } else {
                    $wrapper.removeClass('_active');
                    $slideTrigger.on('click', slideMenu);
                    $secondLink.off('click', showSecond);
                    $link.parent().hover(hoverIcon, unhoverIcon);
                    destroyScrollbar();
                    if (!$menu.hasClass('_opened')) {
                        $slide.hide();
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
            },
            clickContent: function (current, event) {
                return false;
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

    initForm: function () {
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
                .each(function () {
                    if (!$(this).val()) {
                        $(this).siblings('label').addClass('form__label__empty');
                    }
                });
//                не работает для селектов
//        .filter('[value=""], :not([value])').siblings('label').addClass('form__label__empty');

        $('.js-form__file__input').on('change', function () {
            var name = $(this).val();
            name = name.replace(/\\/g, '/').split('/').pop();
            $(this).parents('.js-form__file').find('.js-form__file__name').text(name);
        });
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
                $content = $('.js-tabs__tab .tabs__tab__content'),
                initialized = false;
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
            if (newSize != isMobile || !initialized) {
                isMobile = newSize;
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
            }
            initialized = true;
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
        $('.js-im-menu__toggler a').on('click', function (e) {
            window.location = $(this).attr('href');
            return false;
        });
    },

    initSelects: function () {
//        $('.js-select_always').styler();
        var isMobile = $(window).outerWidth() < appConfig.breakpoint.md,
                $selects = $('.js-select');
        if (!$selects.length)
            return;
        var init = function () {
            $selects.styler({
                selectPlaceholder: '',
                selectSmartPositioning: false
            }).each(function () {
                if ($(this).val()) {
                    $(this).parent().addClass('changed');
                }
            });
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
                        step = $($quantityInput).data('step') || 1,
                        val = shiftUp ? cur + step - ((cur + step) % step) : cur - step - ((cur - step) % step);
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
                                return element && element[0] && element.find('.arrow')[0];
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
                console.log($(this).index());
//                placemarks[$(this).index()].balloon.open();
                $('.js-pickup__map__item').removeClass('_active');
                $(this).addClass('_active');
                $('.js-pickup__submit').prop('disabled', false);
                placemarks[$(this).index()].balloon.open();
            });
            // handle click on placemark
            $.each(placemarks, function (index, placemark) {
                placemark.events.add('balloonopen', function () {
                    $('.js-pickup__map__item').removeClass('_active');
                    $('.js-pickup__map__item').eq(index).addClass('_active');
                    $('.js-pickup__submit').prop('disabled', false);
                });
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

        // popups in pickup popup
        var closePhotoPopup = function () {
            $('.js-contacts__popup._active').fadeOut(function () {
                $(this).remove();
            });
            $('.js-contacts__popup-open').removeClass('_active');
            return false;
        }
        $('.js-contacts__popup-open').on('click', function () {
            if ($(this).hasClass('_active')) {
                return false;
            }
            closePhotoPopup();
            var $popup = $(this).siblings('.js-contacts__popup');
            var $cloned = $popup.clone();
            if ($(window).outerWidth() >= appConfig.breakpoint.lg) {
                $cloned.appendTo($('#contacts_map'));
            } else {
                $cloned.appendTo('body');
            }
            $cloned.fadeIn().addClass('_active');
            $cloned.find('.js-contacts__popup-close').on('click', closePhotoPopup);
            $(this).addClass('_active');
            return false;
        });
        $('.js-contacts__popup-close').on('click', closePhotoPopup);

        // map
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
                    $('.js-contacts__map .js-tag').filter('[data-type="' + type + '"]').addClass('_active');
//                    console.log(placemarks[idx]);
                    map.setCenter(placemarks[idx].geometry.getCoordinates(), 13, {
                        duration: 300
                    }).then(function () {
                        placemarks[idx].balloon.open();
                    });
                });
            });
            // click on tag
            $('.js-contacts__map .js-tag').on('click', function () {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsialF1ZXJ5LmV4cHJbJzonXS5mb2N1cyA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICByZXR1cm4gZWxlbSA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiAoZWxlbS50eXBlIHx8IGVsZW0uaHJlZik7XHJcbn07XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuaW5pdGlhbGl6ZSgpO1xyXG59KTtcclxuXHJcbnZhciBhcHAgPSB7XHJcbiAgICBpbml0aWFsaXplZDogZmFsc2UsXHJcblxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBlbGVtSFRNTCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdodG1sJylbMF07XHJcbiAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTWFjJykgPiAwKSB7XHJcbiAgICAgICAgICAgIGVsZW1IVE1MLmNsYXNzTmFtZSArPSBcIiBtYWMtb3NcIjtcclxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignU2FmYXJpJykgPiAwKVxyXG4gICAgICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIG1hYy1zYWZhcmlcIjtcclxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lJykgPiAwKVxyXG4gICAgICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIG1hYy1jaHJvbWVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignRWRnZScpID4gMCB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1RyaWRlbnQnKSA+IDApIHtcclxuICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIGllXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5pdFNsaWRlcnMoKTsgLy8gbXVzdCBiZSBmaXJzdCFcclxuICAgICAgICB0aGlzLmluaXRNZW51KCk7XHJcbiAgICAgICAgdGhpcy5pbml0Rm9vdGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q3V0KCk7XHJcbiAgICAgICAgdGhpcy5pbml0SG92ZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRTY3JvbGxiYXIoKTtcclxuICAgICAgICB0aGlzLmluaXRDYXRhbG9nKCk7XHJcbiAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XHJcbiAgICAgICAgdGhpcy5pbml0UG9wdXAoKTtcclxuICAgICAgICB0aGlzLmluaXRGb3JtKCk7XHJcbiAgICAgICAgdGhpcy5pbml0UmVnaW9uU2VsZWN0KCk7XHJcbiAgICAgICAgdGhpcy5pbml0VGFicygpO1xyXG4gICAgICAgIHRoaXMuaW5pdFFBKCk7XHJcbiAgICAgICAgdGhpcy5pbml0SU1tZW51KCk7XHJcbiAgICAgICAgdGhpcy5pbml0U2VsZWN0cygpO1xyXG4gICAgICAgIHRoaXMuaW5pdE1hc2soKTtcclxuICAgICAgICB0aGlzLmluaXRSYW5nZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdEZpbHRlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdENyZWF0ZVByaWNlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0UXVhbnRpdHkoKTtcclxuICAgICAgICB0aGlzLmluaXRDYXJ0KCk7XHJcbiAgICAgICAgdGhpcy5pbml0U1AoKTtcclxuICAgICAgICB0aGlzLmluaXRUYWdzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q29udGFjdHMoKTtcclxuICAgICAgICB0aGlzLmluaXRVcCgpO1xyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhcHAuaW5pdEhvdmVyKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgaW5pdFVwOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyICRidG4gPSAkKFwiLmpzLXVwXCIpO1xyXG4gICAgICAgIGlmICghJGJ0bi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYnJlYWtwb2ludCA9ICQod2luZG93KS5vdXRlckhlaWdodCgpIC8gNTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiBicmVha3BvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAkYnRuLnJlbW92ZUNsYXNzKCdfaGlkZGVuJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkYnRuLmFkZENsYXNzKCdfaGlkZGVuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7c2Nyb2xsVG9wOiAwfSwgNTAwKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdE1lbnU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtbWVudS10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgICAgJCgnLmpzLW1lbnUtdG9nZ2xlcltocmVmPVwiJyArIGhyZWYgKyAnXCJdJykudG9nZ2xlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgJChocmVmKS50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKCcuanMtbWVudS5fYWN0aXZlJykubGVuZ3RoID09IDAgPyAkKCcuanMtbWVudS1vdmVybGF5JykuaGlkZSgpIDogJCgnLmpzLW1lbnUtb3ZlcmxheScpLnNob3coKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5qcy1tZW51LW92ZXJsYXknKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAkKCcuanMtbWVudS10b2dnbGVyLCAuanMtbWVudScpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQodGhpcykuaGlkZSgpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciAkaGVhZGVyID0gJCgnaGVhZGVyJyk7XHJcbiAgICAgICAgdmFyIGhlYWRlckhlaWdodCA9ICRoZWFkZXIub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgICB2YXIgJGhlYWRlclRvcCA9ICQoJy5oZWFkZXJfX3RvcCcpO1xyXG4gICAgICAgIHZhciBoZWFkZXJUb3BIZWlnaHQgPSAkaGVhZGVyVG9wLm91dGVySGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHEgPSAxO1xyXG4gICAgICAgIHZhciBhY3Rpb24gPSAwO1xyXG4gICAgICAgIHZhciBfcGluSGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJjb21wbGV0ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiBoZWFkZXJIZWlnaHQgKiBxKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhY3Rpb24gPSAxO1xyXG4gICAgICAgICAgICAgICAgJGhlYWRlci5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKHsncGFkZGluZy10b3AnOiBoZWFkZXJIZWlnaHR9KTtcclxuICAgICAgICAgICAgICAgICRoZWFkZXIuY3NzKHsndG9wJzogLWhlYWRlckhlaWdodH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnX2ZpeGVkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFuaW1hdGUoeyd0b3AnOiAwfSwgMTAwMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09IDIgfHwgISRoZWFkZXIuaGFzQ2xhc3MoJ19maXhlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gMjtcclxuICAgICAgICAgICAgICAgICRoZWFkZXIuYW5pbWF0ZSh7J3RvcCc6IC1oZWFkZXJIZWlnaHR9LCBcImZhc3RcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRoZWFkZXIuY3NzKHsndG9wJzogMH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5jc3MoeydwYWRkaW5nLXRvcCc6IDB9KTtcclxuICAgICAgICAgICAgICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdfZml4ZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwaW5IZWFkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9PSBcImNvbXBsZXRlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5zY3JvbGxUb3AoKSA+IGhlYWRlclRvcEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLmNzcyh7J3BhZGRpbmctdG9wJzogaGVhZGVySGVpZ2h0fSk7XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLmFkZENsYXNzKCdfZml4ZWQnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghJGhlYWRlci5oYXNDbGFzcygnX2ZpeGVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKHsncGFkZGluZy10b3AnOiAwfSk7XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdfZml4ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcpIHtcclxuICAgICAgICAgICAgcGluSGVhZGVyKCk7XHJcbiAgICAgICAgICAgICQod2luZG93KS5vbignbG9hZCBzY3JvbGwnLCBwaW5IZWFkZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IGFwcENvbmZpZy5icmVha3BvaW50LmxnKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJIZWlnaHQgPSAkaGVhZGVyLm91dGVySGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIHBpbkhlYWRlcik7XHJcbiAgICAgICAgICAgICAgICAkKCcuanMtbWVudScpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcuanMtbWVudS1vdmVybGF5JykuaGlkZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9mZignc2Nyb2xsJywgcGluSGVhZGVyKTtcclxuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xyXG4gICAgICAgICAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnX2ZpeGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEZvb3RlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBmaXhNZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA+PSBhcHBDb25maWcuYnJlYWtwb2ludC5tZCAmJiAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcpIHtcclxuICAgICAgICAgICAgICAgICQoJy5mb290ZXJfX21lbnUtc2Vjb25kJykuY3NzKCdsZWZ0JywgJCgnLmZvb3Rlcl9fbWVudSAubWVudSA+IGxpOm50aC1jaGlsZCgzKScpLm9mZnNldCgpLmxlZnQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnLmZvb3Rlcl9fbWVudS1zZWNvbmQnKS5jc3MoJ2xlZnQnLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmaXhNZW51KCk7XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkIHJlc2l6ZScsIGZpeE1lbnUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0Q3V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLWN1dCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5qcy1jdXRfX3RyaWdnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGNvbnRlbnQgPSAkKHRoaXMpLnNpYmxpbmdzKCcuanMtY3V0X19jb250ZW50JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTaG93ID0gJCh0aGlzKS5kYXRhKCd0ZXh0c2hvdycpIHx8ICdzaG93IHRleHQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0SGlkZSA9ICQodGhpcykuZGF0YSgndGV4dGhpZGUnKSB8fCAnaGlkZSB0ZXh0JztcclxuICAgICAgICAgICAgICAgICQodGhpcykudGV4dCgkY29udGVudC5pcygnOnZpc2libGUnKSA/IHRleHRTaG93IDogdGV4dEhpZGUpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmpzLWN1dF9fY29udGVudCcpLnNsaWRlVG9nZ2xlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtZmlsdGVyX19jb3VudGVyJykudHJpZ2dlcihcInN0aWNreV9raXQ6cmVjYWxjXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFNsaWRlcnM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtbWFpbi1zbGlkZXInKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gJCh0aGlzKS5kYXRhKCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5hdXRvcGxheSA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5hdXRvcGxheSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICQodGhpcykuc2xpY2soe1xyXG4gICAgICAgICAgICAgICAgbGF6eUxvYWQ6ICdvbmRlbWFuZCcsXHJcbiAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhdXRvcGxheTogZGF0YS5hdXRvcGxheSxcclxuICAgICAgICAgICAgICAgIGF1dG9wbGF5U3BlZWQ6IGRhdGEuYXV0b3BsYXlzcGVlZCB8fCAzMDAwLFxyXG4gICAgICAgICAgICAgICAgcGF1c2VPbkRvdHNIb3ZlcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IGFwcENvbmZpZy5icmVha3BvaW50Lm1kIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5qcy1zbGlkZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHNsaWRlcyA9ICQodGhpcykuZGF0YSgnc2xpZGVzJykgfHwge307XHJcbiAgICAgICAgICAgIHZhciBhdXRvcGxheVNwZWVkID0gJCh0aGlzKS5kYXRhKCdhdXRvcGxheXNwZWVkJykgfHwgMzAwMDtcclxuICAgICAgICAgICAgdmFyIGF1dG9wbGF5ID0gJCh0aGlzKS5kYXRhKCdhdXRvcGxheScpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGF1dG9wbGF5ID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBhdXRvcGxheSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICQodGhpcykuc2xpY2soe1xyXG4gICAgICAgICAgICAgICAgYXV0b3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhdXRvcGxheVNwZWVkOiAxMDAwLFxyXG4gICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhcnJvd3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogYXV0b3BsYXksXHJcbiAgICAgICAgICAgICAgICBhdXRvcGxheTogYXV0b3BsYXksXHJcbiAgICAgICAgICAgICAgICBhdXRvcGxheVNwZWVkOiBhdXRvcGxheVNwZWVkLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiBzbGlkZXMuc20gfHwgMSxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyTW9kZTogZmFsc2UsXHJcbi8vICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IGFwcENvbmZpZy5icmVha3BvaW50Lm1kIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogc2xpZGVzLm1kIHx8IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiBzbGlkZXMubGcgfHwgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5qcy1uYXYtc2xpZGVyX19tYWluJykuc2xpY2soe1xyXG4gICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgICAgIGFzTmF2Rm9yOiAnLmpzLW5hdi1zbGlkZXJfX25hdicsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIHJlc3BvbnNpdmUgPSB7XHJcbiAgICAgICAgICAgIHByb2R1Y3Q6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiBhcHBDb25maWcuYnJlYWtwb2ludC5sZyAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsU3dpcGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiA1LFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiBhcHBDb25maWcuYnJlYWtwb2ludC5tZCAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsU3dpcGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiA0LFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN3aXBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogNSxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH1cclxuICAgICAgICAkKCcuanMtbmF2LXNsaWRlcl9fbmF2JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuc2xpY2soe1xyXG4gICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhcnJvd3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGFzTmF2Rm9yOiAnLmpzLW5hdi1zbGlkZXJfX21haW4nLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICBmb2N1c09uU2VsZWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiByZXNwb25zaXZlWyQodGhpcykuZGF0YSgncmVzcG9uc2l2ZScpXSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCcuanMtbmF2LXNsaWRlcl9fbWFpbi5zbGljay1pbml0aWFsaXplZCcpLnNsaWNrKCdzZXRQb3NpdGlvbicpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBvbmx5IHNtIHNsaWRlcnNcclxuICAgICAgICB2YXIgaXNNb2JpbGUgPSBmYWxzZTtcclxuICAgICAgICB2YXIgaW5pdFNtU2xpZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCcuanMtc20tc2xpZGVyJykuc2xpY2soe1xyXG4gICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBkZXN0cm95U21TbGlkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1zbS1zbGlkZXIuc2xpY2staW5pdGlhbGl6ZWQnKS5zbGljaygndW5zbGljaycpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGlzTW9iaWxlID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50Lm1kO1xyXG4gICAgICAgIHZhciBjaGVja1NtU2xpZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3U2l6ZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5tZDtcclxuICAgICAgICAgICAgaWYgKG5ld1NpemUgIT0gaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gbmV3U2l6ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgIGluaXRTbVNsaWRlcigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJveVNtU2xpZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkIHJlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2hlY2tTbVNsaWRlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0VGFnczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy10YWcnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRIb3ZlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1ob3ZlcicpLnVuYmluZCgnbW91c2VlbnRlciBtb3VzZWxlYXZlJyk7XHJcbiAgICAgICAgaWYgKCQod2luZG93KS5vdXRlcldpZHRoKCkgPj0gYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcpIHtcclxuICAgICAgICAgICAgJCgnLmpzLWhvdmVyJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMsICRwYXJlbnQsICR3cmFwLCAkaG92ZXIsIGgsIHc7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHRoaXMuaGFzQ2xhc3MoJ19ob3ZlcicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldCA9ICR0aGlzLm9mZnNldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkdGhpcy5wYXJlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAkcGFyZW50LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAkcGFyZW50Lm91dGVySGVpZ2h0KClcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBoID0gJHRoaXMub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB3ID0gJHRoaXMub3V0ZXJXaWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6IHcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiBoLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICR3cmFwID0gJCgnPGRpdi8+JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbygnYm9keScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncG9zaXRpb24nOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0b3AnOiBvZmZzZXQudG9wLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdsZWZ0Jzogb2Zmc2V0LmxlZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogaCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICRob3ZlciA9ICQoJzxkaXYvPicpLmFwcGVuZFRvKCR3cmFwKTtcclxuICAgICAgICAgICAgICAgICAgICAkaG92ZXIuYWRkQ2xhc3MoJ2hvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuYXBwZW5kVG8oJHdyYXApLmFkZENsYXNzKCdfaG92ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkaG92ZXIuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogJy0xMHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJy0xMHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6ICctMTBweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogJy0xMHB4JyxcclxuICAgICAgICAgICAgICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICR3cmFwLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkaG92ZXIuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b206ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbygkcGFyZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ19ob3ZlcicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdzdHlsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHBhcmVudC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiAnYXV0bydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHdyYXAucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFNjcm9sbGJhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1zY3JvbGxiYXInKS5zY3JvbGxiYXIoe1xyXG4vLyAgICAgICAgICAgIGRpc2FibGVCb2R5U2Nyb2xsOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgaW5pdFNlYXJjaDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkaW5wdXQgPSAkKCcuanMtc2VhcmNoLWZvcm1fX2lucHV0Jyk7XHJcbiAgICAgICAgJGlucHV0Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgJGlucHV0Lm9uKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmpzLXNlYXJjaC1yZXMnKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICB9KTsqL1xyXG4gICAgICAgICQod2luZG93KS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1zZWFyY2gtcmVzJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiDQodGC0YDQvtC60LAg0L/QvtC40YHQutCwXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQgc2VhcmNoQWxsID0gJCgnLmotc2VhcmNoLXNob3dfYWxsJyk7XHJcbiAgICAgICAgbGV0IHNlYXJjaFN0cmluZyA9IHNlYXJjaEFsbC5hdHRyKCdkYXRhLXBhZ2UnKTtcclxuXHJcbiAgICAgICAgJCgnLnNlYXJjaC1mb3JtX19zdWJtaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaEFsbC50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINC+0LHRgNCw0LHQvtGC0YfQuNC6INC90LDQttCw0YLQuNGPXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IF9jb3VudCA9IDA7XHJcbiAgICAgICAgJGlucHV0Lm9uKCdpbnB1dCcsIHRoaXMuZGVib3VuY2UoZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgc2VhcmNoQWxsLmhpZGUoKTtcclxuICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkubGVuZ3RoID4gMikge1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoQWxsLmF0dHIoJ2hyZWYnLCBzZWFyY2hTdHJpbmcgKyAnP3E9JyArICQodGhpcykudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYmFzZWluZm8vc2VhcmNoLnBocCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogJCh0aGlzKS5wYXJlbnQoKS5zZXJpYWxpemUoKSxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmotdG9wLXNlYXJjaC13cmFwZXInKS5odG1sKGRhdGEuaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmh0bWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaEFsbC5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuanMtc2VhcmNoLXJlcycpLmFkZENsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfY291bnQgPSAkKCcuYi1zZWFyY2gtY291bnQnKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuai1zZWFyY2gtY291bnQnKS50ZXh0KCcoJyArIF9jb3VudCArICcpJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDMwMCkpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZnVuY1xyXG4gICAgICogQHBhcmFtIHdhaXRcclxuICAgICAqIEBwYXJhbSBpbW1lZGlhdGVcclxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn1cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGRlYm91bmNlOiBmdW5jdGlvbiAoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XHJcbiAgICAgICAgdmFyIHRpbWVvdXQ7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKVxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcclxuICAgICAgICAgICAgaWYgKGNhbGxOb3cpXHJcbiAgICAgICAgICAgICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRDYXRhbG9nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGlzTW9iaWxlID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50LmxnLFxyXG4gICAgICAgICAgICAgICAgJHNsaWRlID0gJCgnLmpzLWNtX19zbGlkZScpLFxyXG4gICAgICAgICAgICAgICAgJHNsaWRlVHJpZ2dlciA9ICQoJy5qcy1jbV9fc2xpZGVfX3RyaWdnZXInKSxcclxuICAgICAgICAgICAgICAgICRtZW51ID0gJCgnLmpzLWNtX19tZW51JyksXHJcbiAgICAgICAgICAgICAgICAkc2Nyb2xsYmFyID0gJCgnLmpzLWNtX19zY3JvbGxiYXInKSxcclxuICAgICAgICAgICAgICAgICRtb2JpbGVUb2dnbGVyID0gJCgnLmpzLWNtX19tb2JpbGUtdG9nZ2xlcicpLFxyXG4gICAgICAgICAgICAgICAgJGxpbmsgPSAkKCcuanMtY21fX2xpbmsnKSxcclxuICAgICAgICAgICAgICAgICRzZWNvbmRMaW5rID0gJCgnLmpzLWNtX19zZWNvbmQtbGluaycpLFxyXG4gICAgICAgICAgICAgICAgJHNlY29uZENsb3NlID0gJCgnLmpzLWNtX19tZW51LXNlY29uZF9fY2xvc2UnKSxcclxuICAgICAgICAgICAgICAgICR3cmFwcGVyID0gJCgnLmpzLWNtX19tZW51LXdyYXBwZXInKTtcclxuXHJcbiAgICAgICAgdmFyIHNsaWRlTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNsaWRlLnNsaWRlVG9nZ2xlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoJy5qcy1maWx0ZXJfX2NvdW50ZXInKS50cmlnZ2VyKFwic3RpY2t5X2tpdDpyZWNhbGNcIik7XHJcbiAgICAgICAgICAgICAgICAkbWVudS50b2dnbGVDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNob3dTZWNvbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJy5qcy1jbV9fbWVudS1zZWNvbmQnKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaG92ZXJJY29uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJGljb24gPSAkKHRoaXMpLmZpbmQoJy5zcHJpdGUnKTtcclxuICAgICAgICAgICAgJGljb24uYWRkQ2xhc3MoJGljb24uZGF0YSgnaG92ZXInKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdW5ob3Zlckljb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkaWNvbiA9ICQodGhpcykuZmluZCgnLnNwcml0ZScpO1xyXG4gICAgICAgICAgICAkaWNvbi5yZW1vdmVDbGFzcygkaWNvbi5kYXRhKCdob3ZlcicpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbml0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLnNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLmNzcyh7J2hlaWdodCc6ICQod2luZG93KS5vdXRlckhlaWdodCgpIC0gJCgnLmhlYWRlcicpLm91dGVySGVpZ2h0KCl9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBkZXN0cm95U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLnNjcm9sbGJhcignZGVzdHJveScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAkc2xpZGVUcmlnZ2VyLm9uKCdjbGljaycsIHNsaWRlTWVudSk7XHJcbiAgICAgICAgICAgICRsaW5rLnBhcmVudCgpLmhvdmVyKGhvdmVySWNvbiwgdW5ob3Zlckljb24pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHNlY29uZExpbmsub24oJ2NsaWNrJywgc2hvd1NlY29uZCk7XHJcbiAgICAgICAgICAgIGluaXRTY3JvbGxiYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJG1vYmlsZVRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkd3JhcHBlci50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJHNlY29uZENsb3NlLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuanMtY21fX21lbnUtc2Vjb25kJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgY2hlY2tNZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3U2l6ZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5sZztcclxuICAgICAgICAgICAgaWYgKG5ld1NpemUgIT0gaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gbmV3U2l6ZTtcclxuICAgICAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzbGlkZS5zaG93KCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAkbWVudS5hZGRDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzbGlkZVRyaWdnZXIub2ZmKCdjbGljaycsIHNsaWRlTWVudSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNlY29uZExpbmsub24oJ2NsaWNrJywgc2hvd1NlY29uZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNlY29uZExpbmsub2ZmKCdtb3VzZWVudGVyIG1vdXNlbGVhdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAkbGluay5wYXJlbnQoKS5vZmYoJ21vdXNlZW50ZXIgbW91c2VsZWF2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRTY3JvbGxiYXIoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdyYXBwZXIucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2xpZGVUcmlnZ2VyLm9uKCdjbGljaycsIHNsaWRlTWVudSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNlY29uZExpbmsub2ZmKCdjbGljaycsIHNob3dTZWNvbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICRsaW5rLnBhcmVudCgpLmhvdmVyKGhvdmVySWNvbiwgdW5ob3Zlckljb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Ryb3lTY3JvbGxiYXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISRtZW51Lmhhc0NsYXNzKCdfb3BlbmVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5ld1NpemUpIHtcclxuICAgICAgICAgICAgICAgICRzY3JvbGxiYXIuY3NzKHsnaGVpZ2h0JzogJCh3aW5kb3cpLm91dGVySGVpZ2h0KCkgLSAkKCcuaGVhZGVyJykub3V0ZXJIZWlnaHQoKX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjaGVja01lbnUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gdG9nZ2xlIGNhdGFsb2cgbGlzdCB2aWV3XHJcbiAgICAgICAgJCgnLmpzLWNhdGFsb2ctdmlldy10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCcuanMtY2F0YWxvZy12aWV3LXRvZ2dsZXInKS50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKCcuanMtY2F0YWxvZy1saXN0IC5qcy1jYXRhbG9nLWxpc3RfX2l0ZW0sIC5qcy1jYXRhbG9nLWxpc3QgLmpzLWNhdGFsb2ctbGlzdF9faXRlbSAuY2F0YWxvZy1saXN0X19pdGVtX19jb250ZW50JykudG9nZ2xlQ2xhc3MoJ19jYXJkJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFBvcHVwOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGJhc2VDbGFzczogJ19wb3B1cCcsXHJcbiAgICAgICAgICAgIGF1dG9Gb2N1czogZmFsc2UsXHJcbiAgICAgICAgICAgIHRvdWNoOiBmYWxzZSxcclxuICAgICAgICAgICAgYWZ0ZXJTaG93OiBmdW5jdGlvbiAoaW5zdGFuY2UsIHNsaWRlKSB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZS4kc2xpZGUuZmluZCgnLnNsaWNrLWluaXRpYWxpemVkJykuc2xpY2soJ3NldFBvc2l0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHNoaXBwaW5nID0gc2xpZGUuJHNsaWRlLmZpbmQoJy5qcy1zaGlwcGluZycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCRzaGlwcGluZy5sZW5ndGggJiYgISRzaGlwcGluZy5kYXRhKCdpbml0JykpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHAuc2hpcHBpbmcuaW5pdCgkc2hpcHBpbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjbGlja0NvbnRlbnQ6IGZ1bmN0aW9uIChjdXJyZW50LCBldmVudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkKCcuanMtcG9wdXAnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQuZmFuY3lib3guY2xvc2UoKTtcclxuICAgICAgICB9KS5mYW5jeWJveChvcHRpb25zKTtcclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggJiYgd2luZG93LmxvY2F0aW9uLmhhc2ggIT09ICcjJykge1xyXG4gICAgICAgICAgICB2YXIgJGNudCA9ICQod2luZG93LmxvY2F0aW9uLmhhc2gpO1xyXG4gICAgICAgICAgICBpZiAoJGNudC5sZW5ndGggJiYgJGNudC5oYXNDbGFzcygncG9wdXAnKSkge1xyXG4gICAgICAgICAgICAgICAgJC5mYW5jeWJveC5vcGVuKCRjbnQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0Rm9ybTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkaW5wdXRzID0gJCgnLmpzLWZvcm1fX2xhYmVsJykuZmluZCgnOm5vdChbcmVxdWlyZWRdKScpO1xyXG4gICAgICAgICRpbnB1dHNcclxuICAgICAgICAgICAgICAgIC5vbignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5yZW1vdmVDbGFzcygnZm9ybV9fbGFiZWxfX2VtcHR5Jyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uKCdibHVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghJCh0aGlzKS52YWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCdsYWJlbCcpLmFkZENsYXNzKCdmb3JtX19sYWJlbF9fZW1wdHknKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghJCh0aGlzKS52YWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCdsYWJlbCcpLmFkZENsYXNzKCdmb3JtX19sYWJlbF9fZW1wdHknKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuLy8gICAgICAgICAgICAgICAg0L3QtSDRgNCw0LHQvtGC0LDQtdGCINC00LvRjyDRgdC10LvQtdC60YLQvtCyXHJcbi8vICAgICAgICAuZmlsdGVyKCdbdmFsdWU9XCJcIl0sIDpub3QoW3ZhbHVlXSknKS5zaWJsaW5ncygnbGFiZWwnKS5hZGRDbGFzcygnZm9ybV9fbGFiZWxfX2VtcHR5Jyk7XHJcblxyXG4gICAgICAgICQoJy5qcy1mb3JtX19maWxlX19pbnB1dCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gJCh0aGlzKS52YWwoKTtcclxuICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvXFxcXC9nLCAnLycpLnNwbGl0KCcvJykucG9wKCk7XHJcbiAgICAgICAgICAgICQodGhpcykucGFyZW50cygnLmpzLWZvcm1fX2ZpbGUnKS5maW5kKCcuanMtZm9ybV9fZmlsZV9fbmFtZScpLnRleHQobmFtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRSZWdpb25TZWxlY3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtcmVnaW9uLXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWwgPSAkKHRoaXMpLmRhdGEoJ3RvZ2dsZScpO1xyXG4gICAgICAgICAgICBpZiAoc2VsKSB7XHJcbiAgICAgICAgICAgICAgICAkKHNlbCkuc2xpZGVUb2dnbGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnLmpzLXJlZ2lvbi1jbG9zZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykucGFyZW50cygnLnJlZ2lvbi1zZWxlY3QnKS5zbGlkZVVwKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyICRoZWFkZXJSZWdpb25TZWxlY3QgPSAkKCcuaGVhZGVyIC5yZWdpb24tc2VsZWN0Jyk7XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkaGVhZGVyUmVnaW9uU2VsZWN0LmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyUmVnaW9uU2VsZWN0LnNsaWRlVXAoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0VGFiczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpc01vYmlsZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5tZCxcclxuICAgICAgICAgICAgICAgICR0YWJzID0gJCgnLmpzLXRhYnNfX3RhYicpLFxyXG4gICAgICAgICAgICAgICAgJHRvZ2dsZXJzID0gJCgnLmpzLXRhYnNfX3RhYiAudGFic19fdGFiX190b2dnbGVyJyksXHJcbiAgICAgICAgICAgICAgICAkY29udGVudCA9ICQoJy5qcy10YWJzX190YWIgLnRhYnNfX3RhYl9fY29udGVudCcpLFxyXG4gICAgICAgICAgICAgICAgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoISR0YWJzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAkdG9nZ2xlcnMub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdfb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJy50YWJzX190YWJfX2NvbnRlbnQnKS5zbGlkZVRvZ2dsZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmlzKCc6dmlzaWJsZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJCh0aGlzKS50cmlnZ2VyKCd0YWJzX3NsaWRlX29wZW4nLCAkKHRoaXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6ICQodGhpcykudHJpZ2dlcigndGFic19zbGlkZV9jbG9zZScsICQodGhpcykpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBpbml0RXRhYnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdTaXplID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50Lm1kO1xyXG4gICAgICAgICAgICBpZiAobmV3U2l6ZSAhPSBpc01vYmlsZSB8fCAhaW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gbmV3U2l6ZTtcclxuICAgICAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICR0YWJzLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAkdG9nZ2xlcnMucmVtb3ZlQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAkY29udGVudC5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICR0YWJzLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAkY29udGVudC5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLXRhYnMnKS5lYXN5dGFicyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUhhc2g6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfSkuYmluZCgnZWFzeXRhYnM6bWlkVHJhbnNpdGlvbicsIGZ1bmN0aW9uIChldmVudCwgJGNsaWNrZWQsICR0YXJnZXRQYW5lbCwgc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICR1bmRlciA9ICQodGhpcykuZmluZCgnLmpzLXRhYnNfX3VuZGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR1bmRlci5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJGNsaWNrZWQucGFyZW50KCkucG9zaXRpb24oKS5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICRjbGlja2VkLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICR0YWJzLmZpbHRlcignLmFjdGl2ZScpLnNob3coKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGluaXRVbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnLmpzLXRhYnMnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkdW5kZXIgPSAkKHRoaXMpLmZpbmQoJy5qcy10YWJzX191bmRlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkYWN0aXZlTGluayA9ICQodGhpcykuZmluZCgnLnRhYnNfX2xpc3QgLmFjdGl2ZSBhJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA9ICRhY3RpdmVMaW5rLm91dGVySGVpZ2h0KCkgLSAkdW5kZXIub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIGlmICgkYWN0aXZlTGluay5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkdW5kZXIuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAnYXV0bycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogdG9wLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAkYWN0aXZlTGluay5wYXJlbnQoKS5wb3NpdGlvbigpLmxlZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAkYWN0aXZlTGluay53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpbml0RXRhYnMoKTtcclxuICAgICAgICBpbml0VW5kZXIoKTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ2xvYWQgcmVzaXplJywgaW5pdEV0YWJzKTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ2xvYWQgcmVzaXplJywgaW5pdFVuZGVyKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFFBOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLXFhOm5vdCguX2FjdGl2ZSkgLnFhX19hJykuc2xpZGVVcCgpO1xyXG4gICAgICAgICQoJy5qcy1xYScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICR0b2dnbGVyID0gJHRoaXMuZmluZCgnLnFhX19xIC5xYV9faCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICRhbnN3ZXIgPSAkdGhpcy5maW5kKCcucWFfX2EnKTtcclxuICAgICAgICAgICAgJHRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHRoaXMudG9nZ2xlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICRhbnN3ZXIuc2xpZGVUb2dnbGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRJTW1lbnU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtaW0tbWVudV9fdG9nZ2xlcjpub3QoLl9vcGVuZWQpJykuc2libGluZ3MoJy5qcy1pbS1tZW51X19zbGlkZScpLnNsaWRlVXAoKTtcclxuICAgICAgICAkKCcuanMtaW0tbWVudV9fdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuanMtaW0tbWVudV9fc2xpZGUnKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5qcy1pbS1tZW51X190b2dnbGVyIGEnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0U2VsZWN0czogZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAgJCgnLmpzLXNlbGVjdF9hbHdheXMnKS5zdHlsZXIoKTtcclxuICAgICAgICB2YXIgaXNNb2JpbGUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQsXHJcbiAgICAgICAgICAgICAgICAkc2VsZWN0cyA9ICQoJy5qcy1zZWxlY3QnKTtcclxuICAgICAgICBpZiAoISRzZWxlY3RzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2VsZWN0cy5zdHlsZXIoe1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0UGxhY2Vob2xkZXI6ICcnLFxyXG4gICAgICAgICAgICAgICAgc2VsZWN0U21hcnRQb3NpdGlvbmluZzogZmFsc2VcclxuICAgICAgICAgICAgfSkuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuYWRkQ2xhc3MoJ2NoYW5nZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNlbGVjdHMuc3R5bGVyKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgcmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1NpemUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQ7XHJcbiAgICAgICAgICAgIGlmIChuZXdTaXplICE9IGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpc01vYmlsZSA9IG5ld1NpemU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoIWlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgIGluaXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCByZWZyZXNoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdE1hc2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtbWFza19fdGVsJykuaW5wdXRtYXNrKHtcclxuICAgICAgICAgICAgbWFzazogJys5ICg5OTkpIDk5OS05OS05OSdcclxuICAgICAgICB9KTtcclxuICAgICAgICBJbnB1dG1hc2suZXh0ZW5kQWxpYXNlcyh7XHJcbiAgICAgICAgICAgICdudW1lcmljJzoge1xyXG4gICAgICAgICAgICAgICAgYXV0b1VubWFzazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNob3dNYXNrT25Ib3ZlcjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICByYWRpeFBvaW50OiBcIixcIixcclxuICAgICAgICAgICAgICAgIGdyb3VwU2VwYXJhdG9yOiBcIiBcIixcclxuICAgICAgICAgICAgICAgIGRpZ2l0czogMCxcclxuICAgICAgICAgICAgICAgIGFsbG93TWludXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXV0b0dyb3VwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmlnaHRBbGlnbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB1bm1hc2tBc051bWJlcjogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnaHRtbDpub3QoLmllKSAuanMtbWFzaycpLmlucHV0bWFzaygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0UmFuZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtcmFuZ2UnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHNsaWRlciA9ICQodGhpcykuZmluZCgnLmpzLXJhbmdlX190YXJnZXQnKVswXSxcclxuICAgICAgICAgICAgICAgICAgICAkaW5wdXRzID0gJCh0aGlzKS5maW5kKCdpbnB1dCcpLFxyXG4gICAgICAgICAgICAgICAgICAgIGZyb20gPSAkaW5wdXRzLmZpcnN0KClbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdG8gPSAkaW5wdXRzLmxhc3QoKVswXTtcclxuICAgICAgICAgICAgaWYgKHNsaWRlciAmJiBmcm9tICYmIHRvKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWluViA9IHBhcnNlSW50KGZyb20udmFsdWUpIHx8IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heFYgPSBwYXJzZUludCh0by52YWx1ZSkgfHwgMDtcclxuICAgICAgICAgICAgICAgIHZhciBtaW4gPSBwYXJzZUludChmcm9tLmRhdGFzZXQubWluKSB8fCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXggPSBwYXJzZUludCh0by5kYXRhc2V0Lm1heCkgfHwgMDtcclxuICAgICAgICAgICAgICAgIG5vVWlTbGlkZXIuY3JlYXRlKHNsaWRlciwge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pblYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heFZcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcDogMTAsXHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ21pbic6IG1pbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ21heCc6IG1heFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNuYXBWYWx1ZXMgPSBbZnJvbSwgdG9dO1xyXG4gICAgICAgICAgICAgICAgc2xpZGVyLm5vVWlTbGlkZXIub24oJ3VwZGF0ZScsIGZ1bmN0aW9uICh2YWx1ZXMsIGhhbmRsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNuYXBWYWx1ZXNbaGFuZGxlXS52YWx1ZSA9IE1hdGgucm91bmQodmFsdWVzW2hhbmRsZV0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBmcm9tLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXIubm9VaVNsaWRlci5zZXQoW3RoaXMudmFsdWUsIG51bGxdKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZnJvbS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5ub1VpU2xpZGVyLnNldChbdGhpcy52YWx1ZSwgbnVsbF0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0by5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVyLm5vVWlTbGlkZXIuc2V0KFtudWxsLCB0aGlzLnZhbHVlXSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRvLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVyLm5vVWlTbGlkZXIuc2V0KFtudWxsLCB0aGlzLnZhbHVlXSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEZpbHRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpc01vYmlsZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5sZyxcclxuICAgICAgICAgICAgICAgICRzY3JvbGxiYXIgPSAkKCcuanMtZmlsdGVyX19zY3JvbGxiYXInKSxcclxuICAgICAgICAgICAgICAgICRtb2JpbGVUb2dnbGVyID0gJCgnLmpzLWZpbHRlcl9fbW9iaWxlLXRvZ2dsZXInKSxcclxuICAgICAgICAgICAgICAgICR3cmFwcGVyID0gJCgnLmpzLWZpbHRlcicpO1xyXG5cclxuICAgICAgICB2YXIgaW5pdFNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjcm9sbGJhci5zY3JvbGxiYXIoKTtcclxuICAgICAgICAgICAgJHNjcm9sbGJhci5jc3MoeydoZWlnaHQnOiAkKHdpbmRvdykub3V0ZXJIZWlnaHQoKSAtICQoJy5oZWFkZXInKS5vdXRlckhlaWdodCgpfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZGVzdHJveVNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjcm9sbGJhci5zY3JvbGxiYXIoJ2Rlc3Ryb3knKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICAgICAgICBpbml0U2Nyb2xsYmFyKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCgnLmpzLWZpbHRlcl9fY291bnRlcicpLnN0aWNrX2luX3BhcmVudCh7b2Zmc2V0X3RvcDogMTAwfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRtb2JpbGVUb2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHdyYXBwZXIudG9nZ2xlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcuanMtZmlsdGVyLWZpZWxkc2V0JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkdHJpZ2dlciA9ICQodGhpcykuZmluZCgnLmpzLWZpbHRlci1maWVsZHNldF9fdHJpZ2dlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICRzbGlkZSA9ICQodGhpcykuZmluZCgnLmpzLWZpbHRlci1maWVsZHNldF9fc2xpZGUnKTtcclxuICAgICAgICAgICAgJHRyaWdnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnX2Nsb3NlZCcpO1xyXG4gICAgICAgICAgICAgICAgJHNsaWRlLnNsaWRlVG9nZ2xlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtZmlsdGVyX19jb3VudGVyJykudHJpZ2dlcihcInN0aWNreV9raXQ6cmVjYWxjXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgY2hlY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdTaXplID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50LmxnO1xyXG4gICAgICAgICAgICBpZiAobmV3U2l6ZSAhPSBpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgaXNNb2JpbGUgPSBuZXdTaXplO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdFNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1maWx0ZXJfX2NvdW50ZXInKS50cmlnZ2VyKFwic3RpY2t5X2tpdDpkZXRhY2hcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICR3cmFwcGVyLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdHJveVNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1maWx0ZXJfX2NvdW50ZXInKS5zdGlja19pbl9wYXJlbnQoe29mZnNldF90b3A6IDEwMH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5ld1NpemUpIHtcclxuICAgICAgICAgICAgICAgICRzY3JvbGxiYXIuY3NzKHsnaGVpZ2h0JzogJCh3aW5kb3cpLm91dGVySGVpZ2h0KCkgLSAkKCcuaGVhZGVyJykub3V0ZXJIZWlnaHQoKX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjaGVjaygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0Q3JlYXRlUHJpY2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJGl0ZW1zID0gJCgnLmpzLWNyZWF0ZS1wcmljZV9faXRlbScpLFxyXG4gICAgICAgICAgICAgICAgJHBhcmVudHMgPSAkKCcuanMtY3JlYXRlLXByaWNlX19wYXJlbnQnKSxcclxuICAgICAgICAgICAgICAgICRjb3VudGVyID0gJCgnLmpzLWNyZWF0ZS1wcmljZV9fY291bnRlcicpLFxyXG4gICAgICAgICAgICAgICAgJGFsbCA9ICQoJy5qcy1jcmVhdGUtcHJpY2VfX2FsbCcpLFxyXG4gICAgICAgICAgICAgICAgJGNsZWFyID0gJCgnLmpzLWNyZWF0ZS1wcmljZV9fY2xlYXInKSxcclxuICAgICAgICAgICAgICAgIGRlY2wxID0gWyfQktGL0LHRgNCw0L3QsDogJywgJ9CS0YvQsdGA0LDQvdC+OiAnLCAn0JLRi9Cx0YDQsNC90L46ICddLFxyXG4gICAgICAgICAgICAgICAgZGVjbDIgPSBbJyDQutCw0YJl0LPQvtGA0LjRjycsICcg0LrQsNGC0LXQs9C+0YDQuNC4JywgJyDQutCw0YLQtdCz0L7RgNC40LknXSxcclxuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50Lm1kO1xyXG4gICAgICAgIGlmICgkaXRlbXMubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgY291bnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB0b3RhbCA9ICRpdGVtcy5maWx0ZXIoJzpjaGVja2VkJykubGVuZ3RoO1xyXG4gICAgICAgICAgICAkY291bnRlci50ZXh0KGFwcC5nZXROdW1FbmRpbmcodG90YWwsIGRlY2wxKSArIHRvdGFsICsgYXBwLmdldE51bUVuZGluZyh0b3RhbCwgZGVjbDIpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvdW50KCk7XHJcbiAgICAgICAgJGl0ZW1zLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkd3JhcHBlciA9ICQodGhpcykucGFyZW50cygnLmpzLWNyZWF0ZS1wcmljZV9fd3JhcHBlcicpO1xyXG4gICAgICAgICAgICBpZiAoJHdyYXBwZXIpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkaXRlbXMgPSAkd3JhcHBlci5maW5kKCcuanMtY3JlYXRlLXByaWNlX19pdGVtJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkd3JhcHBlci5maW5kKCcuanMtY3JlYXRlLXByaWNlX19wYXJlbnQnKTtcclxuICAgICAgICAgICAgICAgICRwYXJlbnQucHJvcCgnY2hlY2tlZCcsICRpdGVtcy5maWx0ZXIoJzpjaGVja2VkJykubGVuZ3RoICE9PSAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb3VudCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRwYXJlbnRzLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkY2hpbGRzID0gJCh0aGlzKS5wYXJlbnRzKCcuanMtY3JlYXRlLXByaWNlX193cmFwcGVyJykuZmluZCgnLmpzLWNyZWF0ZS1wcmljZV9faXRlbScpO1xyXG4gICAgICAgICAgICAkY2hpbGRzLnByb3AoJ2NoZWNrZWQnLCAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSk7XHJcbiAgICAgICAgICAgIGNvdW50KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGFsbC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRpdGVtcy5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICRwYXJlbnRzLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgY291bnQoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICRjbGVhci5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRpdGVtcy5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAkcGFyZW50cy5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICBjb3VudCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLy8gZml4IGhlYWRlclxyXG4gICAgICAgIHZhciAkaGVhZCA9ICQoJy5jYXRhbG9nLWNyZWF0ZS1oZWFkLl9mb290Jyk7XHJcbiAgICAgICAgdmFyIGJyZWFrcG9pbnQsIHdIZWlnaHQ7XHJcbiAgICAgICAgZml4SW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYnJlYWtwb2ludCA9ICRoZWFkLm9mZnNldCgpLnRvcDtcclxuICAgICAgICAgICAgd0hlaWdodCA9ICQod2luZG93KS5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICBmaXhIZWFkKCk7XHJcbiAgICAgICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZml4SGVhZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpeEhlYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyB3SGVpZ2h0IDwgYnJlYWtwb2ludCkge1xyXG4gICAgICAgICAgICAgICAgJGhlYWQuYWRkQ2xhc3MoJ19maXhlZCcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGhlYWQucmVtb3ZlQ2xhc3MoJ19maXhlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICAgICAgICBmaXhJbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3U2l6ZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5sZztcclxuICAgICAgICAgICAgaWYgKG5ld1NpemUgIT0gaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gbmV3U2l6ZTtcclxuICAgICAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpeEluaXQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9mZignc2Nyb2xsJywgZml4SGVhZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhlYWQucmVtb3ZlQ2xhc3MoJ19maXhlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gJCAkd3JhcHBlclxyXG4gICAgICovXHJcbiAgICBpbml0U2hpcHBpbmdDYWxjOiBmdW5jdGlvbiAoJHdyYXBwZXIpIHtcclxuICAgICAgICB2YXIgJHNsaWRlciA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fY2FyLXNsaWRlcicpLFxyXG4gICAgICAgICAgICAgICAgJHJhZGlvID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19jYXItcmFkaW8nKTtcclxuICAgICAgICBpZiAoJHNsaWRlci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJHNsaWRlci5zbGljayh7XHJcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZmFkZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHJhZGlvLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICQodGhpcykucGFyZW50cygnLmpzLXNoaXBwaW5nX19jYXItbGFiZWwnKS5pbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgJHNsaWRlci5zbGljaygnc2xpY2tHb1RvJywgaW5kZXgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgJGRhdGVpbnB1dFdyYXBwZXIgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2RhdGUtaW5wdXQnKSxcclxuICAgICAgICAgICAgICAgICRkYXRlaW5wdXQgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2RhdGUtaW5wdXRfX2lucHV0JyksXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZERheXMgPSBbMCwgNl07XHJcbiAgICAgICAgJGRhdGVpbnB1dC5kYXRlcGlja2VyKHtcclxuICAgICAgICAgICAgcG9zaXRpb246ICd0b3AgcmlnaHQnLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IDQwLFxyXG4gICAgICAgICAgICBuYXZUaXRsZXM6IHtcclxuICAgICAgICAgICAgICAgIGRheXM6ICdNTSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWluRGF0ZTogbmV3IERhdGUobmV3IERhdGUoKS5nZXRUaW1lKCkgKyA4NjQwMCAqIDEwMDAgKiAyKSxcclxuICAgICAgICAgICAgb25SZW5kZXJDZWxsOiBmdW5jdGlvbiAoZGF0ZSwgY2VsbFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PSAnZGF5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXNhYmxlZCA9IGRpc2FibGVkRGF5cy5pbmRleE9mKGRheSkgIT0gLTE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiBpc0Rpc2FibGVkXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24gKGZvcm1hdHRlZERhdGUsIGRhdGUsIGluc3QpIHtcclxuICAgICAgICAgICAgICAgIGluc3QuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgJGRhdGVpbnB1dFdyYXBwZXIucmVtb3ZlQ2xhc3MoJ19lbXB0eScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGRhdGVwaWNrZXIgPSAkZGF0ZWlucHV0LmRhdGVwaWNrZXIoKS5kYXRhKCdkYXRlcGlja2VyJyk7XHJcbiAgICAgICAgJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlcGlja2VyLXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRhdGVwaWNrZXIuc2hvdygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBtYXBcclxuICAgICAgICB2YXIgbWFwLCAkcm91dGVBZGRyZXNzID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yb3V0ZS1hZGRyZXNzJyksXHJcbiAgICAgICAgICAgICAgICAkcm91dGVEaXN0YW5jZSA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fcm91dGUtZGlzdGFuY2UnKTtcclxuICAgICAgICB2YXIgaW5pdE1hcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGJhbGxvb25MYXlvdXQgPSB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoXHJcbiAgICAgICAgICAgICAgICAgICAgXCI8ZGl2PlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLnN1cGVyY2xhc3MuYnVpbGQuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdmFyIG11bHRpUm91dGUgPSBuZXcgeW1hcHMubXVsdGlSb3V0ZXIuTXVsdGlSb3V0ZSh7XHJcbiAgICAgICAgICAgICAgICAvLyDQntC/0LjRgdCw0L3QuNC1INC+0L/QvtGA0L3Ri9GFINGC0L7Rh9C10Log0LzRg9C70YzRgtC40LzQsNGA0YjRgNGD0YLQsC5cclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVBvaW50czogW1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcENvbmZpZy5zaGlwcGluZy5mcm9tLmdlbyxcclxuICAgICAgICAgICAgICAgICAgICBhcHBDb25maWcuc2hpcHBpbmcudG8uZ2VvLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHM6IDNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgYm91bmRzQXV0b0FwcGx5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgd2F5UG9pbnRTdGFydEljb25Db250ZW50TGF5b3V0OiB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcENvbmZpZy5zaGlwcGluZy5mcm9tLnRleHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIHdheVBvaW50RmluaXNoRHJhZ2dhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYmFsbG9vbkxheW91dDogYmFsbG9vbkxheW91dFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbXVsdGlSb3V0ZS5tb2RlbC5ldmVudHMuYWRkKCdyZXF1ZXN0c3VjY2VzcycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNldERpc3RhbmNlKG11bHRpUm91dGUuZ2V0QWN0aXZlUm91dGUoKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9pbnQgPSBtdWx0aVJvdXRlLmdldFdheVBvaW50cygpLmdldCgxKTtcclxuICAgICAgICAgICAgICAgIHltYXBzLmdlb2NvZGUocG9pbnQuZ2VvbWV0cnkuZ2V0Q29vcmRpbmF0ZXMoKSkudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSByZXMuZ2VvT2JqZWN0cy5nZXQoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFkZHJlc3MgPSBvLmdldEFkZHJlc3NMaW5lKCkucmVwbGFjZSgn0J3QuNC20LXQs9C+0YDQvtC00YHQutCw0Y8g0L7QsdC70LDRgdGC0YwsICcsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAkcm91dGVBZGRyZXNzLnZhbChhZGRyZXNzKTtcclxuICAgICAgICAgICAgICAgICAgICBtdWx0aVJvdXRlLm9wdGlvbnMuc2V0KCd3YXlQb2ludEZpbmlzaEljb25Db250ZW50TGF5b3V0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyhhZGRyZXNzKSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbXVsdGlSb3V0ZS5ldmVudHMuYWRkKCdhY3RpdmVyb3V0ZWNoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNldERpc3RhbmNlKG11bHRpUm91dGUuZ2V0QWN0aXZlUm91dGUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtYXAgPSBuZXcgeW1hcHMuTWFwKFwic2hpcHBpbmdfbWFwXCIsIHtcclxuICAgICAgICAgICAgICAgIGNlbnRlcjogYXBwQ29uZmlnLnNoaXBwaW5nLmZyb20uZ2VvLFxyXG4gICAgICAgICAgICAgICAgem9vbTogMTMsXHJcbiAgICAgICAgICAgICAgICBhdXRvRml0VG9WaWV3cG9ydDogJ2Fsd2F5cycsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sczogW11cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG1hcC5nZW9PYmplY3RzLmFkZChtdWx0aVJvdXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNldERpc3RhbmNlID0gZnVuY3Rpb24gKHJvdXRlKSB7XHJcbiAgICAgICAgICAgIGlmIChyb3V0ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5yb3VuZChyb3V0ZS5wcm9wZXJ0aWVzLmdldCgnZGlzdGFuY2UnKS52YWx1ZSAvIDEwMDApO1xyXG4gICAgICAgICAgICAgICAgJHJvdXRlRGlzdGFuY2UudmFsKGRpc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvL2FwaS1tYXBzLnlhbmRleC5ydS8yLjEvP2xhbmc9cnVfUlUmbW9kZT1kZWJ1ZycsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5bWFwcy5yZWFkeShpbml0TWFwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19tYXAtdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX21hcCcpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IGFwcENvbmZpZy5icmVha3BvaW50Lm1kKSB7XHJcbiAgICAgICAgICAgICAgICAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX21hcC10b2dnbGVyJykuYWRkQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fbWFwJykuc2xpZGVEb3duKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkd3JhcHBlci5kYXRhKCdpbml0JywgdHJ1ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRRdWFudGl0eTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1xdWFudGl0eS1zaGlmdC5qcy1xdWFudGl0eS11cCwgLmpzLXF1YW50aXR5LXNoaWZ0LmpzLXF1YW50aXR5LWRvd24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciAkcXVhbnRpdHlJbnB1dCA9ICQodGhpcykuc2libGluZ3MoJy5qcy1xdWFudGl0eScpWzBdO1xyXG4gICAgICAgICAgICBpZiAoJHF1YW50aXR5SW5wdXQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXIgPSBwYXJzZUludCgkcXVhbnRpdHlJbnB1dC52YWx1ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0VXAgPSAkKHRoaXMpLmhhc0NsYXNzKCdqcy1xdWFudGl0eS11cCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdCA9ICQoJHF1YW50aXR5SW5wdXQpLmF0dHIoc2hpZnRVcCA/ICdtYXgnIDogJ21pbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwID0gJCgkcXVhbnRpdHlJbnB1dCkuZGF0YSgnc3RlcCcpIHx8IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHNoaWZ0VXAgPyBjdXIgKyBzdGVwIC0gKChjdXIgKyBzdGVwKSAlIHN0ZXApIDogY3VyIC0gc3RlcCAtICgoY3VyIC0gc3RlcCkgJSBzdGVwKTtcclxuICAgICAgICAgICAgICAgIGlmICghbGltaXQgfHwgKHNoaWZ0VXAgJiYgdmFsIDw9IHBhcnNlSW50KGxpbWl0KSkgfHwgKCFzaGlmdFVwICYmIHZhbCA+PSBwYXJzZUludChsaW1pdCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHF1YW50aXR5SW5wdXQudmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgkcXVhbnRpdHlJbnB1dCkuY2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpbml0IG1hcCBpbiBjb250YWluZXJcclxuICAgICAqIEBwYXJhbSBzdHJpbmcgY250IGlkXHJcbiAgICAgKiBAcmV0dXJuIE1hcCBcclxuICAgICAqL1xyXG4gICAgbWFwSW5pdDogZnVuY3Rpb24gKGNudCkge1xyXG4gICAgICAgIHZhciBtYXAgPSBuZXcgeW1hcHMuTWFwKGNudCwge1xyXG4gICAgICAgICAgICBjZW50ZXI6IFs1Ni4zMjY4ODcsIDQ0LjAwNTk4Nl0sXHJcbiAgICAgICAgICAgIHpvb206IDExLFxyXG4gICAgICAgICAgICBjb250cm9sczogW11cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHN1cHByZXNzTWFwT3BlbkJsb2NrOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1hcC5jb250cm9scy5hZGQoJ3pvb21Db250cm9sJywge1xyXG4gICAgICAgICAgICBzaXplOiAnc21hbGwnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG1hcDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgcGxhY2VtYXJrcyBvbiBtYXBcclxuICAgICAqIEBwYXJhbSBNYXAgbWFwXHJcbiAgICAgKiBAcGFyYW0gJCBpdGVtcyB3aXRoIGRhdGEtYXR0clxyXG4gICAgICogQHJldHVybiBhcnJheSBvZiBHZW9PYmplY3RcclxuICAgICAqL1xyXG4gICAgbWFwQWRkUGxhY2VtYXJrczogZnVuY3Rpb24gKG1hcCwgJGl0ZW1zKSB7XHJcbiAgICAgICAgdmFyIHBsYWNlbWFya3MgPSBbXTtcclxuICAgICAgICB2YXIgdHBsUGxhY2VtYXJrID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwbGFjZW1hcmsge3sgcHJvcGVydGllcy50eXBlIH19XCI+PGkgY2xhc3M9XCJzcHJpdGUge3sgcHJvcGVydGllcy50eXBlIH19XCI+PC9pPjwvZGl2PidcclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICB0cGxCYWxsb29uID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInBpY2t1cC1iYWxsb29uXCI+e3sgcHJvcGVydGllcy50ZXh0IH19PHNwYW4gY2xhc3M9XCJhcnJvd1wiPjwvc3Bhbj48L2Rpdj4nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqINCh0YLRgNC+0LjRgiDRjdC60LfQtdC80L/Qu9GP0YAg0LzQsNC60LXRgtCwINC90LAg0L7RgdC90L7QstC1INGI0LDQsdC70L7QvdCwINC4INC00L7QsdCw0LLQu9GP0LXRgiDQtdCz0L4g0LIg0YDQvtC00LjRgtC10LvRjNGB0LrQuNC5IEhUTUwt0Y3Qu9C10LzQtdC90YIuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAc2VlIGh0dHBzOi8vYXBpLnlhbmRleC5ydS9tYXBzL2RvYy9qc2FwaS8yLjEvcmVmL3JlZmVyZW5jZS9sYXlvdXQudGVtcGxhdGVCYXNlZC5CYXNlLnhtbCNidWlsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAbmFtZSBidWlsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3Iuc3VwZXJjbGFzcy5idWlsZC5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuXyRlbGVtZW50ID0gJCgnLnBpY2t1cC1iYWxsb29uJywgdGhpcy5nZXRQYXJlbnRFbGVtZW50KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqINCY0YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQtNC70Y8g0LDQstGC0L7Qv9C+0LfQuNGG0LjQvtC90LjRgNC+0LLQsNC90LjRjyAoYmFsbG9vbkF1dG9QYW4pLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHNlZSBodHRwczovL2FwaS55YW5kZXgucnUvbWFwcy9kb2MvanNhcGkvMi4xL3JlZi9yZWZlcmVuY2UvSUxheW91dC54bWwjZ2V0Q2xpZW50Qm91bmRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBuYW1lIGdldENsaWVudEJvdW5kc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHJldHVybnMge051bWJlcltdW119INCa0L7QvtGA0LTQuNC90LDRgtGLINC70LXQstC+0LPQviDQstC10YDRhdC90LXQs9C+INC4INC/0YDQsNCy0L7Qs9C+INC90LjQttC90LXQs9C+INGD0LPQu9C+0LIg0YjQsNCx0LvQvtC90LAg0L7RgtC90L7RgdC40YLQtdC70YzQvdC+INGC0L7Rh9C60Lgg0L/RgNC40LLRj9C30LrQuC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0U2hhcGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2lzRWxlbWVudCh0aGlzLl8kZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRwbEJhbGxvb24uc3VwZXJjbGFzcy5nZXRTaGFwZS5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLl8kZWxlbWVudC5wb3NpdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHltYXBzLnNoYXBlLlJlY3RhbmdsZShuZXcgeW1hcHMuZ2VvbWV0cnkucGl4ZWwuUmVjdGFuZ2xlKFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3Bvc2l0aW9uLmxlZnQsIHBvc2l0aW9uLnRvcF0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLmxlZnQgKyB0aGlzLl8kZWxlbWVudFswXS5vZmZzZXRXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnRvcCArIHRoaXMuXyRlbGVtZW50WzBdLm9mZnNldEhlaWdodCArIHRoaXMuXyRlbGVtZW50LmZpbmQoJy5hcnJvdycpWzBdLm9mZnNldEhlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqINCf0YDQvtCy0LXRgNGP0LXQvCDQvdCw0LvQuNGH0LjQtSDRjdC70LXQvNC10L3RgtCwICjQsiDQmNCVINC4INCe0L/QtdGA0LUg0LXQs9C+INC10YnQtSDQvNC+0LbQtdGCINC90LUg0LHRi9GC0YwpLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQG5hbWUgX2lzRWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9IFtlbGVtZW50XSDQrdC70LXQvNC10L3Rgi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufSDQpNC70LDQsyDQvdCw0LvQuNGH0LjRjy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lzRWxlbWVudDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudCAmJiBlbGVtZW50WzBdICYmIGVsZW1lbnQuZmluZCgnLmFycm93JylbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICRpdGVtcy5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICB2YXIgZ2VvID0gJCh0aGlzKS5kYXRhKCdnZW8nKSxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gJCh0aGlzKS5kYXRhKCd0ZXh0JykgfHwgJ9Ch0JDQmtCh0K3QoScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICQodGhpcykuZGF0YSgndHlwZScpIHx8ICdnZW8tb2ZmaWNlJztcclxuICAgICAgICAgICAgaWYgKGdlbykge1xyXG4gICAgICAgICAgICAgICAgZ2VvID0gZ2VvLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgICBnZW9bMF0gPSBwYXJzZUZsb2F0KGdlb1swXSk7XHJcbiAgICAgICAgICAgICAgICBnZW9bMV0gPSBwYXJzZUZsb2F0KGdlb1sxXSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGxhY2VtYXJrID0gbmV3IHltYXBzLlBsYWNlbWFyayhnZW8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0eXBlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MYXlvdXQ6IHRwbFBsYWNlbWFyayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25JbWFnZVNpemU6IFs0MCwgNTBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlkZUljb25PbkJhbGxvb25PcGVuOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbGxvb25MYXlvdXQ6IHRwbEJhbGxvb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWxsb29uQ2xvc2VCdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFuZTogJ2JhbGxvb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFsbG9vblBhbmVsTWF4TWFwQXJlYTogMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIG1hcC5nZW9PYmplY3RzLmFkZChwbGFjZW1hcmspO1xyXG4gICAgICAgICAgICAgICAgcGxhY2VtYXJrcy5wdXNoKHBsYWNlbWFyayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcGxhY2VtYXJrcztcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgYm91bmRzIG9uIGFsbCBnZW8gb2JqZWN0cyBvbiBtYXBcclxuICAgICAqIEBwYXJhbSBNYXAgbWFwXHJcbiAgICAgKiBAcmV0dXJucyB2b2lkXHJcbiAgICAgKi9cclxuICAgIG1hcFNldEJvdW5kczogZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgIG1hcC5zZXRCb3VuZHMobWFwLmdlb09iamVjdHMuZ2V0Qm91bmRzKCksIHtcclxuICAgICAgICAgICAgY2hlY2tab29tUmFuZ2U6IHRydWUsXHJcbiAgICAgICAgICAgIHpvb21NYXJnaW46IDUwXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRDYXJ0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLWNhcnQtaW5mb19fcmFkaW8nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1jYXJ0LWluZm9fX2hpZGRlbicpLmhpZGUoKTtcclxuICAgICAgICAgICAgdmFyIGRlbGl2ZXJ5ID0gJCh0aGlzKS5kYXRhKCdkZWxpdmVyeScpO1xyXG4gICAgICAgICAgICB2YXIgJHRhcmdldCA9ICQoJy5qcy1jYXJ0LWluZm9fX2hpZGRlbltkYXRhLWRlbGl2ZXJ5PVwiJyArIGRlbGl2ZXJ5ICsgJ1wiXScpO1xyXG4gICAgICAgICAgICAkdGFyZ2V0LnNob3coKTtcclxuICAgICAgICAgICAgJHRhcmdldC5maW5kKCcuanMtc2VsZWN0X2Fsd2F5cycpLnN0eWxlcigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBwaWNrdXBcclxuICAgICAgICB2YXIgJHdyYXBwZXIgPSAkKCcuanMtcGlja3VwJyksIG1hcCA9IG51bGw7XHJcbiAgICAgICAgaWYgKCR3cmFwcGVyLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHBvcHVwcyBpbiBwaWNrdXAgcG9wdXBcclxuICAgICAgICB2YXIgY2xvc2VQaG90b1BvcHVwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cCcpLmZhZGVPdXQoKS5yZW1vdmVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cC1vcGVuJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cC1vcGVuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnX2FjdGl2ZScpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cC1vcGVuJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgdmFyICRwb3B1cCA9ICQodGhpcykuc2libGluZ3MoJy5qcy1waWNrdXBfX3BvcHVwJyk7XHJcbiAgICAgICAgICAgIGlmICgkKCcuanMtcGlja3VwX19wb3B1cC5fYWN0aXZlJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cC5fYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKS5mYWRlT3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkcG9wdXAuZmFkZUluKCkuYWRkQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHBvcHVwLmZhZGVJbigpLmFkZENsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnLmpzLXBpY2t1cF9fcG9wdXAtY2xvc2UnKS5vbignY2xpY2snLCBjbG9zZVBob3RvUG9wdXApO1xyXG5cclxuICAgICAgICB2YXIgY2xvc2VQaWNrdXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG1hcC5iYWxsb29uLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX21hcF9faXRlbScpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3N1Ym1pdCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGNsb3NlUGhvdG9Qb3B1cCgpO1xyXG4gICAgICAgICAgICAkLmZhbmN5Ym94LmNsb3NlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHN1Ym1pdFxyXG4gICAgICAgICQoJy5qcy1waWNrdXBfX3N1Ym1pdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICRzZWxlY3RlZCA9ICQoJy5qcy1waWNrdXBfX21hcF9faXRlbS5fYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3RhcmdldF9fdGV4dCcpLnRleHQoJHNlbGVjdGVkLmZpbmQoJy5qcy1waWNrdXBfX21hcF9faXRlbV9fdGV4dCcpLnRleHQoKSk7XHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3RhcmdldF9fdGltZScpLnRleHQoJHNlbGVjdGVkLmZpbmQoJy5qcy1waWNrdXBfX21hcF9faXRlbV9fdGltZScpLnRleHQoKSB8fCAnJyk7XHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3RhcmdldF9faW5wdXQnKS52YWwoJHNlbGVjdGVkLmRhdGEoJ2lkJykgfHwgMCk7XHJcbiAgICAgICAgICAgIGNsb3NlUGlja3VwKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGNhbmNlbFxyXG4gICAgICAgICQoJy5qcy1waWNrdXBfX2NhbmNlbCcpLm9uKCdjbGljaycsIGNsb3NlUGlja3VwKTtcclxuXHJcbiAgICAgICAgLy8gbWFwXHJcbiAgICAgICAgdmFyIGluaXRNYXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG1hcCA9IGFwcC5tYXBJbml0KCdwaWNrdXBfbWFwJyk7XHJcbiAgICAgICAgICAgIHZhciBwbGFjZW1hcmtzID0gYXBwLm1hcEFkZFBsYWNlbWFya3MobWFwLCAkKCcuanMtcGlja3VwX19tYXBfX2l0ZW0nKSk7XHJcbiAgICAgICAgICAgIGFwcC5tYXBTZXRCb3VuZHMobWFwKTtcclxuICAgICAgICAgICAgLy8gY2xpY2tcclxuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fbWFwX19pdGVtJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJCh0aGlzKS5pbmRleCgpKTtcclxuLy8gICAgICAgICAgICAgICAgcGxhY2VtYXJrc1skKHRoaXMpLmluZGV4KCldLmJhbGxvb24ub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fbWFwX19pdGVtJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3N1Ym1pdCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcGxhY2VtYXJrc1skKHRoaXMpLmluZGV4KCldLmJhbGxvb24ub3BlbigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gaGFuZGxlIGNsaWNrIG9uIHBsYWNlbWFya1xyXG4gICAgICAgICAgICAkLmVhY2gocGxhY2VtYXJrcywgZnVuY3Rpb24gKGluZGV4LCBwbGFjZW1hcmspIHtcclxuICAgICAgICAgICAgICAgIHBsYWNlbWFyay5ldmVudHMuYWRkKCdiYWxsb29ub3BlbicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtcGlja3VwX19tYXBfX2l0ZW0nKS5yZW1vdmVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX21hcF9faXRlbScpLmVxKGluZGV4KS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3N1Ym1pdCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHdyYXBwZXIuZGF0YSgnaW5pdCcsIHRydWUpO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBpbml0IG1hcCBvbiBmYi5vcGVuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2FmdGVyU2hvdy5mYicsIGZ1bmN0aW9uIChlLCBpbnN0YW5jZSwgc2xpZGUpIHtcclxuICAgICAgICAgICAgdmFyICRwaWNrdXAgPSBzbGlkZS4kc2xpZGUuZmluZCgnLmpzLXBpY2t1cCcpO1xyXG4gICAgICAgICAgICBpZiAoJHBpY2t1cC5sZW5ndGggJiYgISRwaWNrdXAuZGF0YSgnaW5pdCcpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9hcGktbWFwcy55YW5kZXgucnUvMi4xLz9sYW5nPXJ1X1JVJm1vZGU9ZGVidWcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0U1A6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCgnLmpzLXNwJykubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvL2FwaS1tYXBzLnlhbmRleC5ydS8yLjEvP2xhbmc9cnVfUlUmbW9kZT1kZWJ1ZycsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5bWFwcy5yZWFkeShpbml0TWFwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluaXRNYXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXAgPSBhcHAubWFwSW5pdCgnc3BfbWFwJyk7XHJcbiAgICAgICAgICAgIGFwcC5tYXBBZGRQbGFjZW1hcmtzKG1hcCwgJCgnLmpzLXNwX19tYXAtaXRlbScpKTtcclxuICAgICAgICAgICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0YPQtdC8INC/0YDQuCDQvtGC0LrRgNGL0YLQuNC4INGB0YLRgNCw0L3QuNGG0YssINGC0LDQsdCwINC4INGB0LvQsNC50LTQsFxyXG4gICAgICAgICAgICBpZiAoJCgnI3NwX21hcCcpLmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICBhcHAubWFwU2V0Qm91bmRzKG1hcCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuanMtc3AgLmpzLXRhYnMnKS5vbmUoJ2Vhc3l0YWJzOmFmdGVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcC5tYXBTZXRCb3VuZHMobWFwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgJCgnLmpzLXNwIC5qcy1zcF9fbWFwLXRhYicpLm9uKCd0YWJzX3NsaWRlX29wZW4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwLm1hcFNldEJvdW5kcyhtYXApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRDb250YWN0czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKCcuanMtY29udGFjdHMnKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQoJy5qcy1jb250YWN0c19fbWFwJykuc3RpY2tfaW5fcGFyZW50KHtcclxuICAgICAgICAgICAgb2Zmc2V0X3RvcDogOTBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gcG9wdXBzIGluIHBpY2t1cCBwb3B1cFxyXG4gICAgICAgIHZhciBjbG9zZVBob3RvUG9wdXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1jb250YWN0c19fcG9wdXAuX2FjdGl2ZScpLmZhZGVPdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJy5qcy1jb250YWN0c19fcG9wdXAtb3BlbicpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnLmpzLWNvbnRhY3RzX19wb3B1cC1vcGVuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnX2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2xvc2VQaG90b1BvcHVwKCk7XHJcbiAgICAgICAgICAgIHZhciAkcG9wdXAgPSAkKHRoaXMpLnNpYmxpbmdzKCcuanMtY29udGFjdHNfX3BvcHVwJyk7XHJcbiAgICAgICAgICAgIHZhciAkY2xvbmVkID0gJHBvcHVwLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykub3V0ZXJXaWR0aCgpID49IGFwcENvbmZpZy5icmVha3BvaW50LmxnKSB7XHJcbiAgICAgICAgICAgICAgICAkY2xvbmVkLmFwcGVuZFRvKCQoJyNjb250YWN0c19tYXAnKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkY2xvbmVkLmFwcGVuZFRvKCdib2R5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJGNsb25lZC5mYWRlSW4oKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkY2xvbmVkLmZpbmQoJy5qcy1jb250YWN0c19fcG9wdXAtY2xvc2UnKS5vbignY2xpY2snLCBjbG9zZVBob3RvUG9wdXApO1xyXG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcuanMtY29udGFjdHNfX3BvcHVwLWNsb3NlJykub24oJ2NsaWNrJywgY2xvc2VQaG90b1BvcHVwKTtcclxuXHJcbiAgICAgICAgLy8gbWFwXHJcbiAgICAgICAgaWYgKHR5cGVvZiAoeW1hcHMpID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnLy9hcGktbWFwcy55YW5kZXgucnUvMi4xLz9sYW5nPXJ1X1JVJm1vZGU9ZGVidWcnLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwic2NyaXB0XCIsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB5bWFwcy5yZWFkeShpbml0TWFwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeW1hcHMucmVhZHkoaW5pdE1hcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBpbml0TWFwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJGl0ZW1zID0gJCgnLmpzLWNvbnRhY3RzX19tYXAtaXRlbScpO1xyXG4gICAgICAgICAgICBtYXAgPSBhcHAubWFwSW5pdCgnY29udGFjdHNfbWFwJyk7XHJcbiAgICAgICAgICAgIHZhciBwbGFjZW1hcmtzID0gYXBwLm1hcEFkZFBsYWNlbWFya3MobWFwLCAkaXRlbXMpO1xyXG4gICAgICAgICAgICBhcHAubWFwU2V0Qm91bmRzKG1hcCk7XHJcbiAgICAgICAgICAgICRpdGVtcy5lYWNoKGZ1bmN0aW9uIChpZHgpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlID0gJCh0aGlzKS5kYXRhKCd0eXBlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBsYWNlbWFyay4nICsgdHlwZSkuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1jb250YWN0c19fbWFwIC5qcy10YWcnKS5maWx0ZXIoJ1tkYXRhLXR5cGU9XCInICsgdHlwZSArICdcIl0nKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGxhY2VtYXJrc1tpZHhdKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXAuc2V0Q2VudGVyKHBsYWNlbWFya3NbaWR4XS5nZW9tZXRyeS5nZXRDb29yZGluYXRlcygpLCAxMywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMzAwXHJcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWFya3NbaWR4XS5iYWxsb29uLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gY2xpY2sgb24gdGFnXHJcbiAgICAgICAgICAgICQoJy5qcy1jb250YWN0c19fbWFwIC5qcy10YWcnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBtYXAuYmFsbG9vbi5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyICRwbSA9ICQoJy5wbGFjZW1hcmsuJyArICQodGhpcykuZGF0YSgndHlwZScpKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykuaGFzQ2xhc3MoJ19hY3RpdmUnKSA/ICRwbS5zaG93KCkgOiAkcG0uaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTRg9C90LrRhtC40Y8g0LLQvtC30LLRgNCw0YnQsNC10YIg0L7QutC+0L3Rh9Cw0L3QuNC1INC00LvRjyDQvNC90L7QttC10YHRgtCy0LXQvdC90L7Qs9C+INGH0LjRgdC70LAg0YHQu9C+0LLQsCDQvdCwINC+0YHQvdC+0LLQsNC90LjQuCDRh9C40YHQu9CwINC4INC80LDRgdGB0LjQstCwINC+0LrQvtC90YfQsNC90LjQuVxyXG4gICAgICogcGFyYW0gIGlOdW1iZXIgSW50ZWdlciDQp9C40YHQu9C+INC90LAg0L7RgdC90L7QstC1INC60L7RgtC+0YDQvtCz0L4g0L3Rg9C20L3QviDRgdGE0L7RgNC80LjRgNC+0LLQsNGC0Ywg0L7QutC+0L3Rh9Cw0L3QuNC1XHJcbiAgICAgKiBwYXJhbSAgYUVuZGluZ3MgQXJyYXkg0JzQsNGB0YHQuNCyINGB0LvQvtCyINC40LvQuCDQvtC60L7QvdGH0LDQvdC40Lkg0LTQu9GPINGH0LjRgdC10LsgKDEsIDQsIDUpLFxyXG4gICAgICogICAgICAgICDQvdCw0L/RgNC40LzQtdGAIFsn0Y/QsdC70L7QutC+JywgJ9GP0LHQu9C+0LrQsCcsICfRj9Cx0LvQvtC6J11cclxuICAgICAqIHJldHVybiBTdHJpbmdcclxuICAgICAqIFxyXG4gICAgICogaHR0cHM6Ly9oYWJyYWhhYnIucnUvcG9zdC8xMDU0MjgvXHJcbiAgICAgKi9cclxuICAgIGdldE51bUVuZGluZzogZnVuY3Rpb24gKGlOdW1iZXIsIGFFbmRpbmdzKSB7XHJcbiAgICAgICAgdmFyIHNFbmRpbmcsIGk7XHJcbiAgICAgICAgaU51bWJlciA9IGlOdW1iZXIgJSAxMDA7XHJcbiAgICAgICAgaWYgKGlOdW1iZXIgPj0gMTEgJiYgaU51bWJlciA8PSAxOSkge1xyXG4gICAgICAgICAgICBzRW5kaW5nID0gYUVuZGluZ3NbMl07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaSA9IGlOdW1iZXIgJSAxMDtcclxuICAgICAgICAgICAgc3dpdGNoIChpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICgxKTpcclxuICAgICAgICAgICAgICAgICAgICBzRW5kaW5nID0gYUVuZGluZ3NbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICgyKTpcclxuICAgICAgICAgICAgICAgIGNhc2UgKDMpOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAoNCk6XHJcbiAgICAgICAgICAgICAgICAgICAgc0VuZGluZyA9IGFFbmRpbmdzWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBzRW5kaW5nID0gYUVuZGluZ3NbMl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNFbmRpbmc7XHJcbiAgICB9LFxyXG5cclxufSJdLCJmaWxlIjoiY29tbW9uLmpzIn0=
