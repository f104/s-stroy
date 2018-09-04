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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzaGlwcGluZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuc2hpcHBpbmcgPSB7XG5cbiAgICBtYXBDZW50ZXI6IGFwcENvbmZpZy5zaGlwcGluZy5tYXBDZW50ZXIgfHwgWzU2LjMyNjg4NywgNDQuMDA1OTg2XSxcbiAgICBtYXBab29tOiBhcHBDb25maWcuc2hpcHBpbmcubWFwWm9vbSB8fCAxMSxcbiAgICAkd3JhcHBlcjogbnVsbCxcbiAgICAkYWRkcmVzc0lucHV0OiBudWxsLFxuICAgICRkaXN0YW5jZUlucHV0OiBudWxsLFxuICAgICRkaXN0YW5jZVRleHQ6IG51bGwsXG4gICAgJHN1bW1hcnlEaXY6IG51bGwsXG4gICAgJHJlc2V0QnRuOiBudWxsLFxuICAgIG1hcENvbnRhaW5lcklEOiBudWxsLFxuICAgIG1hcDogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSAkICR3cmFwcGVyXG4gICAgICovXG4gICAgaW5pdDogZnVuY3Rpb24gKCR3cmFwcGVyKSB7XG4gICAgICAgIHRoaXMuJHdyYXBwZXIgPSAkd3JhcHBlcjtcbiAgICAgICAgdGhpcy5tYXBDb250YWluZXJJRCA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fbWFwJykuYXR0cignaWQnKTtcbiAgICAgICAgdGhpcy4kYWRkcmVzc0lucHV0ID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yb3V0ZS1hZGRyZXNzJyk7XG4gICAgICAgIHRoaXMuJGRpc3RhbmNlSW5wdXQgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3JvdXRlLWRpc3RhbmNlJyk7XG4gICAgICAgIHRoaXMuJGRpc3RhbmNlVGV4dCA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fcm91dGUtZGlzdGFuY2UtdGV4dCcpO1xuICAgICAgICB0aGlzLiRzdW1tYXJ5RGl2ID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19zdW1tYXJ5Jyk7XG4gICAgICAgIHRoaXMuJHJlc2V0QnRuID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yZXNldCcpO1xuICAgICAgICB0aGlzLmluaXRTbGlkZXIoKTtcbiAgICAgICAgdGhpcy5pbml0RGF0ZXBpY2tlcigpO1xuICAgICAgICBpZiAodHlwZW9mICh5bWFwcykgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogJy8vYXBpLW1hcHMueWFuZGV4LnJ1LzIuMS8/bGFuZz1ydV9SVSZtb2RlPWRlYnVnJyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJzY3JpcHRcIixcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHltYXBzLnJlYWR5KGFwcC5zaGlwcGluZy5pbml0TWFwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHltYXBzLnJlYWR5KGFwcC5zaGlwcGluZy5pbml0TWFwKTtcbiAgICAgICAgfVxuICAgICAgICBhcHAuc2hpcHBpbmcuJHJlc2V0QnRuLm9uKCdjbGljaycsIHRoaXMuY2xlYXJSb3V0ZSk7XG5cbiAgICAgICAgJHdyYXBwZXIuZGF0YSgnaW5pdCcsIHRydWUpO1xuXG4gICAgICAgIHRoaXMuY2FsY1ByaWNlKCk7XG4gICAgfSxcblxuICAgIGluaXRTbGlkZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IF90aGF0ID0gdGhpcztcbiAgICAgICAgdmFyICRzbGlkZXIgPSB0aGlzLiR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fY2FyLXNsaWRlcicpLFxuICAgICAgICAgICAgICAgICRyYWRpbyA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19jYXItcmFkaW8nKTtcbiAgICAgICAgaWYgKCRzbGlkZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICAkc2xpZGVyLnNsaWNrKHtcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZmFkZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkcmFkaW8ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRyYWRpby5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICQodGhpcykucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICQodGhpcykucGFyZW50cygnLmpzLXNoaXBwaW5nX19jYXItbGFiZWwnKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgIF90aGF0LmNhbGNQcmljZSgpO1xuICAgICAgICAgICAgICAgICRzbGlkZXIuc2xpY2soJ3NsaWNrR29UbycsIGluZGV4KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5pdERhdGVwaWNrZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IF90aGF0ID0gdGhpcztcbiAgICAgICAgdmFyICRkYXRlaW5wdXQgPSB0aGlzLiR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZS1pbnB1dCcpLFxuLy8gICAgICAgICAgICAgICAgJGRhdGVpbnB1dCA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlLWlucHV0X19pbnB1dCcpLFxuLy8gICAgICAgICAgICAgICAgJGRhdGVpbnB1dFdyYXBwZXIgPSB0aGlzLiR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZS1pbnB1dCcpLFxuICAgICAgICAgICAgICAgIGRpc2FibGVkRGF5cyA9IGFwcENvbmZpZy5zaGlwcGluZy5kaXNhYmxlZERheXMgfHwgWzAsIDZdO1xuICAgICAgICAkZGF0ZWlucHV0LmRhdGVwaWNrZXIoe1xuLy8gICAgICAgICAgICBwb3NpdGlvbjogJ3RvcCByaWdodCcsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbSBsZWZ0Jyxcbi8vICAgICAgICAgICAgb2Zmc2V0OiA0MCxcbiAgICAgICAgICAgIG5hdlRpdGxlczoge1xuICAgICAgICAgICAgICAgIGRheXM6ICdNTSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLzg2NDAwICogMTAwMCAqIDIgLSDQtNC10L3RjFxuICAgICAgICAgICAgLy80MzIwMDAwMCAtINC/0L7Qu9C00L3RjyDQv9C+0YHQu9C1IDEyXG4gICAgICAgICAgICBtaW5EYXRlOiBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldFRpbWUoKSArIDQzMjAwMDAwICksXG4gICAgICAgICAgICBvblJlbmRlckNlbGw6IGZ1bmN0aW9uIChkYXRlLCBjZWxsVHlwZSkge1xuICAgICAgICAgICAgICAgIC8qaWYgKGNlbGxUeXBlID09ICdkYXknKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERheSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGlzYWJsZWQgPSBkaXNhYmxlZERheXMuaW5kZXhPZihkYXkpICE9IC0xO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IGlzRGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbiAoZm9ybWF0dGVkRGF0ZSwgZGF0ZSwgaW5zdCkge1xuICAgICAgICAgICAgICAgIGluc3QuaGlkZSgpO1xuICAgICAgICAgICAgICAgIF90aGF0LmNhbGNQcmljZSgpO1xuLy8gICAgICAgICAgICAgICAgJGRhdGVpbnB1dFdyYXBwZXIucmVtb3ZlQ2xhc3MoJ19lbXB0eScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGRhdGVwaWNrZXIgPSAkZGF0ZWlucHV0LmRhdGVwaWNrZXIoKS5kYXRhKCdkYXRlcGlja2VyJyk7XG4gICAgICAgICQoJy5mYW5jeWJveC1zbGlkZScpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkYXRlcGlja2VyLmhpZGUoKTtcbiAgICAgICAgfSk7XG4vLyAgICAgICAgdGhpcy4kd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2RhdGVwaWNrZXItdG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgICAgZGF0ZXBpY2tlci5zaG93KCk7XG4vLyAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGluaXRNYXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8g0YjQsNCx0LvQvtC9INCx0LDQu9GD0L3QsCDQv9C+INC60LvQuNC60YNcbiAgICAgICAgdmFyIEJhbGxvb25Db250ZW50TGF5b3V0ID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxuICAgICAgICAgICAgICAgICc8cD57eyB0ZXh0fX08L3A+JyArXG4gICAgICAgICAgICAgICAgJzxhIGhyZWY9XCIjXCIgaWQ9XCJtYWtlX3JvdXRlXCIgeyUgaWYgIWxpbmsgJX1jbGFzcz1cImhpZGRlblwieyUgZW5kaWYgJX0+PGkgY2xhc3M9XCJpY29uLXJvdXRlXCI+PC9pPiDQn9GA0L7Qu9C+0LbQuNGC0Ywg0LzQsNGA0YjRgNGD0YI8L2E+Jywge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vINCf0LXRgNC10L7Qv9GA0LXQtNC10LvRj9C10Lwg0YTRg9C90LrRhtC40Y4gYnVpbGQsINGH0YLQvtCx0Ysg0L/RgNC4INGB0L7Qt9C00LDQvdC40Lgg0LzQsNC60LXRgtCwINC90LDRh9C40L3QsNGC0YxcbiAgICAgICAgICAgICAgICAgICAgLy8g0YHQu9GD0YjQsNGC0Ywg0YHQvtCx0YvRgtC40LUgY2xpY2sg0L3QsCDQutC90L7Qv9C60LVcbiAgICAgICAgICAgICAgICAgICAgYnVpbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCh0L3QsNGH0LDQu9CwINCy0YvQt9GL0LLQsNC10Lwg0LzQtdGC0L7QtCBidWlsZCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDQutC70LDRgdGB0LAuXG4gICAgICAgICAgICAgICAgICAgICAgICBCYWxsb29uQ29udGVudExheW91dC5zdXBlcmNsYXNzLmJ1aWxkLmNhbGwodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQkCDQt9Cw0YLQtdC8INCy0YvQv9C+0LvQvdGP0LXQvCDQtNC+0L/QvtC70L3QuNGC0LXQu9GM0L3Ri9C1INC00LXQudGB0YLQstC40Y8uXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjbWFrZV9yb3V0ZScpLmJpbmQoJ2NsaWNrJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkczogdGhpcy5fZGF0YS5jb29yZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy5fZGF0YS50ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzLm1ha2VSb3V0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLy8g0JDQvdCw0LvQvtCz0LjRh9C90L4g0L/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXQvCDRhNGD0L3QutGG0LjRjiBjbGVhciwg0YfRgtC+0LHRiyDRgdC90Y/RgtGMXG4gICAgICAgICAgICAgICAgICAgIC8vINC/0YDQvtGB0LvRg9GI0LjQstCw0L3QuNC1INC60LvQuNC60LAg0L/RgNC4INGD0LTQsNC70LXQvdC40Lgg0LzQsNC60LXRgtCwINGBINC60LDRgNGC0YsuXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQktGL0L/QvtC70L3Rj9C10Lwg0LTQtdC50YHRgtCy0LjRjyDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1IC0g0YHQvdCw0YfQsNC70LAg0YHQvdC40LzQsNC10Lwg0YHQu9GD0YjQsNGC0LXQu9GPLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0LAg0L/QvtGC0L7QvCDQstGL0LfRi9Cy0LDQtdC8INC80LXRgtC+0LQgY2xlYXIg0YDQvtC00LjRgtC10LvRjNGB0LrQvtCz0L4g0LrQu9Cw0YHRgdCwLlxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI21ha2Vfcm91dGUnKS51bmJpbmQoJ2NsaWNrJywgdGhpcy5tYWtlUm91dGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgQmFsbG9vbkNvbnRlbnRMYXlvdXQuc3VwZXJjbGFzcy5jbGVhci5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIG1ha2VSb3V0ZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5zaGlwcGluZy5tYWtlUm91dGUoZS5kYXRhLmNvb3JkcywgZS5kYXRhLnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIHZhciBtYXAgPSBuZXcgeW1hcHMuTWFwKGFwcC5zaGlwcGluZy5tYXBDb250YWluZXJJRCwge1xuICAgICAgICAgICAgY2VudGVyOiBhcHAuc2hpcHBpbmcubWFwQ2VudGVyLFxuICAgICAgICAgICAgem9vbTogYXBwLnNoaXBwaW5nLm1hcFpvb20sXG4gICAgICAgICAgICBhdXRvRml0VG9WaWV3cG9ydDogJ2Fsd2F5cycsXG4gICAgICAgICAgICBjb250cm9sczogW11cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgc3VwcHJlc3NNYXBPcGVuQmxvY2s6IHRydWUsXG4gICAgICAgICAgICBiYWxsb29uTWF4V2lkdGg6IDIwMCxcbiAgICAgICAgICAgIGJhbGxvb25Db250ZW50TGF5b3V0OiBCYWxsb29uQ29udGVudExheW91dCxcbiAgICAgICAgICAgIGJhbGxvb25QYW5lbE1heE1hcEFyZWE6IDBcbiAgICAgICAgfSk7XG4gICAgICAgIG1hcC5jb250cm9scy5hZGQoJ3pvb21Db250cm9sJywge1xuICAgICAgICAgICAgc2l6ZTogJ3NtYWxsJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvL2luaXQgc3VnZ2VzdGlvbnNcbiAgICAgICAgYXBwLnNoaXBwaW5nLmluaXRTdWdnZXN0KCk7XG5cbiAgICAgICAgLy9lbmFibGUgaW5wdXRcbiAgICAgICAgYXBwLnNoaXBwaW5nLiRhZGRyZXNzSW5wdXQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cbiAgICAgICAgLy8g0J7QsdGA0LDQsdC+0YLQutCwINGB0L7QsdGL0YLQuNGPLCDQstC+0LfQvdC40LrQsNGO0YnQtdCz0L4g0L/RgNC4INGJ0LXQu9GH0LrQtVxuICAgICAgICAvLyDQu9C10LLQvtC5INC60L3QvtC/0LrQvtC5INC80YvRiNC4INCyINC70Y7QsdC+0Lkg0YLQvtGH0LrQtSDQutCw0YDRgtGLLlxuICAgICAgICBtYXAuZXZlbnRzLmFkZCgnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgaWYgKCFtYXAuYmFsbG9vbi5pc09wZW4oKSkge1xuICAgICAgICAgICAgICAgIHZhciBjb29yZHMgPSBlLmdldCgnY29vcmRzJyk7XG4gICAgICAgICAgICAgICAgbWFwLmJhbGxvb24ub3Blbihjb29yZHMsIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ9CX0LDQs9GA0YPQttCw0LXQvCDQtNCw0L3QvdGL0LUuLi4nLFxuICAgICAgICAgICAgICAgICAgICBjb29yZHM6IGNvb3JkcyxcbiAgICAgICAgICAgICAgICAgICAgbGluazogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB5bWFwcy5nZW9jb2RlKGNvb3JkcykudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IHJlcy5nZW9PYmplY3RzLmdldCgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gby5nZXRBZGRyZXNzTGluZSgpLnJlcGxhY2UoJ9Cd0LjQttC10LPQvtGA0L7QtNGB0LrQsNGPINC+0LHQu9Cw0YHRgtGMLCAnLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5iYWxsb29uLnNldERhdGEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkczogY29vcmRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluazogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1hcC5iYWxsb29uLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAuc2hpcHBpbmcubWFwID0gbWFwO1xuICAgIH0sXG5cbiAgICBtYWtlUm91dGU6IGZ1bmN0aW9uIChjb29yZCwgdGV4dCkge1xuICAgICAgICBhcHAuc2hpcHBpbmcubWFwLmdlb09iamVjdHMucmVtb3ZlQWxsKCk7XG4gICAgICAgIHZhciBiYWxsb29uTGF5b3V0ID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxuICAgICAgICAgICAgICAgIFwiPGRpdj5cIiwge1xuICAgICAgICAgICAgICAgICAgICBidWlsZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5zdXBlcmNsYXNzLmJ1aWxkLmNhbGwodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHZhciBtdWx0aVJvdXRlID0gbmV3IHltYXBzLm11bHRpUm91dGVyLk11bHRpUm91dGUoe1xuICAgICAgICAgICAgLy8g0J7Qv9C40YHQsNC90LjQtSDQvtC/0L7RgNC90YvRhSDRgtC+0YfQtdC6INC80YPQu9GM0YLQuNC80LDRgNGI0YDRg9GC0LBcbiAgICAgICAgICAgIHJlZmVyZW5jZVBvaW50czogW1xuICAgICAgICAgICAgICAgIGFwcENvbmZpZy5zaGlwcGluZy5mcm9tLmdlbyxcbiAgICAgICAgICAgICAgICBjb29yZCxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICByZXN1bHRzOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGJvdW5kc0F1dG9BcHBseTogdHJ1ZSxcbiAgICAgICAgICAgIHdheVBvaW50U3RhcnRJY29uQ29udGVudExheW91dDogeW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxuICAgICAgICAgICAgICAgICAgICBhcHBDb25maWcuc2hpcHBpbmcuZnJvbS50ZXh0XG4gICAgICAgICAgICAgICAgICAgICksXG4vLyAgICAgICAgICAgIHdheVBvaW50RmluaXNoSWNvbkNvbnRlbnRMYXlvdXQ6IHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyh0ZXh0KSxcbi8vICAgICAgICAgICAgd2F5UG9pbnRGaW5pc2hEcmFnZ2FibGU6IHRydWUsXG4gICAgICAgICAgICBiYWxsb29uTGF5b3V0OiBiYWxsb29uTGF5b3V0XG4gICAgICAgIH0pO1xuICAgICAgICBtdWx0aVJvdXRlLm1vZGVsLmV2ZW50cy5hZGQoJ3JlcXVlc3RzdWNjZXNzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1hcC5iYWxsb29uLmNsb3NlKCk7XG4gICAgICAgICAgICB2YXIgcm91dGUgPSBtdWx0aVJvdXRlLmdldEFjdGl2ZVJvdXRlKCk7XG4gICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnJvdW5kKHJvdXRlLnByb3BlcnRpZXMuZ2V0KCdkaXN0YW5jZScpLnZhbHVlIC8gMTAwMCk7XG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcud3JpdGVSb3V0ZUluZm8oZGlzdGFuY2UsIHRleHQpO1xuICAgICAgICB9KTtcbiAgICAgICAgbXVsdGlSb3V0ZS5ldmVudHMuYWRkKCdyZXF1ZXN0ZmFpbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy5lcnJvck1zZygn0J3QtSDRg9C00LDQu9C+0YHRjCDQv9GA0L7Qu9C+0LbQuNGC0Ywg0LzQsNGA0YjRgNGD0YInKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5zaGlwcGluZy5tYXAuZ2VvT2JqZWN0cy5hZGQobXVsdGlSb3V0ZSk7XG4gICAgfSxcblxuICAgIHdyaXRlUm91dGVJbmZvOiBmdW5jdGlvbiAoZGlzdGFuY2UsIGFkZHJlc3MpIHtcbiAgICAgICAgdGhpcy4kYWRkcmVzc0lucHV0LnZhbChhZGRyZXNzKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFN1Z2dlc3RWaWV3IGhhcyBub3QgbWV0aG9kIGZvciBjbG9zZSBwYW5lbCwgcmVtb3ZlIGNsYXNzIGluIGluaXRTdWdnZXN0XG4gICAgICAgIHRoaXMuJGFkZHJlc3NJbnB1dC5zaWJsaW5ncygneW1hcHMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRkaXN0YW5jZUlucHV0LnZhbChkaXN0YW5jZSk7XG4gICAgICAgIHRoaXMuJGRpc3RhbmNlVGV4dC50ZXh0KGRpc3RhbmNlKTtcbiAgICAgICAgdGhpcy4kc3VtbWFyeURpdi5yZW1vdmVDbGFzcygnX2hpZGRlbicpO1xuICAgICAgICB0aGlzLiRyZXNldEJ0bi5zaG93KCk7XG4gICAgICAgIHRoaXMuY2FsY1ByaWNlKCk7XG4gICAgfSxcblxuICAgIGNsZWFyUm91dGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGFwcC5zaGlwcGluZy5tYXApIHtcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy5tYXAuZ2VvT2JqZWN0cy5yZW1vdmVBbGwoKTtcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy5tYXAuYmFsbG9vbi5jbG9zZSgpO1xuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLiRhZGRyZXNzSW5wdXQudmFsKCcnKTtcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy4kZGlzdGFuY2VJbnB1dC52YWwoJycpO1xuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLiRzdW1tYXJ5RGl2LmFkZENsYXNzKCdfaGlkZGVuJyk7XG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcuJHJlc2V0QnRuLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBlcnJvck1zZzogZnVuY3Rpb24gKG1zZykge1xuICAgICAgICBhbGVydChtc2cpO1xuICAgIH0sXG5cbiAgICBpbml0U3VnZ2VzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLiRhZGRyZXNzSW5wdXQub24oJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygneW1hcHMnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLiRhZGRyZXNzSW5wdXQub24oJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgc3VnZ2VzdFZpZXcgPSBuZXcgeW1hcHMuU3VnZ2VzdFZpZXcodGhpcy4kYWRkcmVzc0lucHV0LmF0dHIoJ2lkJyksIHtcbiAgICAgICAgICAgIG9mZnNldDogWy0xLCAzXVxuICAgICAgICB9KTtcblxuICAgICAgICBzdWdnZXN0Vmlldy5ldmVudHMuYWRkKCdzZWxlY3QnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBlLmdldCgnaXRlbScpO1xuICAgICAgICAgICAgeW1hcHMuZ2VvY29kZShpdGVtLnZhbHVlKS50aGVuKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IHJlcy5nZW9PYmplY3RzLmdldCgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5zaGlwcGluZy5tYWtlUm91dGUoby5nZW9tZXRyeS5fY29vcmRpbmF0ZXMsIGl0ZW0udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGNhbGNQcmljZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgX3RoYXQgPSB0aGlzO1xuICAgICAgICBsZXQgcnUgPSAnIDxzcGFuIGNsYXNzPVwicnViXCI+4oK9PC9zcGFuPic7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6ICcvYmFzZWluZm8vZ2V0cm9hZGNhbGMucGhwJyxcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBkYXRhOiBfdGhhdC4kd3JhcHBlci5zZXJpYWxpemUoKSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MoZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnByaWNlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtd3JhcGVyX3ByaWNlJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuai1yb2FkLXByaWNlX2Vycm9yJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuai1yb2FkLWNvbmZpcm1hdGlvbicpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBfdGhhdC4kd3JhcHBlci5maW5kKCcuai1jdXJyZW50LXByaWNlJykuaHRtbChkYXRhLnByaWNlICsgcnUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtd3JhcGVyX3ByaWNlJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuai1yb2FkLXByaWNlX2Vycm9yJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuai1yb2FkLWNvbmZpcm1hdGlvbicpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbn0iXSwiZmlsZSI6InNoaXBwaW5nLmpzIn0=
