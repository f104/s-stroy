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
    suggestView: null,

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

        this.calcPrice();
    },

    initSlider: function () {
        let _that = this;
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
                $radio.prop('checked', false);
                $(this).prop('checked', true);
                var index = $(this).parents('.js-shipping__car-label').index();
                _that.calcPrice();
                $slider.slick('slickGoTo', index);
            })
        }
    },

    initDatepicker: function () {
        let _that = this;
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
            //86400 * 1000 * 2 - день
            //43200000 - полдня после 12
            minDate: new Date(new Date().getTime() + 43200000 ),
            onRenderCell: function (date, cellType) {
                /*if (cellType == 'day') {
                    var day = date.getDay(),
                            isDisabled = disabledDays.indexOf(day) != -1;
                    return {
                        disabled: isDisabled
                    }
                }*/
            },
            onSelect: function (formattedDate, date, inst) {
                inst.hide();
                _that.calcPrice();
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
        
        // Обработка смены области просмотра
        // и отправка ее в suggestView
        map.events.add('boundschange', function (e) {
            app.shipping.suggestView.options.set('boundedBy', e.get('newBounds'));
        });
        
        app.shipping.map = map;

        //init suggestions
        app.shipping.initSuggest();

        //enable input
        app.shipping.$addressInput.prop('disabled', false);
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
        this.calcPrice();
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
            offset: [-1, 3],
            boundedBy: app.shipping.map.getBounds()
        });

        suggestView.events.add('select', function (e) {
            var item = e.get('item');
            ymaps.geocode(item.value).then(
                    function (res) {
                        var o = res.geoObjects.get(0);
                        app.shipping.makeRoute(o.geometry._coordinates, item.value);
                    });
        });
        
        this.suggestView = suggestView;
        
    },

    /**
     *
     */
    calcPrice: function () {
        let _that = this;
        let ru = ' <span class="rub">₽</span>';
        $.ajax({
            url: '/baseinfo/getroadcalc.php',
            type: 'post',
            dataType: 'json',
            data: _that.$wrapper.serialize(),
            success: function success(data) {
                if (data.price !== 0) {
                    $('.j-road-wraper_price').show();
                    $('.j-road-price_error').hide();
                    $('.j-road-confirmation').prop('disabled', false);
                    _that.$wrapper.find('.j-current-price').html(data.price + ru);
                } else {
                    $('.j-road-wraper_price').hide();
                    $('.j-road-price_error').show();
                    $('.j-road-confirmation').prop('disabled', true);
                }

            }
        });
    },

}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzaGlwcGluZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuc2hpcHBpbmcgPSB7XHJcblxyXG4gICAgbWFwQ2VudGVyOiBhcHBDb25maWcuc2hpcHBpbmcubWFwQ2VudGVyIHx8IFs1Ni4zMjY4ODcsIDQ0LjAwNTk4Nl0sXHJcbiAgICBtYXBab29tOiBhcHBDb25maWcuc2hpcHBpbmcubWFwWm9vbSB8fCAxMSxcclxuICAgICR3cmFwcGVyOiBudWxsLFxyXG4gICAgJGFkZHJlc3NJbnB1dDogbnVsbCxcclxuICAgICRkaXN0YW5jZUlucHV0OiBudWxsLFxyXG4gICAgJGRpc3RhbmNlVGV4dDogbnVsbCxcclxuICAgICRzdW1tYXJ5RGl2OiBudWxsLFxyXG4gICAgJHJlc2V0QnRuOiBudWxsLFxyXG4gICAgbWFwQ29udGFpbmVySUQ6IG51bGwsXHJcbiAgICBtYXA6IG51bGwsXHJcbiAgICBzdWdnZXN0VmlldzogbnVsbCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtICQgJHdyYXBwZXJcclxuICAgICAqL1xyXG4gICAgaW5pdDogZnVuY3Rpb24gKCR3cmFwcGVyKSB7XHJcbiAgICAgICAgdGhpcy4kd3JhcHBlciA9ICR3cmFwcGVyO1xyXG4gICAgICAgIHRoaXMubWFwQ29udGFpbmVySUQgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX21hcCcpLmF0dHIoJ2lkJyk7XHJcbiAgICAgICAgdGhpcy4kYWRkcmVzc0lucHV0ID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yb3V0ZS1hZGRyZXNzJyk7XHJcbiAgICAgICAgdGhpcy4kZGlzdGFuY2VJbnB1dCA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fcm91dGUtZGlzdGFuY2UnKTtcclxuICAgICAgICB0aGlzLiRkaXN0YW5jZVRleHQgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3JvdXRlLWRpc3RhbmNlLXRleHQnKTtcclxuICAgICAgICB0aGlzLiRzdW1tYXJ5RGl2ID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19zdW1tYXJ5Jyk7XHJcbiAgICAgICAgdGhpcy4kcmVzZXRCdG4gPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3Jlc2V0Jyk7XHJcbiAgICAgICAgdGhpcy5pbml0U2xpZGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RGF0ZXBpY2tlcigpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgKHltYXBzKSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogJy8vYXBpLW1hcHMueWFuZGV4LnJ1LzIuMS8/bGFuZz1ydV9SVSZtb2RlPWRlYnVnJyxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcInNjcmlwdFwiLFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeW1hcHMucmVhZHkoYXBwLnNoaXBwaW5nLmluaXRNYXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB5bWFwcy5yZWFkeShhcHAuc2hpcHBpbmcuaW5pdE1hcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFwcC5zaGlwcGluZy4kcmVzZXRCdG4ub24oJ2NsaWNrJywgdGhpcy5jbGVhclJvdXRlKTtcclxuXHJcbiAgICAgICAgJHdyYXBwZXIuZGF0YSgnaW5pdCcsIHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLmNhbGNQcmljZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0U2xpZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IF90aGF0ID0gdGhpcztcclxuICAgICAgICB2YXIgJHNsaWRlciA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19jYXItc2xpZGVyJyksXHJcbiAgICAgICAgICAgICAgICAkcmFkaW8gPSB0aGlzLiR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fY2FyLXJhZGlvJyk7XHJcbiAgICAgICAgaWYgKCRzbGlkZXIubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICRzbGlkZXIuc2xpY2soe1xyXG4gICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGZhZGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRyYWRpby5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkcmFkaW8ucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gJCh0aGlzKS5wYXJlbnRzKCcuanMtc2hpcHBpbmdfX2Nhci1sYWJlbCcpLmluZGV4KCk7XHJcbiAgICAgICAgICAgICAgICBfdGhhdC5jYWxjUHJpY2UoKTtcclxuICAgICAgICAgICAgICAgICRzbGlkZXIuc2xpY2soJ3NsaWNrR29UbycsIGluZGV4KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXREYXRlcGlja2VyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IF90aGF0ID0gdGhpcztcclxuICAgICAgICB2YXIgJGRhdGVpbnB1dCA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlLWlucHV0JyksXHJcbi8vICAgICAgICAgICAgICAgICRkYXRlaW5wdXQgPSB0aGlzLiR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZS1pbnB1dF9faW5wdXQnKSxcclxuLy8gICAgICAgICAgICAgICAgJGRhdGVpbnB1dFdyYXBwZXIgPSB0aGlzLiR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZS1pbnB1dCcpLFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZWREYXlzID0gYXBwQ29uZmlnLnNoaXBwaW5nLmRpc2FibGVkRGF5cyB8fCBbMCwgNl07XHJcbiAgICAgICAgJGRhdGVpbnB1dC5kYXRlcGlja2VyKHtcclxuLy8gICAgICAgICAgICBwb3NpdGlvbjogJ3RvcCByaWdodCcsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tIGxlZnQnLFxyXG4vLyAgICAgICAgICAgIG9mZnNldDogNDAsXHJcbiAgICAgICAgICAgIG5hdlRpdGxlczoge1xyXG4gICAgICAgICAgICAgICAgZGF5czogJ01NJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLzg2NDAwICogMTAwMCAqIDIgLSDQtNC10L3RjFxyXG4gICAgICAgICAgICAvLzQzMjAwMDAwIC0g0L/QvtC70LTQvdGPINC/0L7RgdC70LUgMTJcclxuICAgICAgICAgICAgbWluRGF0ZTogbmV3IERhdGUobmV3IERhdGUoKS5nZXRUaW1lKCkgKyA0MzIwMDAwMCApLFxyXG4gICAgICAgICAgICBvblJlbmRlckNlbGw6IGZ1bmN0aW9uIChkYXRlLCBjZWxsVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgLyppZiAoY2VsbFR5cGUgPT0gJ2RheScpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF5ID0gZGF0ZS5nZXREYXkoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGlzYWJsZWQgPSBkaXNhYmxlZERheXMuaW5kZXhPZihkYXkpICE9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiBpc0Rpc2FibGVkXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbiAoZm9ybWF0dGVkRGF0ZSwgZGF0ZSwgaW5zdCkge1xyXG4gICAgICAgICAgICAgICAgaW5zdC5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICBfdGhhdC5jYWxjUHJpY2UoKTtcclxuLy8gICAgICAgICAgICAgICAgJGRhdGVpbnB1dFdyYXBwZXIucmVtb3ZlQ2xhc3MoJ19lbXB0eScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGRhdGVwaWNrZXIgPSAkZGF0ZWlucHV0LmRhdGVwaWNrZXIoKS5kYXRhKCdkYXRlcGlja2VyJyk7XHJcbiAgICAgICAgJCgnLmZhbmN5Ym94LXNsaWRlJykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZGF0ZXBpY2tlci5oaWRlKCk7XHJcbiAgICAgICAgfSk7XHJcbi8vICAgICAgICB0aGlzLiR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZXBpY2tlci10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAgICAgIGRhdGVwaWNrZXIuc2hvdygpO1xyXG4vLyAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRNYXA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyDRiNCw0LHQu9C+0L0g0LHQsNC70YPQvdCwINC/0L4g0LrQu9C40LrRg1xyXG4gICAgICAgIHZhciBCYWxsb29uQ29udGVudExheW91dCA9IHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyhcclxuICAgICAgICAgICAgICAgICc8cD57eyB0ZXh0fX08L3A+JyArXHJcbiAgICAgICAgICAgICAgICAnPGEgaHJlZj1cIiNcIiBpZD1cIm1ha2Vfcm91dGVcIiB7JSBpZiAhbGluayAlfWNsYXNzPVwiaGlkZGVuXCJ7JSBlbmRpZiAlfT48aSBjbGFzcz1cImljb24tcm91dGVcIj48L2k+INCf0YDQvtC70L7QttC40YLRjCDQvNCw0YDRiNGA0YPRgjwvYT4nLCB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9C10Lwg0YTRg9C90LrRhtC40Y4gYnVpbGQsINGH0YLQvtCx0Ysg0L/RgNC4INGB0L7Qt9C00LDQvdC40Lgg0LzQsNC60LXRgtCwINC90LDRh9C40L3QsNGC0YxcclxuICAgICAgICAgICAgICAgICAgICAvLyDRgdC70YPRiNCw0YLRjCDRgdC+0LHRi9GC0LjQtSBjbGljayDQvdCwINC60L3QvtC/0LrQtVxyXG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCh0L3QsNGH0LDQu9CwINCy0YvQt9GL0LLQsNC10Lwg0LzQtdGC0L7QtCBidWlsZCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDQutC70LDRgdGB0LAuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhbGxvb25Db250ZW50TGF5b3V0LnN1cGVyY2xhc3MuYnVpbGQuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0JAg0LfQsNGC0LXQvCDQstGL0L/QvtC70L3Rj9C10Lwg0LTQvtC/0L7Qu9C90LjRgtC10LvRjNC90YvQtSDQtNC10LnRgdGC0LLQuNGPLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjbWFrZV9yb3V0ZScpLmJpbmQoJ2NsaWNrJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRzOiB0aGlzLl9kYXRhLmNvb3JkcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMuX2RhdGEudGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzLm1ha2VSb3V0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0JDQvdCw0LvQvtCz0LjRh9C90L4g0L/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXQvCDRhNGD0L3QutGG0LjRjiBjbGVhciwg0YfRgtC+0LHRiyDRgdC90Y/RgtGMXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0L/RgNC+0YHQu9GD0YjQuNCy0LDQvdC40LUg0LrQu9C40LrQsCDQv9GA0Lgg0YPQtNCw0LvQtdC90LjQuCDQvNCw0LrQtdGC0LAg0YEg0LrQsNGA0YLRiy5cclxuICAgICAgICAgICAgICAgICAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQktGL0L/QvtC70L3Rj9C10Lwg0LTQtdC50YHRgtCy0LjRjyDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1IC0g0YHQvdCw0YfQsNC70LAg0YHQvdC40LzQsNC10Lwg0YHQu9GD0YjQsNGC0LXQu9GPLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQsCDQv9C+0YLQvtC8INCy0YvQt9GL0LLQsNC10Lwg0LzQtdGC0L7QtCBjbGVhciDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDQutC70LDRgdGB0LAuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNtYWtlX3JvdXRlJykudW5iaW5kKCdjbGljaycsIHRoaXMubWFrZVJvdXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQmFsbG9vbkNvbnRlbnRMYXlvdXQuc3VwZXJjbGFzcy5jbGVhci5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG1ha2VSb3V0ZTogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1ha2VSb3V0ZShlLmRhdGEuY29vcmRzLCBlLmRhdGEudGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB2YXIgbWFwID0gbmV3IHltYXBzLk1hcChhcHAuc2hpcHBpbmcubWFwQ29udGFpbmVySUQsIHtcclxuICAgICAgICAgICAgY2VudGVyOiBhcHAuc2hpcHBpbmcubWFwQ2VudGVyLFxyXG4gICAgICAgICAgICB6b29tOiBhcHAuc2hpcHBpbmcubWFwWm9vbSxcclxuICAgICAgICAgICAgYXV0b0ZpdFRvVmlld3BvcnQ6ICdhbHdheXMnLFxyXG4gICAgICAgICAgICBjb250cm9sczogW11cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHN1cHByZXNzTWFwT3BlbkJsb2NrOiB0cnVlLFxyXG4gICAgICAgICAgICBiYWxsb29uTWF4V2lkdGg6IDIwMCxcclxuICAgICAgICAgICAgYmFsbG9vbkNvbnRlbnRMYXlvdXQ6IEJhbGxvb25Db250ZW50TGF5b3V0LFxyXG4gICAgICAgICAgICBiYWxsb29uUGFuZWxNYXhNYXBBcmVhOiAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbWFwLmNvbnRyb2xzLmFkZCgnem9vbUNvbnRyb2wnLCB7XHJcbiAgICAgICAgICAgIHNpemU6ICdzbWFsbCdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINGB0L7QsdGL0YLQuNGPLCDQstC+0LfQvdC40LrQsNGO0YnQtdCz0L4g0L/RgNC4INGJ0LXQu9GH0LrQtVxyXG4gICAgICAgIC8vINC70LXQstC+0Lkg0LrQvdC+0L/QutC+0Lkg0LzRi9GI0Lgg0LIg0LvRjtCx0L7QuSDRgtC+0YfQutC1INC60LDRgNGC0YsuXHJcbiAgICAgICAgbWFwLmV2ZW50cy5hZGQoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgaWYgKCFtYXAuYmFsbG9vbi5pc09wZW4oKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvb3JkcyA9IGUuZ2V0KCdjb29yZHMnKTtcclxuICAgICAgICAgICAgICAgIG1hcC5iYWxsb29uLm9wZW4oY29vcmRzLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ9CX0LDQs9GA0YPQttCw0LXQvCDQtNCw0L3QvdGL0LUuLi4nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkczogY29vcmRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbms6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHltYXBzLmdlb2NvZGUoY29vcmRzKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IHJlcy5nZW9PYmplY3RzLmdldCgwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSBvLmdldEFkZHJlc3NMaW5lKCkucmVwbGFjZSgn0J3QuNC20LXQs9C+0YDQvtC00YHQutCw0Y8g0L7QsdC70LDRgdGC0YwsICcsICcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5iYWxsb29uLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZHM6IGNvb3JkcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMzAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtYXAuYmFsbG9vbi5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINGB0LzQtdC90Ysg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwXHJcbiAgICAgICAgLy8g0Lgg0L7RgtC/0YDQsNCy0LrQsCDQtdC1INCyIHN1Z2dlc3RWaWV3XHJcbiAgICAgICAgbWFwLmV2ZW50cy5hZGQoJ2JvdW5kc2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy5zdWdnZXN0Vmlldy5vcHRpb25zLnNldCgnYm91bmRlZEJ5JywgZS5nZXQoJ25ld0JvdW5kcycpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBhcHAuc2hpcHBpbmcubWFwID0gbWFwO1xyXG5cclxuICAgICAgICAvL2luaXQgc3VnZ2VzdGlvbnNcclxuICAgICAgICBhcHAuc2hpcHBpbmcuaW5pdFN1Z2dlc3QoKTtcclxuXHJcbiAgICAgICAgLy9lbmFibGUgaW5wdXRcclxuICAgICAgICBhcHAuc2hpcHBpbmcuJGFkZHJlc3NJbnB1dC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgIH0sXHJcblxyXG4gICAgbWFrZVJvdXRlOiBmdW5jdGlvbiAoY29vcmQsIHRleHQpIHtcclxuICAgICAgICBhcHAuc2hpcHBpbmcubWFwLmdlb09iamVjdHMucmVtb3ZlQWxsKCk7XHJcbiAgICAgICAgdmFyIGJhbGxvb25MYXlvdXQgPSB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoXHJcbiAgICAgICAgICAgICAgICBcIjxkaXY+XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBidWlsZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLnN1cGVyY2xhc3MuYnVpbGQuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICB2YXIgbXVsdGlSb3V0ZSA9IG5ldyB5bWFwcy5tdWx0aVJvdXRlci5NdWx0aVJvdXRlKHtcclxuICAgICAgICAgICAgLy8g0J7Qv9C40YHQsNC90LjQtSDQvtC/0L7RgNC90YvRhSDRgtC+0YfQtdC6INC80YPQu9GM0YLQuNC80LDRgNGI0YDRg9GC0LBcclxuICAgICAgICAgICAgcmVmZXJlbmNlUG9pbnRzOiBbXHJcbiAgICAgICAgICAgICAgICBhcHBDb25maWcuc2hpcHBpbmcuZnJvbS5nZW8sXHJcbiAgICAgICAgICAgICAgICBjb29yZCxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRzOiAxXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGJvdW5kc0F1dG9BcHBseTogdHJ1ZSxcclxuICAgICAgICAgICAgd2F5UG9pbnRTdGFydEljb25Db250ZW50TGF5b3V0OiB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwQ29uZmlnLnNoaXBwaW5nLmZyb20udGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICksXHJcbi8vICAgICAgICAgICAgd2F5UG9pbnRGaW5pc2hJY29uQ29udGVudExheW91dDogeW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKHRleHQpLFxyXG4vLyAgICAgICAgICAgIHdheVBvaW50RmluaXNoRHJhZ2dhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBiYWxsb29uTGF5b3V0OiBiYWxsb29uTGF5b3V0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbXVsdGlSb3V0ZS5tb2RlbC5ldmVudHMuYWRkKCdyZXF1ZXN0c3VjY2VzcycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1hcC5iYWxsb29uLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIHZhciByb3V0ZSA9IG11bHRpUm91dGUuZ2V0QWN0aXZlUm91dGUoKTtcclxuICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5yb3VuZChyb3V0ZS5wcm9wZXJ0aWVzLmdldCgnZGlzdGFuY2UnKS52YWx1ZSAvIDEwMDApO1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcud3JpdGVSb3V0ZUluZm8oZGlzdGFuY2UsIHRleHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG11bHRpUm91dGUuZXZlbnRzLmFkZCgncmVxdWVzdGZhaWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy5lcnJvck1zZygn0J3QtSDRg9C00LDQu9C+0YHRjCDQv9GA0L7Qu9C+0LbQuNGC0Ywg0LzQsNGA0YjRgNGD0YInKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBhcHAuc2hpcHBpbmcubWFwLmdlb09iamVjdHMuYWRkKG11bHRpUm91dGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICB3cml0ZVJvdXRlSW5mbzogZnVuY3Rpb24gKGRpc3RhbmNlLCBhZGRyZXNzKSB7XHJcbiAgICAgICAgdGhpcy4kYWRkcmVzc0lucHV0LnZhbChhZGRyZXNzKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBTdWdnZXN0VmlldyBoYXMgbm90IG1ldGhvZCBmb3IgY2xvc2UgcGFuZWwsIHJlbW92ZSBjbGFzcyBpbiBpbml0U3VnZ2VzdFxyXG4gICAgICAgIHRoaXMuJGFkZHJlc3NJbnB1dC5zaWJsaW5ncygneW1hcHMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy4kZGlzdGFuY2VJbnB1dC52YWwoZGlzdGFuY2UpO1xyXG4gICAgICAgIHRoaXMuJGRpc3RhbmNlVGV4dC50ZXh0KGRpc3RhbmNlKTtcclxuICAgICAgICB0aGlzLiRzdW1tYXJ5RGl2LnJlbW92ZUNsYXNzKCdfaGlkZGVuJyk7XHJcbiAgICAgICAgdGhpcy4kcmVzZXRCdG4uc2hvdygpO1xyXG4gICAgICAgIHRoaXMuY2FsY1ByaWNlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsZWFyUm91dGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoYXBwLnNoaXBwaW5nLm1hcCkge1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcubWFwLmdlb09iamVjdHMucmVtb3ZlQWxsKCk7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy5tYXAuYmFsbG9vbi5jbG9zZSgpO1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcuJGFkZHJlc3NJbnB1dC52YWwoJycpO1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcuJGRpc3RhbmNlSW5wdXQudmFsKCcnKTtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLiRzdW1tYXJ5RGl2LmFkZENsYXNzKCdfaGlkZGVuJyk7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy4kcmVzZXRCdG4uaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgZXJyb3JNc2c6IGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICBhbGVydChtc2cpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0U3VnZ2VzdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuJGFkZHJlc3NJbnB1dC5vbignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoJ3ltYXBzJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuJGFkZHJlc3NJbnB1dC5vbigna2V5ZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PSAxMykge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBzdWdnZXN0VmlldyA9IG5ldyB5bWFwcy5TdWdnZXN0Vmlldyh0aGlzLiRhZGRyZXNzSW5wdXQuYXR0cignaWQnKSwge1xyXG4gICAgICAgICAgICBvZmZzZXQ6IFstMSwgM10sXHJcbiAgICAgICAgICAgIGJvdW5kZWRCeTogYXBwLnNoaXBwaW5nLm1hcC5nZXRCb3VuZHMoKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdWdnZXN0Vmlldy5ldmVudHMuYWRkKCdzZWxlY3QnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGUuZ2V0KCdpdGVtJyk7XHJcbiAgICAgICAgICAgIHltYXBzLmdlb2NvZGUoaXRlbS52YWx1ZSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvID0gcmVzLmdlb09iamVjdHMuZ2V0KDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAuc2hpcHBpbmcubWFrZVJvdXRlKG8uZ2VvbWV0cnkuX2Nvb3JkaW5hdGVzLCBpdGVtLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN1Z2dlc3RWaWV3ID0gc3VnZ2VzdFZpZXc7XHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgY2FsY1ByaWNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IF90aGF0ID0gdGhpcztcclxuICAgICAgICBsZXQgcnUgPSAnIDxzcGFuIGNsYXNzPVwicnViXCI+4oK9PC9zcGFuPic7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiAnL2Jhc2VpbmZvL2dldHJvYWRjYWxjLnBocCcsXHJcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgZGF0YTogX3RoYXQuJHdyYXBwZXIuc2VyaWFsaXplKCksXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEucHJpY2UgIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuai1yb2FkLXdyYXBlcl9wcmljZScpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuai1yb2FkLXByaWNlX2Vycm9yJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtY29uZmlybWF0aW9uJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoYXQuJHdyYXBwZXIuZmluZCgnLmotY3VycmVudC1wcmljZScpLmh0bWwoZGF0YS5wcmljZSArIHJ1KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmotcm9hZC13cmFwZXJfcHJpY2UnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmotcm9hZC1wcmljZV9lcnJvcicpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuai1yb2FkLWNvbmZpcm1hdGlvbicpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxufSJdLCJmaWxlIjoic2hpcHBpbmcuanMifQ==
