app.shipping = {

    mapCenter: appConfig.shipping.mapCenter || [56.326887, 44.005986],
    mapZoom: appConfig.shipping.mapZoom || 11,
    $wrapper: null,
    $addressInput: null,
    $distanceInput: null,
    $distanceText: null,
    $summaryDiv: null,
    $resetBtn: null,
    mapContainerID: null,
    map: null,

    /**
     * 
     * @param $ $wrapper
     */
    init: function ($wrapper) {
        this.$wrapper = $wrapper;
        this.mapContainerID = $wrapper.find('.js-shipping__map').attr('id');
        this.$addressInput = $wrapper.find('.js-shipping__route-address');
        this.$distanceInput = $wrapper.find('.js-shipping__route-distance');
        this.$distanceText = $wrapper.find('.js-shipping__route-distance-text');
        this.$summaryDiv = $wrapper.find('.js-shipping__summary');
        this.$resetBtn = $wrapper.find('.js-shipping__reset');
        this.initSlider();
        this.initDatepicker();
        if (typeof (ymaps) === 'undefined') {
            $.ajax({
                url: '//api-maps.yandex.ru/2.1/?lang=ru_RU&mode=debug',
                dataType: "script",
                cache: true,
                success: function () {
                    ymaps.ready(app.shipping.initMap);
                }
            });
        } else {
            ymaps.ready(app.shipping.initMap);
        }
        app.shipping.$resetBtn.on('click', this.clearRoute);

        $wrapper.data('init', true);
    },

    initSlider: function () {
        var $slider = this.$wrapper.find('.js-shipping__car-slider'),
                $radio = this.$wrapper.find('.js-shipping__car-radio');
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
    },

    initDatepicker: function () {

        var $dateinput = this.$wrapper.find('.js-shipping__date-input'),
//                $dateinput = this.$wrapper.find('.js-shipping__date-input__input'),
//                $dateinputWrapper = this.$wrapper.find('.js-shipping__date-input'),
                disabledDays = appConfig.shipping.disabledDays || [0, 6];
        $dateinput.datepicker({
//            position: 'top right',
            position: 'bottom left',
//            offset: 40,
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
//                $dateinputWrapper.removeClass('_empty');
            }
        });
        var datepicker = $dateinput.datepicker().data('datepicker');
        $('.fancybox-slide').on('scroll', function () {
            datepicker.hide();
        });
//        this.$wrapper.find('.js-shipping__datepicker-toggler').on('click', function () {
//            datepicker.show();
//        });
    },

    initMap: function () {
        // шаблон балуна по клику
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                '<p>{{ text}}</p>' +
                '<a href="#" id="make_route" {% if !link %}class="hidden"{% endif %}><i class="icon-route"></i> Проложить маршрут</a>', {

                    // Переопределяем функцию build, чтобы при создании макета начинать
                    // слушать событие click на кнопке
                    build: function () {
                        // Сначала вызываем метод build родительского класса.
                        BalloonContentLayout.superclass.build.call(this);
                        // А затем выполняем дополнительные действия.
                        $('#make_route').bind('click', {
                            coords: this._data.coords,
                            text: this._data.text
                        }, this.makeRoute);
                    },

                    // Аналогично переопределяем функцию clear, чтобы снять
                    // прослушивание клика при удалении макета с карты.
                    clear: function () {
                        // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                        // а потом вызываем метод clear родительского класса.
                        $('#make_route').unbind('click', this.makeRoute);
                        BalloonContentLayout.superclass.clear.call(this);
                    },

                    makeRoute: function (e) {
                        app.shipping.makeRoute(e.data.coords, e.data.text);
                        return false;
                    }
                });
        var map = new ymaps.Map(app.shipping.mapContainerID, {
            center: app.shipping.mapCenter,
            zoom: app.shipping.mapZoom,
            autoFitToViewport: 'always',
            controls: []
        }, {
            suppressMapOpenBlock: true,
            balloonMaxWidth: 200,
            balloonContentLayout: BalloonContentLayout,
            balloonPanelMaxMapArea: 0
        });
        map.controls.add('zoomControl', {
            size: 'small'
        });

        //init suggestions
        app.shipping.initSuggest();

        //enable input
        app.shipping.$addressInput.prop('disabled', false);

        // Обработка события, возникающего при щелчке
        // левой кнопкой мыши в любой точке карты.
        map.events.add('click', function (e) {
            if (!map.balloon.isOpen()) {
                var coords = e.get('coords');
                map.balloon.open(coords, {
                    text: 'Загружаем данные...',
                    coords: coords,
                    link: false
                });
                ymaps.geocode(coords).then(
                        function (res) {
                            var o = res.geoObjects.get(0);
                            text = o.getAddressLine().replace('Нижегородская область, ', '');
                            setTimeout(function () {
                                map.balloon.setData({
                                    text: text,
                                    coords: coords,
                                    link: true
                                });
                            }, 300);
                        });
            } else {
                map.balloon.close();
            }
        });
        app.shipping.map = map;
    },

    makeRoute: function (coord, text) {
        app.shipping.map.geoObjects.removeAll();
        var balloonLayout = ymaps.templateLayoutFactory.createClass(
                "<div>", {
                    build: function () {
                        this.constructor.superclass.build.call(this);
                    }
                }
        );
        var multiRoute = new ymaps.multiRouter.MultiRoute({
            // Описание опорных точек мультимаршрута
            referencePoints: [
                appConfig.shipping.from.geo,
                coord,
            ],
            params: {
                results: 1
            }
        }, {
            boundsAutoApply: true,
            wayPointStartIconContentLayout: ymaps.templateLayoutFactory.createClass(
                    appConfig.shipping.from.text
                    ),
//            wayPointFinishIconContentLayout: ymaps.templateLayoutFactory.createClass(text),
//            wayPointFinishDraggable: true,
            balloonLayout: balloonLayout
        });
        multiRoute.model.events.add('requestsuccess', function () {
            app.shipping.map.balloon.close();
            var route = multiRoute.getActiveRoute();
            var distance = Math.round(route.properties.get('distance').value / 1000);
            app.shipping.writeRouteInfo(distance, text);
        });
        multiRoute.events.add('requestfail', function () {
            app.shipping.errorMsg('Не удалось проложить маршрут');
        });
        app.shipping.map.geoObjects.add(multiRoute);
    },

    writeRouteInfo: function (distance, address) {
        this.$addressInput.val(address);

        // SuggestView has not method for close panel, remove class in initSuggest
        this.$addressInput.siblings('ymaps').addClass('hidden');

        this.$distanceInput.val(distance);
        this.$distanceText.text(distance);
        this.$summaryDiv.removeClass('_hidden');
        this.$resetBtn.show();
    },

    clearRoute: function () {
        if (app.shipping.map) {
            app.shipping.map.geoObjects.removeAll();
            app.shipping.map.balloon.close();
            app.shipping.$addressInput.val('');
            app.shipping.$distanceInput.val('');
            app.shipping.$summaryDiv.addClass('_hidden');
            app.shipping.$resetBtn.hide();
        }
    },

    errorMsg: function (msg) {
        alert(msg);
    },

    initSuggest: function () {
        this.$addressInput.on('focus', function () {
            $(this).siblings('ymaps').removeClass('hidden');
        });
        this.$addressInput.on('keydown', function (event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        });
        var suggestView = new ymaps.SuggestView(this.$addressInput.attr('id'), {
            offset: [-1, 3]
        });

        suggestView.events.add('select', function (e) {
            var item = e.get('item');
            ymaps.geocode(item.value).then(
                    function (res) {
                        var o = res.geoObjects.get(0);
                        app.shipping.makeRoute(o.geometry._coordinates, item.value);
                    });
        });

    },

}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzaGlwcGluZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuc2hpcHBpbmcgPSB7XHJcblxyXG4gICAgbWFwQ2VudGVyOiBhcHBDb25maWcuc2hpcHBpbmcubWFwQ2VudGVyIHx8IFs1Ni4zMjY4ODcsIDQ0LjAwNTk4Nl0sXHJcbiAgICBtYXBab29tOiBhcHBDb25maWcuc2hpcHBpbmcubWFwWm9vbSB8fCAxMSxcclxuICAgICR3cmFwcGVyOiBudWxsLFxyXG4gICAgJGFkZHJlc3NJbnB1dDogbnVsbCxcclxuICAgICRkaXN0YW5jZUlucHV0OiBudWxsLFxyXG4gICAgJGRpc3RhbmNlVGV4dDogbnVsbCxcclxuICAgICRzdW1tYXJ5RGl2OiBudWxsLFxyXG4gICAgJHJlc2V0QnRuOiBudWxsLFxyXG4gICAgbWFwQ29udGFpbmVySUQ6IG51bGwsXHJcbiAgICBtYXA6IG51bGwsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSAkICR3cmFwcGVyXHJcbiAgICAgKi9cclxuICAgIGluaXQ6IGZ1bmN0aW9uICgkd3JhcHBlcikge1xyXG4gICAgICAgIHRoaXMuJHdyYXBwZXIgPSAkd3JhcHBlcjtcclxuICAgICAgICB0aGlzLm1hcENvbnRhaW5lcklEID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19tYXAnKS5hdHRyKCdpZCcpO1xyXG4gICAgICAgIHRoaXMuJGFkZHJlc3NJbnB1dCA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fcm91dGUtYWRkcmVzcycpO1xyXG4gICAgICAgIHRoaXMuJGRpc3RhbmNlSW5wdXQgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3JvdXRlLWRpc3RhbmNlJyk7XHJcbiAgICAgICAgdGhpcy4kZGlzdGFuY2VUZXh0ID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yb3V0ZS1kaXN0YW5jZS10ZXh0Jyk7XHJcbiAgICAgICAgdGhpcy4kc3VtbWFyeURpdiA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fc3VtbWFyeScpO1xyXG4gICAgICAgIHRoaXMuJHJlc2V0QnRuID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yZXNldCcpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNsaWRlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdERhdGVwaWNrZXIoKTtcclxuICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvL2FwaS1tYXBzLnlhbmRleC5ydS8yLjEvP2xhbmc9cnVfUlUmbW9kZT1kZWJ1ZycsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGFwcC5zaGlwcGluZy5pbml0TWFwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeW1hcHMucmVhZHkoYXBwLnNoaXBwaW5nLmluaXRNYXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhcHAuc2hpcHBpbmcuJHJlc2V0QnRuLm9uKCdjbGljaycsIHRoaXMuY2xlYXJSb3V0ZSk7XHJcblxyXG4gICAgICAgICR3cmFwcGVyLmRhdGEoJ2luaXQnLCB0cnVlKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFNsaWRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkc2xpZGVyID0gdGhpcy4kd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2Nhci1zbGlkZXInKSxcclxuICAgICAgICAgICAgICAgICRyYWRpbyA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19jYXItcmFkaW8nKTtcclxuICAgICAgICBpZiAoJHNsaWRlci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJHNsaWRlci5zbGljayh7XHJcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZmFkZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHJhZGlvLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICQodGhpcykucGFyZW50cygnLmpzLXNoaXBwaW5nX19jYXItbGFiZWwnKS5pbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgJHNsaWRlci5zbGljaygnc2xpY2tHb1RvJywgaW5kZXgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdERhdGVwaWNrZXI6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdmFyICRkYXRlaW5wdXQgPSB0aGlzLiR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZS1pbnB1dCcpLFxyXG4vLyAgICAgICAgICAgICAgICAkZGF0ZWlucHV0ID0gdGhpcy4kd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2RhdGUtaW5wdXRfX2lucHV0JyksXHJcbi8vICAgICAgICAgICAgICAgICRkYXRlaW5wdXRXcmFwcGVyID0gdGhpcy4kd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2RhdGUtaW5wdXQnKSxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVkRGF5cyA9IGFwcENvbmZpZy5zaGlwcGluZy5kaXNhYmxlZERheXMgfHwgWzAsIDZdO1xyXG4gICAgICAgICRkYXRlaW5wdXQuZGF0ZXBpY2tlcih7XHJcbi8vICAgICAgICAgICAgcG9zaXRpb246ICd0b3AgcmlnaHQnLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbSBsZWZ0JyxcclxuLy8gICAgICAgICAgICBvZmZzZXQ6IDQwLFxyXG4gICAgICAgICAgICBuYXZUaXRsZXM6IHtcclxuICAgICAgICAgICAgICAgIGRheXM6ICdNTSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWluRGF0ZTogbmV3IERhdGUobmV3IERhdGUoKS5nZXRUaW1lKCkgKyA4NjQwMCAqIDEwMDAgKiAyKSxcclxuICAgICAgICAgICAgb25SZW5kZXJDZWxsOiBmdW5jdGlvbiAoZGF0ZSwgY2VsbFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PSAnZGF5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXNhYmxlZCA9IGRpc2FibGVkRGF5cy5pbmRleE9mKGRheSkgIT0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IGlzRGlzYWJsZWRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbiAoZm9ybWF0dGVkRGF0ZSwgZGF0ZSwgaW5zdCkge1xyXG4gICAgICAgICAgICAgICAgaW5zdC5oaWRlKCk7XHJcbi8vICAgICAgICAgICAgICAgICRkYXRlaW5wdXRXcmFwcGVyLnJlbW92ZUNsYXNzKCdfZW1wdHknKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBkYXRlcGlja2VyID0gJGRhdGVpbnB1dC5kYXRlcGlja2VyKCkuZGF0YSgnZGF0ZXBpY2tlcicpO1xyXG4gICAgICAgICQoJy5mYW5jeWJveC1zbGlkZScpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRhdGVwaWNrZXIuaGlkZSgpO1xyXG4gICAgICAgIH0pO1xyXG4vLyAgICAgICAgdGhpcy4kd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2RhdGVwaWNrZXItdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICAgICBkYXRlcGlja2VyLnNob3coKTtcclxuLy8gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0TWFwOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8g0YjQsNCx0LvQvtC9INCx0LDQu9GD0L3QsCDQv9C+INC60LvQuNC60YNcclxuICAgICAgICB2YXIgQmFsbG9vbkNvbnRlbnRMYXlvdXQgPSB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoXHJcbiAgICAgICAgICAgICAgICAnPHA+e3sgdGV4dH19PC9wPicgK1xyXG4gICAgICAgICAgICAgICAgJzxhIGhyZWY9XCIjXCIgaWQ9XCJtYWtlX3JvdXRlXCIgeyUgaWYgIWxpbmsgJX1jbGFzcz1cImhpZGRlblwieyUgZW5kaWYgJX0+PGkgY2xhc3M9XCJpY29uLXJvdXRlXCI+PC9pPiDQn9GA0L7Qu9C+0LbQuNGC0Ywg0LzQsNGA0YjRgNGD0YI8L2E+Jywge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDQn9C10YDQtdC+0L/RgNC10LTQtdC70Y/QtdC8INGE0YPQvdC60YbQuNGOIGJ1aWxkLCDRh9GC0L7QsdGLINC/0YDQuCDRgdC+0LfQtNCw0L3QuNC4INC80LDQutC10YLQsCDQvdCw0YfQuNC90LDRgtGMXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0YHQu9GD0YjQsNGC0Ywg0YHQvtCx0YvRgtC40LUgY2xpY2sg0L3QsCDQutC90L7Qv9C60LVcclxuICAgICAgICAgICAgICAgICAgICBidWlsZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQodC90LDRh9Cw0LvQsCDQstGL0LfRi9Cy0LDQtdC8INC80LXRgtC+0LQgYnVpbGQg0YDQvtC00LjRgtC10LvRjNGB0LrQvtCz0L4g0LrQu9Cw0YHRgdCwLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBCYWxsb29uQ29udGVudExheW91dC5zdXBlcmNsYXNzLmJ1aWxkLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCQINC30LDRgtC10Lwg0LLRi9C/0L7Qu9C90Y/QtdC8INC00L7Qv9C+0LvQvdC40YLQtdC70YzQvdGL0LUg0LTQtdC50YHRgtCy0LjRjy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI21ha2Vfcm91dGUnKS5iaW5kKCdjbGljaycsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkczogdGhpcy5fZGF0YS5jb29yZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLl9kYXRhLnRleHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcy5tYWtlUm91dGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vINCQ0L3QsNC70L7Qs9C40YfQvdC+INC/0LXRgNC10L7Qv9GA0LXQtNC10LvRj9C10Lwg0YTRg9C90LrRhtC40Y4gY2xlYXIsINGH0YLQvtCx0Ysg0YHQvdGP0YLRjFxyXG4gICAgICAgICAgICAgICAgICAgIC8vINC/0YDQvtGB0LvRg9GI0LjQstCw0L3QuNC1INC60LvQuNC60LAg0L/RgNC4INGD0LTQsNC70LXQvdC40Lgg0LzQsNC60LXRgtCwINGBINC60LDRgNGC0YsuXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0JLRi9C/0L7Qu9C90Y/QtdC8INC00LXQudGB0YLQstC40Y8g0LIg0L7QsdGA0LDRgtC90L7QvCDQv9C+0YDRj9C00LrQtSAtINGB0L3QsNGH0LDQu9CwINGB0L3QuNC80LDQtdC8INGB0LvRg9GI0LDRgtC10LvRjyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0LAg0L/QvtGC0L7QvCDQstGL0LfRi9Cy0LDQtdC8INC80LXRgtC+0LQgY2xlYXIg0YDQvtC00LjRgtC10LvRjNGB0LrQvtCz0L4g0LrQu9Cw0YHRgdCwLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjbWFrZV9yb3V0ZScpLnVuYmluZCgnY2xpY2snLCB0aGlzLm1ha2VSb3V0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhbGxvb25Db250ZW50TGF5b3V0LnN1cGVyY2xhc3MuY2xlYXIuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBtYWtlUm91dGU6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5zaGlwcGluZy5tYWtlUm91dGUoZS5kYXRhLmNvb3JkcywgZS5kYXRhLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIG1hcCA9IG5ldyB5bWFwcy5NYXAoYXBwLnNoaXBwaW5nLm1hcENvbnRhaW5lcklELCB7XHJcbiAgICAgICAgICAgIGNlbnRlcjogYXBwLnNoaXBwaW5nLm1hcENlbnRlcixcclxuICAgICAgICAgICAgem9vbTogYXBwLnNoaXBwaW5nLm1hcFpvb20sXHJcbiAgICAgICAgICAgIGF1dG9GaXRUb1ZpZXdwb3J0OiAnYWx3YXlzJyxcclxuICAgICAgICAgICAgY29udHJvbHM6IFtdXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBzdXBwcmVzc01hcE9wZW5CbG9jazogdHJ1ZSxcclxuICAgICAgICAgICAgYmFsbG9vbk1heFdpZHRoOiAyMDAsXHJcbiAgICAgICAgICAgIGJhbGxvb25Db250ZW50TGF5b3V0OiBCYWxsb29uQ29udGVudExheW91dCxcclxuICAgICAgICAgICAgYmFsbG9vblBhbmVsTWF4TWFwQXJlYTogMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1hcC5jb250cm9scy5hZGQoJ3pvb21Db250cm9sJywge1xyXG4gICAgICAgICAgICBzaXplOiAnc21hbGwnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vaW5pdCBzdWdnZXN0aW9uc1xyXG4gICAgICAgIGFwcC5zaGlwcGluZy5pbml0U3VnZ2VzdCgpO1xyXG5cclxuICAgICAgICAvL2VuYWJsZSBpbnB1dFxyXG4gICAgICAgIGFwcC5zaGlwcGluZy4kYWRkcmVzc0lucHV0LnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG5cclxuICAgICAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0YHQvtCx0YvRgtC40Y8sINCy0L7Qt9C90LjQutCw0Y7RidC10LPQviDQv9GA0Lgg0YnQtdC70YfQutC1XHJcbiAgICAgICAgLy8g0LvQtdCy0L7QuSDQutC90L7Qv9C60L7QuSDQvNGL0YjQuCDQsiDQu9GO0LHQvtC5INGC0L7Rh9C60LUg0LrQsNGA0YLRiy5cclxuICAgICAgICBtYXAuZXZlbnRzLmFkZCgnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBpZiAoIW1hcC5iYWxsb29uLmlzT3BlbigpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29vcmRzID0gZS5nZXQoJ2Nvb3JkcycpO1xyXG4gICAgICAgICAgICAgICAgbWFwLmJhbGxvb24ub3Blbihjb29yZHMsIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAn0JfQsNCz0YDRg9C20LDQtdC8INC00LDQvdC90YvQtS4uLicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29vcmRzOiBjb29yZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgbGluazogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgeW1hcHMuZ2VvY29kZShjb29yZHMpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvID0gcmVzLmdlb09iamVjdHMuZ2V0KDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IG8uZ2V0QWRkcmVzc0xpbmUoKS5yZXBsYWNlKCfQndC40LbQtdCz0L7RgNC+0LTRgdC60LDRjyDQvtCx0LvQsNGB0YLRjCwgJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwLmJhbGxvb24uc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkczogY29vcmRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1hcC5iYWxsb29uLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBhcHAuc2hpcHBpbmcubWFwID0gbWFwO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYWtlUm91dGU6IGZ1bmN0aW9uIChjb29yZCwgdGV4dCkge1xyXG4gICAgICAgIGFwcC5zaGlwcGluZy5tYXAuZ2VvT2JqZWN0cy5yZW1vdmVBbGwoKTtcclxuICAgICAgICB2YXIgYmFsbG9vbkxheW91dCA9IHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyhcclxuICAgICAgICAgICAgICAgIFwiPGRpdj5cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3Iuc3VwZXJjbGFzcy5idWlsZC5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIHZhciBtdWx0aVJvdXRlID0gbmV3IHltYXBzLm11bHRpUm91dGVyLk11bHRpUm91dGUoe1xyXG4gICAgICAgICAgICAvLyDQntC/0LjRgdCw0L3QuNC1INC+0L/QvtGA0L3Ri9GFINGC0L7Rh9C10Log0LzRg9C70YzRgtC40LzQsNGA0YjRgNGD0YLQsFxyXG4gICAgICAgICAgICByZWZlcmVuY2VQb2ludHM6IFtcclxuICAgICAgICAgICAgICAgIGFwcENvbmZpZy5zaGlwcGluZy5mcm9tLmdlbyxcclxuICAgICAgICAgICAgICAgIGNvb3JkLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdHM6IDFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgYm91bmRzQXV0b0FwcGx5OiB0cnVlLFxyXG4gICAgICAgICAgICB3YXlQb2ludFN0YXJ0SWNvbkNvbnRlbnRMYXlvdXQ6IHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyhcclxuICAgICAgICAgICAgICAgICAgICBhcHBDb25maWcuc2hpcHBpbmcuZnJvbS50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuLy8gICAgICAgICAgICB3YXlQb2ludEZpbmlzaEljb25Db250ZW50TGF5b3V0OiB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3ModGV4dCksXHJcbi8vICAgICAgICAgICAgd2F5UG9pbnRGaW5pc2hEcmFnZ2FibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGJhbGxvb25MYXlvdXQ6IGJhbGxvb25MYXlvdXRcclxuICAgICAgICB9KTtcclxuICAgICAgICBtdWx0aVJvdXRlLm1vZGVsLmV2ZW50cy5hZGQoJ3JlcXVlc3RzdWNjZXNzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcubWFwLmJhbGxvb24uY2xvc2UoKTtcclxuICAgICAgICAgICAgdmFyIHJvdXRlID0gbXVsdGlSb3V0ZS5nZXRBY3RpdmVSb3V0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnJvdW5kKHJvdXRlLnByb3BlcnRpZXMuZ2V0KCdkaXN0YW5jZScpLnZhbHVlIC8gMTAwMCk7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy53cml0ZVJvdXRlSW5mbyhkaXN0YW5jZSwgdGV4dCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbXVsdGlSb3V0ZS5ldmVudHMuYWRkKCdyZXF1ZXN0ZmFpbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLmVycm9yTXNnKCfQndC1INGD0LTQsNC70L7RgdGMINC/0YDQvtC70L7QttC40YLRjCDQvNCw0YDRiNGA0YPRgicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFwcC5zaGlwcGluZy5tYXAuZ2VvT2JqZWN0cy5hZGQobXVsdGlSb3V0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHdyaXRlUm91dGVJbmZvOiBmdW5jdGlvbiAoZGlzdGFuY2UsIGFkZHJlc3MpIHtcclxuICAgICAgICB0aGlzLiRhZGRyZXNzSW5wdXQudmFsKGFkZHJlc3MpO1xyXG5cclxuICAgICAgICAvLyBTdWdnZXN0VmlldyBoYXMgbm90IG1ldGhvZCBmb3IgY2xvc2UgcGFuZWwsIHJlbW92ZSBjbGFzcyBpbiBpbml0U3VnZ2VzdFxyXG4gICAgICAgIHRoaXMuJGFkZHJlc3NJbnB1dC5zaWJsaW5ncygneW1hcHMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XHJcblxyXG4gICAgICAgIHRoaXMuJGRpc3RhbmNlSW5wdXQudmFsKGRpc3RhbmNlKTtcclxuICAgICAgICB0aGlzLiRkaXN0YW5jZVRleHQudGV4dChkaXN0YW5jZSk7XHJcbiAgICAgICAgdGhpcy4kc3VtbWFyeURpdi5yZW1vdmVDbGFzcygnX2hpZGRlbicpO1xyXG4gICAgICAgIHRoaXMuJHJlc2V0QnRuLnNob3coKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xlYXJSb3V0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChhcHAuc2hpcHBpbmcubWFwKSB7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy5tYXAuZ2VvT2JqZWN0cy5yZW1vdmVBbGwoKTtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1hcC5iYWxsb29uLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy4kYWRkcmVzc0lucHV0LnZhbCgnJyk7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy4kZGlzdGFuY2VJbnB1dC52YWwoJycpO1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcuJHN1bW1hcnlEaXYuYWRkQ2xhc3MoJ19oaWRkZW4nKTtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLiRyZXNldEJ0bi5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBlcnJvck1zZzogZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgIGFsZXJ0KG1zZyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRTdWdnZXN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy4kYWRkcmVzc0lucHV0Lm9uKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygneW1hcHMnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy4kYWRkcmVzc0lucHV0Lm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIHN1Z2dlc3RWaWV3ID0gbmV3IHltYXBzLlN1Z2dlc3RWaWV3KHRoaXMuJGFkZHJlc3NJbnB1dC5hdHRyKCdpZCcpLCB7XHJcbiAgICAgICAgICAgIG9mZnNldDogWy0xLCAzXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdWdnZXN0Vmlldy5ldmVudHMuYWRkKCdzZWxlY3QnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGUuZ2V0KCdpdGVtJyk7XHJcbiAgICAgICAgICAgIHltYXBzLmdlb2NvZGUoaXRlbS52YWx1ZSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvID0gcmVzLmdlb09iamVjdHMuZ2V0KDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAuc2hpcHBpbmcubWFrZVJvdXRlKG8uZ2VvbWV0cnkuX2Nvb3JkaW5hdGVzLCBpdGVtLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9LFxyXG5cclxufSJdLCJmaWxlIjoic2hpcHBpbmcuanMifQ==
