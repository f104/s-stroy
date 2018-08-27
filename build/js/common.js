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

        // category menu
        $('.js-category-menu').each(function () {
            var $toggler = $(this).find('.js-category-menu__toggler'),
                    $slide = $(this).find('.js-category-menu__slide');
            $toggler.on('click', function() {
                $toggler.toggleClass('_opened');
                $slide.slideToggle();
                return false;
            })
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
            map.balloon.close()
            $('.js-pickup__map__item').removeClass('_active');
            $('.js-pickup__submit').prop('disabled', true);
            closePhotoPopup();
            $.fancybox.close()
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
            map = new ymaps.Map('pickup_map', {
                center: [56.326887, 44.005986],
                zoom: 11,
                controls: []
            }, {
                suppressMapOpenBlock: true,
            }), placemarks = [];
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
//                            this.applyElementOffset();
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
            $('.js-pickup__map__item').each(function (index) {
                var geo = $(this).data('geo'),
                        text = $(this).find('.js-pickup__map__item__text').text();
                if (geo) {
                    geo = geo.split(',');
                    geo[0] = parseFloat(geo[0]);
                    geo[1] = parseFloat(geo[1]);
                    var placemark = new ymaps.Placemark(geo,
                            {
                                text: text || 'склад'
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
                    map.setBounds(map.geoObjects.getBounds(), {
                        checkZoomRange: true,
                        zoomMargin: 50
                    });
                }
                // click
                $(this).on('click', function () {
                    placemarks[$(this).index()].balloon.open();
                    $('.js-pickup__map__item').removeClass('_active');
                    $(this).addClass('_active');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsialF1ZXJ5LmV4cHJbJzonXS5mb2N1cyA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICByZXR1cm4gZWxlbSA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiAoZWxlbS50eXBlIHx8IGVsZW0uaHJlZik7XHJcbn07XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuaW5pdGlhbGl6ZSgpO1xyXG59KTtcclxuXHJcbnZhciBhcHAgPSB7XHJcbiAgICBpbml0aWFsaXplZDogZmFsc2UsXHJcblxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBlbGVtSFRNTCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdodG1sJylbMF07XHJcbiAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTWFjJykgPiAwKSB7XHJcbiAgICAgICAgICAgIGVsZW1IVE1MLmNsYXNzTmFtZSArPSBcIiBtYWMtb3NcIjtcclxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignU2FmYXJpJykgPiAwKVxyXG4gICAgICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIG1hYy1zYWZhcmlcIjtcclxuICAgICAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lJykgPiAwKVxyXG4gICAgICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIG1hYy1jaHJvbWVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignRWRnZScpID4gMCB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1RyaWRlbnQnKSA+IDApIHtcclxuICAgICAgICAgICAgZWxlbUhUTUwuY2xhc3NOYW1lICs9IFwiIGllXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5pdFNsaWRlcnMoKTsgLy8gbXVzdCBiZSBmaXJzdCFcclxuICAgICAgICB0aGlzLmluaXRNZW51KCk7XHJcbiAgICAgICAgdGhpcy5pbml0Rm9vdGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q3V0KCk7XHJcbiAgICAgICAgdGhpcy5pbml0SG92ZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRTY3JvbGxiYXIoKTtcclxuICAgICAgICB0aGlzLmluaXRDYXRhbG9nKCk7XHJcbiAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XHJcbiAgICAgICAgdGhpcy5pbml0UG9wdXAoKTtcclxuICAgICAgICB0aGlzLmluaXRGb3JtTGFiZWwoKTtcclxuICAgICAgICB0aGlzLmluaXRSZWdpb25TZWxlY3QoKTtcclxuICAgICAgICB0aGlzLmluaXRUYWJzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0UUEoKTtcclxuICAgICAgICB0aGlzLmluaXRJTW1lbnUoKTtcclxuICAgICAgICB0aGlzLmluaXRTZWxlY3RzKCk7XHJcbiAgICAgICAgdGhpcy5pbml0TWFzaygpO1xyXG4gICAgICAgIHRoaXMuaW5pdFJhbmdlKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RmlsdGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q3JlYXRlUHJpY2UoKTtcclxuICAgICAgICB0aGlzLmluaXRRdWFudGl0eSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdENhcnQoKTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXBwLmluaXRIb3ZlcigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdE1lbnU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtbWVudS10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgICAgJCgnLmpzLW1lbnUtdG9nZ2xlcltocmVmPVwiJyArIGhyZWYgKyAnXCJdJykudG9nZ2xlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgJChocmVmKS50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKCcuanMtbWVudS5fYWN0aXZlJykubGVuZ3RoID09IDAgPyAkKCcuanMtbWVudS1vdmVybGF5JykuaGlkZSgpIDogJCgnLmpzLW1lbnUtb3ZlcmxheScpLnNob3coKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5qcy1tZW51LW92ZXJsYXknKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAkKCcuanMtbWVudS10b2dnbGVyLCAuanMtbWVudScpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQodGhpcykuaGlkZSgpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciAkaGVhZGVyID0gJCgnaGVhZGVyJyk7XHJcbiAgICAgICAgdmFyIGhlYWRlckhlaWdodCA9ICRoZWFkZXIub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgICB2YXIgcSA9IDE7XHJcbiAgICAgICAgdmFyIGFjdGlvbiA9IDA7XHJcbiAgICAgICAgdmFyIHBpbkhlYWRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09IFwiY29tcGxldGVcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLnNjcm9sbFRvcCgpID4gaGVhZGVySGVpZ2h0ICogcSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gMTtcclxuICAgICAgICAgICAgICAgICRoZWFkZXIuc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLmNzcyh7J3BhZGRpbmctdG9wJzogaGVhZGVySGVpZ2h0fSk7XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLmNzcyh7J3RvcCc6IC1oZWFkZXJIZWlnaHR9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ19maXhlZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hbmltYXRlKHsndG9wJzogMH0sIDEwMDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PSAyIHx8ICEkaGVhZGVyLmhhc0NsYXNzKCdfZml4ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGFjdGlvbiA9IDI7XHJcbiAgICAgICAgICAgICAgICAkaGVhZGVyLmFuaW1hdGUoeyd0b3AnOiAtaGVhZGVySGVpZ2h0fSwgXCJmYXN0XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaGVhZGVyLmNzcyh7J3RvcCc6IDB9KTtcclxuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKHsncGFkZGluZy10b3AnOiAwfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnX2ZpeGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcpIHtcclxuICAgICAgICAgICAgcGluSGVhZGVyKCk7XHJcbiAgICAgICAgICAgICQod2luZG93KS5vbignbG9hZCBzY3JvbGwnLCBwaW5IZWFkZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IGFwcENvbmZpZy5icmVha3BvaW50LmxnKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJIZWlnaHQgPSAkaGVhZGVyLm91dGVySGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIHBpbkhlYWRlcik7XHJcbiAgICAgICAgICAgICAgICAkKCcuanMtbWVudScpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcuanMtbWVudS1vdmVybGF5JykuaGlkZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9mZignc2Nyb2xsJywgcGluSGVhZGVyKTtcclxuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xyXG4gICAgICAgICAgICAgICAgJGhlYWRlci5yZW1vdmVDbGFzcygnX2ZpeGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gY2F0ZWdvcnkgbWVudVxyXG4gICAgICAgICQoJy5qcy1jYXRlZ29yeS1tZW51JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkdG9nZ2xlciA9ICQodGhpcykuZmluZCgnLmpzLWNhdGVnb3J5LW1lbnVfX3RvZ2dsZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAkc2xpZGUgPSAkKHRoaXMpLmZpbmQoJy5qcy1jYXRlZ29yeS1tZW51X19zbGlkZScpO1xyXG4gICAgICAgICAgICAkdG9nZ2xlci5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICR0b2dnbGVyLnRvZ2dsZUNsYXNzKCdfb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAkc2xpZGUuc2xpZGVUb2dnbGUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEZvb3RlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBmaXhNZW51ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA+PSBhcHBDb25maWcuYnJlYWtwb2ludC5tZCAmJiAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcpIHtcclxuICAgICAgICAgICAgICAgICQoJy5mb290ZXJfX21lbnUtc2Vjb25kJykuY3NzKCdsZWZ0JywgJCgnLmZvb3Rlcl9fbWVudSAubWVudSA+IGxpOm50aC1jaGlsZCgzKScpLm9mZnNldCgpLmxlZnQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnLmZvb3Rlcl9fbWVudS1zZWNvbmQnKS5jc3MoJ2xlZnQnLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmaXhNZW51KCk7XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkIHJlc2l6ZScsIGZpeE1lbnUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0Q3V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLWN1dCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5qcy1jdXRfX3RyaWdnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGNvbnRlbnQgPSAkKHRoaXMpLnNpYmxpbmdzKCcuanMtY3V0X19jb250ZW50JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTaG93ID0gJCh0aGlzKS5kYXRhKCd0ZXh0c2hvdycpIHx8ICdzaG93IHRleHQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0SGlkZSA9ICQodGhpcykuZGF0YSgndGV4dGhpZGUnKSB8fCAnaGlkZSB0ZXh0JztcclxuICAgICAgICAgICAgICAgICQodGhpcykudGV4dCgkY29udGVudC5pcygnOnZpc2libGUnKSA/IHRleHRTaG93IDogdGV4dEhpZGUpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnX29wZW5lZCcpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmpzLWN1dF9fY29udGVudCcpLnNsaWRlVG9nZ2xlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtZmlsdGVyX19jb3VudGVyJykudHJpZ2dlcihcInN0aWNreV9raXQ6cmVjYWxjXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFNsaWRlcnM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtbWFpbi1zbGlkZXInKS5zbGljayh7XHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IGFwcENvbmZpZy5icmVha3BvaW50Lm1kIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJvd3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5qcy1zbGlkZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHNsaWRlcyA9ICQodGhpcykuZGF0YSgnc2xpZGVzJyk7XHJcbiAgICAgICAgICAgICQodGhpcykuc2xpY2soe1xyXG4gICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhcnJvd3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IHNsaWRlcy5zbSB8fCAxLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZSxcclxuLy8gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiBzbGlkZXMubWQgfHwgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiBhcHBDb25maWcuYnJlYWtwb2ludC5sZyAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IHNsaWRlcy5sZyB8fCAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcuanMtbmF2LXNsaWRlcl9fbWFpbicpLnNsaWNrKHtcclxuICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgICAgICBhc05hdkZvcjogJy5qcy1uYXYtc2xpZGVyX19uYXYnLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciByZXNwb25zaXZlID0ge1xyXG4gICAgICAgICAgICBwcm9kdWN0OiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN3aXBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogNSxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBjb250ZW50OiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN3aXBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogNCxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IGFwcENvbmZpZy5icmVha3BvaW50LmxnIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWxTd2lwaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDUsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnLmpzLW5hdi1zbGlkZXJfX25hdicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNsaWNrKHtcclxuICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhc05hdkZvcjogJy5qcy1uYXYtc2xpZGVyX19tYWluJyxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMyxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgZm9jdXNPblNlbGVjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogcmVzcG9uc2l2ZVskKHRoaXMpLmRhdGEoJ3Jlc3BvbnNpdmUnKV0sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnLmpzLW5hdi1zbGlkZXJfX21haW4uc2xpY2staW5pdGlhbGl6ZWQnKS5zbGljaygnc2V0UG9zaXRpb24nKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEhvdmVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLWhvdmVyJykudW5iaW5kKCdtb3VzZWVudGVyIG1vdXNlbGVhdmUnKTtcclxuICAgICAgICBpZiAoJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA+PSBhcHBDb25maWcuYnJlYWtwb2ludC5sZykge1xyXG4gICAgICAgICAgICAkKCcuanMtaG92ZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkdGhpcywgJHBhcmVudCwgJHdyYXAsICRob3ZlciwgaCwgdztcclxuICAgICAgICAgICAgICAgICQodGhpcykub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGhpcy5oYXNDbGFzcygnX2hvdmVyJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gJHRoaXMub2Zmc2V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHBhcmVudCA9ICR0aGlzLnBhcmVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICRwYXJlbnQuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6ICRwYXJlbnQub3V0ZXJIZWlnaHQoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGggPSAkdGhpcy5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHcgPSAkdGhpcy5vdXRlcldpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6IGgsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdyYXAgPSAkKCc8ZGl2Lz4nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKCdib2R5JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3RvcCc6IG9mZnNldC50b3AsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xlZnQnOiBvZmZzZXQubGVmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiB3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiBoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGhvdmVyID0gJCgnPGRpdi8+JykuYXBwZW5kVG8oJHdyYXApO1xyXG4gICAgICAgICAgICAgICAgICAgICRob3Zlci5hZGRDbGFzcygnaG92ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5hcHBlbmRUbygkd3JhcCkuYWRkQ2xhc3MoJ19ob3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRob3Zlci5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnLTEwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAnLTEwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodDogJy0xMHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAnLTEwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdyYXAub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRob3Zlci5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6ICcwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogJzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbygkcGFyZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ19ob3ZlcicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdzdHlsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHBhcmVudC5yZW1vdmVBdHRyKCdzdHlsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHdyYXAucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFNjcm9sbGJhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1zY3JvbGxiYXInKS5zY3JvbGxiYXIoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFNlYXJjaDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkaW5wdXQgPSAkKCcuanMtc2VhcmNoLWZvcm1fX2lucHV0Jyk7XHJcbiAgICAgICAgJGlucHV0Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJGlucHV0Lm9uKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmpzLXNlYXJjaC1yZXMnKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQod2luZG93KS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1zZWFyY2gtcmVzJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdENhdGFsb2c6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXNNb2JpbGUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcsXHJcbiAgICAgICAgICAgICAgICAkc2xpZGUgPSAkKCcuanMtY21fX3NsaWRlJyksXHJcbiAgICAgICAgICAgICAgICAkc2xpZGVUcmlnZ2VyID0gJCgnLmpzLWNtX19zbGlkZV9fdHJpZ2dlcicpLFxyXG4gICAgICAgICAgICAgICAgJG1lbnUgPSAkKCcuanMtY21fX21lbnUnKSxcclxuICAgICAgICAgICAgICAgICRzY3JvbGxiYXIgPSAkKCcuanMtY21fX3Njcm9sbGJhcicpLFxyXG4gICAgICAgICAgICAgICAgJG1vYmlsZVRvZ2dsZXIgPSAkKCcuanMtY21fX21vYmlsZS10b2dnbGVyJyksXHJcbiAgICAgICAgICAgICAgICAkc2Vjb25kTGluayA9ICQoJy5qcy1jbV9fc2Vjb25kLWxpbmsnKSxcclxuICAgICAgICAgICAgICAgICRzZWNvbmRDbG9zZSA9ICQoJy5qcy1jbV9fbWVudS1zZWNvbmRfX2Nsb3NlJyksXHJcbiAgICAgICAgICAgICAgICAkd3JhcHBlciA9ICQoJy5qcy1jbV9fbWVudS13cmFwcGVyJyk7XHJcblxyXG4gICAgICAgIHZhciBzbGlkZU1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzbGlkZS5zbGlkZVRvZ2dsZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuanMtZmlsdGVyX19jb3VudGVyJykudHJpZ2dlcihcInN0aWNreV9raXQ6cmVjYWxjXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJG1lbnUudG9nZ2xlQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNob3dTZWNvbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJy5qcy1jbV9fbWVudS1zZWNvbmQnKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaG92ZXJJY29uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJGljb24gPSAkKHRoaXMpLmZpbmQoJy5zcHJpdGUnKTtcclxuICAgICAgICAgICAgJGljb24uYWRkQ2xhc3MoJGljb24uZGF0YSgnaG92ZXInKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdW5ob3Zlckljb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkaWNvbiA9ICQodGhpcykuZmluZCgnLnNwcml0ZScpO1xyXG4gICAgICAgICAgICAkaWNvbi5yZW1vdmVDbGFzcygkaWNvbi5kYXRhKCdob3ZlcicpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbml0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLnNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLmNzcyh7J2hlaWdodCc6ICQod2luZG93KS5vdXRlckhlaWdodCgpIC0gJCgnLmhlYWRlcicpLm91dGVySGVpZ2h0KCl9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBkZXN0cm95U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2Nyb2xsYmFyLnNjcm9sbGJhcignZGVzdHJveScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAkc2xpZGVUcmlnZ2VyLm9uKCdjbGljaycsIHNsaWRlTWVudSk7XHJcbiAgICAgICAgICAgICRzZWNvbmRMaW5rLnBhcmVudCgpLmhvdmVyKGhvdmVySWNvbiwgdW5ob3Zlckljb24pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHNlY29uZExpbmsub24oJ2NsaWNrJywgc2hvd1NlY29uZCk7XHJcbiAgICAgICAgICAgIGluaXRTY3JvbGxiYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJG1vYmlsZVRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkd3JhcHBlci50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJHNlY29uZENsb3NlLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuanMtY21fX21lbnUtc2Vjb25kJykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoIWlzTW9iaWxlICYmICEkbWVudS5oYXNDbGFzcygnX29wZW5lZCcpKSB7XHJcbiAgICAgICAgICAgICRzbGlkZS5zbGlkZVVwKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoJy5qcy1maWx0ZXJfX2NvdW50ZXInKS50cmlnZ2VyKFwic3RpY2t5X2tpdDpyZWNhbGNcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGNoZWNrTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1NpemUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubGc7XHJcbiAgICAgICAgICAgIGlmIChuZXdTaXplICE9IGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpc01vYmlsZSA9IG5ld1NpemU7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2xpZGUuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICRtZW51LmFkZENsYXNzKCdfb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlVHJpZ2dlci5vZmYoJ2NsaWNrJywgc2xpZGVNZW51KTtcclxuICAgICAgICAgICAgICAgICAgICAkc2Vjb25kTGluay5vbignY2xpY2snLCBzaG93U2Vjb25kKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2Vjb25kTGluay5vZmYoJ21vdXNlZW50ZXIgbW91c2VsZWF2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWNvbmRMaW5rLnBhcmVudCgpLm9mZignbW91c2VlbnRlciBtb3VzZWxlYXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdFNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkd3JhcHBlci5yZW1vdmVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzbGlkZVRyaWdnZXIub24oJ2NsaWNrJywgc2xpZGVNZW51KTtcclxuICAgICAgICAgICAgICAgICAgICAkc2Vjb25kTGluay5vZmYoJ2NsaWNrJywgc2hvd1NlY29uZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNlY29uZExpbmsucGFyZW50KCkuaG92ZXIoaG92ZXJJY29uLCB1bmhvdmVySWNvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdHJveVNjcm9sbGJhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkd3JhcHBlci5oYXNDbGFzcygnX2Fic29sdXRlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG1lbnUucmVtb3ZlQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNsaWRlLnNsaWRlVXAoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5ld1NpemUpIHtcclxuICAgICAgICAgICAgICAgICRzY3JvbGxiYXIuY3NzKHsnaGVpZ2h0JzogJCh3aW5kb3cpLm91dGVySGVpZ2h0KCkgLSAkKCcuaGVhZGVyJykub3V0ZXJIZWlnaHQoKX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjaGVja01lbnUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gdG9nZ2xlIGNhdGFsb2cgbGlzdCB2aWV3XHJcbiAgICAgICAgJCgnLmpzLWNhdGFsb2ctdmlldy10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCcuanMtY2F0YWxvZy12aWV3LXRvZ2dsZXInKS50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKCcuanMtY2F0YWxvZy1saXN0IC5qcy1jYXRhbG9nLWxpc3RfX2l0ZW0sIC5qcy1jYXRhbG9nLWxpc3QgLmpzLWNhdGFsb2ctbGlzdF9faXRlbSAuY2F0YWxvZy1saXN0X19pdGVtX19jb250ZW50JykudG9nZ2xlQ2xhc3MoJ19jYXJkJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFBvcHVwOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGJhc2VDbGFzczogJ19wb3B1cCcsXHJcbiAgICAgICAgICAgIGF1dG9Gb2N1czogZmFsc2UsXHJcbiAgICAgICAgICAgIHRvdWNoOiBmYWxzZSxcclxuICAgICAgICAgICAgYWZ0ZXJTaG93OiBmdW5jdGlvbiAoaW5zdGFuY2UsIHNsaWRlKSB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZS4kc2xpZGUuZmluZCgnLnNsaWNrLWluaXRpYWxpemVkJykuc2xpY2soJ3NldFBvc2l0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHNoaXBwaW5nID0gc2xpZGUuJHNsaWRlLmZpbmQoJy5qcy1zaGlwcGluZycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCRzaGlwcGluZy5sZW5ndGggJiYgISRzaGlwcGluZy5kYXRhKCdpbml0JykpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHAuc2hpcHBpbmcuaW5pdCgkc2hpcHBpbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkKCcuanMtcG9wdXAnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQuZmFuY3lib3guY2xvc2UoKTtcclxuICAgICAgICB9KS5mYW5jeWJveChvcHRpb25zKTtcclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2gpIHtcclxuICAgICAgICAgICAgdmFyICRjbnQgPSAkKHdpbmRvdy5sb2NhdGlvbi5oYXNoKTtcclxuICAgICAgICAgICAgaWYgKCRjbnQubGVuZ3RoICYmICRjbnQuaGFzQ2xhc3MoJ3BvcHVwJykpIHtcclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3gub3BlbigkY250LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdEZvcm1MYWJlbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkaW5wdXRzID0gJCgnLmpzLWZvcm1fX2xhYmVsJykuZmluZCgnOm5vdChbcmVxdWlyZWRdKScpO1xyXG4gICAgICAgICRpbnB1dHNcclxuICAgICAgICAgICAgICAgIC5vbignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnbGFiZWwnKS5yZW1vdmVDbGFzcygnZm9ybV9fbGFiZWxfX2VtcHR5Jyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uKCdibHVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghJCh0aGlzKS52YWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCdsYWJlbCcpLmFkZENsYXNzKCdmb3JtX19sYWJlbF9fZW1wdHknKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcignW3ZhbHVlPVwiXCJdLCA6bm90KFt2YWx1ZV0pJykuc2libGluZ3MoJ2xhYmVsJykuYWRkQ2xhc3MoJ2Zvcm1fX2xhYmVsX19lbXB0eScpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0UmVnaW9uU2VsZWN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLXJlZ2lvbi10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsID0gJCh0aGlzKS5kYXRhKCd0b2dnbGUnKTtcclxuICAgICAgICAgICAgaWYgKHNlbCkge1xyXG4gICAgICAgICAgICAgICAgJChzZWwpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5qcy1yZWdpb24tY2xvc2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJy5yZWdpb24tc2VsZWN0Jykuc2xpZGVVcCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciAkaGVhZGVyUmVnaW9uU2VsZWN0ID0gJCgnLmhlYWRlciAucmVnaW9uLXNlbGVjdCcpO1xyXG4gICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJGhlYWRlclJlZ2lvblNlbGVjdC5pcygnOnZpc2libGUnKSkge1xyXG4gICAgICAgICAgICAgICAgJGhlYWRlclJlZ2lvblNlbGVjdC5zbGlkZVVwKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFRhYnM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXNNb2JpbGUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQsXHJcbiAgICAgICAgICAgICAgICAkdGFicyA9ICQoJy5qcy10YWJzX190YWInKSxcclxuICAgICAgICAgICAgICAgICR0b2dnbGVycyA9ICQoJy5qcy10YWJzX190YWIgLnRhYnNfX3RhYl9fdG9nZ2xlcicpLFxyXG4gICAgICAgICAgICAgICAgJGNvbnRlbnQgPSAkKCcuanMtdGFic19fdGFiIC50YWJzX190YWJfX2NvbnRlbnQnKTtcclxuICAgICAgICBpZiAoISR0YWJzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAkdG9nZ2xlcnMub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdfb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJy50YWJzX190YWJfX2NvbnRlbnQnKS5zbGlkZVRvZ2dsZSgpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIGluaXRFdGFicyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1NpemUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQ7XHJcbiAgICAgICAgICAgIGlmIChuZXdTaXplICE9IGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpc01vYmlsZSA9IG5ld1NpemU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAkdGFicy5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAkdG9nZ2xlcnMucmVtb3ZlQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICRjb250ZW50LmhpZGUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICR0YWJzLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICRjb250ZW50LnNob3coKTtcclxuICAgICAgICAgICAgICAgICQoJy5qcy10YWJzJykuZWFzeXRhYnMoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUhhc2g6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KS5iaW5kKCdlYXN5dGFiczptaWRUcmFuc2l0aW9uJywgZnVuY3Rpb24gKGV2ZW50LCAkY2xpY2tlZCwgJHRhcmdldFBhbmVsLCBzZXR0aW5ncykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciAkdW5kZXIgPSAkKHRoaXMpLmZpbmQoJy5qcy10YWJzX191bmRlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICR1bmRlci5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAkY2xpY2tlZC5wYXJlbnQoKS5wb3NpdGlvbigpLmxlZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAkY2xpY2tlZC53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkdGFicy5maWx0ZXIoJy5hY3RpdmUnKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgaW5pdFVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCcuanMtdGFicycpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICR1bmRlciA9ICQodGhpcykuZmluZCgnLmpzLXRhYnNfX3VuZGVyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRhY3RpdmVMaW5rID0gJCh0aGlzKS5maW5kKCcudGFic19fbGlzdCAuYWN0aXZlIGEnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wID0gJGFjdGl2ZUxpbmsub3V0ZXJIZWlnaHQoKSAtICR1bmRlci5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCRhY3RpdmVMaW5rLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICR1bmRlci5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3R0b206ICdhdXRvJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiB0b3AsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICRhY3RpdmVMaW5rLnBhcmVudCgpLnBvc2l0aW9uKCkubGVmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICRhY3RpdmVMaW5rLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGluaXRFdGFicygpO1xyXG4gICAgICAgIGluaXRVbmRlcigpO1xyXG4gICAgICAgICQod2luZG93KS5vbignbG9hZCByZXNpemUnLCBpbml0RXRhYnMpO1xyXG4gICAgICAgICQod2luZG93KS5vbignbG9hZCByZXNpemUnLCBpbml0VW5kZXIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0UUE6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtcWE6bm90KC5fYWN0aXZlKSAucWFfX2EnKS5zbGlkZVVwKCk7XHJcbiAgICAgICAgJCgnLmpzLXFhJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgJHRvZ2dsZXIgPSAkdGhpcy5maW5kKCcucWFfX3EgLnFhX19oJyksXHJcbiAgICAgICAgICAgICAgICAgICAgJGFuc3dlciA9ICR0aGlzLmZpbmQoJy5xYV9fYScpO1xyXG4gICAgICAgICAgICAkdG9nZ2xlci5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkdGhpcy50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJGFuc3dlci5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdElNbWVudTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1pbS1tZW51X190b2dnbGVyOm5vdCguX29wZW5lZCknKS5zaWJsaW5ncygnLmpzLWltLW1lbnVfX3NsaWRlJykuc2xpZGVVcCgpO1xyXG4gICAgICAgICQoJy5qcy1pbS1tZW51X190b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdfb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJy5qcy1pbS1tZW51X19zbGlkZScpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRTZWxlY3RzOiBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAkKCcuanMtc2VsZWN0X2Fsd2F5cycpLnN0eWxlcigpO1xyXG4gICAgICAgIHZhciBpc01vYmlsZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5tZCxcclxuICAgICAgICAgICAgICAgICRzZWxlY3RzID0gJCgnLmpzLXNlbGVjdCcpO1xyXG4gICAgICAgIGlmICghJHNlbGVjdHMubGVuZ3RoKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzZWxlY3RzLnN0eWxlcigpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzZWxlY3RzLnN0eWxlcignZGVzdHJveScpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIHJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdTaXplID0gJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50Lm1kO1xyXG4gICAgICAgICAgICBpZiAobmV3U2l6ZSAhPSBpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgaXNNb2JpbGUgPSBuZXdTaXplO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCFpc01vYmlsZSkge1xyXG4gICAgICAgICAgICBpbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgcmVmcmVzaCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRNYXNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLW1hc2tfX3RlbCcpLmlucHV0bWFzayh7XHJcbiAgICAgICAgICAgIG1hc2s6ICcrOSAoOTk5KSA5OTktOTktOTknXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgSW5wdXRtYXNrLmV4dGVuZEFsaWFzZXMoe1xyXG4gICAgICAgICAgICAnbnVtZXJpYyc6IHtcclxuICAgICAgICAgICAgICAgIGF1dG9Vbm1hc2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzaG93TWFza09uSG92ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcmFkaXhQb2ludDogXCIsXCIsXHJcbiAgICAgICAgICAgICAgICBncm91cFNlcGFyYXRvcjogXCIgXCIsXHJcbiAgICAgICAgICAgICAgICBkaWdpdHM6IDAsXHJcbiAgICAgICAgICAgICAgICBhbGxvd01pbnVzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGF1dG9Hcm91cDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJpZ2h0QWxpZ246IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdW5tYXNrQXNOdW1iZXI6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJ2h0bWw6bm90KC5pZSkgLmpzLW1hc2snKS5pbnB1dG1hc2soKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFJhbmdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLXJhbmdlJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBzbGlkZXIgPSAkKHRoaXMpLmZpbmQoJy5qcy1yYW5nZV9fdGFyZ2V0JylbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgJGlucHV0cyA9ICQodGhpcykuZmluZCgnaW5wdXQnKSxcclxuICAgICAgICAgICAgICAgICAgICBmcm9tID0gJGlucHV0cy5maXJzdCgpWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvID0gJGlucHV0cy5sYXN0KClbMF07XHJcbiAgICAgICAgICAgIGlmIChzbGlkZXIgJiYgZnJvbSAmJiB0bykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1pblYgPSBwYXJzZUludChmcm9tLnZhbHVlKSB8fCAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhWID0gcGFyc2VJbnQodG8udmFsdWUpIHx8IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWluID0gcGFyc2VJbnQoZnJvbS5kYXRhc2V0Lm1pbikgfHwgMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4ID0gcGFyc2VJbnQodG8uZGF0YXNldC5tYXgpIHx8IDA7XHJcbiAgICAgICAgICAgICAgICBub1VpU2xpZGVyLmNyZWF0ZShzbGlkZXIsIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydDogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5WLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhWXHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBjb25uZWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA6IDEwLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdtaW4nOiBtaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdtYXgnOiBtYXhcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHZhciBzbmFwVmFsdWVzID0gW2Zyb20sIHRvXTtcclxuICAgICAgICAgICAgICAgIHNsaWRlci5ub1VpU2xpZGVyLm9uKCd1cGRhdGUnLCBmdW5jdGlvbiAodmFsdWVzLCBoYW5kbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzbmFwVmFsdWVzW2hhbmRsZV0udmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlc1toYW5kbGVdKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZnJvbS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVyLm5vVWlTbGlkZXIuc2V0KFt0aGlzLnZhbHVlLCBudWxsXSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGZyb20uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXIubm9VaVNsaWRlci5zZXQoW3RoaXMudmFsdWUsIG51bGxdKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdG8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5ub1VpU2xpZGVyLnNldChbbnVsbCwgdGhpcy52YWx1ZV0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0by5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5ub1VpU2xpZGVyLnNldChbbnVsbCwgdGhpcy52YWx1ZV0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRGaWx0ZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXNNb2JpbGUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcsXHJcbiAgICAgICAgICAgICAgICAkc2Nyb2xsYmFyID0gJCgnLmpzLWZpbHRlcl9fc2Nyb2xsYmFyJyksXHJcbiAgICAgICAgICAgICAgICAkbW9iaWxlVG9nZ2xlciA9ICQoJy5qcy1maWx0ZXJfX21vYmlsZS10b2dnbGVyJyksXHJcbiAgICAgICAgICAgICAgICAkd3JhcHBlciA9ICQoJy5qcy1maWx0ZXInKTtcclxuXHJcbiAgICAgICAgdmFyIGluaXRTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY3JvbGxiYXIuc2Nyb2xsYmFyKCk7XHJcbiAgICAgICAgICAgICRzY3JvbGxiYXIuY3NzKHsnaGVpZ2h0JzogJCh3aW5kb3cpLm91dGVySGVpZ2h0KCkgLSAkKCcuaGVhZGVyJykub3V0ZXJIZWlnaHQoKX0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGRlc3Ryb3lTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY3JvbGxiYXIuc2Nyb2xsYmFyKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgaW5pdFNjcm9sbGJhcigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1maWx0ZXJfX2NvdW50ZXInKS5zdGlja19pbl9wYXJlbnQoe29mZnNldF90b3A6IDEwMH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkbW9iaWxlVG9nZ2xlci5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR3cmFwcGVyLnRvZ2dsZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLmpzLWZpbHRlci1maWVsZHNldCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRyaWdnZXIgPSAkKHRoaXMpLmZpbmQoJy5qcy1maWx0ZXItZmllbGRzZXRfX3RyaWdnZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAkc2xpZGUgPSAkKHRoaXMpLmZpbmQoJy5qcy1maWx0ZXItZmllbGRzZXRfX3NsaWRlJyk7XHJcbiAgICAgICAgICAgICR0cmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ19jbG9zZWQnKTtcclxuICAgICAgICAgICAgICAgICRzbGlkZS5zbGlkZVRvZ2dsZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWZpbHRlcl9fY291bnRlcicpLnRyaWdnZXIoXCJzdGlja3lfa2l0OnJlY2FsY1wiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIGNoZWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3U2l6ZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5sZztcclxuICAgICAgICAgICAgaWYgKG5ld1NpemUgIT0gaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgIGlzTW9iaWxlID0gbmV3U2l6ZTtcclxuICAgICAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRTY3JvbGxiYXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtZmlsdGVyX19jb3VudGVyJykudHJpZ2dlcihcInN0aWNreV9raXQ6ZGV0YWNoXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkd3JhcHBlci5yZW1vdmVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Ryb3lTY3JvbGxiYXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtZmlsdGVyX19jb3VudGVyJykuc3RpY2tfaW5fcGFyZW50KHtvZmZzZXRfdG9wOiAxMDB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChuZXdTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAkc2Nyb2xsYmFyLmNzcyh7J2hlaWdodCc6ICQod2luZG93KS5vdXRlckhlaWdodCgpIC0gJCgnLmhlYWRlcicpLm91dGVySGVpZ2h0KCl9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2hlY2soKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdENyZWF0ZVByaWNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyICRpdGVtcyA9ICQoJy5qcy1jcmVhdGUtcHJpY2VfX2l0ZW0nKSxcclxuICAgICAgICAgICAgICAgICRwYXJlbnRzID0gJCgnLmpzLWNyZWF0ZS1wcmljZV9fcGFyZW50JyksXHJcbiAgICAgICAgICAgICAgICAkY291bnRlciA9ICQoJy5qcy1jcmVhdGUtcHJpY2VfX2NvdW50ZXInKSxcclxuICAgICAgICAgICAgICAgICRhbGwgPSAkKCcuanMtY3JlYXRlLXByaWNlX19hbGwnKSxcclxuICAgICAgICAgICAgICAgICRjbGVhciA9ICQoJy5qcy1jcmVhdGUtcHJpY2VfX2NsZWFyJyksXHJcbiAgICAgICAgICAgICAgICBkZWNsMSA9IFsn0JLRi9Cx0YDQsNC90LA6ICcsICfQktGL0LHRgNCw0L3QvjogJywgJ9CS0YvQsdGA0LDQvdC+OiAnXSxcclxuICAgICAgICAgICAgICAgIGRlY2wyID0gWycg0LrQsNGCZdCz0L7RgNC40Y8nLCAnINC60LDRgtC10LPQvtGA0LjQuCcsICcg0LrQsNGC0LXQs9C+0YDQuNC5J10sXHJcbiAgICAgICAgICAgICAgICBpc01vYmlsZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5tZDtcclxuICAgICAgICBpZiAoJGl0ZW1zLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIGNvdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdG90YWwgPSAkaXRlbXMuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aDtcclxuICAgICAgICAgICAgJGNvdW50ZXIudGV4dChhcHAuZ2V0TnVtRW5kaW5nKHRvdGFsLCBkZWNsMSkgKyB0b3RhbCArIGFwcC5nZXROdW1FbmRpbmcodG90YWwsIGRlY2wyKSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb3VudCgpO1xyXG4gICAgICAgICRpdGVtcy5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHdyYXBwZXIgPSAkKHRoaXMpLnBhcmVudHMoJy5qcy1jcmVhdGUtcHJpY2VfX3dyYXBwZXInKTtcclxuICAgICAgICAgICAgaWYgKCR3cmFwcGVyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGl0ZW1zID0gJHdyYXBwZXIuZmluZCgnLmpzLWNyZWF0ZS1wcmljZV9faXRlbScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcGFyZW50ID0gJHdyYXBwZXIuZmluZCgnLmpzLWNyZWF0ZS1wcmljZV9fcGFyZW50Jyk7XHJcbiAgICAgICAgICAgICAgICAkcGFyZW50LnByb3AoJ2NoZWNrZWQnLCAkaXRlbXMuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aCAhPT0gMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY291bnQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkcGFyZW50cy5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJGNoaWxkcyA9ICQodGhpcykucGFyZW50cygnLmpzLWNyZWF0ZS1wcmljZV9fd3JhcHBlcicpLmZpbmQoJy5qcy1jcmVhdGUtcHJpY2VfX2l0ZW0nKTtcclxuICAgICAgICAgICAgJGNoaWxkcy5wcm9wKCdjaGVja2VkJywgJCh0aGlzKS5wcm9wKCdjaGVja2VkJykpO1xyXG4gICAgICAgICAgICBjb3VudCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRhbGwub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkaXRlbXMucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAkcGFyZW50cy5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvdW50KCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAkY2xlYXIub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkaXRlbXMucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgJHBhcmVudHMucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgY291bnQoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC8vIGZpeCBoZWFkZXJcclxuICAgICAgICB2YXIgJGhlYWQgPSAkKCcuY2F0YWxvZy1jcmVhdGUtaGVhZC5fZm9vdCcpO1xyXG4gICAgICAgIHZhciBicmVha3BvaW50LCB3SGVpZ2h0O1xyXG4gICAgICAgIGZpeEluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGJyZWFrcG9pbnQgPSAkaGVhZC5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgICAgIHdIZWlnaHQgPSAkKHdpbmRvdykub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgICAgICAgZml4SGVhZCgpO1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZpeEhlYWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaXhIZWFkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgd0hlaWdodCA8IGJyZWFrcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICRoZWFkLmFkZENsYXNzKCdfZml4ZWQnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRoZWFkLnJlbW92ZUNsYXNzKCdfZml4ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgZml4SW5pdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1NpemUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubGc7XHJcbiAgICAgICAgICAgIGlmIChuZXdTaXplICE9IGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpc01vYmlsZSA9IG5ld1NpemU7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaXhJbml0KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vZmYoJ3Njcm9sbCcsIGZpeEhlYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICRoZWFkLnJlbW92ZUNsYXNzKCdfZml4ZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtICQgJHdyYXBwZXJcclxuICAgICAqL1xyXG4gICAgaW5pdFNoaXBwaW5nQ2FsYzogZnVuY3Rpb24gKCR3cmFwcGVyKSB7XHJcbiAgICAgICAgdmFyICRzbGlkZXIgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2Nhci1zbGlkZXInKSxcclxuICAgICAgICAgICAgICAgICRyYWRpbyA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fY2FyLXJhZGlvJyk7XHJcbiAgICAgICAgaWYgKCRzbGlkZXIubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICRzbGlkZXIuc2xpY2soe1xyXG4gICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGZhZGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRyYWRpby5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAkKHRoaXMpLnBhcmVudHMoJy5qcy1zaGlwcGluZ19fY2FyLWxhYmVsJykuaW5kZXgoKTtcclxuICAgICAgICAgICAgICAgICRzbGlkZXIuc2xpY2soJ3NsaWNrR29UbycsIGluZGV4KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyICRkYXRlaW5wdXRXcmFwcGVyID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlLWlucHV0JyksXHJcbiAgICAgICAgICAgICAgICAkZGF0ZWlucHV0ID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlLWlucHV0X19pbnB1dCcpLFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZWREYXlzID0gWzAsIDZdO1xyXG4gICAgICAgICRkYXRlaW5wdXQuZGF0ZXBpY2tlcih7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAndG9wIHJpZ2h0JyxcclxuICAgICAgICAgICAgb2Zmc2V0OiA0MCxcclxuICAgICAgICAgICAgbmF2VGl0bGVzOiB7XHJcbiAgICAgICAgICAgICAgICBkYXlzOiAnTU0nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1pbkRhdGU6IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgODY0MDAgKiAxMDAwICogMiksXHJcbiAgICAgICAgICAgIG9uUmVuZGVyQ2VsbDogZnVuY3Rpb24gKGRhdGUsIGNlbGxUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT0gJ2RheScpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF5ID0gZGF0ZS5nZXREYXkoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGlzYWJsZWQgPSBkaXNhYmxlZERheXMuaW5kZXhPZihkYXkpICE9IC0xO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogaXNEaXNhYmxlZFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uIChmb3JtYXR0ZWREYXRlLCBkYXRlLCBpbnN0KSB7XHJcbiAgICAgICAgICAgICAgICBpbnN0LmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICRkYXRlaW5wdXRXcmFwcGVyLnJlbW92ZUNsYXNzKCdfZW1wdHknKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBkYXRlcGlja2VyID0gJGRhdGVpbnB1dC5kYXRlcGlja2VyKCkuZGF0YSgnZGF0ZXBpY2tlcicpO1xyXG4gICAgICAgICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZXBpY2tlci10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkYXRlcGlja2VyLnNob3coKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gbWFwXHJcbiAgICAgICAgdmFyIG1hcCwgJHJvdXRlQWRkcmVzcyA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fcm91dGUtYWRkcmVzcycpLFxyXG4gICAgICAgICAgICAgICAgJHJvdXRlRGlzdGFuY2UgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3JvdXRlLWRpc3RhbmNlJyk7XHJcbiAgICAgICAgdmFyIGluaXRNYXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBiYWxsb29uTGF5b3V0ID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxyXG4gICAgICAgICAgICAgICAgICAgIFwiPGRpdj5cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWlsZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5zdXBlcmNsYXNzLmJ1aWxkLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHZhciBtdWx0aVJvdXRlID0gbmV3IHltYXBzLm11bHRpUm91dGVyLk11bHRpUm91dGUoe1xyXG4gICAgICAgICAgICAgICAgLy8g0J7Qv9C40YHQsNC90LjQtSDQvtC/0L7RgNC90YvRhSDRgtC+0YfQtdC6INC80YPQu9GM0YLQuNC80LDRgNGI0YDRg9GC0LAuXHJcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VQb2ludHM6IFtcclxuICAgICAgICAgICAgICAgICAgICBhcHBDb25maWcuc2hpcHBpbmcuZnJvbS5nZW8sXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwQ29uZmlnLnNoaXBwaW5nLnRvLmdlbyxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzOiAzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGJvdW5kc0F1dG9BcHBseTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHdheVBvaW50U3RhcnRJY29uQ29udGVudExheW91dDogeW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBDb25maWcuc2hpcHBpbmcuZnJvbS50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICB3YXlQb2ludEZpbmlzaERyYWdnYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGJhbGxvb25MYXlvdXQ6IGJhbGxvb25MYXlvdXRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG11bHRpUm91dGUubW9kZWwuZXZlbnRzLmFkZCgncmVxdWVzdHN1Y2Nlc3MnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZXREaXN0YW5jZShtdWx0aVJvdXRlLmdldEFjdGl2ZVJvdXRlKCkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvaW50ID0gbXVsdGlSb3V0ZS5nZXRXYXlQb2ludHMoKS5nZXQoMSk7XHJcbiAgICAgICAgICAgICAgICB5bWFwcy5nZW9jb2RlKHBvaW50Lmdlb21ldHJ5LmdldENvb3JkaW5hdGVzKCkpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvID0gcmVzLmdlb09iamVjdHMuZ2V0KDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhZGRyZXNzID0gby5nZXRBZGRyZXNzTGluZSgpLnJlcGxhY2UoJ9Cd0LjQttC10LPQvtGA0L7QtNGB0LrQsNGPINC+0LHQu9Cw0YHRgtGMLCAnLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHJvdXRlQWRkcmVzcy52YWwoYWRkcmVzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlSb3V0ZS5vcHRpb25zLnNldCgnd2F5UG9pbnRGaW5pc2hJY29uQ29udGVudExheW91dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoYWRkcmVzcykpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG11bHRpUm91dGUuZXZlbnRzLmFkZCgnYWN0aXZlcm91dGVjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZXREaXN0YW5jZShtdWx0aVJvdXRlLmdldEFjdGl2ZVJvdXRlKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbWFwID0gbmV3IHltYXBzLk1hcChcInNoaXBwaW5nX21hcFwiLCB7XHJcbiAgICAgICAgICAgICAgICBjZW50ZXI6IGFwcENvbmZpZy5zaGlwcGluZy5mcm9tLmdlbyxcclxuICAgICAgICAgICAgICAgIHpvb206IDEzLFxyXG4gICAgICAgICAgICAgICAgYXV0b0ZpdFRvVmlld3BvcnQ6ICdhbHdheXMnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbHM6IFtdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtYXAuZ2VvT2JqZWN0cy5hZGQobXVsdGlSb3V0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzZXREaXN0YW5jZSA9IGZ1bmN0aW9uIChyb3V0ZSkge1xyXG4gICAgICAgICAgICBpZiAocm91dGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGgucm91bmQocm91dGUucHJvcGVydGllcy5nZXQoJ2Rpc3RhbmNlJykudmFsdWUgLyAxMDAwKTtcclxuICAgICAgICAgICAgICAgICRyb3V0ZURpc3RhbmNlLnZhbChkaXN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiAoeW1hcHMpID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnLy9hcGktbWFwcy55YW5kZXgucnUvMi4xLz9sYW5nPXJ1X1JVJm1vZGU9ZGVidWcnLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwic2NyaXB0XCIsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB5bWFwcy5yZWFkeShpbml0TWFwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeW1hcHMucmVhZHkoaW5pdE1hcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fbWFwLXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ19vcGVuZWQnKTtcclxuICAgICAgICAgICAgJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19tYXAnKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSBhcHBDb25maWcuYnJlYWtwb2ludC5tZCkge1xyXG4gICAgICAgICAgICAgICAgJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19tYXAtdG9nZ2xlcicpLmFkZENsYXNzKCdfb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX21hcCcpLnNsaWRlRG93bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJHdyYXBwZXIuZGF0YSgnaW5pdCcsIHRydWUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0UXVhbnRpdHk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtcXVhbnRpdHktc2hpZnQuanMtcXVhbnRpdHktdXAsIC5qcy1xdWFudGl0eS1zaGlmdC5qcy1xdWFudGl0eS1kb3duJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgJHF1YW50aXR5SW5wdXQgPSAkKHRoaXMpLnNpYmxpbmdzKCcuanMtcXVhbnRpdHknKVswXTtcclxuICAgICAgICAgICAgaWYgKCRxdWFudGl0eUlucHV0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyID0gcGFyc2VJbnQoJHF1YW50aXR5SW5wdXQudmFsdWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlmdFVwID0gJCh0aGlzKS5oYXNDbGFzcygnanMtcXVhbnRpdHktdXAnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGltaXQgPSAkKCRxdWFudGl0eUlucHV0KS5hdHRyKHNoaWZ0VXAgPyAnbWF4JyA6ICdtaW4nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gc2hpZnRVcCA/IGN1ciArIDEgOiBjdXIgLSAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFsaW1pdCB8fCAoc2hpZnRVcCAmJiB2YWwgPD0gcGFyc2VJbnQobGltaXQpKSB8fCAoIXNoaWZ0VXAgJiYgdmFsID49IHBhcnNlSW50KGxpbWl0KSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAkcXVhbnRpdHlJbnB1dC52YWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgICAgICAgICAkKCRxdWFudGl0eUlucHV0KS5jaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0Q2FydDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1jYXJ0LWluZm9fX3JhZGlvJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCcuanMtY2FydC1pbmZvX19oaWRkZW4nKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIHZhciBkZWxpdmVyeSA9ICQodGhpcykuZGF0YSgnZGVsaXZlcnknKTtcclxuICAgICAgICAgICAgdmFyICR0YXJnZXQgPSAkKCcuanMtY2FydC1pbmZvX19oaWRkZW5bZGF0YS1kZWxpdmVyeT1cIicgKyBkZWxpdmVyeSArICdcIl0nKTtcclxuICAgICAgICAgICAgJHRhcmdldC5zaG93KCk7XHJcbiAgICAgICAgICAgICR0YXJnZXQuZmluZCgnLmpzLXNlbGVjdF9hbHdheXMnKS5zdHlsZXIoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gcGlja3VwXHJcbiAgICAgICAgdmFyICR3cmFwcGVyID0gJCgnLmpzLXBpY2t1cCcpLCBtYXAgPSBudWxsO1xyXG4gICAgICAgIGlmICgkd3JhcHBlci5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBwb3B1cHMgaW4gcGlja3VwIHBvcHVwXHJcbiAgICAgICAgdmFyIGNsb3NlUGhvdG9Qb3B1cCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fcG9wdXAnKS5mYWRlT3V0KCkucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fcG9wdXAtb3BlbicpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnLmpzLXBpY2t1cF9fcG9wdXAtb3BlbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ19hY3RpdmUnKSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fcG9wdXAtb3BlbicpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHZhciAkcG9wdXAgPSAkKHRoaXMpLnNpYmxpbmdzKCcuanMtcGlja3VwX19wb3B1cCcpO1xyXG4gICAgICAgICAgICBpZiAoJCgnLmpzLXBpY2t1cF9fcG9wdXAuX2FjdGl2ZScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fcG9wdXAuX2FjdGl2ZScpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJykuZmFkZU91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHBvcHVwLmZhZGVJbigpLmFkZENsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRwb3B1cC5mYWRlSW4oKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJy5qcy1waWNrdXBfX3BvcHVwLWNsb3NlJykub24oJ2NsaWNrJywgY2xvc2VQaG90b1BvcHVwKTtcclxuXHJcbiAgICAgICAgdmFyIGNsb3NlUGlja3VwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBtYXAuYmFsbG9vbi5jbG9zZSgpXHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX21hcF9faXRlbScpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3N1Ym1pdCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGNsb3NlUGhvdG9Qb3B1cCgpO1xyXG4gICAgICAgICAgICAkLmZhbmN5Ym94LmNsb3NlKClcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc3VibWl0XHJcbiAgICAgICAgJCgnLmpzLXBpY2t1cF9fc3VibWl0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHNlbGVjdGVkID0gJCgnLmpzLXBpY2t1cF9fbWFwX19pdGVtLl9hY3RpdmUnKTtcclxuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fdGFyZ2V0X190ZXh0JykudGV4dCgkc2VsZWN0ZWQuZmluZCgnLmpzLXBpY2t1cF9fbWFwX19pdGVtX190ZXh0JykudGV4dCgpKTtcclxuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fdGFyZ2V0X190aW1lJykudGV4dCgkc2VsZWN0ZWQuZmluZCgnLmpzLXBpY2t1cF9fbWFwX19pdGVtX190aW1lJykudGV4dCgpIHx8ICcnKTtcclxuICAgICAgICAgICAgJCgnLmpzLXBpY2t1cF9fdGFyZ2V0X19pbnB1dCcpLnZhbCgkc2VsZWN0ZWQuZGF0YSgnaWQnKSB8fCAwKTtcclxuICAgICAgICAgICAgY2xvc2VQaWNrdXAoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gY2FuY2VsXHJcbiAgICAgICAgJCgnLmpzLXBpY2t1cF9fY2FuY2VsJykub24oJ2NsaWNrJywgY2xvc2VQaWNrdXApO1xyXG5cclxuICAgICAgICAvLyBtYXBcclxuICAgICAgICB2YXIgaW5pdE1hcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbWFwID0gbmV3IHltYXBzLk1hcCgncGlja3VwX21hcCcsIHtcclxuICAgICAgICAgICAgICAgIGNlbnRlcjogWzU2LjMyNjg4NywgNDQuMDA1OTg2XSxcclxuICAgICAgICAgICAgICAgIHpvb206IDExLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbHM6IFtdXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIHN1cHByZXNzTWFwT3BlbkJsb2NrOiB0cnVlLFxyXG4gICAgICAgICAgICB9KSwgcGxhY2VtYXJrcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgdHBsUGxhY2VtYXJrID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxyXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicGxhY2VtYXJrXCI+PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIzOVwiIGhlaWdodD1cIjUwXCI+PGRlZnM+PGZpbHRlciBpZD1cImFcIiB3aWR0aD1cIjE0NS4yJVwiIGhlaWdodD1cIjEzMy4zJVwiIHg9XCItMjIuNiVcIiB5PVwiLTExLjklXCIgZmlsdGVyVW5pdHM9XCJvYmplY3RCb3VuZGluZ0JveFwiPjxmZU9mZnNldCBkeT1cIjJcIiBpbj1cIlNvdXJjZUFscGhhXCIgcmVzdWx0PVwic2hhZG93T2Zmc2V0T3V0ZXIxXCIvPjxmZUdhdXNzaWFuQmx1ciBpbj1cInNoYWRvd09mZnNldE91dGVyMVwiIHJlc3VsdD1cInNoYWRvd0JsdXJPdXRlcjFcIiBzdGREZXZpYXRpb249XCIyXCIvPjxmZUNvbG9yTWF0cml4IGluPVwic2hhZG93Qmx1ck91dGVyMVwiIHJlc3VsdD1cInNoYWRvd01hdHJpeE91dGVyMVwiIHZhbHVlcz1cIjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMTUgMFwiLz48ZmVNZXJnZT48ZmVNZXJnZU5vZGUgaW49XCJzaGFkb3dNYXRyaXhPdXRlcjFcIi8+PGZlTWVyZ2VOb2RlIGluPVwiU291cmNlR3JhcGhpY1wiLz48L2ZlTWVyZ2U+PC9maWx0ZXI+PC9kZWZzPjxnIGZpbGw9XCJub25lXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGZpbHRlcj1cInVybCgjYSlcIiB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoNCAyKVwiPjxwYXRoIGZpbGw9XCIjMjA1N0FDXCIgZD1cIk0xNS4xNzUgNDJDMjUuMjkyIDI5LjgwNSAzMC4zNSAyMC44OTcgMzAuMzUgMTUuMjczIDMwLjM1IDYuODM4IDIzLjU1NiAwIDE1LjE3NSAwIDYuNzk1IDAgMCA2LjgzOCAwIDE1LjI3MyAwIDIwLjg5NyA1LjA1OCAyOS44MDUgMTUuMTc1IDQyelwiLz48cGF0aCBmaWxsPVwiI0ZGRlwiIGQ9XCJNMjMuODQ2IDE5LjE4M0gxOS43OEwxNS4zMDQgNy4yaDQuMDY3bDQuNDc1IDExLjk4M3ptLTQuODUgMGgtNC4wNjhMMTEuNCA5LjU5N2g0LjA2N2wzLjUyOCA5LjU4NnptLTQuOTMzLjAxN2gtNi45MWwzLjM5OC05LjUyIDMuNTEyIDkuNTJ6bS0zLjUxMi03LjQ5Yy4yNzIuNzA2LjgzMSAyLjMzOSAxLjM0MSAzLjgyOGwuMDA2LjAxOGMuNDM4IDEuMjc3LjgzOCAyLjQ0NS45ODkgMi44MjhoLTQuNTRjLjEyMy0uMzMuNDE0LTEuMjQ3Ljc1My0yLjMxM2wuMDAyLS4wMDVjLjUxMy0xLjYxMiAxLjEzNS0zLjU2NSAxLjQ1LTQuMzU2elwiLz48L2c+PC9zdmc+PC9kaXY+J1xyXG4gICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgdHBsQmFsbG9vbiA9IHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicGlja3VwLWJhbGxvb25cIj57eyBwcm9wZXJ0aWVzLnRleHQgfX08c3BhbiBjbGFzcz1cImFycm93XCI+PC9zcGFuPjwvZGl2PicsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiDQodGC0YDQvtC40YIg0Y3QutC30LXQvNC/0LvRj9GAINC80LDQutC10YLQsCDQvdCwINC+0YHQvdC+0LLQtSDRiNCw0LHQu9C+0L3QsCDQuCDQtNC+0LHQsNCy0LvRj9C10YIg0LXQs9C+INCyINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSBIVE1MLdGN0LvQtdC80LXQvdGCLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBzZWUgaHR0cHM6Ly9hcGkueWFuZGV4LnJ1L21hcHMvZG9jL2pzYXBpLzIuMS9yZWYvcmVmZXJlbmNlL2xheW91dC50ZW1wbGF0ZUJhc2VkLkJhc2UueG1sI2J1aWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQG5hbWUgYnVpbGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLnN1cGVyY2xhc3MuYnVpbGQuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGVsZW1lbnQgPSAkKCcucGlja3VwLWJhbGxvb24nLCB0aGlzLmdldFBhcmVudEVsZW1lbnQoKSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlFbGVtZW50T2Zmc2V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICog0JjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPINC00LvRjyDQsNCy0YLQvtC/0L7Qt9C40YbQuNC+0L3QuNGA0L7QstCw0L3QuNGPIChiYWxsb29uQXV0b1BhbikuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHNlZSBodHRwczovL2FwaS55YW5kZXgucnUvbWFwcy9kb2MvanNhcGkvMi4xL3JlZi9yZWZlcmVuY2UvSUxheW91dC54bWwjZ2V0Q2xpZW50Qm91bmRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQG5hbWUgZ2V0Q2xpZW50Qm91bmRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQHJldHVybnMge051bWJlcltdW119INCa0L7QvtGA0LTQuNC90LDRgtGLINC70LXQstC+0LPQviDQstC10YDRhdC90LXQs9C+INC4INC/0YDQsNCy0L7Qs9C+INC90LjQttC90LXQs9C+INGD0LPQu9C+0LIg0YjQsNCx0LvQvtC90LAg0L7RgtC90L7RgdC40YLQtdC70YzQvdC+INGC0L7Rh9C60Lgg0L/RgNC40LLRj9C30LrQuC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRTaGFwZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2lzRWxlbWVudCh0aGlzLl8kZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cGxCYWxsb29uLnN1cGVyY2xhc3MuZ2V0U2hhcGUuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gdGhpcy5fJGVsZW1lbnQucG9zaXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgeW1hcHMuc2hhcGUuUmVjdGFuZ2xlKG5ldyB5bWFwcy5nZW9tZXRyeS5waXhlbC5SZWN0YW5nbGUoW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3Bvc2l0aW9uLmxlZnQsIHBvc2l0aW9uLnRvcF0sIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi5sZWZ0ICsgdGhpcy5fJGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24udG9wICsgdGhpcy5fJGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0ICsgdGhpcy5fJGVsZW1lbnQuZmluZCgnLmFycm93JylbMF0ub2Zmc2V0SGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiDQn9GA0L7QstC10YDRj9C10Lwg0L3QsNC70LjRh9C40LUg0Y3Qu9C10LzQtdC90YLQsCAo0LIg0JjQlSDQuCDQntC/0LXRgNC1INC10LPQviDQtdGJ0LUg0LzQvtC20LXRgiDQvdC1INCx0YvRgtGMKS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEBuYW1lIF9pc0VsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gW2VsZW1lbnRdINCt0LvQtdC80LXQvdGCLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufSDQpNC70LDQsyDQvdCw0LvQuNGH0LjRjy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaXNFbGVtZW50OiBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudCAmJiBlbGVtZW50WzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCcuanMtcGlja3VwX19tYXBfX2l0ZW0nKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGdlbyA9ICQodGhpcykuZGF0YSgnZ2VvJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSAkKHRoaXMpLmZpbmQoJy5qcy1waWNrdXBfX21hcF9faXRlbV9fdGV4dCcpLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChnZW8pIHtcclxuICAgICAgICAgICAgICAgICAgICBnZW8gPSBnZW8uc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgICAgICAgICBnZW9bMF0gPSBwYXJzZUZsb2F0KGdlb1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2VvWzFdID0gcGFyc2VGbG9hdChnZW9bMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwbGFjZW1hcmsgPSBuZXcgeW1hcHMuUGxhY2VtYXJrKGdlbyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0IHx8ICfRgdC60LvQsNC0J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uTGF5b3V0OiB0cGxQbGFjZW1hcmssXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbkltYWdlU2l6ZTogWzQwLCA1MF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlkZUljb25PbkJhbGxvb25PcGVuOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWxsb29uTGF5b3V0OiB0cGxCYWxsb29uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbGxvb25DbG9zZUJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFuZTogJ2JhbGxvb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbGxvb25QYW5lbE1heE1hcEFyZWE6IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5nZW9PYmplY3RzLmFkZChwbGFjZW1hcmspO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWFya3MucHVzaChwbGFjZW1hcmspO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5zZXRCb3VuZHMobWFwLmdlb09iamVjdHMuZ2V0Qm91bmRzKCksIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tab29tUmFuZ2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHpvb21NYXJnaW46IDUwXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBjbGlja1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtYXJrc1skKHRoaXMpLmluZGV4KCldLmJhbGxvb24ub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX21hcF9faXRlbScpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1waWNrdXBfX3N1Ym1pdCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHdyYXBwZXIuZGF0YSgnaW5pdCcsIHRydWUpO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBpbml0IG1hcCBvbiBmYi5vcGVuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2FmdGVyU2hvdy5mYicsIGZ1bmN0aW9uIChlLCBpbnN0YW5jZSwgc2xpZGUpIHtcclxuICAgICAgICAgICAgdmFyICRwaWNrdXAgPSBzbGlkZS4kc2xpZGUuZmluZCgnLmpzLXBpY2t1cCcpO1xyXG4gICAgICAgICAgICBpZiAoJHBpY2t1cC5sZW5ndGggJiYgISRwaWNrdXAuZGF0YSgnaW5pdCcpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9hcGktbWFwcy55YW5kZXgucnUvMi4xLz9sYW5nPXJ1X1JVJm1vZGU9ZGVidWcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGluaXRNYXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0YPQvdC60YbQuNGPINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINC+0LrQvtC90YfQsNC90LjQtSDQtNC70Y8g0LzQvdC+0LbQtdGB0YLQstC10L3QvdC+0LPQviDRh9C40YHQu9CwINGB0LvQvtCy0LAg0L3QsCDQvtGB0L3QvtCy0LDQvdC40Lgg0YfQuNGB0LvQsCDQuCDQvNCw0YHRgdC40LLQsCDQvtC60L7QvdGH0LDQvdC40LlcclxuICAgICAqIHBhcmFtICBpTnVtYmVyIEludGVnZXIg0KfQuNGB0LvQviDQvdCwINC+0YHQvdC+0LLQtSDQutC+0YLQvtGA0L7Qs9C+INC90YPQttC90L4g0YHRhNC+0YDQvNC40YDQvtCy0LDRgtGMINC+0LrQvtC90YfQsNC90LjQtVxyXG4gICAgICogcGFyYW0gIGFFbmRpbmdzIEFycmF5INCc0LDRgdGB0LjQsiDRgdC70L7QsiDQuNC70Lgg0L7QutC+0L3Rh9Cw0L3QuNC5INC00LvRjyDRh9C40YHQtdC7ICgxLCA0LCA1KSxcclxuICAgICAqICAgICAgICAg0L3QsNC/0YDQuNC80LXRgCBbJ9GP0LHQu9C+0LrQvicsICfRj9Cx0LvQvtC60LAnLCAn0Y/QsdC70L7QuiddXHJcbiAgICAgKiByZXR1cm4gU3RyaW5nXHJcbiAgICAgKiBcclxuICAgICAqIGh0dHBzOi8vaGFicmFoYWJyLnJ1L3Bvc3QvMTA1NDI4L1xyXG4gICAgICovXHJcbiAgICBnZXROdW1FbmRpbmc6IGZ1bmN0aW9uIChpTnVtYmVyLCBhRW5kaW5ncykge1xyXG4gICAgICAgIHZhciBzRW5kaW5nLCBpO1xyXG4gICAgICAgIGlOdW1iZXIgPSBpTnVtYmVyICUgMTAwO1xyXG4gICAgICAgIGlmIChpTnVtYmVyID49IDExICYmIGlOdW1iZXIgPD0gMTkpIHtcclxuICAgICAgICAgICAgc0VuZGluZyA9IGFFbmRpbmdzWzJdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGkgPSBpTnVtYmVyICUgMTA7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoaSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAoMSk6XHJcbiAgICAgICAgICAgICAgICAgICAgc0VuZGluZyA9IGFFbmRpbmdzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAoMik6XHJcbiAgICAgICAgICAgICAgICBjYXNlICgzKTpcclxuICAgICAgICAgICAgICAgIGNhc2UgKDQpOlxyXG4gICAgICAgICAgICAgICAgICAgIHNFbmRpbmcgPSBhRW5kaW5nc1sxXTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgc0VuZGluZyA9IGFFbmRpbmdzWzJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzRW5kaW5nO1xyXG4gICAgfVxyXG5cclxufSJdLCJmaWxlIjoiY29tbW9uLmpzIn0=
