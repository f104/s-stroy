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