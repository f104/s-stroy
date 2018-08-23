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
//        var datepicker = $dateinput.datepicker().data('datepicker');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzaGlwcGluZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuc2hpcHBpbmcgPSB7XHJcblxyXG4gICAgbWFwQ2VudGVyOiBhcHBDb25maWcuc2hpcHBpbmcubWFwQ2VudGVyIHx8IFs1Ni4zMjY4ODcsIDQ0LjAwNTk4Nl0sXHJcbiAgICBtYXBab29tOiBhcHBDb25maWcuc2hpcHBpbmcubWFwWm9vbSB8fCAxMSxcclxuICAgICR3cmFwcGVyOiBudWxsLFxyXG4gICAgJGFkZHJlc3NJbnB1dDogbnVsbCxcclxuICAgICRkaXN0YW5jZUlucHV0OiBudWxsLFxyXG4gICAgJGRpc3RhbmNlVGV4dDogbnVsbCxcclxuICAgICRzdW1tYXJ5RGl2OiBudWxsLFxyXG4gICAgJHJlc2V0QnRuOiBudWxsLFxyXG4gICAgbWFwQ29udGFpbmVySUQ6IG51bGwsXHJcbiAgICBtYXA6IG51bGwsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSAkICR3cmFwcGVyXHJcbiAgICAgKi9cclxuICAgIGluaXQ6IGZ1bmN0aW9uICgkd3JhcHBlcikge1xyXG4gICAgICAgIHRoaXMuJHdyYXBwZXIgPSAkd3JhcHBlcjtcclxuICAgICAgICB0aGlzLm1hcENvbnRhaW5lcklEID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19tYXAnKS5hdHRyKCdpZCcpO1xyXG4gICAgICAgIHRoaXMuJGFkZHJlc3NJbnB1dCA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fcm91dGUtYWRkcmVzcycpO1xyXG4gICAgICAgIHRoaXMuJGRpc3RhbmNlSW5wdXQgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3JvdXRlLWRpc3RhbmNlJyk7XHJcbiAgICAgICAgdGhpcy4kZGlzdGFuY2VUZXh0ID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yb3V0ZS1kaXN0YW5jZS10ZXh0Jyk7XHJcbiAgICAgICAgdGhpcy4kc3VtbWFyeURpdiA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fc3VtbWFyeScpO1xyXG4gICAgICAgIHRoaXMuJHJlc2V0QnRuID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yZXNldCcpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNsaWRlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdERhdGVwaWNrZXIoKTtcclxuICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvL2FwaS1tYXBzLnlhbmRleC5ydS8yLjEvP2xhbmc9cnVfUlUmbW9kZT1kZWJ1ZycsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGFwcC5zaGlwcGluZy5pbml0TWFwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeW1hcHMucmVhZHkoYXBwLnNoaXBwaW5nLmluaXRNYXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhcHAuc2hpcHBpbmcuJHJlc2V0QnRuLm9uKCdjbGljaycsIHRoaXMuY2xlYXJSb3V0ZSk7XHJcblxyXG4gICAgICAgICR3cmFwcGVyLmRhdGEoJ2luaXQnLCB0cnVlKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFNsaWRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkc2xpZGVyID0gdGhpcy4kd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2Nhci1zbGlkZXInKSxcclxuICAgICAgICAgICAgICAgICRyYWRpbyA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19jYXItcmFkaW8nKTtcclxuICAgICAgICBpZiAoJHNsaWRlci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJHNsaWRlci5zbGljayh7XHJcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZmFkZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHJhZGlvLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICQodGhpcykucGFyZW50cygnLmpzLXNoaXBwaW5nX19jYXItbGFiZWwnKS5pbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgJHNsaWRlci5zbGljaygnc2xpY2tHb1RvJywgaW5kZXgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdERhdGVwaWNrZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgJGRhdGVpbnB1dCA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlLWlucHV0JyksXHJcbi8vICAgICAgICAgICAgICAgICRkYXRlaW5wdXQgPSB0aGlzLiR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZS1pbnB1dF9faW5wdXQnKSxcclxuLy8gICAgICAgICAgICAgICAgJGRhdGVpbnB1dFdyYXBwZXIgPSB0aGlzLiR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZS1pbnB1dCcpLFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZWREYXlzID0gYXBwQ29uZmlnLnNoaXBwaW5nLmRpc2FibGVkRGF5cyB8fCBbMCwgNl07XHJcbiAgICAgICAgJGRhdGVpbnB1dC5kYXRlcGlja2VyKHtcclxuLy8gICAgICAgICAgICBwb3NpdGlvbjogJ3RvcCByaWdodCcsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tIGxlZnQnLFxyXG4vLyAgICAgICAgICAgIG9mZnNldDogNDAsXHJcbiAgICAgICAgICAgIG5hdlRpdGxlczoge1xyXG4gICAgICAgICAgICAgICAgZGF5czogJ01NJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtaW5EYXRlOiBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldFRpbWUoKSArIDg2NDAwICogMTAwMCAqIDIpLFxyXG4gICAgICAgICAgICBvblJlbmRlckNlbGw6IGZ1bmN0aW9uIChkYXRlLCBjZWxsVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09ICdkYXknKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRheSA9IGRhdGUuZ2V0RGF5KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Rpc2FibGVkID0gZGlzYWJsZWREYXlzLmluZGV4T2YoZGF5KSAhPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogaXNEaXNhYmxlZFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uIChmb3JtYXR0ZWREYXRlLCBkYXRlLCBpbnN0KSB7XHJcbiAgICAgICAgICAgICAgICBpbnN0LmhpZGUoKTtcclxuLy8gICAgICAgICAgICAgICAgJGRhdGVpbnB1dFdyYXBwZXIucmVtb3ZlQ2xhc3MoJ19lbXB0eScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbi8vICAgICAgICB2YXIgZGF0ZXBpY2tlciA9ICRkYXRlaW5wdXQuZGF0ZXBpY2tlcigpLmRhdGEoJ2RhdGVwaWNrZXInKTtcclxuLy8gICAgICAgIHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlcGlja2VyLXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgZGF0ZXBpY2tlci5zaG93KCk7XHJcbi8vICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdE1hcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vINGI0LDQsdC70L7QvSDQsdCw0LvRg9C90LAg0L/QviDQutC70LjQutGDXHJcbiAgICAgICAgdmFyIEJhbGxvb25Db250ZW50TGF5b3V0ID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxyXG4gICAgICAgICAgICAgICAgJzxwPnt7IHRleHR9fTwvcD4nICtcclxuICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI1wiIGlkPVwibWFrZV9yb3V0ZVwiIHslIGlmICFsaW5rICV9Y2xhc3M9XCJoaWRkZW5cInslIGVuZGlmICV9PjxpIGNsYXNzPVwiaWNvbi1yb3V0ZVwiPjwvaT4g0J/RgNC+0LvQvtC20LjRgtGMINC80LDRgNGI0YDRg9GCPC9hPicsIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXQvCDRhNGD0L3QutGG0LjRjiBidWlsZCwg0YfRgtC+0LHRiyDQv9GA0Lgg0YHQvtC30LTQsNC90LjQuCDQvNCw0LrQtdGC0LAg0L3QsNGH0LjQvdCw0YLRjFxyXG4gICAgICAgICAgICAgICAgICAgIC8vINGB0LvRg9GI0LDRgtGMINGB0L7QsdGL0YLQuNC1IGNsaWNrINC90LAg0LrQvdC+0L/QutC1XHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0KHQvdCw0YfQsNC70LAg0LLRi9C30YvQstCw0LXQvCDQvNC10YLQvtC0IGJ1aWxkINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+INC60LvQsNGB0YHQsC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQmFsbG9vbkNvbnRlbnRMYXlvdXQuc3VwZXJjbGFzcy5idWlsZC5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQkCDQt9Cw0YLQtdC8INCy0YvQv9C+0LvQvdGP0LXQvCDQtNC+0L/QvtC70L3QuNGC0LXQu9GM0L3Ri9C1INC00LXQudGB0YLQstC40Y8uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNtYWtlX3JvdXRlJykuYmluZCgnY2xpY2snLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZHM6IHRoaXMuX2RhdGEuY29vcmRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy5fZGF0YS50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMubWFrZVJvdXRlKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDQkNC90LDQu9C+0LPQuNGH0L3QviDQv9C10YDQtdC+0L/RgNC10LTQtdC70Y/QtdC8INGE0YPQvdC60YbQuNGOIGNsZWFyLCDRh9GC0L7QsdGLINGB0L3Rj9GC0YxcclxuICAgICAgICAgICAgICAgICAgICAvLyDQv9GA0L7RgdC70YPRiNC40LLQsNC90LjQtSDQutC70LjQutCwINC/0YDQuCDRg9C00LDQu9C10L3QuNC4INC80LDQutC10YLQsCDRgSDQutCw0YDRgtGLLlxyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCS0YvQv9C+0LvQvdGP0LXQvCDQtNC10LnRgdGC0LLQuNGPINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LUgLSDRgdC90LDRh9Cw0LvQsCDRgdC90LjQvNCw0LXQvCDRgdC70YPRiNCw0YLQtdC70Y8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCwINC/0L7RgtC+0Lwg0LLRi9C30YvQstCw0LXQvCDQvNC10YLQvtC0IGNsZWFyINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+INC60LvQsNGB0YHQsC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI21ha2Vfcm91dGUnKS51bmJpbmQoJ2NsaWNrJywgdGhpcy5tYWtlUm91dGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCYWxsb29uQ29udGVudExheW91dC5zdXBlcmNsYXNzLmNsZWFyLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWFrZVJvdXRlOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAuc2hpcHBpbmcubWFrZVJvdXRlKGUuZGF0YS5jb29yZHMsIGUuZGF0YS50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBtYXAgPSBuZXcgeW1hcHMuTWFwKGFwcC5zaGlwcGluZy5tYXBDb250YWluZXJJRCwge1xyXG4gICAgICAgICAgICBjZW50ZXI6IGFwcC5zaGlwcGluZy5tYXBDZW50ZXIsXHJcbiAgICAgICAgICAgIHpvb206IGFwcC5zaGlwcGluZy5tYXBab29tLFxyXG4gICAgICAgICAgICBhdXRvRml0VG9WaWV3cG9ydDogJ2Fsd2F5cycsXHJcbiAgICAgICAgICAgIGNvbnRyb2xzOiBbXVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgc3VwcHJlc3NNYXBPcGVuQmxvY2s6IHRydWUsXHJcbiAgICAgICAgICAgIGJhbGxvb25NYXhXaWR0aDogMjAwLFxyXG4gICAgICAgICAgICBiYWxsb29uQ29udGVudExheW91dDogQmFsbG9vbkNvbnRlbnRMYXlvdXQsXHJcbiAgICAgICAgICAgIGJhbGxvb25QYW5lbE1heE1hcEFyZWE6IDBcclxuICAgICAgICB9KTtcclxuICAgICAgICBtYXAuY29udHJvbHMuYWRkKCd6b29tQ29udHJvbCcsIHtcclxuICAgICAgICAgICAgc2l6ZTogJ3NtYWxsJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL2luaXQgc3VnZ2VzdGlvbnNcclxuICAgICAgICBhcHAuc2hpcHBpbmcuaW5pdFN1Z2dlc3QoKTtcclxuXHJcbiAgICAgICAgLy9lbmFibGUgaW5wdXRcclxuICAgICAgICBhcHAuc2hpcHBpbmcuJGFkZHJlc3NJbnB1dC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINGB0L7QsdGL0YLQuNGPLCDQstC+0LfQvdC40LrQsNGO0YnQtdCz0L4g0L/RgNC4INGJ0LXQu9GH0LrQtVxyXG4gICAgICAgIC8vINC70LXQstC+0Lkg0LrQvdC+0L/QutC+0Lkg0LzRi9GI0Lgg0LIg0LvRjtCx0L7QuSDRgtC+0YfQutC1INC60LDRgNGC0YsuXHJcbiAgICAgICAgbWFwLmV2ZW50cy5hZGQoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgaWYgKCFtYXAuYmFsbG9vbi5pc09wZW4oKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvb3JkcyA9IGUuZ2V0KCdjb29yZHMnKTtcclxuICAgICAgICAgICAgICAgIG1hcC5iYWxsb29uLm9wZW4oY29vcmRzLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ9CX0LDQs9GA0YPQttCw0LXQvCDQtNCw0L3QvdGL0LUuLi4nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkczogY29vcmRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbms6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHltYXBzLmdlb2NvZGUoY29vcmRzKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IHJlcy5nZW9PYmplY3RzLmdldCgwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSBvLmdldEFkZHJlc3NMaW5lKCkucmVwbGFjZSgn0J3QuNC20LXQs9C+0YDQvtC00YHQutCw0Y8g0L7QsdC70LDRgdGC0YwsICcsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5iYWxsb29uLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZHM6IGNvb3JkcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtYXAuYmFsbG9vbi5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXBwLnNoaXBwaW5nLm1hcCA9IG1hcDtcclxuICAgIH0sXHJcblxyXG4gICAgbWFrZVJvdXRlOiBmdW5jdGlvbiAoY29vcmQsIHRleHQpIHtcclxuICAgICAgICBhcHAuc2hpcHBpbmcubWFwLmdlb09iamVjdHMucmVtb3ZlQWxsKCk7XHJcbiAgICAgICAgdmFyIGJhbGxvb25MYXlvdXQgPSB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoXHJcbiAgICAgICAgICAgICAgICBcIjxkaXY+XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBidWlsZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLnN1cGVyY2xhc3MuYnVpbGQuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICB2YXIgbXVsdGlSb3V0ZSA9IG5ldyB5bWFwcy5tdWx0aVJvdXRlci5NdWx0aVJvdXRlKHtcclxuICAgICAgICAgICAgLy8g0J7Qv9C40YHQsNC90LjQtSDQvtC/0L7RgNC90YvRhSDRgtC+0YfQtdC6INC80YPQu9GM0YLQuNC80LDRgNGI0YDRg9GC0LBcclxuICAgICAgICAgICAgcmVmZXJlbmNlUG9pbnRzOiBbXHJcbiAgICAgICAgICAgICAgICBhcHBDb25maWcuc2hpcHBpbmcuZnJvbS5nZW8sXHJcbiAgICAgICAgICAgICAgICBjb29yZCxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRzOiAxXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGJvdW5kc0F1dG9BcHBseTogdHJ1ZSxcclxuICAgICAgICAgICAgd2F5UG9pbnRTdGFydEljb25Db250ZW50TGF5b3V0OiB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwQ29uZmlnLnNoaXBwaW5nLmZyb20udGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICksXHJcbi8vICAgICAgICAgICAgd2F5UG9pbnRGaW5pc2hJY29uQ29udGVudExheW91dDogeW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKHRleHQpLFxyXG4vLyAgICAgICAgICAgIHdheVBvaW50RmluaXNoRHJhZ2dhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBiYWxsb29uTGF5b3V0OiBiYWxsb29uTGF5b3V0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbXVsdGlSb3V0ZS5tb2RlbC5ldmVudHMuYWRkKCdyZXF1ZXN0c3VjY2VzcycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1hcC5iYWxsb29uLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIHZhciByb3V0ZSA9IG11bHRpUm91dGUuZ2V0QWN0aXZlUm91dGUoKTtcclxuICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5yb3VuZChyb3V0ZS5wcm9wZXJ0aWVzLmdldCgnZGlzdGFuY2UnKS52YWx1ZSAvIDEwMDApO1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcud3JpdGVSb3V0ZUluZm8oZGlzdGFuY2UsIHRleHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG11bHRpUm91dGUuZXZlbnRzLmFkZCgncmVxdWVzdGZhaWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy5lcnJvck1zZygn0J3QtSDRg9C00LDQu9C+0YHRjCDQv9GA0L7Qu9C+0LbQuNGC0Ywg0LzQsNGA0YjRgNGD0YInKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBhcHAuc2hpcHBpbmcubWFwLmdlb09iamVjdHMuYWRkKG11bHRpUm91dGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICB3cml0ZVJvdXRlSW5mbzogZnVuY3Rpb24gKGRpc3RhbmNlLCBhZGRyZXNzKSB7XHJcbiAgICAgICAgdGhpcy4kYWRkcmVzc0lucHV0LnZhbChhZGRyZXNzKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBTdWdnZXN0VmlldyBoYXMgbm90IG1ldGhvZCBmb3IgY2xvc2UgcGFuZWwsIHJlbW92ZSBjbGFzcyBpbiBpbml0U3VnZ2VzdFxyXG4gICAgICAgIHRoaXMuJGFkZHJlc3NJbnB1dC5zaWJsaW5ncygneW1hcHMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy4kZGlzdGFuY2VJbnB1dC52YWwoZGlzdGFuY2UpO1xyXG4gICAgICAgIHRoaXMuJGRpc3RhbmNlVGV4dC50ZXh0KGRpc3RhbmNlKTtcclxuICAgICAgICB0aGlzLiRzdW1tYXJ5RGl2LnJlbW92ZUNsYXNzKCdfaGlkZGVuJyk7XHJcbiAgICAgICAgdGhpcy4kcmVzZXRCdG4uc2hvdygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbGVhclJvdXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKGFwcC5zaGlwcGluZy5tYXApIHtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1hcC5nZW9PYmplY3RzLnJlbW92ZUFsbCgpO1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcubWFwLmJhbGxvb24uY2xvc2UoKTtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLiRhZGRyZXNzSW5wdXQudmFsKCcnKTtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLiRkaXN0YW5jZUlucHV0LnZhbCgnJyk7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy4kc3VtbWFyeURpdi5hZGRDbGFzcygnX2hpZGRlbicpO1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcuJHJlc2V0QnRuLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGVycm9yTXNnOiBmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgYWxlcnQobXNnKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFN1Z2dlc3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLiRhZGRyZXNzSW5wdXQub24oJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICQodGhpcykuc2libGluZ3MoJ3ltYXBzJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpOyBcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLiRhZGRyZXNzSW5wdXQub24oJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMTMpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgc3VnZ2VzdFZpZXcgPSBuZXcgeW1hcHMuU3VnZ2VzdFZpZXcodGhpcy4kYWRkcmVzc0lucHV0LmF0dHIoJ2lkJyksIHtcclxuICAgICAgICAgICAgb2Zmc2V0OiBbLTEsIDNdXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3VnZ2VzdFZpZXcuZXZlbnRzLmFkZCgnc2VsZWN0JywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBlLmdldCgnaXRlbScpO1xyXG4gICAgICAgICAgICB5bWFwcy5nZW9jb2RlKGl0ZW0udmFsdWUpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IHJlcy5nZW9PYmplY3RzLmdldCgwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1ha2VSb3V0ZShvLmdlb21ldHJ5Ll9jb29yZGluYXRlcywgaXRlbS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxufSJdLCJmaWxlIjoic2hpcHBpbmcuanMifQ==
