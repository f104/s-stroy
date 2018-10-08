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
                results: 1,
                avoidTrafficJams: true,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzaGlwcGluZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuc2hpcHBpbmcgPSB7XHJcblxyXG4gICAgbWFwQ2VudGVyOiBhcHBDb25maWcuc2hpcHBpbmcubWFwQ2VudGVyIHx8IFs1Ni4zMjY4ODcsIDQ0LjAwNTk4Nl0sXHJcbiAgICBtYXBab29tOiBhcHBDb25maWcuc2hpcHBpbmcubWFwWm9vbSB8fCA5LFxyXG4gICAgJHdyYXBwZXI6IG51bGwsXHJcbiAgICAkYWRkcmVzc0lucHV0OiBudWxsLFxyXG4gICAgJGRpc3RhbmNlSW5wdXQ6IG51bGwsXHJcbiAgICAkZGlzdGFuY2VUZXh0OiBudWxsLFxyXG4gICAgJHN1bW1hcnlEaXY6IG51bGwsXHJcbiAgICAkcmVzZXRCdG46IG51bGwsXHJcbiAgICBtYXBDb250YWluZXJJRDogbnVsbCxcclxuICAgIG1hcDogbnVsbCxcclxuICAgIHN1Z2dlc3RWaWV3OiBudWxsLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gJCAkd3JhcHBlclxyXG4gICAgICovXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoJHdyYXBwZXIpIHtcclxuICAgICAgICB0aGlzLiR3cmFwcGVyID0gJHdyYXBwZXI7XHJcbiAgICAgICAgdGhpcy5tYXBDb250YWluZXJJRCA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fbWFwJykuYXR0cignaWQnKTtcclxuICAgICAgICB0aGlzLiRhZGRyZXNzSW5wdXQgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3JvdXRlLWFkZHJlc3MnKTtcclxuICAgICAgICB0aGlzLiRkaXN0YW5jZUlucHV0ID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yb3V0ZS1kaXN0YW5jZScpO1xyXG4gICAgICAgIHRoaXMuJGRpc3RhbmNlVGV4dCA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fcm91dGUtZGlzdGFuY2UtdGV4dCcpO1xyXG4gICAgICAgIHRoaXMuJHN1bW1hcnlEaXYgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3N1bW1hcnknKTtcclxuICAgICAgICB0aGlzLiRyZXNldEJ0biA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fcmVzZXQnKTtcclxuICAgICAgICB0aGlzLmluaXRTbGlkZXIoKTtcclxuICAgICAgICB0aGlzLmluaXREYXRlcGlja2VyKCk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiAoeW1hcHMpID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnLy9hcGktbWFwcy55YW5kZXgucnUvMi4xLz9sYW5nPXJ1X1JVJm1vZGU9ZGVidWcnLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwic2NyaXB0XCIsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB5bWFwcy5yZWFkeShhcHAuc2hpcHBpbmcuaW5pdE1hcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHltYXBzLnJlYWR5KGFwcC5zaGlwcGluZy5pbml0TWFwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXBwLnNoaXBwaW5nLiRyZXNldEJ0bi5vbignY2xpY2snLCB0aGlzLmNsZWFyUm91dGUpO1xyXG5cclxuICAgICAgICAkd3JhcHBlci5kYXRhKCdpbml0JywgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuY2FsY1ByaWNlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRTbGlkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgX3RoYXQgPSB0aGlzO1xyXG4gICAgICAgIHZhciAkc2xpZGVyID0gdGhpcy4kd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2Nhci1zbGlkZXInKSxcclxuICAgICAgICAgICAgICAgICRyYWRpbyA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19jYXItcmFkaW8nKTtcclxuICAgICAgICBpZiAoJHNsaWRlci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJHNsaWRlci5zbGljayh7XHJcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZmFkZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHJhZGlvLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRyYWRpby5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAkKHRoaXMpLnBhcmVudHMoJy5qcy1zaGlwcGluZ19fY2FyLWxhYmVsJykuaW5kZXgoKTtcclxuICAgICAgICAgICAgICAgIF90aGF0LmNhbGNQcmljZSgpO1xyXG4gICAgICAgICAgICAgICAgJHNsaWRlci5zbGljaygnc2xpY2tHb1RvJywgaW5kZXgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdERhdGVwaWNrZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgX3RoYXQgPSB0aGlzO1xyXG4gICAgICAgIHZhciAkZGF0ZWlucHV0ID0gdGhpcy4kd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2RhdGUtaW5wdXQnKSxcclxuLy8gICAgICAgICAgICAgICAgJGRhdGVpbnB1dCA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlLWlucHV0X19pbnB1dCcpLFxyXG4vLyAgICAgICAgICAgICAgICAkZGF0ZWlucHV0V3JhcHBlciA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlLWlucHV0JyksXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZERheXMgPSBhcHBDb25maWcuc2hpcHBpbmcuZGlzYWJsZWREYXlzIHx8IFswLCA2XTtcclxuICAgICAgICAkZGF0ZWlucHV0LmRhdGVwaWNrZXIoe1xyXG4vLyAgICAgICAgICAgIHBvc2l0aW9uOiAndG9wIHJpZ2h0JyxcclxuICAgICAgICAgICAgcG9zaXRpb246ICdib3R0b20gbGVmdCcsXHJcbi8vICAgICAgICAgICAgb2Zmc2V0OiA0MCxcclxuICAgICAgICAgICAgbmF2VGl0bGVzOiB7XHJcbiAgICAgICAgICAgICAgICBkYXlzOiAnTU0nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vODY0MDAgKiAxMDAwICogMiAtINC00LXQvdGMXHJcbiAgICAgICAgICAgIC8vNDMyMDAwMDAgLSDQv9C+0LvQtNC90Y8g0L/QvtGB0LvQtSAxMlxyXG4gICAgICAgICAgICBtaW5EYXRlOiBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldFRpbWUoKSArIDQzMjAwMDAwICksXHJcbiAgICAgICAgICAgIG9uUmVuZGVyQ2VsbDogZnVuY3Rpb24gKGRhdGUsIGNlbGxUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAvKmlmIChjZWxsVHlwZSA9PSAnZGF5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXNhYmxlZCA9IGRpc2FibGVkRGF5cy5pbmRleE9mKGRheSkgIT0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IGlzRGlzYWJsZWRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uIChmb3JtYXR0ZWREYXRlLCBkYXRlLCBpbnN0KSB7XHJcbiAgICAgICAgICAgICAgICBpbnN0LmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIF90aGF0LmNhbGNQcmljZSgpO1xyXG4vLyAgICAgICAgICAgICAgICAkZGF0ZWlucHV0V3JhcHBlci5yZW1vdmVDbGFzcygnX2VtcHR5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgZGF0ZXBpY2tlciA9ICRkYXRlaW5wdXQuZGF0ZXBpY2tlcigpLmRhdGEoJ2RhdGVwaWNrZXInKTtcclxuICAgICAgICAkKCcuZmFuY3lib3gtc2xpZGUnKS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkYXRlcGlja2VyLmhpZGUoKTtcclxuICAgICAgICB9KTtcclxuLy8gICAgICAgIHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlcGlja2VyLXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgZGF0ZXBpY2tlci5zaG93KCk7XHJcbi8vICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdE1hcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vINGI0LDQsdC70L7QvSDQsdCw0LvRg9C90LAg0L/QviDQutC70LjQutGDXHJcbiAgICAgICAgdmFyIEJhbGxvb25Db250ZW50TGF5b3V0ID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxyXG4gICAgICAgICAgICAgICAgJzxwPnt7IHRleHR9fTwvcD4nICtcclxuICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI1wiIGlkPVwibWFrZV9yb3V0ZVwiIHslIGlmICFsaW5rICV9Y2xhc3M9XCJoaWRkZW5cInslIGVuZGlmICV9PjxpIGNsYXNzPVwiaWNvbi1yb3V0ZVwiPjwvaT4g0J/RgNC+0LvQvtC20LjRgtGMINC80LDRgNGI0YDRg9GCPC9hPicsIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXQvCDRhNGD0L3QutGG0LjRjiBidWlsZCwg0YfRgtC+0LHRiyDQv9GA0Lgg0YHQvtC30LTQsNC90LjQuCDQvNCw0LrQtdGC0LAg0L3QsNGH0LjQvdCw0YLRjFxyXG4gICAgICAgICAgICAgICAgICAgIC8vINGB0LvRg9GI0LDRgtGMINGB0L7QsdGL0YLQuNC1IGNsaWNrINC90LAg0LrQvdC+0L/QutC1XHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0KHQvdCw0YfQsNC70LAg0LLRi9C30YvQstCw0LXQvCDQvNC10YLQvtC0IGJ1aWxkINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+INC60LvQsNGB0YHQsC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQmFsbG9vbkNvbnRlbnRMYXlvdXQuc3VwZXJjbGFzcy5idWlsZC5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQkCDQt9Cw0YLQtdC8INCy0YvQv9C+0LvQvdGP0LXQvCDQtNC+0L/QvtC70L3QuNGC0LXQu9GM0L3Ri9C1INC00LXQudGB0YLQstC40Y8uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNtYWtlX3JvdXRlJykuYmluZCgnY2xpY2snLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZHM6IHRoaXMuX2RhdGEuY29vcmRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy5fZGF0YS50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMubWFrZVJvdXRlKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDQkNC90LDQu9C+0LPQuNGH0L3QviDQv9C10YDQtdC+0L/RgNC10LTQtdC70Y/QtdC8INGE0YPQvdC60YbQuNGOIGNsZWFyLCDRh9GC0L7QsdGLINGB0L3Rj9GC0YxcclxuICAgICAgICAgICAgICAgICAgICAvLyDQv9GA0L7RgdC70YPRiNC40LLQsNC90LjQtSDQutC70LjQutCwINC/0YDQuCDRg9C00LDQu9C10L3QuNC4INC80LDQutC10YLQsCDRgSDQutCw0YDRgtGLLlxyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCS0YvQv9C+0LvQvdGP0LXQvCDQtNC10LnRgdGC0LLQuNGPINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LUgLSDRgdC90LDRh9Cw0LvQsCDRgdC90LjQvNCw0LXQvCDRgdC70YPRiNCw0YLQtdC70Y8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCwINC/0L7RgtC+0Lwg0LLRi9C30YvQstCw0LXQvCDQvNC10YLQvtC0IGNsZWFyINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+INC60LvQsNGB0YHQsC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI21ha2Vfcm91dGUnKS51bmJpbmQoJ2NsaWNrJywgdGhpcy5tYWtlUm91dGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCYWxsb29uQ29udGVudExheW91dC5zdXBlcmNsYXNzLmNsZWFyLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWFrZVJvdXRlOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAuc2hpcHBpbmcubWFrZVJvdXRlKGUuZGF0YS5jb29yZHMsIGUuZGF0YS50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBtYXAgPSBuZXcgeW1hcHMuTWFwKGFwcC5zaGlwcGluZy5tYXBDb250YWluZXJJRCwge1xyXG4gICAgICAgICAgICBjZW50ZXI6IGFwcC5zaGlwcGluZy5tYXBDZW50ZXIsXHJcbiAgICAgICAgICAgIHpvb206IGFwcC5zaGlwcGluZy5tYXBab29tLFxyXG4gICAgICAgICAgICBhdXRvRml0VG9WaWV3cG9ydDogJ2Fsd2F5cycsXHJcbiAgICAgICAgICAgIGNvbnRyb2xzOiBbXVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgc3VwcHJlc3NNYXBPcGVuQmxvY2s6IHRydWUsXHJcbiAgICAgICAgICAgIGJhbGxvb25NYXhXaWR0aDogMjAwLFxyXG4gICAgICAgICAgICBiYWxsb29uQ29udGVudExheW91dDogQmFsbG9vbkNvbnRlbnRMYXlvdXQsXHJcbiAgICAgICAgICAgIGJhbGxvb25QYW5lbE1heE1hcEFyZWE6IDBcclxuICAgICAgICB9KTtcclxuICAgICAgICBtYXAuY29udHJvbHMuYWRkKCd6b29tQ29udHJvbCcsIHtcclxuICAgICAgICAgICAgc2l6ZTogJ3NtYWxsJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0YHQvtCx0YvRgtC40Y8sINCy0L7Qt9C90LjQutCw0Y7RidC10LPQviDQv9GA0Lgg0YnQtdC70YfQutC1XHJcbiAgICAgICAgLy8g0LvQtdCy0L7QuSDQutC90L7Qv9C60L7QuSDQvNGL0YjQuCDQsiDQu9GO0LHQvtC5INGC0L7Rh9C60LUg0LrQsNGA0YLRiy5cclxuICAgICAgICBtYXAuZXZlbnRzLmFkZCgnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBpZiAoIW1hcC5iYWxsb29uLmlzT3BlbigpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29vcmRzID0gZS5nZXQoJ2Nvb3JkcycpO1xyXG4gICAgICAgICAgICAgICAgbWFwLmJhbGxvb24ub3Blbihjb29yZHMsIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAn0JfQsNCz0YDRg9C20LDQtdC8INC00LDQvdC90YvQtS4uLicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29vcmRzOiBjb29yZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgbGluazogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgeW1hcHMuZ2VvY29kZShjb29yZHMpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvID0gcmVzLmdlb09iamVjdHMuZ2V0KDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IG8uZ2V0QWRkcmVzc0xpbmUoKS5yZXBsYWNlKCfQndC40LbQtdCz0L7RgNC+0LTRgdC60LDRjyDQvtCx0LvQsNGB0YLRjCwgJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwLmJhbGxvb24uc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkczogY29vcmRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1hcC5iYWxsb29uLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0YHQvNC10L3RiyDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LBcclxuICAgICAgICAvLyDQuCDQvtGC0L/RgNCw0LLQutCwINC10LUg0LIgc3VnZ2VzdFZpZXdcclxuICAgICAgICBtYXAuZXZlbnRzLmFkZCgnYm91bmRzY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLnN1Z2dlc3RWaWV3Lm9wdGlvbnMuc2V0KCdib3VuZGVkQnknLCBlLmdldCgnbmV3Qm91bmRzJykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGFwcC5zaGlwcGluZy5tYXAgPSBtYXA7XHJcblxyXG4gICAgICAgIC8vaW5pdCBzdWdnZXN0aW9uc1xyXG4gICAgICAgIGFwcC5zaGlwcGluZy5pbml0U3VnZ2VzdCgpO1xyXG5cclxuICAgICAgICAvL2VuYWJsZSBpbnB1dFxyXG4gICAgICAgIGFwcC5zaGlwcGluZy4kYWRkcmVzc0lucHV0LnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYWtlUm91dGU6IGZ1bmN0aW9uIChjb29yZCwgdGV4dCkge1xyXG4gICAgICAgIGFwcC5zaGlwcGluZy5tYXAuZ2VvT2JqZWN0cy5yZW1vdmVBbGwoKTtcclxuICAgICAgICB2YXIgYmFsbG9vbkxheW91dCA9IHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyhcclxuICAgICAgICAgICAgICAgIFwiPGRpdj5cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3Iuc3VwZXJjbGFzcy5idWlsZC5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIHZhciBtdWx0aVJvdXRlID0gbmV3IHltYXBzLm11bHRpUm91dGVyLk11bHRpUm91dGUoe1xyXG4gICAgICAgICAgICAvLyDQntC/0LjRgdCw0L3QuNC1INC+0L/QvtGA0L3Ri9GFINGC0L7Rh9C10Log0LzRg9C70YzRgtC40LzQsNGA0YjRgNGD0YLQsFxyXG4gICAgICAgICAgICByZWZlcmVuY2VQb2ludHM6IFtcclxuICAgICAgICAgICAgICAgIGFwcENvbmZpZy5zaGlwcGluZy5mcm9tLmdlbyxcclxuICAgICAgICAgICAgICAgIGNvb3JkLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdHM6IDEsXHJcbiAgICAgICAgICAgICAgICBhdm9pZFRyYWZmaWNKYW1zOiB0cnVlLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBib3VuZHNBdXRvQXBwbHk6IHRydWUsXHJcbiAgICAgICAgICAgIHdheVBvaW50U3RhcnRJY29uQ29udGVudExheW91dDogeW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxyXG4gICAgICAgICAgICAgICAgICAgIGFwcENvbmZpZy5zaGlwcGluZy5mcm9tLnRleHRcclxuICAgICAgICAgICAgICAgICAgICApLFxyXG4vLyAgICAgICAgICAgIHdheVBvaW50RmluaXNoSWNvbkNvbnRlbnRMYXlvdXQ6IHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyh0ZXh0KSxcclxuLy8gICAgICAgICAgICB3YXlQb2ludEZpbmlzaERyYWdnYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgYmFsbG9vbkxheW91dDogYmFsbG9vbkxheW91dFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG11bHRpUm91dGUubW9kZWwuZXZlbnRzLmFkZCgncmVxdWVzdHN1Y2Nlc3MnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy5tYXAuYmFsbG9vbi5jbG9zZSgpO1xyXG4gICAgICAgICAgICB2YXIgcm91dGUgPSBtdWx0aVJvdXRlLmdldEFjdGl2ZVJvdXRlKCk7XHJcbiAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGgucm91bmQocm91dGUucHJvcGVydGllcy5nZXQoJ2Rpc3RhbmNlJykudmFsdWUgLyAxMDAwKTtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLndyaXRlUm91dGVJbmZvKGRpc3RhbmNlLCB0ZXh0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBtdWx0aVJvdXRlLmV2ZW50cy5hZGQoJ3JlcXVlc3RmYWlsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcuZXJyb3JNc2coJ9Cd0LUg0YPQtNCw0LvQvtGB0Ywg0L/RgNC+0LvQvtC20LjRgtGMINC80LDRgNGI0YDRg9GCJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXBwLnNoaXBwaW5nLm1hcC5nZW9PYmplY3RzLmFkZChtdWx0aVJvdXRlKTtcclxuICAgIH0sXHJcblxyXG4gICAgd3JpdGVSb3V0ZUluZm86IGZ1bmN0aW9uIChkaXN0YW5jZSwgYWRkcmVzcykge1xyXG4gICAgICAgIHRoaXMuJGFkZHJlc3NJbnB1dC52YWwoYWRkcmVzcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gU3VnZ2VzdFZpZXcgaGFzIG5vdCBtZXRob2QgZm9yIGNsb3NlIHBhbmVsLCByZW1vdmUgY2xhc3MgaW4gaW5pdFN1Z2dlc3RcclxuICAgICAgICB0aGlzLiRhZGRyZXNzSW5wdXQuc2libGluZ3MoJ3ltYXBzJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuJGRpc3RhbmNlSW5wdXQudmFsKGRpc3RhbmNlKTtcclxuICAgICAgICB0aGlzLiRkaXN0YW5jZVRleHQudGV4dChkaXN0YW5jZSk7XHJcbiAgICAgICAgdGhpcy4kc3VtbWFyeURpdi5yZW1vdmVDbGFzcygnX2hpZGRlbicpO1xyXG4gICAgICAgIHRoaXMuJHJlc2V0QnRuLnNob3coKTtcclxuICAgICAgICB0aGlzLmNhbGNQcmljZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbGVhclJvdXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKGFwcC5zaGlwcGluZy5tYXApIHtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1hcC5nZW9PYmplY3RzLnJlbW92ZUFsbCgpO1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcubWFwLmJhbGxvb24uY2xvc2UoKTtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLiRhZGRyZXNzSW5wdXQudmFsKCcnKTtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLiRkaXN0YW5jZUlucHV0LnZhbCgnJyk7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy4kc3VtbWFyeURpdi5hZGRDbGFzcygnX2hpZGRlbicpO1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcuJHJlc2V0QnRuLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGVycm9yTXNnOiBmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgYWxlcnQobXNnKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdFN1Z2dlc3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLiRhZGRyZXNzSW5wdXQub24oJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCd5bWFwcycpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLiRhZGRyZXNzSW5wdXQub24oJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMTMpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgc3VnZ2VzdFZpZXcgPSBuZXcgeW1hcHMuU3VnZ2VzdFZpZXcodGhpcy4kYWRkcmVzc0lucHV0LmF0dHIoJ2lkJyksIHtcclxuICAgICAgICAgICAgb2Zmc2V0OiBbLTEsIDNdLFxyXG4gICAgICAgICAgICBib3VuZGVkQnk6IGFwcC5zaGlwcGluZy5tYXAuZ2V0Qm91bmRzKClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3VnZ2VzdFZpZXcuZXZlbnRzLmFkZCgnc2VsZWN0JywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBlLmdldCgnaXRlbScpO1xyXG4gICAgICAgICAgICB5bWFwcy5nZW9jb2RlKGl0ZW0udmFsdWUpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IHJlcy5nZW9PYmplY3RzLmdldCgwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1ha2VSb3V0ZShvLmdlb21ldHJ5Ll9jb29yZGluYXRlcywgaXRlbS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdWdnZXN0VmlldyA9IHN1Z2dlc3RWaWV3O1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGNhbGNQcmljZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5qLWVycm9yLXRvb2x0aXAnKS5yZW1vdmUoKTtcclxuICAgICAgICBsZXQgbWVzc2FnZSA9ICcnO1xyXG4gICAgICAgIGxldCAkZGlzdGFuY2UgPSAkKCcjY2FydC1zaGlwcGluZy1jYWxjX2lucHV0Jyk7XHJcbiAgICAgICAgbGV0ICRkYXRlID0gJCgnLmpzLXNoaXBwaW5nX19kYXRlLWlucHV0Jyk7XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gJGRpc3RhbmNlLnZhbCgpO1xyXG4gICAgICAgIGxldCBkYXRlID0gJGRhdGUudmFsKCk7XHJcblxyXG4gICAgICAgICRkaXN0YW5jZS5yZW1vdmVDbGFzcygnai1yb2FkX2lucHV0LWVycm9yJyk7XHJcbiAgICAgICAgJGRhdGUucmVtb3ZlQ2xhc3MoJ2otcm9hZF9pbnB1dC1lcnJvcicpO1xyXG5cclxuICAgICAgICBpZiAoIWRpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgPSAnPHNwYW4gY2xhc3M9XCJjaGVja2JveF9fdG9vbHRpcCBqLWVycm9yLXRvb2x0aXBcIiBzdHlsZT1cImRpc3BsYXk6IGJsb2NrXCI+XFxuJyArXHJcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjaGVja2JveF9fdG9vbHRpcF9fdGV4dFwiPlxcbicgK1xyXG4gICAgICAgICAgICAgICAgJ9Cj0LrQsNC20LjRgtC1INCw0LTRgNC10YEg0LTQvtGB0YLQsNCy0LrQuFxcbiDQuNC70Lgg0LLRi9Cx0LXRgNC40YLQtSDRgtC+0YfQutGDINC90LAg0LrQsNGA0YLQtSBcXG4nICtcclxuICAgICAgICAgICAgICAgICc8L3NwYW4+XFxuJyArXHJcbiAgICAgICAgICAgICAgICAnPC9zcGFuPic7XHJcbiAgICAgICAgICAgICRkaXN0YW5jZS5hZGRDbGFzcygnai1yb2FkX2lucHV0LWVycm9yJyk7XHJcbiAgICAgICAgICAgICRkaXN0YW5jZS5wYXJlbnQoKS5hcHBlbmQobWVzc2FnZSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWRhdGUpIHtcclxuICAgICAgICAgICAgbWVzc2FnZSA9ICc8c3BhbiBjbGFzcz1cImNoZWNrYm94X190b29sdGlwIGotZXJyb3ItdG9vbHRpcFwiIHN0eWxlPVwiZGlzcGxheTogYmxvY2tcIj5cXG4nICtcclxuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNoZWNrYm94X190b29sdGlwX190ZXh0XCI+XFxuJyArXHJcbiAgICAgICAgICAgICAgICAn0JLRi9Cx0LXRgNC40YLQtSDQtNCw0YLRgyDQtNC+0YHRgtCw0LLQutC4IFxcbicgK1xyXG4gICAgICAgICAgICAgICAgJzwvc3Bhbj5cXG4nICtcclxuICAgICAgICAgICAgICAgICc8L3NwYW4+JztcclxuICAgICAgICAgICAgJGRhdGUuYWRkQ2xhc3MoJ2otcm9hZF9pbnB1dC1lcnJvcicpO1xyXG4gICAgICAgICAgICAkZGF0ZS5wYXJlbnQoKS5hcHBlbmQobWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRkaXN0YW5jZS51bmJpbmQoJ2NsaWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5qLWVycm9yLXRvb2x0aXAnKS5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJGRhdGUudW5iaW5kKCdjbGljaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5maW5kKCcuai1lcnJvci10b29sdGlwJykucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghZGF0ZSB8fCAhZGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgX3RoYXQgPSB0aGlzO1xyXG4gICAgICAgIGxldCBydSA9ICcgPHNwYW4gY2xhc3M9XCJydWJcIj7igr08L3NwYW4+JztcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6ICcvYmFzZWluZm8vZ2V0cm9hZGNhbGMucGhwJyxcclxuICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBkYXRhOiBfdGhhdC4kd3JhcHBlci5zZXJpYWxpemUoKSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XHJcbiAgICAgICAgICAgICAgIC8vICQoJy5qcy1zaGlwcGluZ19fY2FyLWxhYmVsJykuY3NzKCdvcGFjaXR5JywgMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5wcmljZSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtd3JhcGVyX3ByaWNlJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtcHJpY2VfZXJyb3InKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmotcm9hZC1jb25maXJtYXRpb24nKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhhdC4kd3JhcHBlci5maW5kKCcuai1jdXJyZW50LXByaWNlJykuaHRtbChkYXRhLnByaWNlICsgcnUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGRhdGEubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaWQgPSBkYXRhLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3QgPSAkKCdpbnB1dFtuYW1lPVwiJytuYW1lKydcIl0nKS5maWx0ZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCh0aGlzKS52YWwoKSA9PSBpZDtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAvL3NlbGVjdC5wYXJlbnQoKS5jc3MoJ29wYWNpdHknLCAwLjQpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtd3JhcGVyX3ByaWNlJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtcHJpY2VfZXJyb3InKS5odG1sKGRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtcHJpY2VfZXJyb3InKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmotcm9hZC1jb25maXJtYXRpb24nKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcuc2hpcHBpbmdfX2Nhci1zZWxlY3QgaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICQoJy5qcy1zaGlwcGluZ19fY2FyLWxhYmVsJykucmVtb3ZlQ2xhc3MoJ19kaXNhYmxlZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEuZGlzYWJsZWQsIGZ1bmN0aW9uIChpbmRleCx2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGQgPSAkKCdpbnB1dFtuYW1lPVwiJyt2YWx1ZS5uYW1lKydcIl0nKS5maWx0ZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpLnZhbCgpID09IHZhbHVlLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICBzZWxlY3RkLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gJzxzcGFuIGNsYXNzPVwiY2hlY2tib3hfX3Rvb2x0aXAgai1lcnJvci10b29sdGlwXCI+XFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJzxpIGNsYXNzPVwic3ByaXRlIGRlbGl2ZXJ5LXRvb2x0aXBcIj48L2k+XFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY2hlY2tib3hfX3Rvb2x0aXBfX3RleHRcIj5cXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5lcnJvcisnXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJzwvc3Bhbj5cXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAnPC9zcGFuPic7XHJcbiAgICAgICAgICAgICAgICAgICAvL3NlbGVjdGQucGFyZW50KCkuY3NzKCdvcGFjaXR5JywgMC40KTtcclxuICAgICAgICAgICAgICAgICAgIHNlbGVjdGQucGFyZW50KCkuYWRkQ2xhc3MoJ19kaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgc2VsZWN0ZC5wYXJlbnQoKS5hcHBlbmQobWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxufSJdLCJmaWxlIjoic2hpcHBpbmcuanMifQ==
