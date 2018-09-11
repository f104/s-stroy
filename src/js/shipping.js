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
                $('.js-shipping__car-label').css('opacity', 1);
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
                    select.parent().css('opacity', 0.4);
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
                   selectd.parent().css('opacity', 0.4);
                   selectd.parent().addClass('_disabled');
                   selectd.parent().append(message);
               });
            }
        });
    },

}