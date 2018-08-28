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
        $(window).on('load', function () {
            $('.js-nav-slider__main.slick-initialized').slick('setPosition');
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
        if (window.location.hash) {
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
            $(this).siblings('.tabs__tab__content').slideToggle(function() {
                $(this).is(':visible') 
                ? $(this).trigger('tabs_slide_open', $(this)) 
                : $(this).trigger('tabs_slide_close', $(this)) ;
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
        return new ymaps.Map(cnt, {
            center: [56.326887, 44.005986],
            zoom: 11,
            controls: []
        }, {
            suppressMapOpenBlock: true,
        });
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
                '<div class="placemark"><svg xmlns="http://www.w3.org/2000/svg" width="39" height="50"><defs><filter id="a" width="145.2%" height="133.3%" x="-22.6%" y="-11.9%" filterUnits="objectBoundingBox"><feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="2"/><feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feMerge><feMergeNode in="shadowMatrixOuter1"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g fill="none" fill-rule="evenodd" filter="url(#a)" transform="translate(4 2)"><path fill="#2057AC" d="M15.175 42C25.292 29.805 30.35 20.897 30.35 15.273 30.35 6.838 23.556 0 15.175 0 6.795 0 0 6.838 0 15.273 0 20.897 5.058 29.805 15.175 42z"/><path fill="#FFF" d="M23.846 19.183H19.78L15.304 7.2h4.067l4.475 11.983zm-4.85 0h-4.068L11.4 9.597h4.067l3.528 9.586zm-4.933.017h-6.91l3.398-9.52 3.512 9.52zm-3.512-7.49c.272.706.831 2.339 1.341 3.828l.006.018c.438 1.277.838 2.445.989 2.828h-4.54c.123-.33.414-1.247.753-2.313l.002-.005c.513-1.612 1.135-3.565 1.45-4.356z"/></g></svg></div>'
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
                    text = $(this).data('text');
            if (geo) {
                geo = geo.split(',');
                geo[0] = parseFloat(geo[0]);
                geo[1] = parseFloat(geo[1]);
                var placemark = new ymaps.Placemark(geo,
                        {
                            text: text || 'САКСЭС'
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsialF1ZXJ5LmV4cHJbJzonXS5mb2N1cyA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICByZXR1cm4gZWxlbSA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiAoZWxlbS50eXBlIHx8IGVsZW0uaHJlZik7XHJcbn07XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuaW5pdGlhbGl6ZSgpO1xyXG59KTtcclxuXHJcbnZhciBhcHAgPSB7XHJcbiAgICBpbml0aWFsaXplZDogZmFsc2UsXHJcblxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBlbGVtSFRNTCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdodG1sJylbMF07XHJcbiAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTWFjJykgPiAwKSB7XHJcbiAgICAgICAgICAgIGVsZW1IVE1MLmNsYXNzTmFtZSArPSBcIiBtYWMtb3NcIjtcclxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignU2FmYXJpJykgPiAwKVxyXG4gICAgICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIG1hYy1zYWZhcmlcIjtcclxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lJykgPiAwKVxyXG4gICAgICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIG1hYy1jaHJvbWVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignRWRnZScpID4gMCB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1RyaWRlbnQnKSA+IDApIHtcclxuICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIGllXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5pdFNsaWRlcnMoKTsgLy8gbXVzdCBiZSBmaXJzdCFcclxuICAgICAgICB0aGlzLmluaXRNZW51KCk7XHJcbiAgICAgICAgdGhpcy5pbml0Rm9vdGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q3V0KCk7XHJcbiAgICAgICAgdGhpcy5pbml0SG92ZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRTY3JvbGxiYXIoKTtcclxuICAgICAgICB0aGlzLmluaXRDYXRhbG9nKCk7XHJcbiAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XHJcbiAgICAgICAgdGhpcy5pbml0UG9wdXAoKTtcclxuICAgICAgICB0aGlzLmluaXRGb3JtTGFiZWwoKTtcclxuICAgICAgICB0aGlzLmluaXRSZWdpb25TZWxlY3QoKTtcclxuICAgICAgICB0aGlzLmluaXRUYWJzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0UUEoKTtcclxuICAgICAgICB0aGlzLmluaXRJTW1lbnUoKTtcclxuICAgICAgICB0aGlzLmluaXRTZWxlY3RzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0TWFzaygpO1xyXG4gICAgICAgIHRoaXMuaW5pdFJhbmdlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RmlsdGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q3JlYXRlUHJpY2UoKTtcclxuICAgICAgICB0aGlzLmluaXRRdWFudGl0eSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdENhcnQoKTtcclxuICAgICAgICB0aGlzLmluaXRTUCgpO1xyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhcHAuaW5pdEhvdmVyKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0TWVudTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1tZW51LXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgaHJlZiA9ICQodGhpcykuYXR0cignaHJlZicpO1xyXG4gICAgICAgICAgICAkKCcuanMtbWVudS10b2dnbGVyW2hyZWY9XCInICsgaHJlZiArICdcIl0nKS50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKGhyZWYpLnRvZ2dsZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQoJy5qcy1tZW51Ll9hY3RpdmUnKS5sZW5ndGggPT0gMCA/ICQoJy5qcy1tZW51LW92ZXJsYXknKS5oaWRlKCkgOiAkKCcuanMtbWVudS1vdmVybGF5Jykuc2hvdygpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnLmpzLW1lbnUtb3ZlcmxheScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1tZW51LXRvZ2dsZXIsIC5qcy1tZW51JykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5oaWRlKClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyICRoZWFkZXIgPSAkKCdoZWFkZXInKTtcclxuICAgICAgICB2YXIgaGVhZGVySGVpZ2h0ID0gJGhlYWRlci5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgIHZhciBxID0gMTtcclxuICAgICAgICB2YXIgYWN0aW9uID0gMDtcclxuICAgICAgICB2YXIgcGluSGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJjb21wbGV0ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiBoZWFkZXJIZWlnaHQgKiBxKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhY3Rpb24gPSAxO1xyXG4gICAgICAgICAgICAgICAgJGhlYWRlci5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKHsncGFkZGluZy10b3AnOiBoZWFkZXJIZWlnaHR9KTtcclxuICAgICAgICAgICAgICAgICRoZWFkZXIuY3NzKHsndG9wJzogLWhlYWRlckhlaWdodH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnX2ZpeGVkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFuaW1hdGUoeyd0b3AnOiAwfSwgMTAwMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09IDIgfHwgISRoZWFkZXIuaGFzQ2xhc3MoJ19maXhlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gMjtcclxuICAgICAgICAgICAgICAgICRoZWFkZXIuYW5pbWF0ZSh7J3RvcCc6IC1oZWFkZXJIZWlnaHR9LCBcImZhc3RcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRoZWFkZXIuY3NzKHsndG9wJzogMH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5jc3MoeydwYWRkaW5nLXRvcCc6IDB9KTtcclxuICAgICAgICAgICAgICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdfZml4ZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSBhcHBDb25maWcuYnJlYWtwb2ludC5sZykge1xyXG4gICAgICAgICAgICBwaW5IZWFkZXIoKTtcclxuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkIHNjcm9sbCcsIHBpbkhlYWRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlckhlaWdodCA9ICRoZWFkZXIub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgcGluSGVhZGVyKTtcclxuICAgICAgICAgICAgICAgICQoJy5qcy1tZW51JykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICQoJy5qcy1tZW51LW92ZXJsYXknKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykub2ZmKCdzY3JvbGwnLCBwaW5IZWFkZXIpO1xyXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdfZml4ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0Rm9vdGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGZpeE1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykub3V0ZXJXaWR0aCgpID49IGFwcENvbmZpZy5icmVha3BvaW50Lm1kICYmICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5sZykge1xyXG4gICAgICAgICAgICAgICAgJCgnLmZvb3Rlcl9fbWVudS1zZWNvbmQnKS5jc3MoJ2xlZnQnLCAkKCcuZm9vdGVyX19tZW51IC5tZW51ID4gbGk6bnRoLWNoaWxkKDMpJykub2Zmc2V0KCkubGVmdCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuZm9vdGVyX19tZW51LXNlY29uZCcpLmNzcygnbGVmdCcsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpeE1lbnUoKTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ2xvYWQgcmVzaXplJywgZml4TWVudSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRDdXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtY3V0JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLmpzLWN1dF9fdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkY29udGVudCA9ICQodGhpcykuc2libGluZ3MoJy5qcy1jdXRfX2NvbnRlbnQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFNob3cgPSAkKHRoaXMpLmRhdGEoJ3RleHRzaG93JykgfHwgJ3Nob3cgdGV4dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRIaWRlID0gJCh0aGlzKS5kYXRhKCd0ZXh0aGlkZScpIHx8ICdoaWRlIHRleHQnO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS50ZXh0KCRjb250ZW50LmlzKCc6dmlzaWJsZScpID8gdGV4dFNob3cgOiB0ZXh0SGlkZSk7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdfb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuanMtY3V0X19jb250ZW50Jykuc2xpZGVUb2dnbGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1maWx0ZXJfX2NvdW50ZXInKS50cmlnZ2VyKFwic3RpY2t5X2tpdDpyZWNhbGNcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0U2xpZGVyczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1tYWluLXNsaWRlcicpLnNsaWNrKHtcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnLmpzLXNsaWRlcicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgc2xpZGVzID0gJCh0aGlzKS5kYXRhKCdzbGlkZXMnKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5zbGljayh7XHJcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogc2xpZGVzLnNtIHx8IDEsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgICAgIGNlbnRlck1vZGU6IGZhbHNlLFxyXG4vLyAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiBhcHBDb25maWcuYnJlYWtwb2ludC5tZCAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IHNsaWRlcy5tZCB8fCAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IGFwcENvbmZpZy5icmVha3BvaW50LmxnIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogc2xpZGVzLmxnIHx8IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5qcy1uYXYtc2xpZGVyX19tYWluJykuc2xpY2soe1xyXG4gICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgICAgIGFzTmF2Rm9yOiAnLmpzLW5hdi1zbGlkZXJfX25hdicsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIHJlc3BvbnNpdmUgPSB7XHJcbiAgICAgICAgICAgIHByb2R1Y3Q6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiBhcHBDb25maWcuYnJlYWtwb2ludC5sZyAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsU3dpcGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiA1LFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiBhcHBDb25maWcuYnJlYWtwb2ludC5tZCAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsU3dpcGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiA0LFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN3aXBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogNSxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH1cclxuICAgICAgICAkKCcuanMtbmF2LXNsaWRlcl9fbmF2JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuc2xpY2soe1xyXG4gICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhcnJvd3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGFzTmF2Rm9yOiAnLmpzLW5hdi1zbGlkZXJfX21haW4nLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICBmb2N1c09uU2VsZWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiByZXNwb25zaXZlWyQodGhpcykuZGF0YSgncmVzcG9uc2l2ZScpXSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCcuanMtbmF2LXNsaWRlcl9fbWFpbi5zbGljay1pbml0aWFsaXplZCcpLnNsaWNrKCdzZXRQb3NpdGlvbicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0SG92ZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtaG92ZXInKS51bmJpbmQoJ21vdXNlZW50ZXIgbW91c2VsZWF2ZScpO1xyXG4gICAgICAgIGlmICgkKHdpbmRvdykub3V0ZXJXaWR0aCgpID49IGFwcENvbmZpZy5icmVha3BvaW50LmxnKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1ob3ZlcicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICR0aGlzLCAkcGFyZW50LCAkd3JhcCwgJGhvdmVyLCBoLCB3O1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkdGhpcyA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0aGlzLmhhc0NsYXNzKCdfaG92ZXInKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSAkdGhpcy5vZmZzZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAkcGFyZW50ID0gJHRoaXMucGFyZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHBhcmVudC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJHBhcmVudC5vdXRlckhlaWdodCgpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaCA9ICR0aGlzLm91dGVySGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdyA9ICR0aGlzLm91dGVyV2lkdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiB3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnaGVpZ2h0JzogaCxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAkd3JhcCA9ICQoJzxkaXYvPicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJ2JvZHknKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndG9wJzogb2Zmc2V0LnRvcCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbGVmdCc6IG9mZnNldC5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6IHcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6IGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAkaG92ZXIgPSAkKCc8ZGl2Lz4nKS5hcHBlbmRUbygkd3JhcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhvdmVyLmFkZENsYXNzKCdob3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmFwcGVuZFRvKCR3cmFwKS5hZGRDbGFzcygnX2hvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhvdmVyLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICctMTBweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICctMTBweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAnLTEwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3R0b206ICctMTBweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAkd3JhcC5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGhvdmVyLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJHBhcmVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdfaG92ZXInKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwYXJlbnQucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR3cmFwLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRTY3JvbGxiYXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtc2Nyb2xsYmFyJykuc2Nyb2xsYmFyKHtcclxuICAgICAgICAgICAgZGlzYWJsZUJvZHlTY3JvbGw6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFNlYXJjaDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkaW5wdXQgPSAkKCcuanMtc2VhcmNoLWZvcm1fX2lucHV0Jyk7XHJcbiAgICAgICAgJGlucHV0Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGlucHV0Lm9uKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmpzLXNlYXJjaC1yZXMnKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQod2luZG93KS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1zZWFyY2gtcmVzJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdENhdGFsb2c6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXNNb2JpbGUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcsXHJcbiAgICAgICAgICAgICAgICAkc2xpZGUgPSAkKCcuanMtY21fX3NsaWRlJyksXHJcbiAgICAgICAgICAgICAgICAkc2xpZGVUcmlnZ2VyID0gJCgnLmpzLWNtX19zbGlkZV9fdHJpZ2dlcicpLFxyXG4gICAgICAgICAgICAgICAgJG1lbnUgPSAkKCcuanMtY21fX21lbnUnKSxcclxuICAgICAgICAgICAgICAgICRzY3JvbGxiYXIgPSAkKCcuanMtY21fX3Njcm9sbGJhcicpLFxyXG4gICAgICAgICAgICAgICAgJG1vYmlsZVRvZ2dsZXIgPSAkKCcuanMtY21fX21vYmlsZS10b2dnbGVyJyksXHJcbiAgICAgICAgICAgICAgICAkc2Vjb25kTGluayA9ICQoJy5qcy1jbV9fc2Vjb25kLWxpbmsnKSxcclxuICAgICAgICAgICAgICAgICRzZWNvbmRDbG9zZSA9ICQoJy5qcy1jbV9fbWVudS1zZWNvbmRfX2Nsb3NlJyksXHJcbiAgICAgICAgICAgICAgICAkd3JhcHBlciA9ICQoJy5qcy1jbV9fbWVudS13cmFwcGVyJyk7XHJcblxyXG4gICAgICAgIHZhciBzbGlkZU1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzbGlkZS5zbGlkZVRvZ2dsZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuanMtZmlsdGVyX19jb3VudGVyJykudHJpZ2dlcihcInN0aWNreV9raXQ6cmVjYWxjXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJG1lbnUudG9nZ2xlQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNob3dTZWNvbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJy5qcy1jbV9fbWVudS1zZWNvbmQnKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaG92ZXJJY29uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJGljb24gPSAkKHRoaXMpLmZpbmQoJy5zcHJpdGUnKTtcclxuICAgICAgICAgICAgJGljb24uYWRkQ2xhc3MoJGljb24uZGF0YSgnaG92ZXInKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdW5ob3Zlckljb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkaWNvbiA9ICQodGhpcykuZmluZCgnLnNwcml0ZScpO1xyXG4gICAgICAgICAgICAkaWNvbi5yZW1vdmVDbGFzcygkaWNvbi5kYXRhKCdob3ZlcicpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbml0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLnNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLmNzcyh7J2hlaWdodCc6ICQod2luZG93KS5vdXRlckhlaWdodCgpIC0gJCgnLmhlYWRlcicpLm91dGVySGVpZ2h0KCl9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBkZXN0cm95U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLnNjcm9sbGJhcignZGVzdHJveScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAkc2xpZGVUcmlnZ2VyLm9uKCdjbGljaycsIHNsaWRlTWVudSk7XHJcbiAgICAgICAgICAgICRzZWNvbmRMaW5rLnBhcmVudCgpLmhvdmVyKGhvdmVySWNvbiwgdW5ob3Zlckljb24pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHNlY29uZExpbmsub24oJ2NsaWNrJywgc2hvd1NlY29uZCk7XHJcbiAgICAgICAgICAgIGluaXRTY3JvbGxiYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJG1vYmlsZVRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkd3JhcHBlci50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJHNlY29uZENsb3NlLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuanMtY21fX21lbnUtc2Vjb25kJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoIWlzTW9iaWxlICYmICEkbWVudS5oYXNDbGFzcygnX29wZW5lZCcpKSB7XHJcbiAgICAgICAgICAgICRzbGlkZS5zbGlkZVVwKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoJy5qcy1maWx0ZXJfX2NvdW50ZXInKS50cmlnZ2VyKFwic3RpY2t5X2tpdDpyZWNhbGNcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGNoZWNrTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1NpemUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubGc7XHJcbiAgICAgICAgICAgIGlmIChuZXdTaXplICE9IGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpc01vYmlsZSA9IG5ld1NpemU7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2xpZGUuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICRtZW51LmFkZENsYXNzKCdfb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlVHJpZ2dlci5vZmYoJ2NsaWNrJywgc2xpZGVNZW51KTtcclxuICAgICAgICAgICAgICAgICAgICAkc2Vjb25kTGluay5vbignY2xpY2snLCBzaG93U2Vjb25kKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2Vjb25kTGluay5vZmYoJ21vdXNlZW50ZXIgbW91c2VsZWF2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWNvbmRMaW5rLnBhcmVudCgpLm9mZignbW91c2VlbnRlciBtb3VzZWxlYXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdFNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkd3JhcHBlci5yZW1vdmVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzbGlkZVRyaWdnZXIub24oJ2NsaWNrJywgc2xpZGVNZW51KTtcclxuICAgICAgICAgICAgICAgICAgICAkc2Vjb25kTGluay5vZmYoJ2NsaWNrJywgc2hvd1NlY29uZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNlY29uZExpbmsucGFyZW50KCkuaG92ZXIoaG92ZXJJY29uLCB1bmhvdmVySWNvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdHJveVNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkd3JhcHBlci5oYXNDbGFzcygnX2Fic29sdXRlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG1lbnUucmVtb3ZlQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlLnNsaWRlVXAoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5ld1NpemUpIHtcclxuICAgICAgICAgICAgICAgICRzY3JvbGxiYXIuY3NzKHsnaGVpZ2h0JzogJCh3aW5kb3cpLm91dGVySGVpZ2h0KCkgLSAkKCcuaGVhZGVyJykub3V0ZXJIZWlnaHQoKX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjaGVja01lbnUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gdG9nZ2xlIGNhdGFsb2cgbGlzdCB2aWV3XHJcbiAgICAgICAgJCgnLmpzLWNhdGFsb2ctdmlldy10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCcuanMtY2F0YWxvZy12aWV3LXRvZ2dsZXInKS50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKCcuanMtY2F0YWxvZy1saXN0IC5qcy1jYXRhbG9nLWxpc3RfX2l0ZW0sIC5qcy1jYXRhbG9nLWxpc3QgLmpzLWNhdGFsb2ctbGlzdF9faXRlbSAuY2F0YWxvZy1saXN0X19pdGVtX19jb250ZW50JykudG9nZ2xlQ2xhc3MoJ19jYXJkJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFBvcHVwOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGJhc2VDbGFzczogJ19wb3B1cCcsXHJcbiAgICAgICAgICAgIGF1dG9Gb2N1czogZmFsc2UsXHJcbiAgICAgICAgICAgIHRvdWNoOiBmYWxzZSxcclxuICAgICAgICAgICAgYWZ0ZXJTaG93OiBmdW5jdGlvbiAoaW5zdGFuY2UsIHNsaWRlKSB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZS4kc2xpZGUuZmluZCgnLnNsaWNrLWluaXRpYWxpemVkJykuc2xpY2soJ3NldFBvc2l0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHNoaXBwaW5nID0gc2xpZGUuJHNsaWRlLmZpbmQoJy5qcy1zaGlwcGluZycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCRzaGlwcGluZy5sZW5ndGggJiYgISRzaGlwcGluZy5kYXRhKCdpbml0JykpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHAuc2hpcHBpbmcuaW5pdCgkc2hpcHBpbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkKCcuanMtcG9wdXAnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQuZmFuY3lib3guY2xvc2UoKTtcclxuICAgICAgICB9KS5mYW5jeWJveChvcHRpb25zKTtcclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2gpIHtcclxuICAgICAgICAgICAgdmFyICRjbnQgPSAkKHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcclxuICAgICAgICAgICAgaWYgKCRjbnQubGVuZ3RoICYmICRjbnQuaGFzQ2xhc3MoJ3BvcHVwJykpIHtcclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3gub3BlbigkY250LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEZvcm1MYWJlbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkaW5wdXRzID0gJCgnLmpzLWZvcm1fX2xhYmVsJykuZmluZCgnOm5vdChbcmVxdWlyZWRdKScpO1xyXG4gICAgICAgICRpbnB1dHNcclxuICAgICAgICAgICAgICAgIC5vbignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5yZW1vdmVDbGFzcygnZm9ybV9fbGFiZWxfX2VtcHR5Jyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uKCdibHVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghJCh0aGlzKS52YWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCdsYWJlbCcpLmFkZENsYXNzKCdmb3JtX19sYWJlbF9fZW1wdHknKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcignW3ZhbHVlPVwiXCJdLCA6bm90KFt2YWx1ZV0pJykuc2libGluZ3MoJ2xhYmVsJykuYWRkQ2xhc3MoJ2Zvcm1fX2xhYmVsX19lbXB0eScpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0UmVnaW9uU2VsZWN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLXJlZ2lvbi10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsID0gJCh0aGlzKS5kYXRhKCd0b2dnbGUnKTtcclxuICAgICAgICAgICAgaWYgKHNlbCkge1xyXG4gICAgICAgICAgICAgICAgJChzZWwpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5qcy1yZWdpb24tY2xvc2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJy5yZWdpb24tc2VsZWN0Jykuc2xpZGVVcCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciAkaGVhZGVyUmVnaW9uU2VsZWN0ID0gJCgnLmhlYWRlciAucmVnaW9uLXNlbGVjdCcpO1xyXG4gICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJGhlYWRlclJlZ2lvblNlbGVjdC5pcygnOnZpc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgJGhlYWRlclJlZ2lvblNlbGVjdC5zbGlkZVVwKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFRhYnM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXNNb2JpbGUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQsXHJcbiAgICAgICAgICAgICAgICAkdGFicyA9ICQoJy5qcy10YWJzX190YWInKSxcclxuICAgICAgICAgICAgICAgICR0b2dnbGVycyA9ICQoJy5qcy10YWJzX190YWIgLnRhYnNfX3RhYl9fdG9nZ2xlcicpLFxyXG4gICAgICAgICAgICAgICAgJGNvbnRlbnQgPSAkKCcuanMtdGFic19fdGFiIC50YWJzX190YWJfX2NvbnRlbnQnKTtcclxuICAgICAgICBpZiAoISR0YWJzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAkdG9nZ2xlcnMub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdfb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJy50YWJzX190YWJfX2NvbnRlbnQnKS5zbGlkZVRvZ2dsZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuaXMoJzp2aXNpYmxlJykgXHJcbiAgICAgICAgICAgICAgICA/ICQodGhpcykudHJpZ2dlcigndGFic19zbGlkZV9vcGVuJywgJCh0aGlzKSkgXHJcbiAgICAgICAgICAgICAgICA6ICQodGhpcykudHJpZ2dlcigndGFic19zbGlkZV9jbG9zZScsICQodGhpcykpIDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgaW5pdEV0YWJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3U2l6ZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5tZDtcclxuICAgICAgICAgICAgaWYgKG5ld1NpemUgIT0gaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gbmV3U2l6ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgICR0YWJzLnNob3coKTtcclxuICAgICAgICAgICAgICAgICR0b2dnbGVycy5yZW1vdmVDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICAgICAgJGNvbnRlbnQuaGlkZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHRhYnMuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgJGNvbnRlbnQuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmpzLXRhYnMnKS5lYXN5dGFicyh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlSGFzaDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pLmJpbmQoJ2Vhc3l0YWJzOm1pZFRyYW5zaXRpb24nLCBmdW5jdGlvbiAoZXZlbnQsICRjbGlja2VkLCAkdGFyZ2V0UGFuZWwsIHNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICR1bmRlciA9ICQodGhpcykuZmluZCgnLmpzLXRhYnNfX3VuZGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHVuZGVyLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICRjbGlja2VkLnBhcmVudCgpLnBvc2l0aW9uKCkubGVmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICRjbGlja2VkLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICR0YWJzLmZpbHRlcignLmFjdGl2ZScpLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBpbml0VW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy10YWJzJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHVuZGVyID0gJCh0aGlzKS5maW5kKCcuanMtdGFic19fdW5kZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGFjdGl2ZUxpbmsgPSAkKHRoaXMpLmZpbmQoJy50YWJzX19saXN0IC5hY3RpdmUgYScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3AgPSAkYWN0aXZlTGluay5vdXRlckhlaWdodCgpIC0gJHVuZGVyLm91dGVySGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoJGFjdGl2ZUxpbmsubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHVuZGVyLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogJ2F1dG8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IHRvcCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJGFjdGl2ZUxpbmsucGFyZW50KCkucG9zaXRpb24oKS5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJGFjdGl2ZUxpbmsud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaW5pdEV0YWJzKCk7XHJcbiAgICAgICAgaW5pdFVuZGVyKCk7XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkIHJlc2l6ZScsIGluaXRFdGFicyk7XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkIHJlc2l6ZScsIGluaXRVbmRlcik7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRRQTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1xYTpub3QoLl9hY3RpdmUpIC5xYV9fYScpLnNsaWRlVXAoKTtcclxuICAgICAgICAkKCcuanMtcWEnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICAkdG9nZ2xlciA9ICR0aGlzLmZpbmQoJy5xYV9fcSAucWFfX2gnKSxcclxuICAgICAgICAgICAgICAgICAgICAkYW5zd2VyID0gJHRoaXMuZmluZCgnLnFhX19hJyk7XHJcbiAgICAgICAgICAgICR0b2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR0aGlzLnRvZ2dsZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAkYW5zd2VyLnNsaWRlVG9nZ2xlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0SU1tZW51OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLWltLW1lbnVfX3RvZ2dsZXI6bm90KC5fb3BlbmVkKScpLnNpYmxpbmdzKCcuanMtaW0tbWVudV9fc2xpZGUnKS5zbGlkZVVwKCk7XHJcbiAgICAgICAgJCgnLmpzLWltLW1lbnVfX3RvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmpzLWltLW1lbnVfX3NsaWRlJykuc2xpZGVUb2dnbGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFNlbGVjdHM6IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICQoJy5qcy1zZWxlY3RfYWx3YXlzJykuc3R5bGVyKCk7XHJcbiAgICAgICAgdmFyIGlzTW9iaWxlID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50Lm1kLFxyXG4gICAgICAgICAgICAgICAgJHNlbGVjdHMgPSAkKCcuanMtc2VsZWN0Jyk7XHJcbiAgICAgICAgaWYgKCEkc2VsZWN0cy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNlbGVjdHMuc3R5bGVyKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNlbGVjdHMuc3R5bGVyKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgcmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1NpemUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQ7XHJcbiAgICAgICAgICAgIGlmIChuZXdTaXplICE9IGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpc01vYmlsZSA9IG5ld1NpemU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoIWlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgIGluaXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCByZWZyZXNoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdE1hc2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtbWFza19fdGVsJykuaW5wdXRtYXNrKHtcclxuICAgICAgICAgICAgbWFzazogJys5ICg5OTkpIDk5OS05OS05OSdcclxuICAgICAgICB9KTtcclxuICAgICAgICBJbnB1dG1hc2suZXh0ZW5kQWxpYXNlcyh7XHJcbiAgICAgICAgICAgICdudW1lcmljJzoge1xyXG4gICAgICAgICAgICAgICAgYXV0b1VubWFzazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNob3dNYXNrT25Ib3ZlcjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICByYWRpeFBvaW50OiBcIixcIixcclxuICAgICAgICAgICAgICAgIGdyb3VwU2VwYXJhdG9yOiBcIiBcIixcclxuICAgICAgICAgICAgICAgIGRpZ2l0czogMCxcclxuICAgICAgICAgICAgICAgIGFsbG93TWludXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXV0b0dyb3VwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmlnaHRBbGlnbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB1bm1hc2tBc051bWJlcjogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnaHRtbDpub3QoLmllKSAuanMtbWFzaycpLmlucHV0bWFzaygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0UmFuZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtcmFuZ2UnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHNsaWRlciA9ICQodGhpcykuZmluZCgnLmpzLXJhbmdlX190YXJnZXQnKVswXSxcclxuICAgICAgICAgICAgICAgICAgICAkaW5wdXRzID0gJCh0aGlzKS5maW5kKCdpbnB1dCcpLFxyXG4gICAgICAgICAgICAgICAgICAgIGZyb20gPSAkaW5wdXRzLmZpcnN0KClbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgdG8gPSAkaW5wdXRzLmxhc3QoKVswXTtcclxuICAgICAgICAgICAgaWYgKHNsaWRlciAmJiBmcm9tICYmIHRvKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWluViA9IHBhcnNlSW50KGZyb20udmFsdWUpIHx8IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heFYgPSBwYXJzZUludCh0by52YWx1ZSkgfHwgMDtcclxuICAgICAgICAgICAgICAgIHZhciBtaW4gPSBwYXJzZUludChmcm9tLmRhdGFzZXQubWluKSB8fCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXggPSBwYXJzZUludCh0by5kYXRhc2V0Lm1heCkgfHwgMDtcclxuICAgICAgICAgICAgICAgIG5vVWlTbGlkZXIuY3JlYXRlKHNsaWRlciwge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pblYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heFZcclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcDogMTAsXHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ21pbic6IG1pbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ21heCc6IG1heFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNuYXBWYWx1ZXMgPSBbZnJvbSwgdG9dO1xyXG4gICAgICAgICAgICAgICAgc2xpZGVyLm5vVWlTbGlkZXIub24oJ3VwZGF0ZScsIGZ1bmN0aW9uICh2YWx1ZXMsIGhhbmRsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNuYXBWYWx1ZXNbaGFuZGxlXS52YWx1ZSA9IE1hdGgucm91bmQodmFsdWVzW2hhbmRsZV0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBmcm9tLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXIubm9VaVNsaWRlci5zZXQoW3RoaXMudmFsdWUsIG51bGxdKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZnJvbS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5ub1VpU2xpZGVyLnNldChbdGhpcy52YWx1ZSwgbnVsbF0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0by5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVyLm5vVWlTbGlkZXIuc2V0KFtudWxsLCB0aGlzLnZhbHVlXSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRvLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVyLm5vVWlTbGlkZXIuc2V0KFtudWxsLCB0aGlzLnZhbHVlXSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEZpbHRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpc01vYmlsZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5sZyxcclxuICAgICAgICAgICAgICAgICRzY3JvbGxiYXIgPSAkKCcuanMtZmlsdGVyX19zY3JvbGxiYXInKSxcclxuICAgICAgICAgICAgICAgICRtb2JpbGVUb2dnbGVyID0gJCgnLmpzLWZpbHRlcl9fbW9iaWxlLXRvZ2dsZXInKSxcclxuICAgICAgICAgICAgICAgICR3cmFwcGVyID0gJCgnLmpzLWZpbHRlcicpO1xyXG5cclxuICAgICAgICB2YXIgaW5pdFNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjcm9sbGJhci5zY3JvbGxiYXIoKTtcclxuICAgICAgICAgICAgJHNjcm9sbGJhci5jc3MoeydoZWlnaHQnOiAkKHdpbmRvdykub3V0ZXJIZWlnaHQoKSAtICQoJy5oZWFkZXInKS5vdXRlckhlaWdodCgpfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZGVzdHJveVNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjcm9sbGJhci5zY3JvbGxiYXIoJ2Rlc3Ryb3knKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICAgICAgICBpbml0U2Nyb2xsYmFyKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCgnLmpzLWZpbHRlcl9fY291bnRlcicpLnN0aWNrX2luX3BhcmVudCh7b2Zmc2V0X3RvcDogMTAwfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRtb2JpbGVUb2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHdyYXBwZXIudG9nZ2xlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcuanMtZmlsdGVyLWZpZWxkc2V0JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkdHJpZ2dlciA9ICQodGhpcykuZmluZCgnLmpzLWZpbHRlci1maWVsZHNldF9fdHJpZ2dlcicpLFxyXG4gICAgICAgICAgICAgICAgICAgICRzbGlkZSA9ICQodGhpcykuZmluZCgnLmpzLWZpbHRlci1maWVsZHNldF9fc2xpZGUnKTtcclxuICAgICAgICAgICAgJHRyaWdnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnX2Nsb3NlZCcpO1xyXG4gICAgICAgICAgICAgICAgJHNsaWRlLnNsaWRlVG9nZ2xlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtZmlsdGVyX19jb3VudGVyJykudHJpZ2dlcihcInN0aWNreV9raXQ6cmVjYWxjXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgY2hlY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdTaXplID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50LmxnO1xyXG4gICAgICAgICAgICBpZiAobmV3U2l6ZSAhPSBpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgaXNNb2JpbGUgPSBuZXdTaXplO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdFNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1maWx0ZXJfX2NvdW50ZXInKS50cmlnZ2VyKFwic3RpY2t5X2tpdDpkZXRhY2hcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICR3cmFwcGVyLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdHJveVNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1maWx0ZXJfX2NvdW50ZXInKS5zdGlja19pbl9wYXJlbnQoe29mZnNldF90b3A6IDEwMH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5ld1NpemUpIHtcclxuICAgICAgICAgICAgICAgICRzY3JvbGxiYXIuY3NzKHsnaGVpZ2h0JzogJCh3aW5kb3cpLm91dGVySGVpZ2h0KCkgLSAkKCcuaGVhZGVyJykub3V0ZXJIZWlnaHQoKX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjaGVjaygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0Q3JlYXRlUHJpY2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJGl0ZW1zID0gJCgnLmpzLWNyZWF0ZS1wcmljZV9faXRlbScpLFxyXG4gICAgICAgICAgICAgICAgJHBhcmVudHMgPSAkKCcuanMtY3JlYXRlLXByaWNlX19wYXJlbnQnKSxcclxuICAgICAgICAgICAgICAgICRjb3VudGVyID0gJCgnLmpzLWNyZWF0ZS1wcmljZV9fY291bnRlcicpLFxyXG4gICAgICAgICAgICAgICAgJGFsbCA9ICQoJy5qcy1jcmVhdGUtcHJpY2VfX2FsbCcpLFxyXG4gICAgICAgICAgICAgICAgJGNsZWFyID0gJCgnLmpzLWNyZWF0ZS1wcmljZV9fY2xlYXInKSxcclxuICAgICAgICAgICAgICAgIGRlY2wxID0gWyfQktGL0LHRgNCw0L3QsDogJywgJ9CS0YvQsdGA0LDQvdC+OiAnLCAn0JLRi9Cx0YDQsNC90L46ICddLFxyXG4gICAgICAgICAgICAgICAgZGVjbDIgPSBbJyDQutCw0YJl0LPQvtGA0LjRjycsICcg0LrQsNGC0LXQs9C+0YDQuNC4JywgJyDQutCw0YLQtdCz0L7RgNC40LknXSxcclxuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50Lm1kO1xyXG4gICAgICAgIGlmICgkaXRlbXMubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgY291bnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB0b3RhbCA9ICRpdGVtcy5maWx0ZXIoJzpjaGVja2VkJykubGVuZ3RoO1xyXG4gICAgICAgICAgICAkY291bnRlci50ZXh0KGFwcC5nZXROdW1FbmRpbmcodG90YWwsIGRlY2wxKSArIHRvdGFsICsgYXBwLmdldE51bUVuZGluZyh0b3RhbCwgZGVjbDIpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvdW50KCk7XHJcbiAgICAgICAgJGl0ZW1zLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkd3JhcHBlciA9ICQodGhpcykucGFyZW50cygnLmpzLWNyZWF0ZS1wcmljZV9fd3JhcHBlcicpO1xyXG4gICAgICAgICAgICBpZiAoJHdyYXBwZXIpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkaXRlbXMgPSAkd3JhcHBlci5maW5kKCcuanMtY3JlYXRlLXByaWNlX19pdGVtJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkd3JhcHBlci5maW5kKCcuanMtY3JlYXRlLXByaWNlX19wYXJlbnQnKTtcclxuICAgICAgICAgICAgICAgICRwYXJlbnQucHJvcCgnY2hlY2tlZCcsICRpdGVtcy5maWx0ZXIoJzpjaGVja2VkJykubGVuZ3RoICE9PSAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb3VudCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRwYXJlbnRzLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkY2hpbGRzID0gJCh0aGlzKS5wYXJlbnRzKCcuanMtY3JlYXRlLXByaWNlX193cmFwcGVyJykuZmluZCgnLmpzLWNyZWF0ZS1wcmljZV9faXRlbScpO1xyXG4gICAgICAgICAgICAkY2hpbGRzLnByb3AoJ2NoZWNrZWQnLCAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSk7XHJcbiAgICAgICAgICAgIGNvdW50KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGFsbC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRpdGVtcy5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICRwYXJlbnRzLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgY291bnQoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICRjbGVhci5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRpdGVtcy5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAkcGFyZW50cy5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICBjb3VudCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLy8gZml4IGhlYWRlclxyXG4gICAgICAgIHZhciAkaGVhZCA9ICQoJy5jYXRhbG9nLWNyZWF0ZS1oZWFkLl9mb290Jyk7XHJcbiAgICAgICAgdmFyIGJyZWFrcG9pbnQsIHdIZWlnaHQ7XHJcbiAgICAgICAgZml4SW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYnJlYWtwb2ludCA9ICRoZWFkLm9mZnNldCgpLnRvcDtcclxuICAgICAgICAgICAgd0hlaWdodCA9ICQod2luZG93KS5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICBmaXhIZWFkKCk7XHJcbiAgICAgICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZml4SGVhZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpeEhlYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyB3SGVpZ2h0IDwgYnJlYWtwb2ludCkge1xyXG4gICAgICAgICAgICAgICAgJGhlYWQuYWRkQ2xhc3MoJ19maXhlZCcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGhlYWQucmVtb3ZlQ2xhc3MoJ19maXhlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICAgICAgICBmaXhJbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3U2l6ZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5sZztcclxuICAgICAgICAgICAgaWYgKG5ld1NpemUgIT0gaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gbmV3U2l6ZTtcclxuICAgICAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpeEluaXQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9mZignc2Nyb2xsJywgZml4SGVhZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhlYWQucmVtb3ZlQ2xhc3MoJ19maXhlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gJCAkd3JhcHBlclxyXG4gICAgICovXHJcbiAgICBpbml0U2hpcHBpbmdDYWxjOiBmdW5jdGlvbiAoJHdyYXBwZXIpIHtcclxuICAgICAgICB2YXIgJHNsaWRlciA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fY2FyLXNsaWRlcicpLFxyXG4gICAgICAgICAgICAgICAgJHJhZGlvID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19jYXItcmFkaW8nKTtcclxuICAgICAgICBpZiAoJHNsaWRlci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJHNsaWRlci5zbGljayh7XHJcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZmFkZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHJhZGlvLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICQodGhpcykucGFyZW50cygnLmpzLXNoaXBwaW5nX19jYXItbGFiZWwnKS5pbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgJHNsaWRlci5zbGljaygnc2xpY2tHb1RvJywgaW5kZXgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgJGRhdGVpbnB1dFdyYXBwZXIgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2RhdGUtaW5wdXQnKSxcclxuICAgICAgICAgICAgICAgICRkYXRlaW5wdXQgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2RhdGUtaW5wdXRfX2lucHV0JyksXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZERheXMgPSBbMCwgNl07XHJcbiAgICAgICAgJGRhdGVpbnB1dC5kYXRlcGlja2VyKHtcclxuICAgICAgICAgICAgcG9zaXRpb246ICd0b3AgcmlnaHQnLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IDQwLFxyXG4gICAgICAgICAgICBuYXZUaXRsZXM6IHtcclxuICAgICAgICAgICAgICAgIGRheXM6ICdNTSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWluRGF0ZTogbmV3IERhdGUobmV3IERhdGUoKS5nZXRUaW1lKCkgKyA4NjQwMCAqIDEwMDAgKiAyKSxcclxuICAgICAgICAgICAgb25SZW5kZXJDZWxsOiBmdW5jdGlvbiAoZGF0ZSwgY2VsbFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PSAnZGF5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXNhYmxlZCA9IGRpc2FibGVkRGF5cy5pbmRleE9mKGRheSkgIT0gLTE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiBpc0Rpc2FibGVkXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24gKGZvcm1hdHRlZERhdGUsIGRhdGUsIGluc3QpIHtcclxuICAgICAgICAgICAgICAgIGluc3QuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgJGRhdGVpbnB1dFdyYXBwZXIucmVtb3ZlQ2xhc3MoJ19lbXB0eScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGRhdGVwaWNrZXIgPSAkZGF0ZWlucHV0LmRhdGVwaWNrZXIoKS5kYXRhKCdkYXRlcGlja2VyJyk7XHJcbiAgICAgICAgJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlcGlja2VyLXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRhdGVwaWNrZXIuc2hvdygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBtYXBcclxuICAgICAgICB2YXIgbWFwLCAkcm91dGVBZGRyZXNzID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yb3V0ZS1hZGRyZXNzJyksXHJcbiAgICAgICAgICAgICAgICAkcm91dGVEaXN0YW5jZSA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fcm91dGUtZGlzdGFuY2UnKTtcclxuICAgICAgICB2YXIgaW5pdE1hcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGJhbGxvb25MYXlvdXQgPSB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoXHJcbiAgICAgICAgICAgICAgICAgICAgXCI8ZGl2PlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLnN1cGVyY2xhc3MuYnVpbGQuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdmFyIG11bHRpUm91dGUgPSBuZXcgeW1hcHMubXVsdGlSb3V0ZXIuTXVsdGlSb3V0ZSh7XHJcbiAgICAgICAgICAgICAgICAvLyDQntC/0LjRgdCw0L3QuNC1INC+0L/QvtGA0L3Ri9GFINGC0L7Rh9C10Log0LzRg9C70YzRgtC40LzQsNGA0YjRgNGD0YLQsC5cclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVBvaW50czogW1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcENvbmZpZy5zaGlwcGluZy5mcm9tLmdlbyxcclxuICAgICAgICAgICAgICAgICAgICBhcHBDb25maWcuc2hpcHBpbmcudG8uZ2VvLFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHM6IDNcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgYm91bmRzQXV0b0FwcGx5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgd2F5UG9pbnRTdGFydEljb25Db250ZW50TGF5b3V0OiB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcENvbmZpZy5zaGlwcGluZy5mcm9tLnRleHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIHdheVBvaW50RmluaXNoRHJhZ2dhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYmFsbG9vbkxheW91dDogYmFsbG9vbkxheW91dFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbXVsdGlSb3V0ZS5tb2RlbC5ldmVudHMuYWRkKCdyZXF1ZXN0c3VjY2VzcycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNldERpc3RhbmNlKG11bHRpUm91dGUuZ2V0QWN0aXZlUm91dGUoKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9pbnQgPSBtdWx0aVJvdXRlLmdldFdheVBvaW50cygpLmdldCgxKTtcclxuICAgICAgICAgICAgICAgIHltYXBzLmdlb2NvZGUocG9pbnQuZ2VvbWV0cnkuZ2V0Q29vcmRpbmF0ZXMoKSkudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSByZXMuZ2VvT2JqZWN0cy5nZXQoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFkZHJlc3MgPSBvLmdldEFkZHJlc3NMaW5lKCkucmVwbGFjZSgn0J3QuNC20LXQs9C+0YDQvtC00YHQutCw0Y8g0L7QsdC70LDRgdGC0YwsICcsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAkcm91dGVBZGRyZXNzLnZhbChhZGRyZXNzKTtcclxuICAgICAgICAgICAgICAgICAgICBtdWx0aVJvdXRlLm9wdGlvbnMuc2V0KCd3YXlQb2ludEZpbmlzaEljb25Db250ZW50TGF5b3V0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyhhZGRyZXNzKSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbXVsdGlSb3V0ZS5ldmVudHMuYWRkKCdhY3RpdmVyb3V0ZWNoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNldERpc3RhbmNlKG11bHRpUm91dGUuZ2V0QWN0aXZlUm91dGUoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtYXAgPSBuZXcgeW1hcHMuTWFwKFwic2hpcHBpbmdfbWFwXCIsIHtcclxuICAgICAgICAgICAgICAgIGNlbnRlcjogYXBwQ29uZmlnLnNoaXBwaW5nLmZyb20uZ2VvLFxyXG4gICAgICAgICAgICAgICAgem9vbTogMTMsXHJcbiAgICAgICAgICAgICAgICBhdXRvRml0VG9WaWV3cG9ydDogJ2Fsd2F5cycsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sczogW11cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG1hcC5nZW9PYmplY3RzLmFkZChtdWx0aVJvdXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNldERpc3RhbmNlID0gZnVuY3Rpb24gKHJvdXRlKSB7XHJcbiAgICAgICAgICAgIGlmIChyb3V0ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5yb3VuZChyb3V0ZS5wcm9wZXJ0aWVzLmdldCgnZGlzdGFuY2UnKS52YWx1ZSAvIDEwMDApO1xyXG4gICAgICAgICAgICAgICAgJHJvdXRlRGlzdGFuY2UudmFsKGRpc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvL2FwaS1tYXBzLnlhbmRleC5ydS8yLjEvP2xhbmc9cnVfUlUmbW9kZT1kZWJ1ZycsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5bWFwcy5yZWFkeShpbml0TWFwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19tYXAtdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX21hcCcpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IGFwcENvbmZpZy5icmVha3BvaW50Lm1kKSB7XHJcbiAgICAgICAgICAgICAgICAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX21hcC10b2dnbGVyJykuYWRkQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fbWFwJykuc2xpZGVEb3duKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkd3JhcHBlci5kYXRhKCdpbml0JywgdHJ1ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRRdWFudGl0eTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1xdWFudGl0eS1zaGlmdC5qcy1xdWFudGl0eS11cCwgLmpzLXF1YW50aXR5LXNoaWZ0LmpzLXF1YW50aXR5LWRvd24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciAkcXVhbnRpdHlJbnB1dCA9ICQodGhpcykuc2libGluZ3MoJy5qcy1xdWFudGl0eScpWzBdO1xyXG4gICAgICAgICAgICBpZiAoJHF1YW50aXR5SW5wdXQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXIgPSBwYXJzZUludCgkcXVhbnRpdHlJbnB1dC52YWx1ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0VXAgPSAkKHRoaXMpLmhhc0NsYXNzKCdqcy1xdWFudGl0eS11cCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdCA9ICQoJHF1YW50aXR5SW5wdXQpLmF0dHIoc2hpZnRVcCA/ICdtYXgnIDogJ21pbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBzaGlmdFVwID8gY3VyICsgMSA6IGN1ciAtIDE7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWxpbWl0IHx8IChzaGlmdFVwICYmIHZhbCA8PSBwYXJzZUludChsaW1pdCkpIHx8ICghc2hpZnRVcCAmJiB2YWwgPj0gcGFyc2VJbnQobGltaXQpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRxdWFudGl0eUlucHV0LnZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJHF1YW50aXR5SW5wdXQpLmNoYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaW5pdCBtYXAgaW4gY29udGFpbmVyXHJcbiAgICAgKiBAcGFyYW0gc3RyaW5nIGNudCBpZFxyXG4gICAgICogQHJldHVybiBNYXAgXHJcbiAgICAgKi9cclxuICAgIG1hcEluaXQ6IGZ1bmN0aW9uIChjbnQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IHltYXBzLk1hcChjbnQsIHtcclxuICAgICAgICAgICAgY2VudGVyOiBbNTYuMzI2ODg3LCA0NC4wMDU5ODZdLFxyXG4gICAgICAgICAgICB6b29tOiAxMSxcclxuICAgICAgICAgICAgY29udHJvbHM6IFtdXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBzdXBwcmVzc01hcE9wZW5CbG9jazogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgcGxhY2VtYXJrcyBvbiBtYXBcclxuICAgICAqIEBwYXJhbSBNYXAgbWFwXHJcbiAgICAgKiBAcGFyYW0gJCBpdGVtcyB3aXRoIGRhdGEtYXR0clxyXG4gICAgICogQHJldHVybiBhcnJheSBvZiBHZW9PYmplY3RcclxuICAgICAqL1xyXG4gICAgbWFwQWRkUGxhY2VtYXJrczogZnVuY3Rpb24gKG1hcCwgJGl0ZW1zKSB7XHJcbiAgICAgICAgdmFyIHBsYWNlbWFya3MgPSBbXTtcclxuICAgICAgICB2YXIgdHBsUGxhY2VtYXJrID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwbGFjZW1hcmtcIj48c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjM5XCIgaGVpZ2h0PVwiNTBcIj48ZGVmcz48ZmlsdGVyIGlkPVwiYVwiIHdpZHRoPVwiMTQ1LjIlXCIgaGVpZ2h0PVwiMTMzLjMlXCIgeD1cIi0yMi42JVwiIHk9XCItMTEuOSVcIiBmaWx0ZXJVbml0cz1cIm9iamVjdEJvdW5kaW5nQm94XCI+PGZlT2Zmc2V0IGR5PVwiMlwiIGluPVwiU291cmNlQWxwaGFcIiByZXN1bHQ9XCJzaGFkb3dPZmZzZXRPdXRlcjFcIi8+PGZlR2F1c3NpYW5CbHVyIGluPVwic2hhZG93T2Zmc2V0T3V0ZXIxXCIgcmVzdWx0PVwic2hhZG93Qmx1ck91dGVyMVwiIHN0ZERldmlhdGlvbj1cIjJcIi8+PGZlQ29sb3JNYXRyaXggaW49XCJzaGFkb3dCbHVyT3V0ZXIxXCIgcmVzdWx0PVwic2hhZG93TWF0cml4T3V0ZXIxXCIgdmFsdWVzPVwiMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4xNSAwXCIvPjxmZU1lcmdlPjxmZU1lcmdlTm9kZSBpbj1cInNoYWRvd01hdHJpeE91dGVyMVwiLz48ZmVNZXJnZU5vZGUgaW49XCJTb3VyY2VHcmFwaGljXCIvPjwvZmVNZXJnZT48L2ZpbHRlcj48L2RlZnM+PGcgZmlsbD1cIm5vbmVcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgZmlsdGVyPVwidXJsKCNhKVwiIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSg0IDIpXCI+PHBhdGggZmlsbD1cIiMyMDU3QUNcIiBkPVwiTTE1LjE3NSA0MkMyNS4yOTIgMjkuODA1IDMwLjM1IDIwLjg5NyAzMC4zNSAxNS4yNzMgMzAuMzUgNi44MzggMjMuNTU2IDAgMTUuMTc1IDAgNi43OTUgMCAwIDYuODM4IDAgMTUuMjczIDAgMjAuODk3IDUuMDU4IDI5LjgwNSAxNS4xNzUgNDJ6XCIvPjxwYXRoIGZpbGw9XCIjRkZGXCIgZD1cIk0yMy44NDYgMTkuMTgzSDE5Ljc4TDE1LjMwNCA3LjJoNC4wNjdsNC40NzUgMTEuOTgzem0tNC44NSAwaC00LjA2OEwxMS40IDkuNTk3aDQuMDY3bDMuNTI4IDkuNTg2em0tNC45MzMuMDE3aC02LjkxbDMuMzk4LTkuNTIgMy41MTIgOS41MnptLTMuNTEyLTcuNDljLjI3Mi43MDYuODMxIDIuMzM5IDEuMzQxIDMuODI4bC4wMDYuMDE4Yy40MzggMS4yNzcuODM4IDIuNDQ1Ljk4OSAyLjgyOGgtNC41NGMuMTIzLS4zMy40MTQtMS4yNDcuNzUzLTIuMzEzbC4wMDItLjAwNWMuNTEzLTEuNjEyIDEuMTM1LTMuNTY1IDEuNDUtNC4zNTZ6XCIvPjwvZz48L3N2Zz48L2Rpdj4nXHJcbiAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgdHBsQmFsbG9vbiA9IHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwaWNrdXAtYmFsbG9vblwiPnt7IHByb3BlcnRpZXMudGV4dCB9fTxzcGFuIGNsYXNzPVwiYXJyb3dcIj48L3NwYW4+PC9kaXY+Jywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiDQodGC0YDQvtC40YIg0Y3QutC30LXQvNC/0LvRj9GAINC80LDQutC10YLQsCDQvdCwINC+0YHQvdC+0LLQtSDRiNCw0LHQu9C+0L3QsCDQuCDQtNC+0LHQsNCy0LvRj9C10YIg0LXQs9C+INCyINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSBIVE1MLdGN0LvQtdC80LXQvdGCLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHNlZSBodHRwczovL2FwaS55YW5kZXgucnUvbWFwcy9kb2MvanNhcGkvMi4xL3JlZi9yZWZlcmVuY2UvbGF5b3V0LnRlbXBsYXRlQmFzZWQuQmFzZS54bWwjYnVpbGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQG5hbWUgYnVpbGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLnN1cGVyY2xhc3MuYnVpbGQuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl8kZWxlbWVudCA9ICQoJy5waWNrdXAtYmFsbG9vbicsIHRoaXMuZ2V0UGFyZW50RWxlbWVudCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiDQmNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0LTQu9GPINCw0LLRgtC+0L/QvtC30LjRhtC40L7QvdC40YDQvtCy0LDQvdC40Y8gKGJhbGxvb25BdXRvUGFuKS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBzZWUgaHR0cHM6Ly9hcGkueWFuZGV4LnJ1L21hcHMvZG9jL2pzYXBpLzIuMS9yZWYvcmVmZXJlbmNlL0lMYXlvdXQueG1sI2dldENsaWVudEJvdW5kc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAbmFtZSBnZXRDbGllbnRCb3VuZHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtOdW1iZXJbXVtdfSDQmtC+0L7RgNC00LjQvdCw0YLRiyDQu9C10LLQvtCz0L4g0LLQtdGA0YXQvdC10LPQviDQuCDQv9GA0LDQstC+0LPQviDQvdC40LbQvdC10LPQviDRg9Cz0LvQvtCyINGI0LDQsdC70L7QvdCwINC+0YLQvdC+0YHQuNGC0LXQu9GM0L3QviDRgtC+0YfQutC4INC/0YDQuNCy0Y/Qt9C60LguXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFNoYXBlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pc0VsZW1lbnQodGhpcy5fJGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cGxCYWxsb29uLnN1cGVyY2xhc3MuZ2V0U2hhcGUuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuXyRlbGVtZW50LnBvc2l0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgeW1hcHMuc2hhcGUuUmVjdGFuZ2xlKG5ldyB5bWFwcy5nZW9tZXRyeS5waXhlbC5SZWN0YW5nbGUoW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcG9zaXRpb24ubGVmdCwgcG9zaXRpb24udG9wXSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ubGVmdCArIHRoaXMuXyRlbGVtZW50WzBdLm9mZnNldFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24udG9wICsgdGhpcy5fJGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0ICsgdGhpcy5fJGVsZW1lbnQuZmluZCgnLmFycm93JylbMF0ub2Zmc2V0SGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICog0J/RgNC+0LLQtdGA0Y/QtdC8INC90LDQu9C40YfQuNC1INGN0LvQtdC80LXQvdGC0LAgKNCyINCY0JUg0Lgg0J7Qv9C10YDQtSDQtdCz0L4g0LXRidC1INC80L7QttC10YIg0L3QtSDQsdGL0YLRjCkuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAbmFtZSBfaXNFbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gW2VsZW1lbnRdINCt0LvQtdC80LXQvdGCLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59INCk0LvQsNCzINC90LDQu9C40YfQuNGPLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaXNFbGVtZW50OiBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50ICYmIGVsZW1lbnRbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICRpdGVtcy5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICB2YXIgZ2VvID0gJCh0aGlzKS5kYXRhKCdnZW8nKSxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gJCh0aGlzKS5kYXRhKCd0ZXh0Jyk7XHJcbiAgICAgICAgICAgIGlmIChnZW8pIHtcclxuICAgICAgICAgICAgICAgIGdlbyA9IGdlby5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICAgICAgZ2VvWzBdID0gcGFyc2VGbG9hdChnZW9bMF0pO1xyXG4gICAgICAgICAgICAgICAgZ2VvWzFdID0gcGFyc2VGbG9hdChnZW9bMV0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBsYWNlbWFyayA9IG5ldyB5bWFwcy5QbGFjZW1hcmsoZ2VvLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0IHx8ICfQodCQ0JrQodCt0KEnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25MYXlvdXQ6IHRwbFBsYWNlbWFyayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb25JbWFnZVNpemU6IFs0MCwgNTBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlkZUljb25PbkJhbGxvb25PcGVuOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbGxvb25MYXlvdXQ6IHRwbEJhbGxvb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWxsb29uQ2xvc2VCdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFuZTogJ2JhbGxvb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFsbG9vblBhbmVsTWF4TWFwQXJlYTogMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIG1hcC5nZW9PYmplY3RzLmFkZChwbGFjZW1hcmspO1xyXG4gICAgICAgICAgICAgICAgcGxhY2VtYXJrcy5wdXNoKHBsYWNlbWFyayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcGxhY2VtYXJrcztcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgYm91bmRzIG9uIGFsbCBnZW8gb2JqZWN0cyBvbiBtYXBcclxuICAgICAqIEBwYXJhbSBNYXAgbWFwXHJcbiAgICAgKiBAcmV0dXJucyB2b2lkXHJcbiAgICAgKi9cclxuICAgIG1hcFNldEJvdW5kczogZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgIG1hcC5zZXRCb3VuZHMobWFwLmdlb09iamVjdHMuZ2V0Qm91bmRzKCksIHtcclxuICAgICAgICAgICAgY2hlY2tab29tUmFuZ2U6IHRydWUsXHJcbiAgICAgICAgICAgIHpvb21NYXJnaW46IDUwXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRDYXJ0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLWNhcnQtaW5mb19fcmFkaW8nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1jYXJ0LWluZm9fX2hpZGRlbicpLmhpZGUoKTtcclxuICAgICAgICAgICAgdmFyIGRlbGl2ZXJ5ID0gJCh0aGlzKS5kYXRhKCdkZWxpdmVyeScpO1xyXG4gICAgICAgICAgICB2YXIgJHRhcmdldCA9ICQoJy5qcy1jYXJ0LWluZm9fX2hpZGRlbltkYXRhLWRlbGl2ZXJ5PVwiJyArIGRlbGl2ZXJ5ICsgJ1wiXScpO1xyXG4gICAgICAgICAgICAkdGFyZ2V0LnNob3coKTtcclxuICAgICAgICAgICAgJHRhcmdldC5maW5kKCcuanMtc2VsZWN0X2Fsd2F5cycpLnN0eWxlcigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBwaWNrdXBcclxuICAgICAgICB2YXIgJHdyYXBwZXIgPSAkKCcuanMtcGlja3VwJyksIG1hcCA9IG51bGw7XHJcbiAgICAgICAgaWYgKCR3cmFwcGVyLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHBvcHVwcyBpbiBwaWNrdXAgcG9wdXBcclxuICAgICAgICB2YXIgY2xvc2VQaG90b1BvcHVwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cCcpLmZhZGVPdXQoKS5yZW1vdmVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cC1vcGVuJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cC1vcGVuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnX2FjdGl2ZScpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cC1vcGVuJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgdmFyICRwb3B1cCA9ICQodGhpcykuc2libGluZ3MoJy5qcy1waWNrdXBfX3BvcHVwJyk7XHJcbiAgICAgICAgICAgIGlmICgkKCcuanMtcGlja3VwX19wb3B1cC5fYWN0aXZlJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuanMtcGlja3VwX19wb3B1cC5fYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKS5mYWRlT3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkcG9wdXAuZmFkZUluKCkuYWRkQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHBvcHVwLmZhZGVJbigpLmFkZENsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnLmpzLXBpY2t1cF9fcG9wdXAtY2xvc2UnKS5vbignY2xpY2snLCBjbG9zZVBob3RvUG9wdXApO1xyXG5cclxuICAgICAgICB2YXIgY2xvc2VQaWNrdXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG1hcC5iYWxsb29uLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX21hcF9faXRlbScpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3N1Ym1pdCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGNsb3NlUGhvdG9Qb3B1cCgpO1xyXG4gICAgICAgICAgICAkLmZhbmN5Ym94LmNsb3NlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHN1Ym1pdFxyXG4gICAgICAgICQoJy5qcy1waWNrdXBfX3N1Ym1pdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICRzZWxlY3RlZCA9ICQoJy5qcy1waWNrdXBfX21hcF9faXRlbS5fYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3RhcmdldF9fdGV4dCcpLnRleHQoJHNlbGVjdGVkLmZpbmQoJy5qcy1waWNrdXBfX21hcF9faXRlbV9fdGV4dCcpLnRleHQoKSk7XHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3RhcmdldF9fdGltZScpLnRleHQoJHNlbGVjdGVkLmZpbmQoJy5qcy1waWNrdXBfX21hcF9faXRlbV9fdGltZScpLnRleHQoKSB8fCAnJyk7XHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3RhcmdldF9faW5wdXQnKS52YWwoJHNlbGVjdGVkLmRhdGEoJ2lkJykgfHwgMCk7XHJcbiAgICAgICAgICAgIGNsb3NlUGlja3VwKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGNhbmNlbFxyXG4gICAgICAgICQoJy5qcy1waWNrdXBfX2NhbmNlbCcpLm9uKCdjbGljaycsIGNsb3NlUGlja3VwKTtcclxuXHJcbiAgICAgICAgLy8gbWFwXHJcbiAgICAgICAgdmFyIGluaXRNYXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG1hcCA9IGFwcC5tYXBJbml0KCdwaWNrdXBfbWFwJyk7XHJcbiAgICAgICAgICAgIHZhciBwbGFjZW1hcmtzID0gYXBwLm1hcEFkZFBsYWNlbWFya3MobWFwLCAkKCcuanMtcGlja3VwX19tYXBfX2l0ZW0nKSk7XHJcbiAgICAgICAgICAgIGFwcC5tYXBTZXRCb3VuZHMobWFwKTtcclxuICAgICAgICAgICAgLy8gY2xpY2tcclxuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fbWFwX19pdGVtJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcGxhY2VtYXJrc1skKHRoaXMpLmluZGV4KCldLmJhbGxvb24ub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fbWFwX19pdGVtJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3N1Ym1pdCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICR3cmFwcGVyLmRhdGEoJ2luaXQnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gaW5pdCBtYXAgb24gZmIub3BlblxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdhZnRlclNob3cuZmInLCBmdW5jdGlvbiAoZSwgaW5zdGFuY2UsIHNsaWRlKSB7XHJcbiAgICAgICAgICAgIHZhciAkcGlja3VwID0gc2xpZGUuJHNsaWRlLmZpbmQoJy5qcy1waWNrdXAnKTtcclxuICAgICAgICAgICAgaWYgKCRwaWNrdXAubGVuZ3RoICYmICEkcGlja3VwLmRhdGEoJ2luaXQnKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAoeW1hcHMpID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy8vYXBpLW1hcHMueWFuZGV4LnJ1LzIuMS8/bGFuZz1ydV9SVSZtb2RlPWRlYnVnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwic2NyaXB0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5bWFwcy5yZWFkeShpbml0TWFwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB5bWFwcy5yZWFkeShpbml0TWFwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFNQOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQoJy5qcy1zcCcpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiAoeW1hcHMpID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnLy9hcGktbWFwcy55YW5kZXgucnUvMi4xLz9sYW5nPXJ1X1JVJm1vZGU9ZGVidWcnLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwic2NyaXB0XCIsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB5bWFwcy5yZWFkeShpbml0TWFwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeW1hcHMucmVhZHkoaW5pdE1hcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBpbml0TWFwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbWFwID0gYXBwLm1hcEluaXQoJ3NwX21hcCcpO1xyXG4gICAgICAgICAgICBhcHAubWFwQWRkUGxhY2VtYXJrcyhtYXAsICQoJy5qcy1zcF9fbWFwLWl0ZW0nKSk7XHJcbiAgICAgICAgICAgIC8vINC80LDRgdGI0YLQsNCx0LjRgNGD0LXQvCDQv9GA0Lgg0L7RgtC60YDRi9GC0LjQuCDRgdGC0YDQsNC90LjRhtGLLCDRgtCw0LHQsCDQuCDRgdC70LDQudC00LBcclxuICAgICAgICAgICAgaWYgKCQoJyNzcF9tYXAnKS5pcygnOnZpc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgYXBwLm1hcFNldEJvdW5kcyhtYXApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnLmpzLXNwIC5qcy10YWJzJykub25lKCdlYXN5dGFiczphZnRlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHAubWFwU2V0Qm91bmRzKG1hcCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICQoJy5qcy1zcCAuanMtc3BfX21hcC10YWInKS5vbigndGFic19zbGlkZV9vcGVuJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcC5tYXBTZXRCb3VuZHMobWFwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0YPQvdC60YbQuNGPINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC+0LrQvtC90YfQsNC90LjQtSDQtNC70Y8g0LzQvdC+0LbQtdGB0YLQstC10L3QvdC+0LPQviDRh9C40YHQu9CwINGB0LvQvtCy0LAg0L3QsCDQvtGB0L3QvtCy0LDQvdC40Lgg0YfQuNGB0LvQsCDQuCDQvNCw0YHRgdC40LLQsCDQvtC60L7QvdGH0LDQvdC40LlcclxuICAgICAqIHBhcmFtICBpTnVtYmVyIEludGVnZXIg0KfQuNGB0LvQviDQvdCwINC+0YHQvdC+0LLQtSDQutC+0YLQvtGA0L7Qs9C+INC90YPQttC90L4g0YHRhNC+0YDQvNC40YDQvtCy0LDRgtGMINC+0LrQvtC90YfQsNC90LjQtVxyXG4gICAgICogcGFyYW0gIGFFbmRpbmdzIEFycmF5INCc0LDRgdGB0LjQsiDRgdC70L7QsiDQuNC70Lgg0L7QutC+0L3Rh9Cw0L3QuNC5INC00LvRjyDRh9C40YHQtdC7ICgxLCA0LCA1KSxcclxuICAgICAqICAgICAgICAg0L3QsNC/0YDQuNC80LXRgCBbJ9GP0LHQu9C+0LrQvicsICfRj9Cx0LvQvtC60LAnLCAn0Y/QsdC70L7QuiddXHJcbiAgICAgKiByZXR1cm4gU3RyaW5nXHJcbiAgICAgKiBcclxuICAgICAqIGh0dHBzOi8vaGFicmFoYWJyLnJ1L3Bvc3QvMTA1NDI4L1xyXG4gICAgICovXHJcbiAgICBnZXROdW1FbmRpbmc6IGZ1bmN0aW9uIChpTnVtYmVyLCBhRW5kaW5ncykge1xyXG4gICAgICAgIHZhciBzRW5kaW5nLCBpO1xyXG4gICAgICAgIGlOdW1iZXIgPSBpTnVtYmVyICUgMTAwO1xyXG4gICAgICAgIGlmIChpTnVtYmVyID49IDExICYmIGlOdW1iZXIgPD0gMTkpIHtcclxuICAgICAgICAgICAgc0VuZGluZyA9IGFFbmRpbmdzWzJdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGkgPSBpTnVtYmVyICUgMTA7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoaSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAoMSk6XHJcbiAgICAgICAgICAgICAgICAgICAgc0VuZGluZyA9IGFFbmRpbmdzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAoMik6XHJcbiAgICAgICAgICAgICAgICBjYXNlICgzKTpcclxuICAgICAgICAgICAgICAgIGNhc2UgKDQpOlxyXG4gICAgICAgICAgICAgICAgICAgIHNFbmRpbmcgPSBhRW5kaW5nc1sxXTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgc0VuZGluZyA9IGFFbmRpbmdzWzJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzRW5kaW5nO1xyXG4gICAgfVxyXG5cclxufSJdLCJmaWxlIjoiY29tbW9uLmpzIn0=
