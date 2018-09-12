app.shipping = {

    mapCenter: appConfig.shipping.mapCenter || [56.326887, 44.005986],
    mapZoom: appConfig.shipping.mapZoom || 9,
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
        $('.j-error-tooltip').remove();
        let message = '';
        let $distance = $('#cart-shipping-calc_input');
        let $date = $('.js-shipping__date-input');
        let distance = $distance.val();
        let date = $date.val();

        $distance.removeClass('j-road_input-error');
        $date.removeClass('j-road_input-error');

        if (!distance) {
            message = '<span class="checkbox__tooltip j-error-tooltip" style="display: block">\n' +
                '<span class="checkbox__tooltip__text">\n' +
                'Укажите адрес доставки\n или выберите точку на карте \n' +
                '</span>\n' +
                '</span>';
            $distance.addClass('j-road_input-error');
            $distance.parent().append(message);

        }
        if (!date) {
            message = '<span class="checkbox__tooltip j-error-tooltip" style="display: block">\n' +
                '<span class="checkbox__tooltip__text">\n' +
                'Выберите дату доставки \n' +
                '</span>\n' +
                '</span>';
            $date.addClass('j-road_input-error');
            $date.parent().append(message);
        }
        $distance.unbind('click').on('click', function () {
            $(this).parent().find('.j-error-tooltip').remove();
        });

        $date.unbind('click').on('click', function () {
            $(this).parent().find('.j-error-tooltip').remove();
        });

        if (!date || !distance) {
            return;
        }
        let _that = this;
        let ru = ' <span class="rub">₽</span>';
        $.ajax({
            url: '/baseinfo/getroadcalc.php',
            type: 'post',
            dataType: 'json',
            data: _that.$wrapper.serialize(),
            success: function success(data) {
               // $('.js-shipping__car-label').css('opacity', 1);
                if (data.price !== 0) {
                    $('.j-road-wraper_price').show();
                    $('.j-road-price_error').hide();
                    $('.j-road-confirmation').prop('disabled', false);
                    _that.$wrapper.find('.j-current-price').html(data.price + ru);
                } else {
                    let name = data.name;
                    let id = data.id;
                    let select = $('input[name="'+name+'"]').filter(function () {
                        return $(this).val() == id;
                    });
                    //select.parent().css('opacity', 0.4);
                    $('.j-road-wraper_price').hide();
                    $('.j-road-price_error').html(data.error);
                    $('.j-road-price_error').show();
                    $('.j-road-confirmation').prop('disabled', true);
                };

                $('.shipping__car-select input').prop('disabled', false);
                $('.js-shipping__car-label').removeClass('_disabled');

               $.each(data.disabled, function (index,value) {
                   let selectd = $('input[name="'+value.name+'"]').filter(function () {
                       return $(this).val() == value.id;
                   });
                   selectd.prop('disabled', true);
                   message = '<span class="checkbox__tooltip j-error-tooltip">\n' +
                       '<i class="sprite delivery-tooltip"></i>\n' +
                       '<span class="checkbox__tooltip__text">\n' +
                       value.error+'\n' +
                       '</span>\n' +
                       '</span>';
                   //selectd.parent().css('opacity', 0.4);
                   selectd.parent().addClass('_disabled');
                   selectd.parent().append(message);
               });
            }
        });
    },

}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzaGlwcGluZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuc2hpcHBpbmcgPSB7XG5cbiAgICBtYXBDZW50ZXI6IGFwcENvbmZpZy5zaGlwcGluZy5tYXBDZW50ZXIgfHwgWzU2LjMyNjg4NywgNDQuMDA1OTg2XSxcbiAgICBtYXBab29tOiBhcHBDb25maWcuc2hpcHBpbmcubWFwWm9vbSB8fCA5LFxuICAgICR3cmFwcGVyOiBudWxsLFxuICAgICRhZGRyZXNzSW5wdXQ6IG51bGwsXG4gICAgJGRpc3RhbmNlSW5wdXQ6IG51bGwsXG4gICAgJGRpc3RhbmNlVGV4dDogbnVsbCxcbiAgICAkc3VtbWFyeURpdjogbnVsbCxcbiAgICAkcmVzZXRCdG46IG51bGwsXG4gICAgbWFwQ29udGFpbmVySUQ6IG51bGwsXG4gICAgbWFwOiBudWxsLFxuICAgIHN1Z2dlc3RWaWV3OiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtICQgJHdyYXBwZXJcbiAgICAgKi9cbiAgICBpbml0OiBmdW5jdGlvbiAoJHdyYXBwZXIpIHtcbiAgICAgICAgdGhpcy4kd3JhcHBlciA9ICR3cmFwcGVyO1xuICAgICAgICB0aGlzLm1hcENvbnRhaW5lcklEID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19tYXAnKS5hdHRyKCdpZCcpO1xuICAgICAgICB0aGlzLiRhZGRyZXNzSW5wdXQgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3JvdXRlLWFkZHJlc3MnKTtcbiAgICAgICAgdGhpcy4kZGlzdGFuY2VJbnB1dCA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fcm91dGUtZGlzdGFuY2UnKTtcbiAgICAgICAgdGhpcy4kZGlzdGFuY2VUZXh0ID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yb3V0ZS1kaXN0YW5jZS10ZXh0Jyk7XG4gICAgICAgIHRoaXMuJHN1bW1hcnlEaXYgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3N1bW1hcnknKTtcbiAgICAgICAgdGhpcy4kcmVzZXRCdG4gPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3Jlc2V0Jyk7XG4gICAgICAgIHRoaXMuaW5pdFNsaWRlcigpO1xuICAgICAgICB0aGlzLmluaXREYXRlcGlja2VyKCk7XG4gICAgICAgIGlmICh0eXBlb2YgKHltYXBzKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnLy9hcGktbWFwcy55YW5kZXgucnUvMi4xLz9sYW5nPXJ1X1JVJm1vZGU9ZGVidWcnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcInNjcmlwdFwiLFxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgeW1hcHMucmVhZHkoYXBwLnNoaXBwaW5nLmluaXRNYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeW1hcHMucmVhZHkoYXBwLnNoaXBwaW5nLmluaXRNYXApO1xuICAgICAgICB9XG4gICAgICAgIGFwcC5zaGlwcGluZy4kcmVzZXRCdG4ub24oJ2NsaWNrJywgdGhpcy5jbGVhclJvdXRlKTtcblxuICAgICAgICAkd3JhcHBlci5kYXRhKCdpbml0JywgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5jYWxjUHJpY2UoKTtcbiAgICB9LFxuXG4gICAgaW5pdFNsaWRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgX3RoYXQgPSB0aGlzO1xuICAgICAgICB2YXIgJHNsaWRlciA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19jYXItc2xpZGVyJyksXG4gICAgICAgICAgICAgICAgJHJhZGlvID0gdGhpcy4kd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2Nhci1yYWRpbycpO1xuICAgICAgICBpZiAoJHNsaWRlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICRzbGlkZXIuc2xpY2soe1xuICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBmYWRlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRyYWRpby5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHJhZGlvLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gJCh0aGlzKS5wYXJlbnRzKCcuanMtc2hpcHBpbmdfX2Nhci1sYWJlbCcpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgX3RoYXQuY2FsY1ByaWNlKCk7XG4gICAgICAgICAgICAgICAgJHNsaWRlci5zbGljaygnc2xpY2tHb1RvJywgaW5kZXgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0RGF0ZXBpY2tlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgX3RoYXQgPSB0aGlzO1xuICAgICAgICB2YXIgJGRhdGVpbnB1dCA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlLWlucHV0JyksXG4vLyAgICAgICAgICAgICAgICAkZGF0ZWlucHV0ID0gdGhpcy4kd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2RhdGUtaW5wdXRfX2lucHV0JyksXG4vLyAgICAgICAgICAgICAgICAkZGF0ZWlucHV0V3JhcHBlciA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlLWlucHV0JyksXG4gICAgICAgICAgICAgICAgZGlzYWJsZWREYXlzID0gYXBwQ29uZmlnLnNoaXBwaW5nLmRpc2FibGVkRGF5cyB8fCBbMCwgNl07XG4gICAgICAgICRkYXRlaW5wdXQuZGF0ZXBpY2tlcih7XG4vLyAgICAgICAgICAgIHBvc2l0aW9uOiAndG9wIHJpZ2h0JyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tIGxlZnQnLFxuLy8gICAgICAgICAgICBvZmZzZXQ6IDQwLFxuICAgICAgICAgICAgbmF2VGl0bGVzOiB7XG4gICAgICAgICAgICAgICAgZGF5czogJ01NJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vODY0MDAgKiAxMDAwICogMiAtINC00LXQvdGMXG4gICAgICAgICAgICAvLzQzMjAwMDAwIC0g0L/QvtC70LTQvdGPINC/0L7RgdC70LUgMTJcbiAgICAgICAgICAgIG1pbkRhdGU6IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgNDMyMDAwMDAgKSxcbiAgICAgICAgICAgIG9uUmVuZGVyQ2VsbDogZnVuY3Rpb24gKGRhdGUsIGNlbGxUeXBlKSB7XG4gICAgICAgICAgICAgICAgLyppZiAoY2VsbFR5cGUgPT0gJ2RheScpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRheSA9IGRhdGUuZ2V0RGF5KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXNhYmxlZCA9IGRpc2FibGVkRGF5cy5pbmRleE9mKGRheSkgIT0gLTE7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogaXNEaXNhYmxlZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uIChmb3JtYXR0ZWREYXRlLCBkYXRlLCBpbnN0KSB7XG4gICAgICAgICAgICAgICAgaW5zdC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgX3RoYXQuY2FsY1ByaWNlKCk7XG4vLyAgICAgICAgICAgICAgICAkZGF0ZWlucHV0V3JhcHBlci5yZW1vdmVDbGFzcygnX2VtcHR5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgZGF0ZXBpY2tlciA9ICRkYXRlaW5wdXQuZGF0ZXBpY2tlcigpLmRhdGEoJ2RhdGVwaWNrZXInKTtcbiAgICAgICAgJCgnLmZhbmN5Ym94LXNsaWRlJykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRhdGVwaWNrZXIuaGlkZSgpO1xuICAgICAgICB9KTtcbi8vICAgICAgICB0aGlzLiR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fZGF0ZXBpY2tlci10b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICAgICBkYXRlcGlja2VyLnNob3coKTtcbi8vICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgaW5pdE1hcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyDRiNCw0LHQu9C+0L0g0LHQsNC70YPQvdCwINC/0L4g0LrQu9C40LrRg1xuICAgICAgICB2YXIgQmFsbG9vbkNvbnRlbnRMYXlvdXQgPSB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoXG4gICAgICAgICAgICAgICAgJzxwPnt7IHRleHR9fTwvcD4nICtcbiAgICAgICAgICAgICAgICAnPGEgaHJlZj1cIiNcIiBpZD1cIm1ha2Vfcm91dGVcIiB7JSBpZiAhbGluayAlfWNsYXNzPVwiaGlkZGVuXCJ7JSBlbmRpZiAlfT48aSBjbGFzcz1cImljb24tcm91dGVcIj48L2k+INCf0YDQvtC70L7QttC40YLRjCDQvNCw0YDRiNGA0YPRgjwvYT4nLCB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXQvCDRhNGD0L3QutGG0LjRjiBidWlsZCwg0YfRgtC+0LHRiyDQv9GA0Lgg0YHQvtC30LTQsNC90LjQuCDQvNCw0LrQtdGC0LAg0L3QsNGH0LjQvdCw0YLRjFxuICAgICAgICAgICAgICAgICAgICAvLyDRgdC70YPRiNCw0YLRjCDRgdC+0LHRi9GC0LjQtSBjbGljayDQvdCwINC60L3QvtC/0LrQtVxuICAgICAgICAgICAgICAgICAgICBidWlsZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0KHQvdCw0YfQsNC70LAg0LLRi9C30YvQstCw0LXQvCDQvNC10YLQvtC0IGJ1aWxkINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+INC60LvQsNGB0YHQsC5cbiAgICAgICAgICAgICAgICAgICAgICAgIEJhbGxvb25Db250ZW50TGF5b3V0LnN1cGVyY2xhc3MuYnVpbGQuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCQINC30LDRgtC10Lwg0LLRi9C/0L7Qu9C90Y/QtdC8INC00L7Qv9C+0LvQvdC40YLQtdC70YzQvdGL0LUg0LTQtdC50YHRgtCy0LjRjy5cbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNtYWtlX3JvdXRlJykuYmluZCgnY2xpY2snLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRzOiB0aGlzLl9kYXRhLmNvb3JkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLl9kYXRhLnRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMubWFrZVJvdXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvLyDQkNC90LDQu9C+0LPQuNGH0L3QviDQv9C10YDQtdC+0L/RgNC10LTQtdC70Y/QtdC8INGE0YPQvdC60YbQuNGOIGNsZWFyLCDRh9GC0L7QsdGLINGB0L3Rj9GC0YxcbiAgICAgICAgICAgICAgICAgICAgLy8g0L/RgNC+0YHQu9GD0YjQuNCy0LDQvdC40LUg0LrQu9C40LrQsCDQv9GA0Lgg0YPQtNCw0LvQtdC90LjQuCDQvNCw0LrQtdGC0LAg0YEg0LrQsNGA0YLRiy5cbiAgICAgICAgICAgICAgICAgICAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCS0YvQv9C+0LvQvdGP0LXQvCDQtNC10LnRgdGC0LLQuNGPINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LUgLSDRgdC90LDRh9Cw0LvQsCDRgdC90LjQvNCw0LXQvCDRgdC70YPRiNCw0YLQtdC70Y8sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQsCDQv9C+0YLQvtC8INCy0YvQt9GL0LLQsNC10Lwg0LzQtdGC0L7QtCBjbGVhciDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDQutC70LDRgdGB0LAuXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjbWFrZV9yb3V0ZScpLnVuYmluZCgnY2xpY2snLCB0aGlzLm1ha2VSb3V0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBCYWxsb29uQ29udGVudExheW91dC5zdXBlcmNsYXNzLmNsZWFyLmNhbGwodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgbWFrZVJvdXRlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1ha2VSb3V0ZShlLmRhdGEuY29vcmRzLCBlLmRhdGEudGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgdmFyIG1hcCA9IG5ldyB5bWFwcy5NYXAoYXBwLnNoaXBwaW5nLm1hcENvbnRhaW5lcklELCB7XG4gICAgICAgICAgICBjZW50ZXI6IGFwcC5zaGlwcGluZy5tYXBDZW50ZXIsXG4gICAgICAgICAgICB6b29tOiBhcHAuc2hpcHBpbmcubWFwWm9vbSxcbiAgICAgICAgICAgIGF1dG9GaXRUb1ZpZXdwb3J0OiAnYWx3YXlzJyxcbiAgICAgICAgICAgIGNvbnRyb2xzOiBbXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBzdXBwcmVzc01hcE9wZW5CbG9jazogdHJ1ZSxcbiAgICAgICAgICAgIGJhbGxvb25NYXhXaWR0aDogMjAwLFxuICAgICAgICAgICAgYmFsbG9vbkNvbnRlbnRMYXlvdXQ6IEJhbGxvb25Db250ZW50TGF5b3V0LFxuICAgICAgICAgICAgYmFsbG9vblBhbmVsTWF4TWFwQXJlYTogMFxuICAgICAgICB9KTtcbiAgICAgICAgbWFwLmNvbnRyb2xzLmFkZCgnem9vbUNvbnRyb2wnLCB7XG4gICAgICAgICAgICBzaXplOiAnc21hbGwnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDRgdC+0LHRi9GC0LjRjywg0LLQvtC30L3QuNC60LDRjtGJ0LXQs9C+INC/0YDQuCDRidC10LvRh9C60LVcbiAgICAgICAgLy8g0LvQtdCy0L7QuSDQutC90L7Qv9C60L7QuSDQvNGL0YjQuCDQsiDQu9GO0LHQvtC5INGC0L7Rh9C60LUg0LrQsNGA0YLRiy5cbiAgICAgICAgbWFwLmV2ZW50cy5hZGQoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmICghbWFwLmJhbGxvb24uaXNPcGVuKCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29vcmRzID0gZS5nZXQoJ2Nvb3JkcycpO1xuICAgICAgICAgICAgICAgIG1hcC5iYWxsb29uLm9wZW4oY29vcmRzLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICfQl9Cw0LPRgNGD0LbQsNC10Lwg0LTQsNC90L3Ri9C1Li4uJyxcbiAgICAgICAgICAgICAgICAgICAgY29vcmRzOiBjb29yZHMsXG4gICAgICAgICAgICAgICAgICAgIGxpbms6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgeW1hcHMuZ2VvY29kZShjb29yZHMpLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSByZXMuZ2VvT2JqZWN0cy5nZXQoMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IG8uZ2V0QWRkcmVzc0xpbmUoKS5yZXBsYWNlKCfQndC40LbQtdCz0L7RgNC+0LTRgdC60LDRjyDQvtCx0LvQsNGB0YLRjCwgJywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXAuYmFsbG9vbi5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZHM6IGNvb3JkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYXAuYmFsbG9vbi5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIC8vINCe0LHRgNCw0LHQvtGC0LrQsCDRgdC80LXQvdGLINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsFxuICAgICAgICAvLyDQuCDQvtGC0L/RgNCw0LLQutCwINC10LUg0LIgc3VnZ2VzdFZpZXdcbiAgICAgICAgbWFwLmV2ZW50cy5hZGQoJ2JvdW5kc2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcuc3VnZ2VzdFZpZXcub3B0aW9ucy5zZXQoJ2JvdW5kZWRCeScsIGUuZ2V0KCduZXdCb3VuZHMnKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgYXBwLnNoaXBwaW5nLm1hcCA9IG1hcDtcblxuICAgICAgICAvL2luaXQgc3VnZ2VzdGlvbnNcbiAgICAgICAgYXBwLnNoaXBwaW5nLmluaXRTdWdnZXN0KCk7XG5cbiAgICAgICAgLy9lbmFibGUgaW5wdXRcbiAgICAgICAgYXBwLnNoaXBwaW5nLiRhZGRyZXNzSW5wdXQucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIG1ha2VSb3V0ZTogZnVuY3Rpb24gKGNvb3JkLCB0ZXh0KSB7XG4gICAgICAgIGFwcC5zaGlwcGluZy5tYXAuZ2VvT2JqZWN0cy5yZW1vdmVBbGwoKTtcbiAgICAgICAgdmFyIGJhbGxvb25MYXlvdXQgPSB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoXG4gICAgICAgICAgICAgICAgXCI8ZGl2PlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLnN1cGVyY2xhc3MuYnVpbGQuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgdmFyIG11bHRpUm91dGUgPSBuZXcgeW1hcHMubXVsdGlSb3V0ZXIuTXVsdGlSb3V0ZSh7XG4gICAgICAgICAgICAvLyDQntC/0LjRgdCw0L3QuNC1INC+0L/QvtGA0L3Ri9GFINGC0L7Rh9C10Log0LzRg9C70YzRgtC40LzQsNGA0YjRgNGD0YLQsFxuICAgICAgICAgICAgcmVmZXJlbmNlUG9pbnRzOiBbXG4gICAgICAgICAgICAgICAgYXBwQ29uZmlnLnNoaXBwaW5nLmZyb20uZ2VvLFxuICAgICAgICAgICAgICAgIGNvb3JkLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHJlc3VsdHM6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgYm91bmRzQXV0b0FwcGx5OiB0cnVlLFxuICAgICAgICAgICAgd2F5UG9pbnRTdGFydEljb25Db250ZW50TGF5b3V0OiB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3MoXG4gICAgICAgICAgICAgICAgICAgIGFwcENvbmZpZy5zaGlwcGluZy5mcm9tLnRleHRcbiAgICAgICAgICAgICAgICAgICAgKSxcbi8vICAgICAgICAgICAgd2F5UG9pbnRGaW5pc2hJY29uQ29udGVudExheW91dDogeW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKHRleHQpLFxuLy8gICAgICAgICAgICB3YXlQb2ludEZpbmlzaERyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGJhbGxvb25MYXlvdXQ6IGJhbGxvb25MYXlvdXRcbiAgICAgICAgfSk7XG4gICAgICAgIG11bHRpUm91dGUubW9kZWwuZXZlbnRzLmFkZCgncmVxdWVzdHN1Y2Nlc3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcubWFwLmJhbGxvb24uY2xvc2UoKTtcbiAgICAgICAgICAgIHZhciByb3V0ZSA9IG11bHRpUm91dGUuZ2V0QWN0aXZlUm91dGUoKTtcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGgucm91bmQocm91dGUucHJvcGVydGllcy5nZXQoJ2Rpc3RhbmNlJykudmFsdWUgLyAxMDAwKTtcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy53cml0ZVJvdXRlSW5mbyhkaXN0YW5jZSwgdGV4dCk7XG4gICAgICAgIH0pO1xuICAgICAgICBtdWx0aVJvdXRlLmV2ZW50cy5hZGQoJ3JlcXVlc3RmYWlsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLmVycm9yTXNnKCfQndC1INGD0LTQsNC70L7RgdGMINC/0YDQvtC70L7QttC40YLRjCDQvNCw0YDRiNGA0YPRgicpO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLnNoaXBwaW5nLm1hcC5nZW9PYmplY3RzLmFkZChtdWx0aVJvdXRlKTtcbiAgICB9LFxuXG4gICAgd3JpdGVSb3V0ZUluZm86IGZ1bmN0aW9uIChkaXN0YW5jZSwgYWRkcmVzcykge1xuICAgICAgICB0aGlzLiRhZGRyZXNzSW5wdXQudmFsKGFkZHJlc3MpO1xuICAgICAgICBcbiAgICAgICAgLy8gU3VnZ2VzdFZpZXcgaGFzIG5vdCBtZXRob2QgZm9yIGNsb3NlIHBhbmVsLCByZW1vdmUgY2xhc3MgaW4gaW5pdFN1Z2dlc3RcbiAgICAgICAgdGhpcy4kYWRkcmVzc0lucHV0LnNpYmxpbmdzKCd5bWFwcycpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGRpc3RhbmNlSW5wdXQudmFsKGRpc3RhbmNlKTtcbiAgICAgICAgdGhpcy4kZGlzdGFuY2VUZXh0LnRleHQoZGlzdGFuY2UpO1xuICAgICAgICB0aGlzLiRzdW1tYXJ5RGl2LnJlbW92ZUNsYXNzKCdfaGlkZGVuJyk7XG4gICAgICAgIHRoaXMuJHJlc2V0QnRuLnNob3coKTtcbiAgICAgICAgdGhpcy5jYWxjUHJpY2UoKTtcbiAgICB9LFxuXG4gICAgY2xlYXJSb3V0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoYXBwLnNoaXBwaW5nLm1hcCkge1xuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1hcC5nZW9PYmplY3RzLnJlbW92ZUFsbCgpO1xuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1hcC5iYWxsb29uLmNsb3NlKCk7XG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcuJGFkZHJlc3NJbnB1dC52YWwoJycpO1xuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLiRkaXN0YW5jZUlucHV0LnZhbCgnJyk7XG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcuJHN1bW1hcnlEaXYuYWRkQ2xhc3MoJ19oaWRkZW4nKTtcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy4kcmVzZXRCdG4uaGlkZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGVycm9yTXNnOiBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgIGFsZXJ0KG1zZyk7XG4gICAgfSxcblxuICAgIGluaXRTdWdnZXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuJGFkZHJlc3NJbnB1dC5vbignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCd5bWFwcycpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuJGFkZHJlc3NJbnB1dC5vbigna2V5ZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBzdWdnZXN0VmlldyA9IG5ldyB5bWFwcy5TdWdnZXN0Vmlldyh0aGlzLiRhZGRyZXNzSW5wdXQuYXR0cignaWQnKSwge1xuICAgICAgICAgICAgb2Zmc2V0OiBbLTEsIDNdLFxuICAgICAgICAgICAgYm91bmRlZEJ5OiBhcHAuc2hpcHBpbmcubWFwLmdldEJvdW5kcygpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN1Z2dlc3RWaWV3LmV2ZW50cy5hZGQoJ3NlbGVjdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGUuZ2V0KCdpdGVtJyk7XG4gICAgICAgICAgICB5bWFwcy5nZW9jb2RlKGl0ZW0udmFsdWUpLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvID0gcmVzLmdlb09iamVjdHMuZ2V0KDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1ha2VSb3V0ZShvLmdlb21ldHJ5Ll9jb29yZGluYXRlcywgaXRlbS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc3VnZ2VzdFZpZXcgPSBzdWdnZXN0VmlldztcbiAgICAgICAgXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgY2FsY1ByaWNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5qLWVycm9yLXRvb2x0aXAnKS5yZW1vdmUoKTtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSAnJztcbiAgICAgICAgbGV0ICRkaXN0YW5jZSA9ICQoJyNjYXJ0LXNoaXBwaW5nLWNhbGNfaW5wdXQnKTtcbiAgICAgICAgbGV0ICRkYXRlID0gJCgnLmpzLXNoaXBwaW5nX19kYXRlLWlucHV0Jyk7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9ICRkaXN0YW5jZS52YWwoKTtcbiAgICAgICAgbGV0IGRhdGUgPSAkZGF0ZS52YWwoKTtcblxuICAgICAgICAkZGlzdGFuY2UucmVtb3ZlQ2xhc3MoJ2otcm9hZF9pbnB1dC1lcnJvcicpO1xuICAgICAgICAkZGF0ZS5yZW1vdmVDbGFzcygnai1yb2FkX2lucHV0LWVycm9yJyk7XG5cbiAgICAgICAgaWYgKCFkaXN0YW5jZSkge1xuICAgICAgICAgICAgbWVzc2FnZSA9ICc8c3BhbiBjbGFzcz1cImNoZWNrYm94X190b29sdGlwIGotZXJyb3ItdG9vbHRpcFwiIHN0eWxlPVwiZGlzcGxheTogYmxvY2tcIj5cXG4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjaGVja2JveF9fdG9vbHRpcF9fdGV4dFwiPlxcbicgK1xuICAgICAgICAgICAgICAgICfQo9C60LDQttC40YLQtSDQsNC00YDQtdGBINC00L7RgdGC0LDQstC60LhcXG4g0LjQu9C4INCy0YvQsdC10YDQuNGC0LUg0YLQvtGH0LrRgyDQvdCwINC60LDRgNGC0LUgXFxuJyArXG4gICAgICAgICAgICAgICAgJzwvc3Bhbj5cXG4nICtcbiAgICAgICAgICAgICAgICAnPC9zcGFuPic7XG4gICAgICAgICAgICAkZGlzdGFuY2UuYWRkQ2xhc3MoJ2otcm9hZF9pbnB1dC1lcnJvcicpO1xuICAgICAgICAgICAgJGRpc3RhbmNlLnBhcmVudCgpLmFwcGVuZChtZXNzYWdlKTtcblxuICAgICAgICB9XG4gICAgICAgIGlmICghZGF0ZSkge1xuICAgICAgICAgICAgbWVzc2FnZSA9ICc8c3BhbiBjbGFzcz1cImNoZWNrYm94X190b29sdGlwIGotZXJyb3ItdG9vbHRpcFwiIHN0eWxlPVwiZGlzcGxheTogYmxvY2tcIj5cXG4nICtcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjaGVja2JveF9fdG9vbHRpcF9fdGV4dFwiPlxcbicgK1xuICAgICAgICAgICAgICAgICfQktGL0LHQtdGA0LjRgtC1INC00LDRgtGDINC00L7RgdGC0LDQstC60LggXFxuJyArXG4gICAgICAgICAgICAgICAgJzwvc3Bhbj5cXG4nICtcbiAgICAgICAgICAgICAgICAnPC9zcGFuPic7XG4gICAgICAgICAgICAkZGF0ZS5hZGRDbGFzcygnai1yb2FkX2lucHV0LWVycm9yJyk7XG4gICAgICAgICAgICAkZGF0ZS5wYXJlbnQoKS5hcHBlbmQobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgJGRpc3RhbmNlLnVuYmluZCgnY2xpY2snKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5qLWVycm9yLXRvb2x0aXAnKS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGRhdGUudW5iaW5kKCdjbGljaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuZmluZCgnLmotZXJyb3ItdG9vbHRpcCcpLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWRhdGUgfHwgIWRpc3RhbmNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IF90aGF0ID0gdGhpcztcbiAgICAgICAgbGV0IHJ1ID0gJyA8c3BhbiBjbGFzcz1cInJ1YlwiPuKCvTwvc3Bhbj4nO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnL2Jhc2VpbmZvL2dldHJvYWRjYWxjLnBocCcsXG4gICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YTogX3RoYXQuJHdyYXBwZXIuc2VyaWFsaXplKCksXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgICAgICAgIC8vICQoJy5qcy1zaGlwcGluZ19fY2FyLWxhYmVsJykuY3NzKCdvcGFjaXR5JywgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEucHJpY2UgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmotcm9hZC13cmFwZXJfcHJpY2UnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtcHJpY2VfZXJyb3InKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtY29uZmlybWF0aW9uJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGF0LiR3cmFwcGVyLmZpbmQoJy5qLWN1cnJlbnQtcHJpY2UnKS5odG1sKGRhdGEucHJpY2UgKyBydSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBkYXRhLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpZCA9IGRhdGEuaWQ7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3QgPSAkKCdpbnB1dFtuYW1lPVwiJytuYW1lKydcIl0nKS5maWx0ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQodGhpcykudmFsKCkgPT0gaWQ7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAvL3NlbGVjdC5wYXJlbnQoKS5jc3MoJ29wYWNpdHknLCAwLjQpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuai1yb2FkLXdyYXBlcl9wcmljZScpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmotcm9hZC1wcmljZV9lcnJvcicpLmh0bWwoZGF0YS5lcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtcHJpY2VfZXJyb3InKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtY29uZmlybWF0aW9uJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgJCgnLnNoaXBwaW5nX19jYXItc2VsZWN0IGlucHV0JykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgJCgnLmpzLXNoaXBwaW5nX19jYXItbGFiZWwnKS5yZW1vdmVDbGFzcygnX2Rpc2FibGVkJyk7XG5cbiAgICAgICAgICAgICAgICQuZWFjaChkYXRhLmRpc2FibGVkLCBmdW5jdGlvbiAoaW5kZXgsdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZCA9ICQoJ2lucHV0W25hbWU9XCInK3ZhbHVlLm5hbWUrJ1wiXScpLmZpbHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpLnZhbCgpID09IHZhbHVlLmlkO1xuICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgIHNlbGVjdGQucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gJzxzcGFuIGNsYXNzPVwiY2hlY2tib3hfX3Rvb2x0aXAgai1lcnJvci10b29sdGlwXCI+XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICc8aSBjbGFzcz1cInNwcml0ZSBkZWxpdmVyeS10b29sdGlwXCI+PC9pPlxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjaGVja2JveF9fdG9vbHRpcF9fdGV4dFwiPlxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5lcnJvcisnXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICc8L3NwYW4+XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICc8L3NwYW4+JztcbiAgICAgICAgICAgICAgICAgICAvL3NlbGVjdGQucGFyZW50KCkuY3NzKCdvcGFjaXR5JywgMC40KTtcbiAgICAgICAgICAgICAgICAgICBzZWxlY3RkLnBhcmVudCgpLmFkZENsYXNzKCdfZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICBzZWxlY3RkLnBhcmVudCgpLmFwcGVuZChtZXNzYWdlKTtcbiAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG59Il0sImZpbGUiOiJzaGlwcGluZy5qcyJ9
