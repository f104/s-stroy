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
                $('.j-error-tooltip').remove();

               $.each(data.disabled, function (index,value) {
                   let selectd = $('input[name="'+value.name+'"]').filter(function () {
                       return $(this).val() == value.id;
                   });
                   selectd.prop('disabled', true);
                   let message = '<span class="checkbox__tooltip j-error-tooltip">\n' +
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzaGlwcGluZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhcHAuc2hpcHBpbmcgPSB7XHJcblxyXG4gICAgbWFwQ2VudGVyOiBhcHBDb25maWcuc2hpcHBpbmcubWFwQ2VudGVyIHx8IFs1Ni4zMjY4ODcsIDQ0LjAwNTk4Nl0sXHJcbiAgICBtYXBab29tOiBhcHBDb25maWcuc2hpcHBpbmcubWFwWm9vbSB8fCA5LFxyXG4gICAgJHdyYXBwZXI6IG51bGwsXHJcbiAgICAkYWRkcmVzc0lucHV0OiBudWxsLFxyXG4gICAgJGRpc3RhbmNlSW5wdXQ6IG51bGwsXHJcbiAgICAkZGlzdGFuY2VUZXh0OiBudWxsLFxyXG4gICAgJHN1bW1hcnlEaXY6IG51bGwsXHJcbiAgICAkcmVzZXRCdG46IG51bGwsXHJcbiAgICBtYXBDb250YWluZXJJRDogbnVsbCxcclxuICAgIG1hcDogbnVsbCxcclxuICAgIHN1Z2dlc3RWaWV3OiBudWxsLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gJCAkd3JhcHBlclxyXG4gICAgICovXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoJHdyYXBwZXIpIHtcclxuICAgICAgICB0aGlzLiR3cmFwcGVyID0gJHdyYXBwZXI7XHJcbiAgICAgICAgdGhpcy5tYXBDb250YWluZXJJRCA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fbWFwJykuYXR0cignaWQnKTtcclxuICAgICAgICB0aGlzLiRhZGRyZXNzSW5wdXQgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3JvdXRlLWFkZHJlc3MnKTtcclxuICAgICAgICB0aGlzLiRkaXN0YW5jZUlucHV0ID0gJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19yb3V0ZS1kaXN0YW5jZScpO1xyXG4gICAgICAgIHRoaXMuJGRpc3RhbmNlVGV4dCA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fcm91dGUtZGlzdGFuY2UtdGV4dCcpO1xyXG4gICAgICAgIHRoaXMuJHN1bW1hcnlEaXYgPSAkd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX3N1bW1hcnknKTtcclxuICAgICAgICB0aGlzLiRyZXNldEJ0biA9ICR3cmFwcGVyLmZpbmQoJy5qcy1zaGlwcGluZ19fcmVzZXQnKTtcclxuICAgICAgICB0aGlzLmluaXRTbGlkZXIoKTtcclxuICAgICAgICB0aGlzLmluaXREYXRlcGlja2VyKCk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiAoeW1hcHMpID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnLy9hcGktbWFwcy55YW5kZXgucnUvMi4xLz9sYW5nPXJ1X1JVJm1vZGU9ZGVidWcnLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwic2NyaXB0XCIsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB5bWFwcy5yZWFkeShhcHAuc2hpcHBpbmcuaW5pdE1hcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHltYXBzLnJlYWR5KGFwcC5zaGlwcGluZy5pbml0TWFwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXBwLnNoaXBwaW5nLiRyZXNldEJ0bi5vbignY2xpY2snLCB0aGlzLmNsZWFyUm91dGUpO1xyXG5cclxuICAgICAgICAkd3JhcHBlci5kYXRhKCdpbml0JywgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuY2FsY1ByaWNlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRTbGlkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgX3RoYXQgPSB0aGlzO1xyXG4gICAgICAgIHZhciAkc2xpZGVyID0gdGhpcy4kd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2Nhci1zbGlkZXInKSxcclxuICAgICAgICAgICAgICAgICRyYWRpbyA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19jYXItcmFkaW8nKTtcclxuICAgICAgICBpZiAoJHNsaWRlci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJHNsaWRlci5zbGljayh7XHJcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZmFkZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHJhZGlvLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRyYWRpby5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAkKHRoaXMpLnBhcmVudHMoJy5qcy1zaGlwcGluZ19fY2FyLWxhYmVsJykuaW5kZXgoKTtcclxuICAgICAgICAgICAgICAgIF90aGF0LmNhbGNQcmljZSgpO1xyXG4gICAgICAgICAgICAgICAgJHNsaWRlci5zbGljaygnc2xpY2tHb1RvJywgaW5kZXgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdERhdGVwaWNrZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgX3RoYXQgPSB0aGlzO1xyXG4gICAgICAgIHZhciAkZGF0ZWlucHV0ID0gdGhpcy4kd3JhcHBlci5maW5kKCcuanMtc2hpcHBpbmdfX2RhdGUtaW5wdXQnKSxcclxuLy8gICAgICAgICAgICAgICAgJGRhdGVpbnB1dCA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlLWlucHV0X19pbnB1dCcpLFxyXG4vLyAgICAgICAgICAgICAgICAkZGF0ZWlucHV0V3JhcHBlciA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlLWlucHV0JyksXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZERheXMgPSBhcHBDb25maWcuc2hpcHBpbmcuZGlzYWJsZWREYXlzIHx8IFswLCA2XTtcclxuICAgICAgICAkZGF0ZWlucHV0LmRhdGVwaWNrZXIoe1xyXG4vLyAgICAgICAgICAgIHBvc2l0aW9uOiAndG9wIHJpZ2h0JyxcclxuICAgICAgICAgICAgcG9zaXRpb246ICdib3R0b20gbGVmdCcsXHJcbi8vICAgICAgICAgICAgb2Zmc2V0OiA0MCxcclxuICAgICAgICAgICAgbmF2VGl0bGVzOiB7XHJcbiAgICAgICAgICAgICAgICBkYXlzOiAnTU0nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vODY0MDAgKiAxMDAwICogMiAtINC00LXQvdGMXHJcbiAgICAgICAgICAgIC8vNDMyMDAwMDAgLSDQv9C+0LvQtNC90Y8g0L/QvtGB0LvQtSAxMlxyXG4gICAgICAgICAgICBtaW5EYXRlOiBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldFRpbWUoKSArIDQzMjAwMDAwICksXHJcbiAgICAgICAgICAgIG9uUmVuZGVyQ2VsbDogZnVuY3Rpb24gKGRhdGUsIGNlbGxUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAvKmlmIChjZWxsVHlwZSA9PSAnZGF5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXNhYmxlZCA9IGRpc2FibGVkRGF5cy5pbmRleE9mKGRheSkgIT0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IGlzRGlzYWJsZWRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uIChmb3JtYXR0ZWREYXRlLCBkYXRlLCBpbnN0KSB7XHJcbiAgICAgICAgICAgICAgICBpbnN0LmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIF90aGF0LmNhbGNQcmljZSgpO1xyXG4vLyAgICAgICAgICAgICAgICAkZGF0ZWlucHV0V3JhcHBlci5yZW1vdmVDbGFzcygnX2VtcHR5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgZGF0ZXBpY2tlciA9ICRkYXRlaW5wdXQuZGF0ZXBpY2tlcigpLmRhdGEoJ2RhdGVwaWNrZXInKTtcclxuICAgICAgICAkKCcuZmFuY3lib3gtc2xpZGUnKS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkYXRlcGlja2VyLmhpZGUoKTtcclxuICAgICAgICB9KTtcclxuLy8gICAgICAgIHRoaXMuJHdyYXBwZXIuZmluZCgnLmpzLXNoaXBwaW5nX19kYXRlcGlja2VyLXRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgZGF0ZXBpY2tlci5zaG93KCk7XHJcbi8vICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdE1hcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vINGI0LDQsdC70L7QvSDQsdCw0LvRg9C90LAg0L/QviDQutC70LjQutGDXHJcbiAgICAgICAgdmFyIEJhbGxvb25Db250ZW50TGF5b3V0ID0geW1hcHMudGVtcGxhdGVMYXlvdXRGYWN0b3J5LmNyZWF0ZUNsYXNzKFxyXG4gICAgICAgICAgICAgICAgJzxwPnt7IHRleHR9fTwvcD4nICtcclxuICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI1wiIGlkPVwibWFrZV9yb3V0ZVwiIHslIGlmICFsaW5rICV9Y2xhc3M9XCJoaWRkZW5cInslIGVuZGlmICV9PjxpIGNsYXNzPVwiaWNvbi1yb3V0ZVwiPjwvaT4g0J/RgNC+0LvQvtC20LjRgtGMINC80LDRgNGI0YDRg9GCPC9hPicsIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0J/QtdGA0LXQvtC/0YDQtdC00LXQu9GP0LXQvCDRhNGD0L3QutGG0LjRjiBidWlsZCwg0YfRgtC+0LHRiyDQv9GA0Lgg0YHQvtC30LTQsNC90LjQuCDQvNCw0LrQtdGC0LAg0L3QsNGH0LjQvdCw0YLRjFxyXG4gICAgICAgICAgICAgICAgICAgIC8vINGB0LvRg9GI0LDRgtGMINGB0L7QsdGL0YLQuNC1IGNsaWNrINC90LAg0LrQvdC+0L/QutC1XHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0KHQvdCw0YfQsNC70LAg0LLRi9C30YvQstCw0LXQvCDQvNC10YLQvtC0IGJ1aWxkINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+INC60LvQsNGB0YHQsC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQmFsbG9vbkNvbnRlbnRMYXlvdXQuc3VwZXJjbGFzcy5idWlsZC5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDQkCDQt9Cw0YLQtdC8INCy0YvQv9C+0LvQvdGP0LXQvCDQtNC+0L/QvtC70L3QuNGC0LXQu9GM0L3Ri9C1INC00LXQudGB0YLQstC40Y8uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNtYWtlX3JvdXRlJykuYmluZCgnY2xpY2snLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZHM6IHRoaXMuX2RhdGEuY29vcmRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy5fZGF0YS50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMubWFrZVJvdXRlKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDQkNC90LDQu9C+0LPQuNGH0L3QviDQv9C10YDQtdC+0L/RgNC10LTQtdC70Y/QtdC8INGE0YPQvdC60YbQuNGOIGNsZWFyLCDRh9GC0L7QsdGLINGB0L3Rj9GC0YxcclxuICAgICAgICAgICAgICAgICAgICAvLyDQv9GA0L7RgdC70YPRiNC40LLQsNC90LjQtSDQutC70LjQutCwINC/0YDQuCDRg9C00LDQu9C10L3QuNC4INC80LDQutC10YLQsCDRgSDQutCw0YDRgtGLLlxyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCS0YvQv9C+0LvQvdGP0LXQvCDQtNC10LnRgdGC0LLQuNGPINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LUgLSDRgdC90LDRh9Cw0LvQsCDRgdC90LjQvNCw0LXQvCDRgdC70YPRiNCw0YLQtdC70Y8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCwINC/0L7RgtC+0Lwg0LLRi9C30YvQstCw0LXQvCDQvNC10YLQvtC0IGNsZWFyINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+INC60LvQsNGB0YHQsC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI21ha2Vfcm91dGUnKS51bmJpbmQoJ2NsaWNrJywgdGhpcy5tYWtlUm91dGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCYWxsb29uQ29udGVudExheW91dC5zdXBlcmNsYXNzLmNsZWFyLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWFrZVJvdXRlOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAuc2hpcHBpbmcubWFrZVJvdXRlKGUuZGF0YS5jb29yZHMsIGUuZGF0YS50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBtYXAgPSBuZXcgeW1hcHMuTWFwKGFwcC5zaGlwcGluZy5tYXBDb250YWluZXJJRCwge1xyXG4gICAgICAgICAgICBjZW50ZXI6IGFwcC5zaGlwcGluZy5tYXBDZW50ZXIsXHJcbiAgICAgICAgICAgIHpvb206IGFwcC5zaGlwcGluZy5tYXBab29tLFxyXG4gICAgICAgICAgICBhdXRvRml0VG9WaWV3cG9ydDogJ2Fsd2F5cycsXHJcbiAgICAgICAgICAgIGNvbnRyb2xzOiBbXVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgc3VwcHJlc3NNYXBPcGVuQmxvY2s6IHRydWUsXHJcbiAgICAgICAgICAgIGJhbGxvb25NYXhXaWR0aDogMjAwLFxyXG4gICAgICAgICAgICBiYWxsb29uQ29udGVudExheW91dDogQmFsbG9vbkNvbnRlbnRMYXlvdXQsXHJcbiAgICAgICAgICAgIGJhbGxvb25QYW5lbE1heE1hcEFyZWE6IDBcclxuICAgICAgICB9KTtcclxuICAgICAgICBtYXAuY29udHJvbHMuYWRkKCd6b29tQ29udHJvbCcsIHtcclxuICAgICAgICAgICAgc2l6ZTogJ3NtYWxsJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0YHQvtCx0YvRgtC40Y8sINCy0L7Qt9C90LjQutCw0Y7RidC10LPQviDQv9GA0Lgg0YnQtdC70YfQutC1XHJcbiAgICAgICAgLy8g0LvQtdCy0L7QuSDQutC90L7Qv9C60L7QuSDQvNGL0YjQuCDQsiDQu9GO0LHQvtC5INGC0L7Rh9C60LUg0LrQsNGA0YLRiy5cclxuICAgICAgICBtYXAuZXZlbnRzLmFkZCgnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBpZiAoIW1hcC5iYWxsb29uLmlzT3BlbigpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29vcmRzID0gZS5nZXQoJ2Nvb3JkcycpO1xyXG4gICAgICAgICAgICAgICAgbWFwLmJhbGxvb24ub3Blbihjb29yZHMsIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAn0JfQsNCz0YDRg9C20LDQtdC8INC00LDQvdC90YvQtS4uLicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29vcmRzOiBjb29yZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgbGluazogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgeW1hcHMuZ2VvY29kZShjb29yZHMpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvID0gcmVzLmdlb09iamVjdHMuZ2V0KDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IG8uZ2V0QWRkcmVzc0xpbmUoKS5yZXBsYWNlKCfQndC40LbQtdCz0L7RgNC+0LTRgdC60LDRjyDQvtCx0LvQsNGB0YLRjCwgJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwLmJhbGxvb24uc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkczogY29vcmRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1hcC5iYWxsb29uLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICAvLyDQntCx0YDQsNCx0L7RgtC60LAg0YHQvNC10L3RiyDQvtCx0LvQsNGB0YLQuCDQv9GA0L7RgdC80L7RgtGA0LBcclxuICAgICAgICAvLyDQuCDQvtGC0L/RgNCw0LLQutCwINC10LUg0LIgc3VnZ2VzdFZpZXdcclxuICAgICAgICBtYXAuZXZlbnRzLmFkZCgnYm91bmRzY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLnN1Z2dlc3RWaWV3Lm9wdGlvbnMuc2V0KCdib3VuZGVkQnknLCBlLmdldCgnbmV3Qm91bmRzJykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGFwcC5zaGlwcGluZy5tYXAgPSBtYXA7XHJcblxyXG4gICAgICAgIC8vaW5pdCBzdWdnZXN0aW9uc1xyXG4gICAgICAgIGFwcC5zaGlwcGluZy5pbml0U3VnZ2VzdCgpO1xyXG5cclxuICAgICAgICAvL2VuYWJsZSBpbnB1dFxyXG4gICAgICAgIGFwcC5zaGlwcGluZy4kYWRkcmVzc0lucHV0LnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgfSxcclxuXHJcbiAgICBtYWtlUm91dGU6IGZ1bmN0aW9uIChjb29yZCwgdGV4dCkge1xyXG4gICAgICAgIGFwcC5zaGlwcGluZy5tYXAuZ2VvT2JqZWN0cy5yZW1vdmVBbGwoKTtcclxuICAgICAgICB2YXIgYmFsbG9vbkxheW91dCA9IHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyhcclxuICAgICAgICAgICAgICAgIFwiPGRpdj5cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3Iuc3VwZXJjbGFzcy5idWlsZC5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIHZhciBtdWx0aVJvdXRlID0gbmV3IHltYXBzLm11bHRpUm91dGVyLk11bHRpUm91dGUoe1xyXG4gICAgICAgICAgICAvLyDQntC/0LjRgdCw0L3QuNC1INC+0L/QvtGA0L3Ri9GFINGC0L7Rh9C10Log0LzRg9C70YzRgtC40LzQsNGA0YjRgNGD0YLQsFxyXG4gICAgICAgICAgICByZWZlcmVuY2VQb2ludHM6IFtcclxuICAgICAgICAgICAgICAgIGFwcENvbmZpZy5zaGlwcGluZy5mcm9tLmdlbyxcclxuICAgICAgICAgICAgICAgIGNvb3JkLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdHM6IDFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgYm91bmRzQXV0b0FwcGx5OiB0cnVlLFxyXG4gICAgICAgICAgICB3YXlQb2ludFN0YXJ0SWNvbkNvbnRlbnRMYXlvdXQ6IHltYXBzLnRlbXBsYXRlTGF5b3V0RmFjdG9yeS5jcmVhdGVDbGFzcyhcclxuICAgICAgICAgICAgICAgICAgICBhcHBDb25maWcuc2hpcHBpbmcuZnJvbS50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuLy8gICAgICAgICAgICB3YXlQb2ludEZpbmlzaEljb25Db250ZW50TGF5b3V0OiB5bWFwcy50ZW1wbGF0ZUxheW91dEZhY3RvcnkuY3JlYXRlQ2xhc3ModGV4dCksXHJcbi8vICAgICAgICAgICAgd2F5UG9pbnRGaW5pc2hEcmFnZ2FibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGJhbGxvb25MYXlvdXQ6IGJhbGxvb25MYXlvdXRcclxuICAgICAgICB9KTtcclxuICAgICAgICBtdWx0aVJvdXRlLm1vZGVsLmV2ZW50cy5hZGQoJ3JlcXVlc3RzdWNjZXNzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcubWFwLmJhbGxvb24uY2xvc2UoKTtcclxuICAgICAgICAgICAgdmFyIHJvdXRlID0gbXVsdGlSb3V0ZS5nZXRBY3RpdmVSb3V0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnJvdW5kKHJvdXRlLnByb3BlcnRpZXMuZ2V0KCdkaXN0YW5jZScpLnZhbHVlIC8gMTAwMCk7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy53cml0ZVJvdXRlSW5mbyhkaXN0YW5jZSwgdGV4dCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbXVsdGlSb3V0ZS5ldmVudHMuYWRkKCdyZXF1ZXN0ZmFpbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLmVycm9yTXNnKCfQndC1INGD0LTQsNC70L7RgdGMINC/0YDQvtC70L7QttC40YLRjCDQvNCw0YDRiNGA0YPRgicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFwcC5zaGlwcGluZy5tYXAuZ2VvT2JqZWN0cy5hZGQobXVsdGlSb3V0ZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHdyaXRlUm91dGVJbmZvOiBmdW5jdGlvbiAoZGlzdGFuY2UsIGFkZHJlc3MpIHtcclxuICAgICAgICB0aGlzLiRhZGRyZXNzSW5wdXQudmFsKGFkZHJlc3MpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFN1Z2dlc3RWaWV3IGhhcyBub3QgbWV0aG9kIGZvciBjbG9zZSBwYW5lbCwgcmVtb3ZlIGNsYXNzIGluIGluaXRTdWdnZXN0XHJcbiAgICAgICAgdGhpcy4kYWRkcmVzc0lucHV0LnNpYmxpbmdzKCd5bWFwcycpLmFkZENsYXNzKCdoaWRkZW4nKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLiRkaXN0YW5jZUlucHV0LnZhbChkaXN0YW5jZSk7XHJcbiAgICAgICAgdGhpcy4kZGlzdGFuY2VUZXh0LnRleHQoZGlzdGFuY2UpO1xyXG4gICAgICAgIHRoaXMuJHN1bW1hcnlEaXYucmVtb3ZlQ2xhc3MoJ19oaWRkZW4nKTtcclxuICAgICAgICB0aGlzLiRyZXNldEJ0bi5zaG93KCk7XHJcbiAgICAgICAgdGhpcy5jYWxjUHJpY2UoKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xlYXJSb3V0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChhcHAuc2hpcHBpbmcubWFwKSB7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy5tYXAuZ2VvT2JqZWN0cy5yZW1vdmVBbGwoKTtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLm1hcC5iYWxsb29uLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy4kYWRkcmVzc0lucHV0LnZhbCgnJyk7XHJcbiAgICAgICAgICAgIGFwcC5zaGlwcGluZy4kZGlzdGFuY2VJbnB1dC52YWwoJycpO1xyXG4gICAgICAgICAgICBhcHAuc2hpcHBpbmcuJHN1bW1hcnlEaXYuYWRkQ2xhc3MoJ19oaWRkZW4nKTtcclxuICAgICAgICAgICAgYXBwLnNoaXBwaW5nLiRyZXNldEJ0bi5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBlcnJvck1zZzogZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgIGFsZXJ0KG1zZyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRTdWdnZXN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy4kYWRkcmVzc0lucHV0Lm9uKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygneW1hcHMnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy4kYWRkcmVzc0lucHV0Lm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIHN1Z2dlc3RWaWV3ID0gbmV3IHltYXBzLlN1Z2dlc3RWaWV3KHRoaXMuJGFkZHJlc3NJbnB1dC5hdHRyKCdpZCcpLCB7XHJcbiAgICAgICAgICAgIG9mZnNldDogWy0xLCAzXSxcclxuICAgICAgICAgICAgYm91bmRlZEJ5OiBhcHAuc2hpcHBpbmcubWFwLmdldEJvdW5kcygpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHN1Z2dlc3RWaWV3LmV2ZW50cy5hZGQoJ3NlbGVjdCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gZS5nZXQoJ2l0ZW0nKTtcclxuICAgICAgICAgICAgeW1hcHMuZ2VvY29kZShpdGVtLnZhbHVlKS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSByZXMuZ2VvT2JqZWN0cy5nZXQoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5zaGlwcGluZy5tYWtlUm91dGUoby5nZW9tZXRyeS5fY29vcmRpbmF0ZXMsIGl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3VnZ2VzdFZpZXcgPSBzdWdnZXN0VmlldztcclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBjYWxjUHJpY2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgX3RoYXQgPSB0aGlzO1xyXG4gICAgICAgIGxldCBydSA9ICcgPHNwYW4gY2xhc3M9XCJydWJcIj7igr08L3NwYW4+JztcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6ICcvYmFzZWluZm8vZ2V0cm9hZGNhbGMucGhwJyxcclxuICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBkYXRhOiBfdGhhdC4kd3JhcHBlci5zZXJpYWxpemUoKSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XHJcbiAgICAgICAgICAgICAgIC8vICQoJy5qcy1zaGlwcGluZ19fY2FyLWxhYmVsJykuY3NzKCdvcGFjaXR5JywgMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5wcmljZSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtd3JhcGVyX3ByaWNlJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtcHJpY2VfZXJyb3InKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmotcm9hZC1jb25maXJtYXRpb24nKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhhdC4kd3JhcHBlci5maW5kKCcuai1jdXJyZW50LXByaWNlJykuaHRtbChkYXRhLnByaWNlICsgcnUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGRhdGEubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaWQgPSBkYXRhLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3QgPSAkKCdpbnB1dFtuYW1lPVwiJytuYW1lKydcIl0nKS5maWx0ZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCh0aGlzKS52YWwoKSA9PSBpZDtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAvL3NlbGVjdC5wYXJlbnQoKS5jc3MoJ29wYWNpdHknLCAwLjQpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtd3JhcGVyX3ByaWNlJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtcHJpY2VfZXJyb3InKS5odG1sKGRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5qLXJvYWQtcHJpY2VfZXJyb3InKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmotcm9hZC1jb25maXJtYXRpb24nKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCcuc2hpcHBpbmdfX2Nhci1zZWxlY3QgaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICQoJy5qcy1zaGlwcGluZ19fY2FyLWxhYmVsJykucmVtb3ZlQ2xhc3MoJ19kaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmotZXJyb3ItdG9vbHRpcCcpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEuZGlzYWJsZWQsIGZ1bmN0aW9uIChpbmRleCx2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGQgPSAkKCdpbnB1dFtuYW1lPVwiJyt2YWx1ZS5uYW1lKydcIl0nKS5maWx0ZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHRoaXMpLnZhbCgpID09IHZhbHVlLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICBzZWxlY3RkLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9ICc8c3BhbiBjbGFzcz1cImNoZWNrYm94X190b29sdGlwIGotZXJyb3ItdG9vbHRpcFwiPlxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICc8aSBjbGFzcz1cInNwcml0ZSBkZWxpdmVyeS10b29sdGlwXCI+PC9pPlxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNoZWNrYm94X190b29sdGlwX190ZXh0XCI+XFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuZXJyb3IrJ1xcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICc8L3NwYW4+XFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nO1xyXG4gICAgICAgICAgICAgICAgICAgLy9zZWxlY3RkLnBhcmVudCgpLmNzcygnb3BhY2l0eScsIDAuNCk7XHJcbiAgICAgICAgICAgICAgICAgICBzZWxlY3RkLnBhcmVudCgpLmFkZENsYXNzKCdfZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgICAgICAgIHNlbGVjdGQucGFyZW50KCkuYXBwZW5kKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbn0iXSwiZmlsZSI6InNoaXBwaW5nLmpzIn0=
