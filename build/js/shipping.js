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
        var $dateinputWrapper = this.$wrapper.find('.js-shipping__date-input'),
                $dateinput = this.$wrapper.find('.js-shipping__date-input__input'),
                disabledDays = appConfig.shipping.disabledDays || [0, 6];
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
        this.$wrapper.find('.js-shipping__datepicker-toggler').on('click', function () {
            datepicker.show();
        });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzaGlwcGluZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuc2hpcHBpbmcgPSB7XHJcblxyXG4gICAgbWFwQ2VudGVyOiBhcHBDb25maWcuc2hpcHBpbmcubWFwQ2VudGVyIHx8IFs1Ni4zMjY4ODcsIDQ0LjAwNTk4Nl0sXHJcbiAgICBtYXBab29tOiBhcHBDb25maWcuc2hpcHBpbmcubWFwWm9vbSB8fCAxMSxcclxuICAgICR3cmFwcGVyOiBudWxsLFxyXG4gICAgJGFkZHJlc3NJbnB1dDogbnVsbCxcclxuICAgICRkaXN0YW5jZUlucHV0OiBudWxsLFxyXG4gICAgJGRpc3RhbmNlVGV4dDogbnVsbCxcclxuICAgICRzdW1tYXJ5RGl2OiBudWxsLFxyXG4gICAgJHJlc2V0QnRuOiBudWxsLFxyXG4gICAgbWFwQ29udGFpbmVySUQ6IG51bGwsXHJcbiAgICBtYXA6IG51bGwsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSAkICR3cmFwcGVyXHJcbiAgICAgKi9cclxuICAgIGluaXQ6IGZ1bmN0aW9uICgkd3JhcHBlcikge1xyXG4gICAgICAgIHRoaXMuJHdyYXBwZXIgPSAkd3JhcHBlcjtcclxuICAgICAgICB0aGlzLm1hcENvbnRhaW5lcklEID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19tYXAnKS5hdHRyKCdpZCcpO1xyXG4gICAgICAgIHRoaXMuJGFkZHJlc3NJbnB1dCA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fcm91dGUtYWRkcmVzcycpO1xyXG4gICAgICAgIHRoaXMuJGRpc3RhbmNlSW5wdXQgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3JvdXRlLWRpc3RhbmNlJyk7XHJcbiAgICAgICAgdGhpcy4kZGlzdGFuY2VUZXh0ID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yb3V0ZS1kaXN0YW5jZS10ZXh0Jyk7XHJcbiAgICAgICAgdGhpcy4kc3VtbWFyeURpdiA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fc3VtbWFyeScpO1xyXG4gICAgICAgIHRoaXMuJHJlc2V0QnRuID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yZXNldCcpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNsaWRlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdERhdGVwaWNrZXIoKTtcclxuICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvL2FwaS1tYXBzLnlhbmRleC5ydS8yLjEvP2xhbmc9cnVfUlUmbW9kZT1kZWJ1ZycsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGFwcC5zaGlwcGluZy5pbml0TWFwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeW1hcHMucmVhZHkoYXBwLnNoaXBwaW5nLmluaXRNYXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhcHAuc2hpcHBpbmcuJHJlc2V0QnRuLm9uKCdjbGljaycsIHRoaXMuY2xlYXJSb3V0ZSk7XHJcblxyXG4gICAgICAgICR3cmFwcGVyLmRhdGEoJ2luaXQnLCB0cnVlKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFNsaWRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkc2xpZGVyID0gdGhpcy4kd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2Nhci1zbGlkZXInKSxcclxuICAgICAgICAgICAgICAgICRyYWRpbyA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19jYXItcmFkaW8nKTtcclxuICAgICAgICBpZiAoJHNsaWRlci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJHNsaWRlci5zbGljayh7XHJcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZmFkZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHJhZGlvLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICQodGhpcykucGFyZW50cygnLmpzLXNoaXBwaW5nX19jYXItbGFiZWwnKS5pbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgJHNsaWRlci5zbGljaygnc2xpY2tHb1RvJywgaW5kZXgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdERhdGVwaWNrZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJGRhdGVpbnB1dFdyYXBwZXIgPSB0aGlzLiR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZS1pbnB1dCcpLFxyXG4gICAgICAgICAgICAgICAgJGRhdGVpbnB1dCA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlLWlucHV0X19pbnB1dCcpLFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZWREYXlzID0gYXBwQ29uZmlnLnNoaXBwaW5nLmRpc2FibGVkRGF5cyB8fCBbMCwgNl07XHJcbiAgICAgICAgJGRhdGVpbnB1dC5kYXRlcGlja2VyKHtcclxuICAgICAgICAgICAgcG9zaXRpb246ICd0b3AgcmlnaHQnLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IDQwLFxyXG4gICAgICAgICAgICBuYXZUaXRsZXM6IHtcclxuICAgICAgICAgICAgICAgIGRheXM6ICdNTSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWluRGF0ZTogbmV3IERhdGUobmV3IERhdGUoKS5nZXRUaW1lKCkgKyA4NjQwMCAqIDEwMDAgKiAyKSxcclxuICAgICAgICAgICAgb25SZW5kZXJDZWxsOiBmdW5jdGlvbiAoZGF0ZSwgY2VsbFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PSAnZGF5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXNhYmxlZCA9IGRpc2FibGVkRGF5cy5pbmRleE9mKGRheSkgIT0gLTE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiBpc0Rpc2FibGVkXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24gKGZvcm1hdHRlZERhdGUsIGRhdGUsIGluc3QpIHtcclxuICAgICAgICAgICAgICAgIGluc3QuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgJGRhdGVpbnB1dFdyYXBwZXIucmVtb3ZlQ2xhc3MoJ19lbXB0eScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGRhdGVwaWNrZXIgPSAkZGF0ZWlucHV0LmRhdGVwaWNrZXIoKS5kYXRhKCdkYXRlcGlja2VyJyk7XHJcbiAgICAgICAgdGhpcy4kd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2RhdGVwaWNrZXItdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZGF0ZXBpY2tlci5zaG93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRNYXA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyDRiNCw0LHQu9C+0L0g0LHQsNC70YPQvdCwINC/0L4g0LrQu9C40LrRg1xyXG4gICAgICAgIHZhciBCYWxsb29uQ29udGVudExheW91dCA9IHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyhcclxuICAgICAgICAgICAgICAgICc8cD57eyB0ZXh0fX08L3A+JyArXHJcbiAgICAgICAgICAgICAgICAnPGEgaHJlZj1cIiNcIiBpZD1cIm1ha2Vfcm91dGVcIiB7JSBpZiAhbGluayAlfWNsYXNzPVwiaGlkZGVuXCJ7JSBlbmRpZiAlfT48aSBjbGFzcz1cImljb24tcm91dGVcIj48L2k+INCf0YDQvtC70L7QttC40YLRjCDQvNCw0YDRiNGA0YPRgjwvYT4nLCB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9C10Lwg0YTRg9C90LrRhtC40Y4gYnVpbGQsINGH0YLQvtCx0Ysg0L/RgNC4INGB0L7Qt9C00LDQvdC40Lgg0LzQsNC60LXRgtCwINC90LDRh9C40L3QsNGC0YxcclxuICAgICAgICAgICAgICAgICAgICAvLyDRgdC70YPRiNCw0YLRjCDRgdC+0LHRi9GC0LjQtSBjbGljayDQvdCwINC60L3QvtC/0LrQtVxyXG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCh0L3QsNGH0LDQu9CwINCy0YvQt9GL0LLQsNC10Lwg0LzQtdGC0L7QtCBidWlsZCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDQutC70LDRgdGB0LAuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhbGxvb25Db250ZW50TGF5b3V0LnN1cGVyY2xhc3MuYnVpbGQuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0JAg0LfQsNGC0LXQvCDQstGL0L/QvtC70L3Rj9C10Lwg0LTQvtC/0L7Qu9C90LjRgtC10LvRjNC90YvQtSDQtNC10LnRgdGC0LLQuNGPLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjbWFrZV9yb3V0ZScpLmJpbmQoJ2NsaWNrJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRzOiB0aGlzLl9kYXRhLmNvb3JkcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMuX2RhdGEudGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzLm1ha2VSb3V0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0JDQvdCw0LvQvtCz0LjRh9C90L4g0L/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXQvCDRhNGD0L3QutGG0LjRjiBjbGVhciwg0YfRgtC+0LHRiyDRgdC90Y/RgtGMXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0L/RgNC+0YHQu9GD0YjQuNCy0LDQvdC40LUg0LrQu9C40LrQsCDQv9GA0Lgg0YPQtNCw0LvQtdC90LjQuCDQvNCw0LrQtdGC0LAg0YEg0LrQsNGA0YLRiy5cclxuICAgICAgICAgICAgICAgICAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQktGL0L/QvtC70L3Rj9C10Lwg0LTQtdC50YHRgtCy0LjRjyDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1IC0g0YHQvdCw0YfQsNC70LAg0YHQvdC40LzQsNC10Lwg0YHQu9GD0YjQsNGC0LXQu9GPLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQsCDQv9C+0YLQvtC8INCy0YvQt9GL0LLQsNC10Lwg0LzQtdGC0L7QtCBjbGVhciDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDQutC70LDRgdGB0LAuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNtYWtlX3JvdXRlJykudW5iaW5kKCdjbGljaycsIHRoaXMubWFrZVJvdXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQmFsbG9vbkNvbnRlbnRMYXlvdXQuc3VwZXJjbGFzcy5jbGVhci5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1ha2VSb3V0ZTogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1ha2VSb3V0ZShlLmRhdGEuY29vcmRzLCBlLmRhdGEudGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB2YXIgbWFwID0gbmV3IHltYXBzLk1hcChhcHAuc2hpcHBpbmcubWFwQ29udGFpbmVySUQsIHtcclxuICAgICAgICAgICAgY2VudGVyOiBhcHAuc2hpcHBpbmcubWFwQ2VudGVyLFxyXG4gICAgICAgICAgICB6b29tOiBhcHAuc2hpcHBpbmcubWFwWm9vbSxcclxuICAgICAgICAgICAgYXV0b0ZpdFRvVmlld3BvcnQ6ICdhbHdheXMnLFxyXG4gICAgICAgICAgICBjb250cm9sczogW11cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHN1cHByZXNzTWFwT3BlbkJsb2NrOiB0cnVlLFxyXG4gICAgICAgICAgICBiYWxsb29uTWF4V2lkdGg6IDIwMCxcclxuICAgICAgICAgICAgYmFsbG9vbkNvbnRlbnRMYXlvdXQ6IEJhbGxvb25Db250ZW50TGF5b3V0LFxyXG4gICAgICAgICAgICBiYWxsb29uUGFuZWxNYXhNYXBBcmVhOiAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbWFwLmNvbnRyb2xzLmFkZCgnem9vbUNvbnRyb2wnLCB7XHJcbiAgICAgICAgICAgIHNpemU6ICdzbWFsbCdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9pbml0IHN1Z2dlc3Rpb25zXHJcbiAgICAgICAgYXBwLnNoaXBwaW5nLmluaXRTdWdnZXN0KCk7XHJcblxyXG4gICAgICAgIC8vZW5hYmxlIGlucHV0XHJcbiAgICAgICAgYXBwLnNoaXBwaW5nLiRhZGRyZXNzSW5wdXQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XHJcblxyXG4gICAgICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDRgdC+0LHRi9GC0LjRjywg0LLQvtC30L3QuNC60LDRjtGJ0LXQs9C+INC/0YDQuCDRidC10LvRh9C60LVcclxuICAgICAgICAvLyDQu9C10LLQvtC5INC60L3QvtC/0LrQvtC5INC80YvRiNC4INCyINC70Y7QsdC+0Lkg0YLQvtGH0LrQtSDQutCw0YDRgtGLLlxyXG4gICAgICAgIG1hcC5ldmVudHMuYWRkKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGlmICghbWFwLmJhbGxvb24uaXNPcGVuKCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb29yZHMgPSBlLmdldCgnY29vcmRzJyk7XHJcbiAgICAgICAgICAgICAgICBtYXAuYmFsbG9vbi5vcGVuKGNvb3Jkcywge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICfQl9Cw0LPRgNGD0LbQsNC10Lwg0LTQsNC90L3Ri9C1Li4uJyxcclxuICAgICAgICAgICAgICAgICAgICBjb29yZHM6IGNvb3JkcyxcclxuICAgICAgICAgICAgICAgICAgICBsaW5rOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB5bWFwcy5nZW9jb2RlKGNvb3JkcykudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSByZXMuZ2VvT2JqZWN0cy5nZXQoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gby5nZXRBZGRyZXNzTGluZSgpLnJlcGxhY2UoJ9Cd0LjQttC10LPQvtGA0L7QtNGB0LrQsNGPINC+0LHQu9Cw0YHRgtGMLCAnLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXAuYmFsbG9vbi5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRzOiBjb29yZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDMwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWFwLmJhbGxvb24uY2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFwcC5zaGlwcGluZy5tYXAgPSBtYXA7XHJcbiAgICB9LFxyXG5cclxuICAgIG1ha2VSb3V0ZTogZnVuY3Rpb24gKGNvb3JkLCB0ZXh0KSB7XHJcbiAgICAgICAgYXBwLnNoaXBwaW5nLm1hcC5nZW9PYmplY3RzLnJlbW92ZUFsbCgpO1xyXG4gICAgICAgIHZhciBiYWxsb29uTGF5b3V0ID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxyXG4gICAgICAgICAgICAgICAgXCI8ZGl2PlwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5zdXBlcmNsYXNzLmJ1aWxkLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdmFyIG11bHRpUm91dGUgPSBuZXcgeW1hcHMubXVsdGlSb3V0ZXIuTXVsdGlSb3V0ZSh7XHJcbiAgICAgICAgICAgIC8vINCe0L/QuNGB0LDQvdC40LUg0L7Qv9C+0YDQvdGL0YUg0YLQvtGH0LXQuiDQvNGD0LvRjNGC0LjQvNCw0YDRiNGA0YPRgtCwXHJcbiAgICAgICAgICAgIHJlZmVyZW5jZVBvaW50czogW1xyXG4gICAgICAgICAgICAgICAgYXBwQ29uZmlnLnNoaXBwaW5nLmZyb20uZ2VvLFxyXG4gICAgICAgICAgICAgICAgY29vcmQsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0czogMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBib3VuZHNBdXRvQXBwbHk6IHRydWUsXHJcbiAgICAgICAgICAgIHdheVBvaW50U3RhcnRJY29uQ29udGVudExheW91dDogeW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxyXG4gICAgICAgICAgICAgICAgICAgIGFwcENvbmZpZy5zaGlwcGluZy5mcm9tLnRleHRcclxuICAgICAgICAgICAgICAgICAgICApLFxyXG4vLyAgICAgICAgICAgIHdheVBvaW50RmluaXNoSWNvbkNvbnRlbnRMYXlvdXQ6IHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyh0ZXh0KSxcclxuLy8gICAgICAgICAgICB3YXlQb2ludEZpbmlzaERyYWdnYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgYmFsbG9vbkxheW91dDogYmFsbG9vbkxheW91dFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG11bHRpUm91dGUubW9kZWwuZXZlbnRzLmFkZCgncmVxdWVzdHN1Y2Nlc3MnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy5tYXAuYmFsbG9vbi5jbG9zZSgpO1xyXG4gICAgICAgICAgICB2YXIgcm91dGUgPSBtdWx0aVJvdXRlLmdldEFjdGl2ZVJvdXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGgucm91bmQocm91dGUucHJvcGVydGllcy5nZXQoJ2Rpc3RhbmNlJykudmFsdWUgLyAxMDAwKTtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLndyaXRlUm91dGVJbmZvKGRpc3RhbmNlLCB0ZXh0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBtdWx0aVJvdXRlLmV2ZW50cy5hZGQoJ3JlcXVlc3RmYWlsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcuZXJyb3JNc2coJ9Cd0LUg0YPQtNCw0LvQvtGB0Ywg0L/RgNC+0LvQvtC20LjRgtGMINC80LDRgNGI0YDRg9GCJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXBwLnNoaXBwaW5nLm1hcC5nZW9PYmplY3RzLmFkZChtdWx0aVJvdXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgd3JpdGVSb3V0ZUluZm86IGZ1bmN0aW9uIChkaXN0YW5jZSwgYWRkcmVzcykge1xyXG4gICAgICAgIHRoaXMuJGFkZHJlc3NJbnB1dC52YWwoYWRkcmVzcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gU3VnZ2VzdFZpZXcgaGFzIG5vdCBtZXRob2QgZm9yIGNsb3NlIHBhbmVsLCByZW1vdmUgY2xhc3MgaW4gaW5pdFN1Z2dlc3RcclxuICAgICAgICB0aGlzLiRhZGRyZXNzSW5wdXQuc2libGluZ3MoJ3ltYXBzJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuJGRpc3RhbmNlSW5wdXQudmFsKGRpc3RhbmNlKTtcclxuICAgICAgICB0aGlzLiRkaXN0YW5jZVRleHQudGV4dChkaXN0YW5jZSk7XHJcbiAgICAgICAgdGhpcy4kc3VtbWFyeURpdi5yZW1vdmVDbGFzcygnX2hpZGRlbicpO1xyXG4gICAgICAgIHRoaXMuJHJlc2V0QnRuLnNob3coKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xlYXJSb3V0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChhcHAuc2hpcHBpbmcubWFwKSB7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy5tYXAuZ2VvT2JqZWN0cy5yZW1vdmVBbGwoKTtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1hcC5iYWxsb29uLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy4kYWRkcmVzc0lucHV0LnZhbCgnJyk7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy4kZGlzdGFuY2VJbnB1dC52YWwoJycpO1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcuJHN1bW1hcnlEaXYuYWRkQ2xhc3MoJ19oaWRkZW4nKTtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLiRyZXNldEJ0bi5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBlcnJvck1zZzogZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgIGFsZXJ0KG1zZyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRTdWdnZXN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy4kYWRkcmVzc0lucHV0Lm9uKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCd5bWFwcycpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTsgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy4kYWRkcmVzc0lucHV0Lm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIHN1Z2dlc3RWaWV3ID0gbmV3IHltYXBzLlN1Z2dlc3RWaWV3KHRoaXMuJGFkZHJlc3NJbnB1dC5hdHRyKCdpZCcpLCB7XHJcbiAgICAgICAgICAgIG9mZnNldDogWy0xLCAzXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN1Z2dlc3RWaWV3LmV2ZW50cy5hZGQoJ3NlbGVjdCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gZS5nZXQoJ2l0ZW0nKTtcclxuICAgICAgICAgICAgeW1hcHMuZ2VvY29kZShpdGVtLnZhbHVlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSByZXMuZ2VvT2JqZWN0cy5nZXQoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5zaGlwcGluZy5tYWtlUm91dGUoby5nZW9tZXRyeS5fY29vcmRpbmF0ZXMsIGl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbn0iXSwiZmlsZSI6InNoaXBwaW5nLmpzIn0=
