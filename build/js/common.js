$(document).ready(function () {
    app.initialize();
});

var app = {
    initialized: false,

    initialize: function () {
        this.initSliders(); // must be first!
        this.initMenu();
        this.initFooter();
        this.initCut();
        this.initHover();
        this.initScrollbar();
        this.initCatalog();
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
                $(this).hide(200, function () {
                    $(this).siblings('.js-cut__content').slideDown();
                })
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
                variableWidth: true,
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
        })
    },

    initHover1: function () {
        $('.js-hover').unbind('mouseenter mouseleave');
        if ($(window).outerWidth() >= appConfig.breakpoint.lg) {
            var zoom = appConfig.hoverZoom || 10;
            $('.js-hover').each(function () {
                var $parent, h, w;
                $(this).hover(
                        function () {
                            if ($(this).hasClass('_hover'))
                                return;
                            var offset = $(this).offset();
                            $parent = $(this).parent();
                            h = $(this).outerHeight();
                            w = $(this).outerWidth();
                            $(this).appendTo('body').css({
                                'position': 'absolute',
                                'top': offset.top,
                                'left': offset.left,
                                'width': w,
                                'height': h,
                            }).addClass('_hover');
                        },
                        function () {
                            $(this).removeClass('_hover')
                                    .appendTo($parent)
                                    .removeAttr('style');
                        }
                );
            });
        }
    },
    
    initHover: function () {
        $('.js-hover').unbind('mouseenter mouseleave');
        if ($(window).outerWidth() >= appConfig.breakpoint.lg) {
            var zoom = appConfig.hoverZoom || 10;
            $('.js-hover').each(function () {
                var $parent, h, w;
                $(this).hover(
                        function () {
                            if ($(this).hasClass('_hover'))
                                return;
                            var offset = $(this).offset();
                            $parent = $(this).parent();
                            h = $(this).outerHeight();
                            w = $(this).outerWidth();
                            $(this).appendTo('body').css({
                                'position': 'absolute',
                                'top': offset.top - zoom,
                                'left': offset.left - zoom,
                                'width': w + zoom * 2,
                                'height': h + zoom * 2,
                            }).addClass('_hover');
                        },
                        function () {
                            $(this).removeClass('_hover')
                                    .appendTo($parent)
                                    .removeAttr('style');
                        }
                );
            });
        }
    },

    initScrollbar: function () {
        $('.js-scrollbar').scrollbar();
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
                    initScrollbar();
                } else {
                    $wrapper.removeClass('_active');
                    $slideTrigger.on('click', slideMenu);
                    $secondLink.off('click', showSecond);
                    $secondLink.parent().hover(hoverIcon, unhoverIcon);
                    destroyScrollbar();
                }
            }
        }
        $(window).on('resize', function () {
            checkMenu();
        });
    },

}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgYXBwLmluaXRpYWxpemUoKTtcclxufSk7XHJcblxyXG52YXIgYXBwID0ge1xyXG4gICAgaW5pdGlhbGl6ZWQ6IGZhbHNlLFxyXG5cclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmluaXRTbGlkZXJzKCk7IC8vIG11c3QgYmUgZmlyc3QhXHJcbiAgICAgICAgdGhpcy5pbml0TWVudSgpO1xyXG4gICAgICAgIHRoaXMuaW5pdEZvb3RlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdEN1dCgpO1xyXG4gICAgICAgIHRoaXMuaW5pdEhvdmVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0U2Nyb2xsYmFyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q2F0YWxvZygpO1xyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhcHAuaW5pdEhvdmVyKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0TWVudTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1tZW51LXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgaHJlZiA9ICQodGhpcykuYXR0cignaHJlZicpO1xyXG4gICAgICAgICAgICAkKCcuanMtbWVudS10b2dnbGVyW2hyZWY9XCInICsgaHJlZiArICdcIl0nKS50b2dnbGVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKGhyZWYpLnRvZ2dsZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQoJy5qcy1tZW51Ll9hY3RpdmUnKS5sZW5ndGggPT0gMCA/ICQoJy5qcy1tZW51LW92ZXJsYXknKS5oaWRlKCkgOiAkKCcuanMtbWVudS1vdmVybGF5Jykuc2hvdygpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnLmpzLW1lbnUtb3ZlcmxheScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICQoJy5qcy1tZW51LXRvZ2dsZXIsIC5qcy1tZW51JykucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5oaWRlKClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyICRoZWFkZXIgPSAkKCdoZWFkZXInKTtcclxuICAgICAgICB2YXIgaGVhZGVySGVpZ2h0ID0gJGhlYWRlci5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgIHZhciBxID0gMztcclxuICAgICAgICB2YXIgYWN0aW9uID0gMDtcclxuICAgICAgICB2YXIgcGluSGVhZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJjb21wbGV0ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCQodGhpcykuc2Nyb2xsVG9wKCkgPiBoZWFkZXJIZWlnaHQgKiBxKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhY3Rpb24gPSAxO1xyXG4gICAgICAgICAgICAgICAgJGhlYWRlci5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAkKCdib2R5JykuY3NzKHsncGFkZGluZy10b3AnOiBoZWFkZXJIZWlnaHR9KTtcclxuICAgICAgICAgICAgICAgICRoZWFkZXIuY3NzKHsndG9wJzogLWhlYWRlckhlaWdodH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnX2ZpeGVkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFuaW1hdGUoeyd0b3AnOiAwfSwgMTAwMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09IDIgfHwgISRoZWFkZXIuaGFzQ2xhc3MoJ19maXhlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gMjtcclxuICAgICAgICAgICAgICAgICRoZWFkZXIuYW5pbWF0ZSh7J3RvcCc6IC1oZWFkZXJIZWlnaHR9LCBcImZhc3RcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRoZWFkZXIuY3NzKHsndG9wJzogMH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5jc3MoeydwYWRkaW5nLXRvcCc6IDB9KTtcclxuICAgICAgICAgICAgICAgICAgICAkaGVhZGVyLnJlbW92ZUNsYXNzKCdfZml4ZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSBhcHBDb25maWcuYnJlYWtwb2ludC5sZykge1xyXG4gICAgICAgICAgICB3aW5kb3cub25sb2FkID0gcGluSGVhZGVyKCk7XHJcbiAgICAgICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgcGluSGVhZGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSBhcHBDb25maWcuYnJlYWtwb2ludC5sZykge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVySGVpZ2h0ID0gJGhlYWRlci5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBwaW5IZWFkZXIpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmpzLW1lbnUnKS5yZW1vdmVDbGFzcygnX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmpzLW1lbnUtb3ZlcmxheScpLmhpZGUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQod2luZG93KS5vZmYoJ3Njcm9sbCcsIHBpbkhlYWRlcik7XHJcbiAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuICAgICAgICAgICAgICAgICRoZWFkZXIucmVtb3ZlQ2xhc3MoJ19maXhlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRGb290ZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmaXhNZW51KCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZml4TWVudSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgZml4TWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCQod2luZG93KS5vdXRlcldpZHRoKCkgPj0gYXBwQ29uZmlnLmJyZWFrcG9pbnQubWQgJiYgJCh3aW5kb3cpLm91dGVyV2lkdGgoKSA8IGFwcENvbmZpZy5icmVha3BvaW50LmxnKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuZm9vdGVyX19tZW51LXNlY29uZCcpLmNzcygnbGVmdCcsICQoJy5mb290ZXJfX21lbnUgLm1lbnUgPiBsaTpudGgtY2hpbGQoMyknKS5vZmZzZXQoKS5sZWZ0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJy5mb290ZXJfX21lbnUtc2Vjb25kJykuY3NzKCdsZWZ0JywgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRDdXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtY3V0JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLmpzLWN1dF9fdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuaGlkZSgyMDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuanMtY3V0X19jb250ZW50Jykuc2xpZGVEb3duKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRTbGlkZXJzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLW1haW4tc2xpZGVyJykuc2xpY2soe1xyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiBhcHBDb25maWcuYnJlYWtwb2ludC5tZCAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcuanMtc2xpZGVyJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBzbGlkZXMgPSAkKHRoaXMpLmRhdGEoJ3NsaWRlcycpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNsaWNrKHtcclxuICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiBzbGlkZXMuc20gfHwgMSxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyTW9kZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiBhcHBDb25maWcuYnJlYWtwb2ludC5tZCAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IHNsaWRlcy5tZCB8fCAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IGFwcENvbmZpZy5icmVha3BvaW50LmxnIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogc2xpZGVzLmxnIHx8IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRIb3ZlcjE6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuanMtaG92ZXInKS51bmJpbmQoJ21vdXNlZW50ZXIgbW91c2VsZWF2ZScpO1xyXG4gICAgICAgIGlmICgkKHdpbmRvdykub3V0ZXJXaWR0aCgpID49IGFwcENvbmZpZy5icmVha3BvaW50LmxnKSB7XHJcbiAgICAgICAgICAgIHZhciB6b29tID0gYXBwQ29uZmlnLmhvdmVyWm9vbSB8fCAxMDtcclxuICAgICAgICAgICAgJCgnLmpzLWhvdmVyJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHBhcmVudCwgaCwgdztcclxuICAgICAgICAgICAgICAgICQodGhpcykuaG92ZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdfaG92ZXInKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gJCh0aGlzKS5vZmZzZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkKHRoaXMpLnBhcmVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaCA9ICQodGhpcykub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHcgPSAkKHRoaXMpLm91dGVyV2lkdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXBwZW5kVG8oJ2JvZHknKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3RvcCc6IG9mZnNldC50b3AsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xlZnQnOiBvZmZzZXQubGVmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiB3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiBoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuYWRkQ2xhc3MoJ19ob3ZlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdfaG92ZXInKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJHBhcmVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcclxuICAgIGluaXRIb3ZlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qcy1ob3ZlcicpLnVuYmluZCgnbW91c2VlbnRlciBtb3VzZWxlYXZlJyk7XHJcbiAgICAgICAgaWYgKCQod2luZG93KS5vdXRlcldpZHRoKCkgPj0gYXBwQ29uZmlnLmJyZWFrcG9pbnQubGcpIHtcclxuICAgICAgICAgICAgdmFyIHpvb20gPSBhcHBDb25maWcuaG92ZXJab29tIHx8IDEwO1xyXG4gICAgICAgICAgICAkKCcuanMtaG92ZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkcGFyZW50LCBoLCB3O1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5ob3ZlcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ19ob3ZlcicpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSAkKHRoaXMpLm9mZnNldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHBhcmVudCA9ICQodGhpcykucGFyZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoID0gJCh0aGlzKS5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdyA9ICQodGhpcykub3V0ZXJXaWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hcHBlbmRUbygnYm9keScpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndG9wJzogb2Zmc2V0LnRvcCAtIHpvb20sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xlZnQnOiBvZmZzZXQubGVmdCAtIHpvb20sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogdyArIHpvb20gKiAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoZWlnaHQnOiBoICsgem9vbSAqIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5hZGRDbGFzcygnX2hvdmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ19ob3ZlcicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbygkcGFyZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0U2Nyb2xsYmFyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLmpzLXNjcm9sbGJhcicpLnNjcm9sbGJhcigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0Q2F0YWxvZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpc01vYmlsZSA9ICQod2luZG93KS5vdXRlcldpZHRoKCkgPCBhcHBDb25maWcuYnJlYWtwb2ludC5sZyxcclxuICAgICAgICAgICAgICAgICRzbGlkZSA9ICQoJy5qcy1jbV9fc2xpZGUnKSxcclxuICAgICAgICAgICAgICAgICRzbGlkZVRyaWdnZXIgPSAkKCcuanMtY21fX3NsaWRlX190cmlnZ2VyJyksXHJcbiAgICAgICAgICAgICAgICAkbWVudSA9ICQoJy5qcy1jbV9fbWVudScpLFxyXG4gICAgICAgICAgICAgICAgJHNjcm9sbGJhciA9ICQoJy5qcy1jbV9fc2Nyb2xsYmFyJyksXHJcbiAgICAgICAgICAgICAgICAkbW9iaWxlVG9nZ2xlciA9ICQoJy5qcy1jbV9fbW9iaWxlLXRvZ2dsZXInKSxcclxuICAgICAgICAgICAgICAgICRzZWNvbmRMaW5rID0gJCgnLmpzLWNtX19zZWNvbmQtbGluaycpLFxyXG4gICAgICAgICAgICAgICAgJHNlY29uZENsb3NlID0gJCgnLmpzLWNtX19tZW51LXNlY29uZF9fY2xvc2UnKSxcclxuICAgICAgICAgICAgICAgICR3cmFwcGVyID0gJCgnLmpzLWNtX19tZW51LXdyYXBwZXInKTtcclxuXHJcbiAgICAgICAgdmFyIHNsaWRlTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNsaWRlLnNsaWRlVG9nZ2xlKCk7XHJcbiAgICAgICAgICAgICRtZW51LnRvZ2dsZUNsYXNzKCdfb3BlbmVkJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzaG93U2Vjb25kID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuanMtY21fX21lbnUtc2Vjb25kJykuYWRkQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGhvdmVySWNvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICRpY29uID0gJCh0aGlzKS5maW5kKCcuc3ByaXRlJyk7XHJcbiAgICAgICAgICAgICRpY29uLmFkZENsYXNzKCRpY29uLmRhdGEoJ2hvdmVyJykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHVuaG92ZXJJY29uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJGljb24gPSAkKHRoaXMpLmZpbmQoJy5zcHJpdGUnKTtcclxuICAgICAgICAgICAgJGljb24ucmVtb3ZlQ2xhc3MoJGljb24uZGF0YSgnaG92ZXInKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW5pdFNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjcm9sbGJhci5zY3JvbGxiYXIoKTtcclxuICAgICAgICAgICAgJHNjcm9sbGJhci5jc3MoeydoZWlnaHQnOiAkKHdpbmRvdykub3V0ZXJIZWlnaHQoKSAtICQoJy5oZWFkZXInKS5vdXRlckhlaWdodCgpfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZGVzdHJveVNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjcm9sbGJhci5zY3JvbGxiYXIoJ2Rlc3Ryb3knKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgJHNsaWRlVHJpZ2dlci5vbignY2xpY2snLCBzbGlkZU1lbnUpO1xyXG4gICAgICAgICAgICAkc2Vjb25kTGluay5wYXJlbnQoKS5ob3Zlcihob3Zlckljb24sIHVuaG92ZXJJY29uKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRzZWNvbmRMaW5rLm9uKCdjbGljaycsIHNob3dTZWNvbmQpO1xyXG4gICAgICAgICAgICBpbml0U2Nyb2xsYmFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRtb2JpbGVUb2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHdyYXBwZXIudG9nZ2xlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRzZWNvbmRDbG9zZS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykucGFyZW50cygnLmpzLWNtX19tZW51LXNlY29uZCcpLnJlbW92ZUNsYXNzKCdfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIGNoZWNrTWVudSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1NpemUgPSAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIDwgYXBwQ29uZmlnLmJyZWFrcG9pbnQubGc7XHJcbiAgICAgICAgICAgIGlmIChuZXdTaXplICE9IGlzTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICBpc01vYmlsZSA9IG5ld1NpemU7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2xpZGUuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICRtZW51LmFkZENsYXNzKCdfb3BlbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlVHJpZ2dlci5vZmYoJ2NsaWNrJywgc2xpZGVNZW51KTtcclxuICAgICAgICAgICAgICAgICAgICAkc2Vjb25kTGluay5vbignY2xpY2snLCBzaG93U2Vjb25kKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2Vjb25kTGluay5vZmYoJ21vdXNlZW50ZXIgbW91c2VsZWF2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRTY3JvbGxiYXIoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdyYXBwZXIucmVtb3ZlQ2xhc3MoJ19hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2xpZGVUcmlnZ2VyLm9uKCdjbGljaycsIHNsaWRlTWVudSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNlY29uZExpbmsub2ZmKCdjbGljaycsIHNob3dTZWNvbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWNvbmRMaW5rLnBhcmVudCgpLmhvdmVyKGhvdmVySWNvbiwgdW5ob3Zlckljb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc3Ryb3lTY3JvbGxiYXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2hlY2tNZW51KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxufSJdLCJmaWxlIjoiY29tbW9uLmpzIn0=
