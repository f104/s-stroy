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
        var $headerTop = $('.header__top');
        var headerTopHeight = $headerTop.outerHeight();
        console.log(headerTopHeight)
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
//            disableBodyScroll: true
        });
    },

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
                    $secondLink.parent().off('mouseenter mouseleave');
                    initScrollbar();
                } else {
                    $wrapper.removeClass('_active');
                    $slideTrigger.on('click', slideMenu);
                    $secondLink.off('click', showSecond);
                    $secondLink.parent().hover(hoverIcon, unhoverIcon);
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

        $('.js-form__file__input').on('change', function(){
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
            $selects.styler({
                selectPlaceholder: '',
                selectSmartPositioning: false
            }).each(function(){
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
    }

}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsialF1ZXJ5LmV4cHJbJzonXS5mb2N1cyA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICByZXR1cm4gZWxlbSA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiAoZWxlbS50eXBlIHx8IGVsZW0uaHJlZik7XHJcbn07XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuaW5pdGlhbGl6ZSgpO1xyXG59KTtcclxuXHJcbnZhciBhcHAgPSB7XHJcbiAgICBpbml0aWFsaXplZDogZmFsc2UsXHJcblxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBlbGVtSFRNTCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdodG1sJylbMF07XHJcbiAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTWFjJykgPiAwKSB7XHJcbiAgICAgICAgICAgIGVsZW1IVE1MLmNsYXNzTmFtZSArPSBcIiBtYWMtb3NcIjtcclxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignU2FmYXJpJykgPiAwKVxyXG4gICAgICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIG1hYy1zYWZhcmlcIjtcclxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lJykgPiAwKVxyXG4gICAgICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIG1hYy1jaHJvbWVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignRWRnZScpID4gMCB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1RyaWRlbnQnKSA+IDApIHtcclxuICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIGllXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5pdFNsaWRlcnMoKTsgLy8gbXVzdCBiZSBmaXJzdCFcclxuICAgICAgICB0aGlzLmluaXRNZW51KCk7XHJcbiAgICAgICAgdGhpcy5pbml0Rm9vdGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q3V0KCk7XHJcbiAgICAgICAgdGhpcy5pbml0SG92ZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRTY3JvbGxiYXIoKTtcclxuICAgICAgICB0aGlzLmluaXRDYXRhbG9nKCk7XHJcbiAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XHJcbiAgICAgICAgdGhpcy5pbml0UG9wdXAoKTtcclxuICAgICAgICB0aGlzLmluaXRGb3JtKCk7XHJcbiAgICAgICAgdGhpcy5pbml0UmVnaW9uU2VsZWN0KCk7XHJcbiAgICAgICAgdGhpcy5pbml0VGFicygpO1xyXG4gICAgICAgIHRoaXMuaW5pdFFBKCk7XHJcbiAgICAgICAgdGhpcy5pbml0SU1tZW51KCk7XHJcbiAgICAgICAgdGhpcy5pbml0U2VsZWN0cygpO1xyXG4gICAgICAgIHRoaXMuaW5pdE1hc2soKTtcclxuICAgICAgICB0aGlzLmluaXRSYW5nZSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdEZpbHRlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdENyZWF0ZVByaWNlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0UXVhbnRpdHkoKTtcclxuICAgICAgICB0aGlzLmluaXRDYXJ0KCk7XHJcbiAgICAgICAgdGhpcy5pbml0U1AoKTtcclxuICAgICAgICB0aGlzLmluaXRUYWdzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q29udGFjdHMoKTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXBwLmluaXRIb3ZlcigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdE1lbnU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtbWVudS10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgICAgJCgnLmpzLW1lbnUtdG9nZ2xlcltocmVmPVwiJyArIGhyZWYgKyAnXCJdJykudG9nZ2xlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgJChocmVmKS50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKCcuanMtbWVudS5fYWN0aXZlJykubGVuZ3RoID09IDAgPyAkKCcuanMtbWVudS1vdmVybGF5JykuaGlkZSgpIDogJCgnLmpzLW1lbnUtb3ZlcmxheScpLnNob3coKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5qcy1tZW51LW92ZXJsYXknKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAkKCcuanMtbWVudS10b2dnbGVyLCAuanMtbWVudScpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQodGhpcykuaGlkZSgpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciAkaGVhZGVyID0gJCgnaGVhZGVyJyk7XHJcbiAgICAgICAgdmFyIGhlYWRlckhlaWdodCA9ICRoZWFkZXIub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgICB2YXIgJGhlYWRlclRvcCA9ICQoJy5oZWFkZXJfX3RvcCcpO1xyXG4gICAgICAgIHZhciBoZWFkZXJUb3BIZWlnaHQgPSAkaGVhZGVyVG9wLm91dGVySGVpZ2h0KCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coaGVhZGVyVG9wSGVpZ2h0KVxyXG4gICAgICAgIHZhciBxID0gMTtcclxuICAgICAgICB2YXIgYWN0aW9uID0gMDtcclxuICAgICAgICB2YXIgX3BpbkhlYWRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09IFwiY29tcGxldGVcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLnNjcm9sbFRvcCgpID4gaGVhZGVySGVpZ2h0ICogcSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gMTtcclxuICAgICAgICAgICAgICAgICRoZWFkZXIuc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLmNzcyh7J3BhZGRpbmctdG9wJzogaGVhZGVySGVpZ2h0fSk7XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLmNzcyh7J3RvcCc6IC1oZWFkZXJIZWlnaHR9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ19maXhlZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hbmltYXRlKHsndG9wJzogMH0sIDEwMDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PSAyIHx8ICEkaGVhZGVyLmhhc0NsYXNzKCdfZml4ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGFjdGlvbiA9IDI7XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLmFuaW1hdGUoeyd0b3AnOiAtaGVhZGVySGVpZ2h0fSwgXCJmYXN0XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaGVhZGVyLmNzcyh7J3RvcCc6IDB9KTtcclxuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKHsncGFkZGluZy10b3AnOiAwfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnX2ZpeGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcGluSGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJjb21wbGV0ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiBoZWFkZXJUb3BIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5jc3MoeydwYWRkaW5nLXRvcCc6IGhlYWRlckhlaWdodH0pO1xyXG4gICAgICAgICAgICAgICAgJGhlYWRlci5hZGRDbGFzcygnX2ZpeGVkJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoISRoZWFkZXIuaGFzQ2xhc3MoJ19maXhlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLmNzcyh7J3BhZGRpbmctdG9wJzogMH0pO1xyXG4gICAgICAgICAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnX2ZpeGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IGFwcENvbmZpZy5icmVha3BvaW50LmxnKSB7XHJcbiAgICAgICAgICAgIHBpbkhlYWRlcigpO1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ2xvYWQgc2Nyb2xsJywgcGluSGVhZGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSBhcHBDb25maWcuYnJlYWtwb2ludC5sZykge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVySGVpZ2h0ID0gJGhlYWRlci5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBwaW5IZWFkZXIpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmpzLW1lbnUnKS5yZW1vdmVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmpzLW1lbnUtb3ZlcmxheScpLmhpZGUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQod2luZG93KS5vZmYoJ3Njcm9sbCcsIHBpbkhlYWRlcik7XHJcbiAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuICAgICAgICAgICAgICAgICRoZWFkZXIucmVtb3ZlQ2xhc3MoJ19maXhlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRGb290ZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZml4TWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCQod2luZG93KS5vdXRlcldpZHRoKCkgPj0gYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQgJiYgJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50LmxnKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuZm9vdGVyX19tZW51LXNlY29uZCcpLmNzcygnbGVmdCcsICQoJy5mb290ZXJfX21lbnUgLm1lbnUgPiBsaTpudGgtY2hpbGQoMyknKS5vZmZzZXQoKS5sZWZ0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJy5mb290ZXJfX21lbnUtc2Vjb25kJykuY3NzKCdsZWZ0JywgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZml4TWVudSgpO1xyXG4gICAgICAgICQod2luZG93KS5vbignbG9hZCByZXNpemUnLCBmaXhNZW51KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEN1dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1jdXQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuanMtY3V0X190cmlnZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICRjb250ZW50ID0gJCh0aGlzKS5zaWJsaW5ncygnLmpzLWN1dF9fY29udGVudCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U2hvdyA9ICQodGhpcykuZGF0YSgndGV4dHNob3cnKSB8fCAnc2hvdyB0ZXh0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEhpZGUgPSAkKHRoaXMpLmRhdGEoJ3RleHRoaWRlJykgfHwgJ2hpZGUgdGV4dCc7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnRleHQoJGNvbnRlbnQuaXMoJzp2aXNpYmxlJykgPyB0ZXh0U2hvdyA6IHRleHRIaWRlKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJy5qcy1jdXRfX2NvbnRlbnQnKS5zbGlkZVRvZ2dsZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWZpbHRlcl9fY291bnRlcicpLnRyaWdnZXIoXCJzdGlja3lfa2l0OnJlY2FsY1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRTbGlkZXJzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLW1haW4tc2xpZGVyJykuc2xpY2soe1xyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiBhcHBDb25maWcuYnJlYWtwb2ludC5tZCAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcuanMtc2xpZGVyJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBzbGlkZXMgPSAkKHRoaXMpLmRhdGEoJ3NsaWRlcycpIHx8IHt9O1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNsaWNrKHtcclxuICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiBzbGlkZXMuc20gfHwgMSxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyTW9kZTogZmFsc2UsXHJcbi8vICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IGFwcENvbmZpZy5icmVha3BvaW50Lm1kIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogc2xpZGVzLm1kIHx8IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiBzbGlkZXMubGcgfHwgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnLmpzLW5hdi1zbGlkZXJfX21haW4nKS5zbGljayh7XHJcbiAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgYXNOYXZGb3I6ICcuanMtbmF2LXNsaWRlcl9fbmF2JyxcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgcmVzcG9uc2l2ZSA9IHtcclxuICAgICAgICAgICAgcHJvZHVjdDogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IGFwcENvbmZpZy5icmVha3BvaW50LmxnIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWxTd2lwaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDUsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgY29udGVudDogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IGFwcENvbmZpZy5icmVha3BvaW50Lm1kIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWxTd2lwaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDQsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiBhcHBDb25maWcuYnJlYWtwb2ludC5sZyAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsU3dpcGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiA1LFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfVxyXG4gICAgICAgICQoJy5qcy1uYXYtc2xpZGVyX19uYXYnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5zbGljayh7XHJcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYXNOYXZGb3I6ICcuanMtbmF2LXNsaWRlcl9fbWFpbicsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDMsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgICAgIGZvY3VzT25TZWxlY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IHJlc3BvbnNpdmVbJCh0aGlzKS5kYXRhKCdyZXNwb25zaXZlJyldLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1uYXYtc2xpZGVyX19tYWluLnNsaWNrLWluaXRpYWxpemVkJykuc2xpY2soJ3NldFBvc2l0aW9uJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIG9ubHkgc20gc2xpZGVyc1xyXG4gICAgICAgIHZhciBpc01vYmlsZSA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBpbml0U21TbGlkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1zbS1zbGlkZXInKS5zbGljayh7XHJcbiAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGRlc3Ryb3lTbVNsaWRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnLmpzLXNtLXNsaWRlci5zbGljay1pbml0aWFsaXplZCcpLnNsaWNrKCd1bnNsaWNrJyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgaXNNb2JpbGUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQ7XHJcbiAgICAgICAgdmFyIGNoZWNrU21TbGlkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdTaXplID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50Lm1kO1xyXG4gICAgICAgICAgICBpZiAobmV3U2l6ZSAhPSBpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgaXNNb2JpbGUgPSBuZXdTaXplO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgaW5pdFNtU2xpZGVyKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cm95U21TbGlkZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAkKHdpbmRvdykub24oJ2xvYWQgcmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjaGVja1NtU2xpZGVyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRUYWdzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLXRhZycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEhvdmVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLWhvdmVyJykudW5iaW5kKCdtb3VzZWVudGVyIG1vdXNlbGVhdmUnKTtcclxuICAgICAgICBpZiAoJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA+PSBhcHBDb25maWcuYnJlYWtwb2ludC5sZykge1xyXG4gICAgICAgICAgICAkKCcuanMtaG92ZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkdGhpcywgJHBhcmVudCwgJHdyYXAsICRob3ZlciwgaCwgdztcclxuICAgICAgICAgICAgICAgICQodGhpcykub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGhpcy5oYXNDbGFzcygnX2hvdmVyJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gJHRoaXMub2Zmc2V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHBhcmVudCA9ICR0aGlzLnBhcmVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICRwYXJlbnQuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICRwYXJlbnQub3V0ZXJIZWlnaHQoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGggPSAkdGhpcy5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHcgPSAkdGhpcy5vdXRlcldpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6IGgsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdyYXAgPSAkKCc8ZGl2Lz4nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKCdib2R5JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3RvcCc6IG9mZnNldC50b3AsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xlZnQnOiBvZmZzZXQubGVmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiB3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiBoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhvdmVyID0gJCgnPGRpdi8+JykuYXBwZW5kVG8oJHdyYXApO1xyXG4gICAgICAgICAgICAgICAgICAgICRob3Zlci5hZGRDbGFzcygnaG92ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5hcHBlbmRUbygkd3JhcCkuYWRkQ2xhc3MoJ19ob3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRob3Zlci5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnLTEwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAnLTEwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodDogJy0xMHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAnLTEwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdyYXAub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRob3Zlci5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKCRwYXJlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnX2hvdmVyJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcGFyZW50LnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkd3JhcC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0U2Nyb2xsYmFyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLXNjcm9sbGJhcicpLnNjcm9sbGJhcih7XHJcbi8vICAgICAgICAgICAgZGlzYWJsZUJvZHlTY3JvbGw6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFNlYXJjaDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkaW5wdXQgPSAkKCcuanMtc2VhcmNoLWZvcm1fX2lucHV0Jyk7XHJcbiAgICAgICAgJGlucHV0Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGlucHV0Lm9uKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmpzLXNlYXJjaC1yZXMnKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQod2luZG93KS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1zZWFyY2gtcmVzJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdENhdGFsb2c6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXNNb2JpbGUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcsXHJcbiAgICAgICAgICAgICAgICAkc2xpZGUgPSAkKCcuanMtY21fX3NsaWRlJyksXHJcbiAgICAgICAgICAgICAgICAkc2xpZGVUcmlnZ2VyID0gJCgnLmpzLWNtX19zbGlkZV9fdHJpZ2dlcicpLFxyXG4gICAgICAgICAgICAgICAgJG1lbnUgPSAkKCcuanMtY21fX21lbnUnKSxcclxuICAgICAgICAgICAgICAgICRzY3JvbGxiYXIgPSAkKCcuanMtY21fX3Njcm9sbGJhcicpLFxyXG4gICAgICAgICAgICAgICAgJG1vYmlsZVRvZ2dsZXIgPSAkKCcuanMtY21fX21vYmlsZS10b2dnbGVyJyksXHJcbiAgICAgICAgICAgICAgICAkc2Vjb25kTGluayA9ICQoJy5qcy1jbV9fc2Vjb25kLWxpbmsnKSxcclxuICAgICAgICAgICAgICAgICRzZWNvbmRDbG9zZSA9ICQoJy5qcy1jbV9fbWVudS1zZWNvbmRfX2Nsb3NlJyksXHJcbiAgICAgICAgICAgICAgICAkd3JhcHBlciA9ICQoJy5qcy1jbV9fbWVudS13cmFwcGVyJyk7XHJcblxyXG4gICAgICAgIHZhciBzbGlkZU1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzbGlkZS5zbGlkZVRvZ2dsZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuanMtZmlsdGVyX19jb3VudGVyJykudHJpZ2dlcihcInN0aWNreV9raXQ6cmVjYWxjXCIpO1xyXG4gICAgICAgICAgICAgICAgJG1lbnUudG9nZ2xlQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzaG93U2Vjb25kID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuanMtY21fX21lbnUtc2Vjb25kJykuYWRkQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGhvdmVySWNvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICRpY29uID0gJCh0aGlzKS5maW5kKCcuc3ByaXRlJyk7XHJcbiAgICAgICAgICAgICRpY29uLmFkZENsYXNzKCRpY29uLmRhdGEoJ2hvdmVyJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHVuaG92ZXJJY29uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJGljb24gPSAkKHRoaXMpLmZpbmQoJy5zcHJpdGUnKTtcclxuICAgICAgICAgICAgJGljb24ucmVtb3ZlQ2xhc3MoJGljb24uZGF0YSgnaG92ZXInKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW5pdFNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjcm9sbGJhci5zY3JvbGxiYXIoKTtcclxuICAgICAgICAgICAgJHNjcm9sbGJhci5jc3MoeydoZWlnaHQnOiAkKHdpbmRvdykub3V0ZXJIZWlnaHQoKSAtICQoJy5oZWFkZXInKS5vdXRlckhlaWdodCgpfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZGVzdHJveVNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjcm9sbGJhci5zY3JvbGxiYXIoJ2Rlc3Ryb3knKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgJHNsaWRlVHJpZ2dlci5vbignY2xpY2snLCBzbGlkZU1lbnUpO1xyXG4gICAgICAgICAgICAkc2Vjb25kTGluay5wYXJlbnQoKS5ob3Zlcihob3Zlckljb24sIHVuaG92ZXJJY29uKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRzZWNvbmRMaW5rLm9uKCdjbGljaycsIHNob3dTZWNvbmQpO1xyXG4gICAgICAgICAgICBpbml0U2Nyb2xsYmFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRtb2JpbGVUb2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHdyYXBwZXIudG9nZ2xlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRzZWNvbmRDbG9zZS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykucGFyZW50cygnLmpzLWNtX19tZW51LXNlY29uZCcpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIGNoZWNrTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1NpemUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubGc7XHJcbiAgICAgICAgICAgIGlmIChuZXdTaXplICE9IGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpc01vYmlsZSA9IG5ld1NpemU7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2xpZGUuc2hvdygpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgJG1lbnUuYWRkQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2xpZGVUcmlnZ2VyLm9mZignY2xpY2snLCBzbGlkZU1lbnUpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWNvbmRMaW5rLm9uKCdjbGljaycsIHNob3dTZWNvbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWNvbmRMaW5rLm9mZignbW91c2VlbnRlciBtb3VzZWxlYXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNlY29uZExpbmsucGFyZW50KCkub2ZmKCdtb3VzZWVudGVyIG1vdXNlbGVhdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICBpbml0U2Nyb2xsYmFyKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICR3cmFwcGVyLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlVHJpZ2dlci5vbignY2xpY2snLCBzbGlkZU1lbnUpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWNvbmRMaW5rLm9mZignY2xpY2snLCBzaG93U2Vjb25kKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2Vjb25kTGluay5wYXJlbnQoKS5ob3Zlcihob3Zlckljb24sIHVuaG92ZXJJY29uKTtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0cm95U2Nyb2xsYmFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkbWVudS5oYXNDbGFzcygnX29wZW5lZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzbGlkZS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChuZXdTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAkc2Nyb2xsYmFyLmNzcyh7J2hlaWdodCc6ICQod2luZG93KS5vdXRlckhlaWdodCgpIC0gJCgnLmhlYWRlcicpLm91dGVySGVpZ2h0KCl9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2hlY2tNZW51KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHRvZ2dsZSBjYXRhbG9nIGxpc3Qgdmlld1xyXG4gICAgICAgICQoJy5qcy1jYXRhbG9nLXZpZXctdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnLmpzLWNhdGFsb2ctdmlldy10b2dnbGVyJykudG9nZ2xlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgJCgnLmpzLWNhdGFsb2ctbGlzdCAuanMtY2F0YWxvZy1saXN0X19pdGVtLCAuanMtY2F0YWxvZy1saXN0IC5qcy1jYXRhbG9nLWxpc3RfX2l0ZW0gLmNhdGFsb2ctbGlzdF9faXRlbV9fY29udGVudCcpLnRvZ2dsZUNsYXNzKCdfY2FyZCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRQb3B1cDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICBiYXNlQ2xhc3M6ICdfcG9wdXAnLFxyXG4gICAgICAgICAgICBhdXRvRm9jdXM6IGZhbHNlLFxyXG4gICAgICAgICAgICB0b3VjaDogZmFsc2UsXHJcbiAgICAgICAgICAgIGFmdGVyU2hvdzogZnVuY3Rpb24gKGluc3RhbmNlLCBzbGlkZSkge1xyXG4gICAgICAgICAgICAgICAgc2xpZGUuJHNsaWRlLmZpbmQoJy5zbGljay1pbml0aWFsaXplZCcpLnNsaWNrKCdzZXRQb3NpdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgdmFyICRzaGlwcGluZyA9IHNsaWRlLiRzbGlkZS5maW5kKCcuanMtc2hpcHBpbmcnKTtcclxuICAgICAgICAgICAgICAgIGlmICgkc2hpcHBpbmcubGVuZ3RoICYmICEkc2hpcHBpbmcuZGF0YSgnaW5pdCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwLnNoaXBwaW5nLmluaXQoJHNoaXBwaW5nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJCgnLmpzLXBvcHVwJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkLmZhbmN5Ym94LmNsb3NlKCk7XHJcbiAgICAgICAgfSkuZmFuY3lib3gob3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoICE9PSAnIycpIHtcclxuICAgICAgICAgICAgdmFyICRjbnQgPSAkKHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcclxuICAgICAgICAgICAgaWYgKCRjbnQubGVuZ3RoICYmICRjbnQuaGFzQ2xhc3MoJ3BvcHVwJykpIHtcclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3gub3BlbigkY250LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEZvcm06IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJGlucHV0cyA9ICQoJy5qcy1mb3JtX19sYWJlbCcpLmZpbmQoJzpub3QoW3JlcXVpcmVkXSknKTtcclxuICAgICAgICAkaW5wdXRzXHJcbiAgICAgICAgICAgICAgICAub24oJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJ2xhYmVsJykucmVtb3ZlQ2xhc3MoJ2Zvcm1fX2xhYmVsX19lbXB0eScpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5vbignYmx1cicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISQodGhpcykudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5hZGRDbGFzcygnZm9ybV9fbGFiZWxfX2VtcHR5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISQodGhpcykudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5hZGRDbGFzcygnZm9ybV9fbGFiZWxfX2VtcHR5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbi8vICAgICAgICAgICAgICAgINC90LUg0YDQsNCx0L7RgtCw0LXRgiDQtNC70Y8g0YHQtdC70LXQutGC0L7QslxyXG4vLyAgICAgICAgLmZpbHRlcignW3ZhbHVlPVwiXCJdLCA6bm90KFt2YWx1ZV0pJykuc2libGluZ3MoJ2xhYmVsJykuYWRkQ2xhc3MoJ2Zvcm1fX2xhYmVsX19lbXB0eScpO1xyXG5cclxuICAgICAgICAkKCcuanMtZm9ybV9fZmlsZV9faW5wdXQnKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLnZhbCgpO1xyXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9cXFxcL2csICcvJykuc3BsaXQoJy8nKS5wb3AoKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuanMtZm9ybV9fZmlsZScpLmZpbmQoJy5qcy1mb3JtX19maWxlX19uYW1lJykudGV4dChuYW1lKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFJlZ2lvblNlbGVjdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1yZWdpb24tdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHNlbCA9ICQodGhpcykuZGF0YSgndG9nZ2xlJyk7XHJcbiAgICAgICAgICAgIGlmIChzZWwpIHtcclxuICAgICAgICAgICAgICAgICQoc2VsKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcuanMtcmVnaW9uLWNsb3NlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcucmVnaW9uLXNlbGVjdCcpLnNsaWRlVXAoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgJGhlYWRlclJlZ2lvblNlbGVjdCA9ICQoJy5oZWFkZXIgLnJlZ2lvbi1zZWxlY3QnKTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCRoZWFkZXJSZWdpb25TZWxlY3QuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICAgICAgICAgICRoZWFkZXJSZWdpb25TZWxlY3Quc2xpZGVVcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRUYWJzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGlzTW9iaWxlID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50Lm1kLFxyXG4gICAgICAgICAgICAgICAgJHRhYnMgPSAkKCcuanMtdGFic19fdGFiJyksXHJcbiAgICAgICAgICAgICAgICAkdG9nZ2xlcnMgPSAkKCcuanMtdGFic19fdGFiIC50YWJzX190YWJfX3RvZ2dsZXInKSxcclxuICAgICAgICAgICAgICAgICRjb250ZW50ID0gJCgnLmpzLXRhYnNfX3RhYiAudGFic19fdGFiX19jb250ZW50Jyk7XHJcbiAgICAgICAgaWYgKCEkdGFicy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgJHRvZ2dsZXJzLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcudGFic19fdGFiX19jb250ZW50Jykuc2xpZGVUb2dnbGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5pcygnOnZpc2libGUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICQodGhpcykudHJpZ2dlcigndGFic19zbGlkZV9vcGVuJywgJCh0aGlzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiAkKHRoaXMpLnRyaWdnZXIoJ3RhYnNfc2xpZGVfY2xvc2UnLCAkKHRoaXMpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgaW5pdEV0YWJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3U2l6ZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5tZDtcclxuICAgICAgICAgICAgaWYgKG5ld1NpemUgIT0gaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gbmV3U2l6ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgICR0YWJzLnNob3coKTtcclxuICAgICAgICAgICAgICAgICR0b2dnbGVycy5yZW1vdmVDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICAgICAgJGNvbnRlbnQuaGlkZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHRhYnMuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgJGNvbnRlbnQuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmpzLXRhYnMnKS5lYXN5dGFicyh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlSGFzaDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pLmJpbmQoJ2Vhc3l0YWJzOm1pZFRyYW5zaXRpb24nLCBmdW5jdGlvbiAoZXZlbnQsICRjbGlja2VkLCAkdGFyZ2V0UGFuZWwsIHNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICR1bmRlciA9ICQodGhpcykuZmluZCgnLmpzLXRhYnNfX3VuZGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHVuZGVyLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICRjbGlja2VkLnBhcmVudCgpLnBvc2l0aW9uKCkubGVmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICRjbGlja2VkLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICR0YWJzLmZpbHRlcignLmFjdGl2ZScpLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBpbml0VW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy10YWJzJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHVuZGVyID0gJCh0aGlzKS5maW5kKCcuanMtdGFic19fdW5kZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGFjdGl2ZUxpbmsgPSAkKHRoaXMpLmZpbmQoJy50YWJzX19saXN0IC5hY3RpdmUgYScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3AgPSAkYWN0aXZlTGluay5vdXRlckhlaWdodCgpIC0gJHVuZGVyLm91dGVySGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoJGFjdGl2ZUxpbmsubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHVuZGVyLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogJ2F1dG8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IHRvcCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJGFjdGl2ZUxpbmsucGFyZW50KCkucG9zaXRpb24oKS5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJGFjdGl2ZUxpbmsud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaW5pdEV0YWJzKCk7XHJcbiAgICAgICAgaW5pdFVuZGVyKCk7XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkIHJlc2l6ZScsIGluaXRFdGFicyk7XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkIHJlc2l6ZScsIGluaXRVbmRlcik7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRRQTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1xYTpub3QoLl9hY3RpdmUpIC5xYV9fYScpLnNsaWRlVXAoKTtcclxuICAgICAgICAkKCcuanMtcWEnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICAkdG9nZ2xlciA9ICR0aGlzLmZpbmQoJy5xYV9fcSAucWFfX2gnKSxcclxuICAgICAgICAgICAgICAgICAgICAkYW5zd2VyID0gJHRoaXMuZmluZCgnLnFhX19hJyk7XHJcbiAgICAgICAgICAgICR0b2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR0aGlzLnRvZ2dsZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAkYW5zd2VyLnNsaWRlVG9nZ2xlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0SU1tZW51OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLWltLW1lbnVfX3RvZ2dsZXI6bm90KC5fb3BlbmVkKScpLnNpYmxpbmdzKCcuanMtaW0tbWVudV9fc2xpZGUnKS5zbGlkZVVwKCk7XHJcbiAgICAgICAgJCgnLmpzLWltLW1lbnVfX3RvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmpzLWltLW1lbnVfX3NsaWRlJykuc2xpZGVUb2dnbGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFNlbGVjdHM6IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICQoJy5qcy1zZWxlY3RfYWx3YXlzJykuc3R5bGVyKCk7XHJcbiAgICAgICAgdmFyIGlzTW9iaWxlID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50Lm1kLFxyXG4gICAgICAgICAgICAgICAgJHNlbGVjdHMgPSAkKCcuanMtc2VsZWN0Jyk7XHJcbiAgICAgICAgaWYgKCEkc2VsZWN0cy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNlbGVjdHMuc3R5bGVyKHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdFBsYWNlaG9sZGVyOiAnJyxcclxuICAgICAgICAgICAgICAgIHNlbGVjdFNtYXJ0UG9zaXRpb25pbmc6IGZhbHNlXHJcbiAgICAgICAgICAgIH0pLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcygnY2hhbmdlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBkZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2VsZWN0cy5zdHlsZXIoJ2Rlc3Ryb3knKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciByZWZyZXNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3U2l6ZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5tZDtcclxuICAgICAgICAgICAgaWYgKG5ld1NpemUgIT0gaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gbmV3U2l6ZTtcclxuICAgICAgICAgICAgICAgIGlmICghaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbml0KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICghaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgaW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIHJlZnJlc2gpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0TWFzazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1tYXNrX190ZWwnKS5pbnB1dG1hc2soe1xyXG4gICAgICAgICAgICBtYXNrOiAnKzkgKDk5OSkgOTk5LTk5LTk5J1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIElucHV0bWFzay5leHRlbmRBbGlhc2VzKHtcclxuICAgICAgICAgICAgJ251bWVyaWMnOiB7XHJcbiAgICAgICAgICAgICAgICBhdXRvVW5tYXNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2hvd01hc2tPbkhvdmVyOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHJhZGl4UG9pbnQ6IFwiLFwiLFxyXG4gICAgICAgICAgICAgICAgZ3JvdXBTZXBhcmF0b3I6IFwiIFwiLFxyXG4gICAgICAgICAgICAgICAgZGlnaXRzOiAwLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dNaW51czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhdXRvR3JvdXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICByaWdodEFsaWduOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHVubWFza0FzTnVtYmVyOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCdodG1sOm5vdCguaWUpIC5qcy1tYXNrJykuaW5wdXRtYXNrKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRSYW5nZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1yYW5nZScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgc2xpZGVyID0gJCh0aGlzKS5maW5kKCcuanMtcmFuZ2VfX3RhcmdldCcpWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICRpbnB1dHMgPSAkKHRoaXMpLmZpbmQoJ2lucHV0JyksXHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbSA9ICRpbnB1dHMuZmlyc3QoKVswXSxcclxuICAgICAgICAgICAgICAgICAgICB0byA9ICRpbnB1dHMubGFzdCgpWzBdO1xyXG4gICAgICAgICAgICBpZiAoc2xpZGVyICYmIGZyb20gJiYgdG8pIHtcclxuICAgICAgICAgICAgICAgIHZhciBtaW5WID0gcGFyc2VJbnQoZnJvbS52YWx1ZSkgfHwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4ViA9IHBhcnNlSW50KHRvLnZhbHVlKSB8fCAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1pbiA9IHBhcnNlSW50KGZyb20uZGF0YXNldC5taW4pIHx8IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heCA9IHBhcnNlSW50KHRvLmRhdGFzZXQubWF4KSB8fCAwO1xyXG4gICAgICAgICAgICAgICAgbm9VaVNsaWRlci5jcmVhdGUoc2xpZGVyLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluVixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4VlxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBzdGVwOiAxMCxcclxuICAgICAgICAgICAgICAgICAgICByYW5nZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbWluJzogbWluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbWF4JzogbWF4XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc25hcFZhbHVlcyA9IFtmcm9tLCB0b107XHJcbiAgICAgICAgICAgICAgICBzbGlkZXIubm9VaVNsaWRlci5vbigndXBkYXRlJywgZnVuY3Rpb24gKHZhbHVlcywgaGFuZGxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc25hcFZhbHVlc1toYW5kbGVdLnZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZXNbaGFuZGxlXSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGZyb20uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5ub1VpU2xpZGVyLnNldChbdGhpcy52YWx1ZSwgbnVsbF0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBmcm9tLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVyLm5vVWlTbGlkZXIuc2V0KFt0aGlzLnZhbHVlLCBudWxsXSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXIubm9VaVNsaWRlci5zZXQoW251bGwsIHRoaXMudmFsdWVdKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdG8uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXIubm9VaVNsaWRlci5zZXQoW251bGwsIHRoaXMudmFsdWVdKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0RmlsdGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGlzTW9iaWxlID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50LmxnLFxyXG4gICAgICAgICAgICAgICAgJHNjcm9sbGJhciA9ICQoJy5qcy1maWx0ZXJfX3Njcm9sbGJhcicpLFxyXG4gICAgICAgICAgICAgICAgJG1vYmlsZVRvZ2dsZXIgPSAkKCcuanMtZmlsdGVyX19tb2JpbGUtdG9nZ2xlcicpLFxyXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIgPSAkKCcuanMtZmlsdGVyJyk7XHJcblxyXG4gICAgICAgIHZhciBpbml0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLnNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLmNzcyh7J2hlaWdodCc6ICQod2luZG93KS5vdXRlckhlaWdodCgpIC0gJCgnLmhlYWRlcicpLm91dGVySGVpZ2h0KCl9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBkZXN0cm95U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLnNjcm9sbGJhcignZGVzdHJveScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgIGluaXRTY3JvbGxiYXIoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcuanMtZmlsdGVyX19jb3VudGVyJykuc3RpY2tfaW5fcGFyZW50KHtvZmZzZXRfdG9wOiAxMDB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJG1vYmlsZVRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkd3JhcHBlci50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJy5qcy1maWx0ZXItZmllbGRzZXQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR0cmlnZ2VyID0gJCh0aGlzKS5maW5kKCcuanMtZmlsdGVyLWZpZWxkc2V0X190cmlnZ2VyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlID0gJCh0aGlzKS5maW5kKCcuanMtZmlsdGVyLWZpZWxkc2V0X19zbGlkZScpO1xyXG4gICAgICAgICAgICAkdHJpZ2dlci5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdfY2xvc2VkJyk7XHJcbiAgICAgICAgICAgICAgICAkc2xpZGUuc2xpZGVUb2dnbGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1maWx0ZXJfX2NvdW50ZXInKS50cmlnZ2VyKFwic3RpY2t5X2tpdDpyZWNhbGNcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBjaGVjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1NpemUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubGc7XHJcbiAgICAgICAgICAgIGlmIChuZXdTaXplICE9IGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpc01vYmlsZSA9IG5ld1NpemU7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbml0U2Nyb2xsYmFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWZpbHRlcl9fY291bnRlcicpLnRyaWdnZXIoXCJzdGlja3lfa2l0OmRldGFjaFwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdyYXBwZXIucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0cm95U2Nyb2xsYmFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWZpbHRlcl9fY291bnRlcicpLnN0aWNrX2luX3BhcmVudCh7b2Zmc2V0X3RvcDogMTAwfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobmV3U2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjcm9sbGJhci5jc3MoeydoZWlnaHQnOiAkKHdpbmRvdykub3V0ZXJIZWlnaHQoKSAtICQoJy5oZWFkZXInKS5vdXRlckhlaWdodCgpfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNoZWNrKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRDcmVhdGVQcmljZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkaXRlbXMgPSAkKCcuanMtY3JlYXRlLXByaWNlX19pdGVtJyksXHJcbiAgICAgICAgICAgICAgICAkcGFyZW50cyA9ICQoJy5qcy1jcmVhdGUtcHJpY2VfX3BhcmVudCcpLFxyXG4gICAgICAgICAgICAgICAgJGNvdW50ZXIgPSAkKCcuanMtY3JlYXRlLXByaWNlX19jb3VudGVyJyksXHJcbiAgICAgICAgICAgICAgICAkYWxsID0gJCgnLmpzLWNyZWF0ZS1wcmljZV9fYWxsJyksXHJcbiAgICAgICAgICAgICAgICAkY2xlYXIgPSAkKCcuanMtY3JlYXRlLXByaWNlX19jbGVhcicpLFxyXG4gICAgICAgICAgICAgICAgZGVjbDEgPSBbJ9CS0YvQsdGA0LDQvdCwOiAnLCAn0JLRi9Cx0YDQsNC90L46ICcsICfQktGL0LHRgNCw0L3QvjogJ10sXHJcbiAgICAgICAgICAgICAgICBkZWNsMiA9IFsnINC60LDRgmXQs9C+0YDQuNGPJywgJyDQutCw0YLQtdCz0L7RgNC40LgnLCAnINC60LDRgtC10LPQvtGA0LjQuSddLFxyXG4gICAgICAgICAgICAgICAgaXNNb2JpbGUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQ7XHJcbiAgICAgICAgaWYgKCRpdGVtcy5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciBjb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRvdGFsID0gJGl0ZW1zLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGg7XHJcbiAgICAgICAgICAgICRjb3VudGVyLnRleHQoYXBwLmdldE51bUVuZGluZyh0b3RhbCwgZGVjbDEpICsgdG90YWwgKyBhcHAuZ2V0TnVtRW5kaW5nKHRvdGFsLCBkZWNsMikpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY291bnQoKTtcclxuICAgICAgICAkaXRlbXMub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR3cmFwcGVyID0gJCh0aGlzKS5wYXJlbnRzKCcuanMtY3JlYXRlLXByaWNlX193cmFwcGVyJyk7XHJcbiAgICAgICAgICAgIGlmICgkd3JhcHBlcikge1xyXG4gICAgICAgICAgICAgICAgdmFyICRpdGVtcyA9ICR3cmFwcGVyLmZpbmQoJy5qcy1jcmVhdGUtcHJpY2VfX2l0ZW0nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHBhcmVudCA9ICR3cmFwcGVyLmZpbmQoJy5qcy1jcmVhdGUtcHJpY2VfX3BhcmVudCcpO1xyXG4gICAgICAgICAgICAgICAgJHBhcmVudC5wcm9wKCdjaGVja2VkJywgJGl0ZW1zLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGggIT09IDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvdW50KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJHBhcmVudHMub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICRjaGlsZHMgPSAkKHRoaXMpLnBhcmVudHMoJy5qcy1jcmVhdGUtcHJpY2VfX3dyYXBwZXInKS5maW5kKCcuanMtY3JlYXRlLXByaWNlX19pdGVtJyk7XHJcbiAgICAgICAgICAgICRjaGlsZHMucHJvcCgnY2hlY2tlZCcsICQodGhpcykucHJvcCgnY2hlY2tlZCcpKTtcclxuICAgICAgICAgICAgY291bnQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkYWxsLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJGl0ZW1zLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgJHBhcmVudHMucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICBjb3VudCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgJGNsZWFyLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJGl0ZW1zLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICRwYXJlbnRzLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGNvdW50KCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAvLyBmaXggaGVhZGVyXHJcbiAgICAgICAgdmFyICRoZWFkID0gJCgnLmNhdGFsb2ctY3JlYXRlLWhlYWQuX2Zvb3QnKTtcclxuICAgICAgICB2YXIgYnJlYWtwb2ludCwgd0hlaWdodDtcclxuICAgICAgICBmaXhJbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBicmVha3BvaW50ID0gJGhlYWQub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgICAgICB3SGVpZ2h0ID0gJCh3aW5kb3cpLm91dGVySGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIGZpeEhlYWQoKTtcclxuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmaXhIZWFkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZml4SGVhZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSArIHdIZWlnaHQgPCBicmVha3BvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAkaGVhZC5hZGRDbGFzcygnX2ZpeGVkJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkaGVhZC5yZW1vdmVDbGFzcygnX2ZpeGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgIGZpeEluaXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdTaXplID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50LmxnO1xyXG4gICAgICAgICAgICBpZiAobmV3U2l6ZSAhPSBpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgaXNNb2JpbGUgPSBuZXdTaXplO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZml4SW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub2ZmKCdzY3JvbGwnLCBmaXhIZWFkKTtcclxuICAgICAgICAgICAgICAgICAgICAkaGVhZC5yZW1vdmVDbGFzcygnX2ZpeGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSAkICR3cmFwcGVyXHJcbiAgICAgKi9cclxuICAgIGluaXRTaGlwcGluZ0NhbGM6IGZ1bmN0aW9uICgkd3JhcHBlcikge1xyXG4gICAgICAgIHZhciAkc2xpZGVyID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19jYXItc2xpZGVyJyksXHJcbiAgICAgICAgICAgICAgICAkcmFkaW8gPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2Nhci1yYWRpbycpO1xyXG4gICAgICAgIGlmICgkc2xpZGVyLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAkc2xpZGVyLnNsaWNrKHtcclxuICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBmYWRlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkcmFkaW8ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gJCh0aGlzKS5wYXJlbnRzKCcuanMtc2hpcHBpbmdfX2Nhci1sYWJlbCcpLmluZGV4KCk7XHJcbiAgICAgICAgICAgICAgICAkc2xpZGVyLnNsaWNrKCdzbGlja0dvVG8nLCBpbmRleCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciAkZGF0ZWlucHV0V3JhcHBlciA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZS1pbnB1dCcpLFxyXG4gICAgICAgICAgICAgICAgJGRhdGVpbnB1dCA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZS1pbnB1dF9faW5wdXQnKSxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVkRGF5cyA9IFswLCA2XTtcclxuICAgICAgICAkZGF0ZWlucHV0LmRhdGVwaWNrZXIoe1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ3RvcCByaWdodCcsXHJcbiAgICAgICAgICAgIG9mZnNldDogNDAsXHJcbiAgICAgICAgICAgIG5hdlRpdGxlczoge1xyXG4gICAgICAgICAgICAgICAgZGF5czogJ01NJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtaW5EYXRlOiBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldFRpbWUoKSArIDg2NDAwICogMTAwMCAqIDIpLFxyXG4gICAgICAgICAgICBvblJlbmRlckNlbGw6IGZ1bmN0aW9uIChkYXRlLCBjZWxsVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09ICdkYXknKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRheSA9IGRhdGUuZ2V0RGF5KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Rpc2FibGVkID0gZGlzYWJsZWREYXlzLmluZGV4T2YoZGF5KSAhPSAtMTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IGlzRGlzYWJsZWRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbiAoZm9ybWF0dGVkRGF0ZSwgZGF0ZSwgaW5zdCkge1xyXG4gICAgICAgICAgICAgICAgaW5zdC5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAkZGF0ZWlucHV0V3JhcHBlci5yZW1vdmVDbGFzcygnX2VtcHR5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgZGF0ZXBpY2tlciA9ICRkYXRlaW5wdXQuZGF0ZXBpY2tlcigpLmRhdGEoJ2RhdGVwaWNrZXInKTtcclxuICAgICAgICAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2RhdGVwaWNrZXItdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZGF0ZXBpY2tlci5zaG93KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIG1hcFxyXG4gICAgICAgIHZhciBtYXAsICRyb3V0ZUFkZHJlc3MgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3JvdXRlLWFkZHJlc3MnKSxcclxuICAgICAgICAgICAgICAgICRyb3V0ZURpc3RhbmNlID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yb3V0ZS1kaXN0YW5jZScpO1xyXG4gICAgICAgIHZhciBpbml0TWFwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgYmFsbG9vbkxheW91dCA9IHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyhcclxuICAgICAgICAgICAgICAgICAgICBcIjxkaXY+XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3Iuc3VwZXJjbGFzcy5idWlsZC5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB2YXIgbXVsdGlSb3V0ZSA9IG5ldyB5bWFwcy5tdWx0aVJvdXRlci5NdWx0aVJvdXRlKHtcclxuICAgICAgICAgICAgICAgIC8vINCe0L/QuNGB0LDQvdC40LUg0L7Qv9C+0YDQvdGL0YUg0YLQvtGH0LXQuiDQvNGD0LvRjNGC0LjQvNCw0YDRiNGA0YPRgtCwLlxyXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlUG9pbnRzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwQ29uZmlnLnNoaXBwaW5nLmZyb20uZ2VvLFxyXG4gICAgICAgICAgICAgICAgICAgIGFwcENvbmZpZy5zaGlwcGluZy50by5nZW8sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0czogM1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBib3VuZHNBdXRvQXBwbHk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB3YXlQb2ludFN0YXJ0SWNvbkNvbnRlbnRMYXlvdXQ6IHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwQ29uZmlnLnNoaXBwaW5nLmZyb20udGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgd2F5UG9pbnRGaW5pc2hEcmFnZ2FibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBiYWxsb29uTGF5b3V0OiBiYWxsb29uTGF5b3V0XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtdWx0aVJvdXRlLm1vZGVsLmV2ZW50cy5hZGQoJ3JlcXVlc3RzdWNjZXNzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2V0RGlzdGFuY2UobXVsdGlSb3V0ZS5nZXRBY3RpdmVSb3V0ZSgpKTtcclxuICAgICAgICAgICAgICAgIHZhciBwb2ludCA9IG11bHRpUm91dGUuZ2V0V2F5UG9pbnRzKCkuZ2V0KDEpO1xyXG4gICAgICAgICAgICAgICAgeW1hcHMuZ2VvY29kZShwb2ludC5nZW9tZXRyeS5nZXRDb29yZGluYXRlcygpKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IHJlcy5nZW9PYmplY3RzLmdldCgwKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWRkcmVzcyA9IG8uZ2V0QWRkcmVzc0xpbmUoKS5yZXBsYWNlKCfQndC40LbQtdCz0L7RgNC+0LTRgdC60LDRjyDQvtCx0LvQsNGB0YLRjCwgJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICRyb3V0ZUFkZHJlc3MudmFsKGFkZHJlc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIG11bHRpUm91dGUub3B0aW9ucy5zZXQoJ3dheVBvaW50RmluaXNoSWNvbkNvbnRlbnRMYXlvdXQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKGFkZHJlc3MpKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtdWx0aVJvdXRlLmV2ZW50cy5hZGQoJ2FjdGl2ZXJvdXRlY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2V0RGlzdGFuY2UobXVsdGlSb3V0ZS5nZXRBY3RpdmVSb3V0ZSgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG1hcCA9IG5ldyB5bWFwcy5NYXAoXCJzaGlwcGluZ19tYXBcIiwge1xyXG4gICAgICAgICAgICAgICAgY2VudGVyOiBhcHBDb25maWcuc2hpcHBpbmcuZnJvbS5nZW8sXHJcbiAgICAgICAgICAgICAgICB6b29tOiAxMyxcclxuICAgICAgICAgICAgICAgIGF1dG9GaXRUb1ZpZXdwb3J0OiAnYWx3YXlzJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xzOiBbXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbWFwLmdlb09iamVjdHMuYWRkKG11bHRpUm91dGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc2V0RGlzdGFuY2UgPSBmdW5jdGlvbiAocm91dGUpIHtcclxuICAgICAgICAgICAgaWYgKHJvdXRlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnJvdW5kKHJvdXRlLnByb3BlcnRpZXMuZ2V0KCdkaXN0YW5jZScpLnZhbHVlIC8gMTAwMCk7XHJcbiAgICAgICAgICAgICAgICAkcm91dGVEaXN0YW5jZS52YWwoZGlzdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgKHltYXBzKSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogJy8vYXBpLW1hcHMueWFuZGV4LnJ1LzIuMS8/bGFuZz1ydV9SVSZtb2RlPWRlYnVnJyxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcInNjcmlwdFwiLFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeW1hcHMucmVhZHkoaW5pdE1hcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX21hcC10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdfb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fbWFwJykuc2xpZGVUb2dnbGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQpIHtcclxuICAgICAgICAgICAgICAgICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fbWFwLXRvZ2dsZXInKS5hZGRDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19tYXAnKS5zbGlkZURvd24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICR3cmFwcGVyLmRhdGEoJ2luaXQnLCB0cnVlKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFF1YW50aXR5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLXF1YW50aXR5LXNoaWZ0LmpzLXF1YW50aXR5LXVwLCAuanMtcXVhbnRpdHktc2hpZnQuanMtcXVhbnRpdHktZG93bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyICRxdWFudGl0eUlucHV0ID0gJCh0aGlzKS5zaWJsaW5ncygnLmpzLXF1YW50aXR5JylbMF07XHJcbiAgICAgICAgICAgIGlmICgkcXVhbnRpdHlJbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1ciA9IHBhcnNlSW50KCRxdWFudGl0eUlucHV0LnZhbHVlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hpZnRVcCA9ICQodGhpcykuaGFzQ2xhc3MoJ2pzLXF1YW50aXR5LXVwJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0ID0gJCgkcXVhbnRpdHlJbnB1dCkuYXR0cihzaGlmdFVwID8gJ21heCcgOiAnbWluJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHNoaWZ0VXAgPyBjdXIgKyAxIDogY3VyIC0gMTtcclxuICAgICAgICAgICAgICAgIGlmICghbGltaXQgfHwgKHNoaWZ0VXAgJiYgdmFsIDw9IHBhcnNlSW50KGxpbWl0KSkgfHwgKCFzaGlmdFVwICYmIHZhbCA+PSBwYXJzZUludChsaW1pdCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHF1YW50aXR5SW5wdXQudmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgkcXVhbnRpdHlJbnB1dCkuY2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpbml0IG1hcCBpbiBjb250YWluZXJcclxuICAgICAqIEBwYXJhbSBzdHJpbmcgY250IGlkXHJcbiAgICAgKiBAcmV0dXJuIE1hcCBcclxuICAgICAqL1xyXG4gICAgbWFwSW5pdDogZnVuY3Rpb24gKGNudCkge1xyXG4gICAgICAgIHZhciBtYXAgPSBuZXcgeW1hcHMuTWFwKGNudCwge1xyXG4gICAgICAgICAgICBjZW50ZXI6IFs1Ni4zMjY4ODcsIDQ0LjAwNTk4Nl0sXHJcbiAgICAgICAgICAgIHpvb206IDExLFxyXG4gICAgICAgICAgICBjb250cm9sczogW11cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHN1cHByZXNzTWFwT3BlbkJsb2NrOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1hcC5jb250cm9scy5hZGQoJ3pvb21Db250cm9sJywge1xyXG4gICAgICAgICAgICBzaXplOiAnc21hbGwnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG1hcDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgcGxhY2VtYXJrcyBvbiBtYXBcclxuICAgICAqIEBwYXJhbSBNYXAgbWFwXHJcbiAgICAgKiBAcGFyYW0gJCBpdGVtcyB3aXRoIGRhdGEtYXR0clxyXG4gICAgICogQHJldHVybiBhcnJheSBvZiBHZW9PYmplY3RcclxuICAgICAqL1xyXG4gICAgbWFwQWRkUGxhY2VtYXJrczogZnVuY3Rpb24gKG1hcCwgJGl0ZW1zKSB7XHJcbiAgICAgICAgdmFyIHBsYWNlbWFya3MgPSBbXTtcclxuICAgICAgICB2YXIgdHBsUGxhY2VtYXJrID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwbGFjZW1hcmsge3sgcHJvcGVydGllcy50eXBlIH19XCI+PGkgY2xhc3M9XCJzcHJpdGUge3sgcHJvcGVydGllcy50eXBlIH19XCI+PC9pPjwvZGl2PidcclxuICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICB0cGxCYWxsb29uID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInBpY2t1cC1iYWxsb29uXCI+e3sgcHJvcGVydGllcy50ZXh0IH19PHNwYW4gY2xhc3M9XCJhcnJvd1wiPjwvc3Bhbj48L2Rpdj4nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqINCh0YLRgNC+0LjRgiDRjdC60LfQtdC80L/Qu9GP0YAg0LzQsNC60LXRgtCwINC90LAg0L7RgdC90L7QstC1INGI0LDQsdC70L7QvdCwINC4INC00L7QsdCw0LLQu9GP0LXRgiDQtdCz0L4g0LIg0YDQvtC00LjRgtC10LvRjNGB0LrQuNC5IEhUTUwt0Y3Qu9C10LzQtdC90YIuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAc2VlIGh0dHBzOi8vYXBpLnlhbmRleC5ydS9tYXBzL2RvYy9qc2FwaS8yLjEvcmVmL3JlZmVyZW5jZS9sYXlvdXQudGVtcGxhdGVCYXNlZC5CYXNlLnhtbCNidWlsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAbmFtZSBidWlsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3Iuc3VwZXJjbGFzcy5idWlsZC5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuXyRlbGVtZW50ID0gJCgnLnBpY2t1cC1iYWxsb29uJywgdGhpcy5nZXRQYXJlbnRFbGVtZW50KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqINCY0YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQtNC70Y8g0LDQstGC0L7Qv9C+0LfQuNGG0LjQvtC90LjRgNC+0LLQsNC90LjRjyAoYmFsbG9vbkF1dG9QYW4pLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHNlZSBodHRwczovL2FwaS55YW5kZXgucnUvbWFwcy9kb2MvanNhcGkvMi4xL3JlZi9yZWZlcmVuY2UvSUxheW91dC54bWwjZ2V0Q2xpZW50Qm91bmRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBuYW1lIGdldENsaWVudEJvdW5kc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHJldHVybnMge051bWJlcltdW119INCa0L7QvtGA0LTQuNC90LDRgtGLINC70LXQstC+0LPQviDQstC10YDRhdC90LXQs9C+INC4INC/0YDQsNCy0L7Qs9C+INC90LjQttC90LXQs9C+INGD0LPQu9C+0LIg0YjQsNCx0LvQvtC90LAg0L7RgtC90L7RgdC40YLQtdC70YzQvdC+INGC0L7Rh9C60Lgg0L/RgNC40LLRj9C30LrQuC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0U2hhcGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2lzRWxlbWVudCh0aGlzLl8kZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRwbEJhbGxvb24uc3VwZXJjbGFzcy5nZXRTaGFwZS5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5fJGVsZW1lbnQucG9zaXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB5bWFwcy5zaGFwZS5SZWN0YW5nbGUobmV3IHltYXBzLmdlb21ldHJ5LnBpeGVsLlJlY3RhbmdsZShbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtwb3NpdGlvbi5sZWZ0LCBwb3NpdGlvbi50b3BdLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi5sZWZ0ICsgdGhpcy5fJGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi50b3AgKyB0aGlzLl8kZWxlbWVudFswXS5vZmZzZXRIZWlnaHQgKyB0aGlzLl8kZWxlbWVudC5maW5kKCcuYXJyb3cnKVswXS5vZmZzZXRIZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiDQn9GA0L7QstC10YDRj9C10Lwg0L3QsNC70LjRh9C40LUg0Y3Qu9C10LzQtdC90YLQsCAo0LIg0JjQlSDQuCDQntC/0LXRgNC1INC10LPQviDQtdGJ0LUg0LzQvtC20LXRgiDQvdC1INCx0YvRgtGMKS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBuYW1lIF9pc0VsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSBbZWxlbWVudF0g0K3Qu9C10LzQtdC90YIuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0g0KTQu9Cw0LMg0L3QsNC70LjRh9C40Y8uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pc0VsZW1lbnQ6IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQgJiYgZWxlbWVudFswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgJGl0ZW1zLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgIHZhciBnZW8gPSAkKHRoaXMpLmRhdGEoJ2dlbycpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSAkKHRoaXMpLmRhdGEoJ3RleHQnKSB8fCAn0KHQkNCa0KHQrdChJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJCh0aGlzKS5kYXRhKCd0eXBlJykgfHwgJ2dlby1vZmZpY2UnO1xyXG4gICAgICAgICAgICBpZiAoZ2VvKSB7XHJcbiAgICAgICAgICAgICAgICBnZW8gPSBnZW8uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgICAgIGdlb1swXSA9IHBhcnNlRmxvYXQoZ2VvWzBdKTtcclxuICAgICAgICAgICAgICAgIGdlb1sxXSA9IHBhcnNlRmxvYXQoZ2VvWzFdKTtcclxuICAgICAgICAgICAgICAgIHZhciBwbGFjZW1hcmsgPSBuZXcgeW1hcHMuUGxhY2VtYXJrKGdlbyxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkxheW91dDogdHBsUGxhY2VtYXJrLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkltYWdlU2l6ZTogWzQwLCA1MF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRlSWNvbk9uQmFsbG9vbk9wZW46IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFsbG9vbkxheW91dDogdHBsQmFsbG9vbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbGxvb25DbG9zZUJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYW5lOiAnYmFsbG9vbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWxsb29uUGFuZWxNYXhNYXBBcmVhOiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgbWFwLmdlb09iamVjdHMuYWRkKHBsYWNlbWFyayk7XHJcbiAgICAgICAgICAgICAgICBwbGFjZW1hcmtzLnB1c2gocGxhY2VtYXJrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBwbGFjZW1hcmtzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBib3VuZHMgb24gYWxsIGdlbyBvYmplY3RzIG9uIG1hcFxyXG4gICAgICogQHBhcmFtIE1hcCBtYXBcclxuICAgICAqIEByZXR1cm5zIHZvaWRcclxuICAgICAqL1xyXG4gICAgbWFwU2V0Qm91bmRzOiBmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgbWFwLnNldEJvdW5kcyhtYXAuZ2VvT2JqZWN0cy5nZXRCb3VuZHMoKSwge1xyXG4gICAgICAgICAgICBjaGVja1pvb21SYW5nZTogdHJ1ZSxcclxuICAgICAgICAgICAgem9vbU1hcmdpbjogNTBcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdENhcnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtY2FydC1pbmZvX19yYWRpbycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnLmpzLWNhcnQtaW5mb19faGlkZGVuJykuaGlkZSgpO1xyXG4gICAgICAgICAgICB2YXIgZGVsaXZlcnkgPSAkKHRoaXMpLmRhdGEoJ2RlbGl2ZXJ5Jyk7XHJcbiAgICAgICAgICAgIHZhciAkdGFyZ2V0ID0gJCgnLmpzLWNhcnQtaW5mb19faGlkZGVuW2RhdGEtZGVsaXZlcnk9XCInICsgZGVsaXZlcnkgKyAnXCJdJyk7XHJcbiAgICAgICAgICAgICR0YXJnZXQuc2hvdygpO1xyXG4gICAgICAgICAgICAkdGFyZ2V0LmZpbmQoJy5qcy1zZWxlY3RfYWx3YXlzJykuc3R5bGVyKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHBpY2t1cFxyXG4gICAgICAgIHZhciAkd3JhcHBlciA9ICQoJy5qcy1waWNrdXAnKSwgbWFwID0gbnVsbDtcclxuICAgICAgICBpZiAoJHdyYXBwZXIubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcG9wdXBzIGluIHBpY2t1cCBwb3B1cFxyXG4gICAgICAgIHZhciBjbG9zZVBob3RvUG9wdXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3BvcHVwJykuZmFkZU91dCgpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3BvcHVwLW9wZW4nKS5yZW1vdmVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQoJy5qcy1waWNrdXBfX3BvcHVwLW9wZW4nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdfYWN0aXZlJykpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3BvcHVwLW9wZW4nKS5yZW1vdmVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB2YXIgJHBvcHVwID0gJCh0aGlzKS5zaWJsaW5ncygnLmpzLXBpY2t1cF9fcG9wdXAnKTtcclxuICAgICAgICAgICAgaWYgKCQoJy5qcy1waWNrdXBfX3BvcHVwLl9hY3RpdmUnKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3BvcHVwLl9hY3RpdmUnKS5yZW1vdmVDbGFzcygnX2FjdGl2ZScpLmZhZGVPdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRwb3B1cC5mYWRlSW4oKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkcG9wdXAuZmFkZUluKCkuYWRkQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cC1jbG9zZScpLm9uKCdjbGljaycsIGNsb3NlUGhvdG9Qb3B1cCk7XHJcblxyXG4gICAgICAgIHZhciBjbG9zZVBpY2t1cCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbWFwLmJhbGxvb24uY2xvc2UoKTtcclxuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fbWFwX19pdGVtJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fc3VibWl0JykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgY2xvc2VQaG90b1BvcHVwKCk7XHJcbiAgICAgICAgICAgICQuZmFuY3lib3guY2xvc2UoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc3VibWl0XHJcbiAgICAgICAgJCgnLmpzLXBpY2t1cF9fc3VibWl0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHNlbGVjdGVkID0gJCgnLmpzLXBpY2t1cF9fbWFwX19pdGVtLl9hY3RpdmUnKTtcclxuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fdGFyZ2V0X190ZXh0JykudGV4dCgkc2VsZWN0ZWQuZmluZCgnLmpzLXBpY2t1cF9fbWFwX19pdGVtX190ZXh0JykudGV4dCgpKTtcclxuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fdGFyZ2V0X190aW1lJykudGV4dCgkc2VsZWN0ZWQuZmluZCgnLmpzLXBpY2t1cF9fbWFwX19pdGVtX190aW1lJykudGV4dCgpIHx8ICcnKTtcclxuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fdGFyZ2V0X19pbnB1dCcpLnZhbCgkc2VsZWN0ZWQuZGF0YSgnaWQnKSB8fCAwKTtcclxuICAgICAgICAgICAgY2xvc2VQaWNrdXAoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gY2FuY2VsXHJcbiAgICAgICAgJCgnLmpzLXBpY2t1cF9fY2FuY2VsJykub24oJ2NsaWNrJywgY2xvc2VQaWNrdXApO1xyXG5cclxuICAgICAgICAvLyBtYXBcclxuICAgICAgICB2YXIgaW5pdE1hcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbWFwID0gYXBwLm1hcEluaXQoJ3BpY2t1cF9tYXAnKTtcclxuICAgICAgICAgICAgdmFyIHBsYWNlbWFya3MgPSBhcHAubWFwQWRkUGxhY2VtYXJrcyhtYXAsICQoJy5qcy1waWNrdXBfX21hcF9faXRlbScpKTtcclxuICAgICAgICAgICAgYXBwLm1hcFNldEJvdW5kcyhtYXApO1xyXG4gICAgICAgICAgICAvLyBjbGlja1xyXG4gICAgICAgICAgICAkKCcuanMtcGlja3VwX19tYXBfX2l0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBwbGFjZW1hcmtzWyQodGhpcykuaW5kZXgoKV0uYmFsbG9vbi5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICAkKCcuanMtcGlja3VwX19tYXBfX2l0ZW0nKS5yZW1vdmVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fc3VibWl0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHdyYXBwZXIuZGF0YSgnaW5pdCcsIHRydWUpO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBpbml0IG1hcCBvbiBmYi5vcGVuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2FmdGVyU2hvdy5mYicsIGZ1bmN0aW9uIChlLCBpbnN0YW5jZSwgc2xpZGUpIHtcclxuICAgICAgICAgICAgdmFyICRwaWNrdXAgPSBzbGlkZS4kc2xpZGUuZmluZCgnLmpzLXBpY2t1cCcpO1xyXG4gICAgICAgICAgICBpZiAoJHBpY2t1cC5sZW5ndGggJiYgISRwaWNrdXAuZGF0YSgnaW5pdCcpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9hcGktbWFwcy55YW5kZXgucnUvMi4xLz9sYW5nPXJ1X1JVJm1vZGU9ZGVidWcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0U1A6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCgnLmpzLXNwJykubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvL2FwaS1tYXBzLnlhbmRleC5ydS8yLjEvP2xhbmc9cnVfUlUmbW9kZT1kZWJ1ZycsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5bWFwcy5yZWFkeShpbml0TWFwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluaXRNYXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXAgPSBhcHAubWFwSW5pdCgnc3BfbWFwJyk7XHJcbiAgICAgICAgICAgIGFwcC5tYXBBZGRQbGFjZW1hcmtzKG1hcCwgJCgnLmpzLXNwX19tYXAtaXRlbScpKTtcclxuICAgICAgICAgICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0YPQtdC8INC/0YDQuCDQvtGC0LrRgNGL0YLQuNC4INGB0YLRgNCw0L3QuNGG0YssINGC0LDQsdCwINC4INGB0LvQsNC50LTQsFxyXG4gICAgICAgICAgICBpZiAoJCgnI3NwX21hcCcpLmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICBhcHAubWFwU2V0Qm91bmRzKG1hcCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuanMtc3AgLmpzLXRhYnMnKS5vbmUoJ2Vhc3l0YWJzOmFmdGVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcC5tYXBTZXRCb3VuZHMobWFwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgJCgnLmpzLXNwIC5qcy1zcF9fbWFwLXRhYicpLm9uKCd0YWJzX3NsaWRlX29wZW4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwLm1hcFNldEJvdW5kcyhtYXApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRDb250YWN0czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKCcuanMtY29udGFjdHMnKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQoJy5qcy1jb250YWN0c19fbWFwJykuc3RpY2tfaW5fcGFyZW50KHtcclxuICAgICAgICAgICAgb2Zmc2V0X3RvcDogOTBcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvL2FwaS1tYXBzLnlhbmRleC5ydS8yLjEvP2xhbmc9cnVfUlUmbW9kZT1kZWJ1ZycsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5bWFwcy5yZWFkeShpbml0TWFwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluaXRNYXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkaXRlbXMgPSAkKCcuanMtY29udGFjdHNfX21hcC1pdGVtJyk7XHJcbiAgICAgICAgICAgIG1hcCA9IGFwcC5tYXBJbml0KCdjb250YWN0c19tYXAnKTtcclxuICAgICAgICAgICAgdmFyIHBsYWNlbWFya3MgPSBhcHAubWFwQWRkUGxhY2VtYXJrcyhtYXAsICRpdGVtcyk7XHJcbiAgICAgICAgICAgIGFwcC5tYXBTZXRCb3VuZHMobWFwKTtcclxuICAgICAgICAgICAgJGl0ZW1zLmVhY2goZnVuY3Rpb24gKGlkeCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSAkKHRoaXMpLmRhdGEoJ3R5cGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcucGxhY2VtYXJrLicgKyB0eXBlKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWNvbnRhY3RzX19tYXAgLmpzLXRhZycpLmZpbHRlcignW2RhdGEtdHlwZT1cIicgKyB0eXBlICsgJ1wiXScpLmFkZENsYXNzKCdfYWN0aXZlJyk7XHJcbi8vICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwbGFjZW1hcmtzW2lkeF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5zZXRDZW50ZXIocGxhY2VtYXJrc1tpZHhdLmdlb21ldHJ5LmdldENvb3JkaW5hdGVzKCksIDEzLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAzMDBcclxuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtYXJrc1tpZHhdLmJhbGxvb24ub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyBjbGljayBvbiB0YWdcclxuICAgICAgICAgICAgJCgnLmpzLWNvbnRhY3RzX19tYXAgLmpzLXRhZycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIG1hcC5iYWxsb29uLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHBtID0gJCgnLnBsYWNlbWFyay4nICsgJCh0aGlzKS5kYXRhKCd0eXBlJykpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5oYXNDbGFzcygnX2FjdGl2ZScpID8gJHBtLnNob3coKSA6ICRwbS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpNGD0L3QutGG0LjRjyDQstC+0LfQstGA0LDRidCw0LXRgiDQvtC60L7QvdGH0LDQvdC40LUg0LTQu9GPINC80L3QvtC20LXRgdGC0LLQtdC90L3QvtCz0L4g0YfQuNGB0LvQsCDRgdC70L7QstCwINC90LAg0L7RgdC90L7QstCw0L3QuNC4INGH0LjRgdC70LAg0Lgg0LzQsNGB0YHQuNCy0LAg0L7QutC+0L3Rh9Cw0L3QuNC5XHJcbiAgICAgKiBwYXJhbSAgaU51bWJlciBJbnRlZ2VyINCn0LjRgdC70L4g0L3QsCDQvtGB0L3QvtCy0LUg0LrQvtGC0L7RgNC+0LPQviDQvdGD0LbQvdC+INGB0YTQvtGA0LzQuNGA0L7QstCw0YLRjCDQvtC60L7QvdGH0LDQvdC40LVcclxuICAgICAqIHBhcmFtICBhRW5kaW5ncyBBcnJheSDQnNCw0YHRgdC40LIg0YHQu9C+0LIg0LjQu9C4INC+0LrQvtC90YfQsNC90LjQuSDQtNC70Y8g0YfQuNGB0LXQuyAoMSwgNCwgNSksXHJcbiAgICAgKiAgICAgICAgINC90LDQv9GA0LjQvNC10YAgWyfRj9Cx0LvQvtC60L4nLCAn0Y/QsdC70L7QutCwJywgJ9GP0LHQu9C+0LonXVxyXG4gICAgICogcmV0dXJuIFN0cmluZ1xyXG4gICAgICogXHJcbiAgICAgKiBodHRwczovL2hhYnJhaGFici5ydS9wb3N0LzEwNTQyOC9cclxuICAgICAqL1xyXG4gICAgZ2V0TnVtRW5kaW5nOiBmdW5jdGlvbiAoaU51bWJlciwgYUVuZGluZ3MpIHtcclxuICAgICAgICB2YXIgc0VuZGluZywgaTtcclxuICAgICAgICBpTnVtYmVyID0gaU51bWJlciAlIDEwMDtcclxuICAgICAgICBpZiAoaU51bWJlciA+PSAxMSAmJiBpTnVtYmVyIDw9IDE5KSB7XHJcbiAgICAgICAgICAgIHNFbmRpbmcgPSBhRW5kaW5nc1syXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpID0gaU51bWJlciAlIDEwO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgKDEpOlxyXG4gICAgICAgICAgICAgICAgICAgIHNFbmRpbmcgPSBhRW5kaW5nc1swXTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgKDIpOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAoMyk6XHJcbiAgICAgICAgICAgICAgICBjYXNlICg0KTpcclxuICAgICAgICAgICAgICAgICAgICBzRW5kaW5nID0gYUVuZGluZ3NbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHNFbmRpbmcgPSBhRW5kaW5nc1syXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc0VuZGluZztcclxuICAgIH1cclxuXHJcbn0iXSwiZmlsZSI6ImNvbW1vbi5qcyJ9
