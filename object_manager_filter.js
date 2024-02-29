ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
        center: [50.26823978180608, 53.594909999999885],
        zoom: 5,
        // controls: []
    }, {
        searchControlProvider: 'yandex#search'
    }),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 64,
            // Макет метки кластера pieChart.
            clusterIconLayout: "default#pieChart"
        });
    myMap.geoObjects.add(objectManager);

    // Создадим пунктов выпадающего списка.
    var listBoxItems = ['Грузоподъёмное оборудование', 'Складская техника', 'Станки', 'Строительное оборудование', 'Окрасочное оборудование', 'Генераторы и электростанции', 'Компрессоры воздушные', 'Сварочное оборудование', 'Пневматический инструмент', 'Профессиональное оборудование для общепита', 'Упаковочное и фасовочное оборудование', 'Материалы для гидроизоляции деформационных швов', 'Оборудование для обустройства дорог и парковок', 'Гидравлическое оборудование и инструменты', 'Оборудование для автосервиса', 'Оборудование для клининга', 'Промышленная вентиляция и отопление', 'Ультразвуковое оборудование', 'Насосное оборудование']
        .map(function (title) {
            return new ymaps.control.ListBoxItem({
                data: {
                    content: title
                },
                state: {
                    selected: false
                }
            })
        }),
        reducer = function (filters, filter) {
            filters[filter.data.get('content')] = filter.isSelected();
            return filters;
        },
        // Теперь создадим список.
        listBoxControl = new ymaps.control.ListBox({
            data: {
                content: 'Группы товаров',
                title: 'Фильтр'
            },
            items: listBoxItems,
            state: {
                // Признак, развернут ли список.
                expanded: false,
                filters: listBoxItems.reduce(reducer, {})
            }
        });
    myMap.controls.add(listBoxControl);

    // Добавим отслеживание изменения признака, выбран ли пункт списка.
    listBoxControl.events.add(['select', 'deselect'], function (e) {
        var listBoxItem = e.get('target');
        var filters = ymaps.util.extend({}, listBoxControl.state.get('filters'));
        filters[listBoxItem.data.get('content')] = listBoxItem.isSelected();
        listBoxControl.state.set('filters', filters);
    });

    var filterMonitor = new ymaps.Monitor(listBoxControl.state);
    filterMonitor.add('filters', function (filters) {
        // Применим фильтр.
        objectManager.setFilter(getFilterFunction(filters));
    });

    function getFilterFunction(categories) {
        return function (obj) {
            var content = obj.properties.balloonContent;
            return categories[content]
        }
    }

    $.ajax({
        url: "data.json"
    }).done(function (data) {
        objectManager.add(data);
    });

    // Создаем коллекцию.
    myCollection = new ymaps.GeoObjectCollection(),
        // Создаем массив с данными.
        myPoints = [
            { coords: [53.988902570600345, 27.79295849999996], text: 'GROST (ГРОСТ)' },
            { coords: [54.80931856989344, 56.09632199999998], text: 'TOR (ТОР)' },
            { coords: [55.862716568863895, 38.19766849999994], text: 'Metal Master' },
            { coords: [48.449044, 135.110697], text: 'TSS (ТСС)' },
            { coords: [43.222962, 76.904089], text: 'Schtaer (ШТАЕР)' },
            { coords: [55.77597, 37.5129], text: 'Hyundai (ХЕНДАЙ)' },
            { coords: [55.751841, 37.404853], text: 'Denzel (ДЕНЗЕЛ)' },
            { coords: [55.77597, 37.5129], text: 'Сварог' },
            { coords: [43.222962, 76.904089], text: 'Remeza (РЕМЕЗА)' },
            { coords: [55.862716568863895, 38.19766849999994], text: 'Hurakan (ХУРАКАН)' },
            { coords: [53.8589, 27.399019], text: 'Технология' },
            { coords: [51.216218, 71.509382], text: 'VOLL (ВОЛЛ)' },
            { coords: [46.312237, 39.946724], text: 'HUALIAN (ХУАЛЯНЬ)' },
            { coords: [44.033898, 43.165208], text: 'АКВАСТОП (Aquastop)' },
            { coords: [52.31563821788578, 104.26586499999993], text: 'Энерпред' },
            { coords: [43.222962, 76.904089], text: 'KraftWell (КРАФТВЕЛЛ' },
            { coords: [55.81, 37.73], text: 'Lavor (ЛАВОР)' },
            { coords: [44.033898, 55.165208], text: 'ЭНКОР' },
            { coords: [46.312237, 67.946724], text: 'AGG (ЭГГ)' },
            { coords: [47.312237, 60.946724], text: 'SAER (САЕР)' },
            { coords: [48.312237, 66.946724], text: 'Азовэнергомаш ' },
            { coords: [49.312237, 55.946724], text: 'Koshin (КОШИН)' },
            { coords: [50.312237, 56.946724], text: 'FLUIMAC (ФЛУИМАК)' },
            { coords: [55.38, 37.69], text: 'AIRPRO (АИРПРО)' },
            { coords: [55.91, 37.50], text: 'МАСТАК ' },
            { coords: [55.62, 37.32], text: 'Torin (ТОРИН)' },
            { coords: [55.85, 37.41], text: 'Datakom (ДАТАКОМ)' },
            { coords: [55.67, 37.24], text: 'FoxWeld (ФОКСВЕЛД)' }
        ];

    // Заполняем коллекцию данными.
    for (var i = 0, l = myPoints.length; i < l; i++) {
        var point = myPoints[i];
        myCollection.add(new ymaps.Placemark(
            point.coords, {
            balloonContentBody: point.text
        }
        ));
    }

    // Добавляем коллекцию меток на карту.
    // myMap.geoObjects.add(myCollection);

    // Создаем экземпляр класса ymaps.control.SearchControl
    var mySearchControl = new ymaps.control.SearchControl({
        options: {
            // Заменяем стандартный провайдер данных (геокодер) нашим собственным.
            provider: new CustomSearchProvider(myPoints),
            // Не будем показывать еще одну метку при выборе результата поиска,
            // т.к. метки коллекции myCollection уже добавлены на карту.
            noPlacemark: true,
            resultsPerPage: 5
        }
    });

    // Добавляем контрол в верхний правый угол,
    myMap.controls
        .add(mySearchControl, { float: 'right' });
}


// Провайдер данных для элемента управления ymaps.control.SearchControl.
// Осуществляет поиск геообъектов в по массиву points.
// Реализует интерфейс IGeocodeProvider.
function CustomSearchProvider(points) {
    this.points = points;
}

// Провайдер ищет по полю text стандартным методом String.ptototype.indexOf.
CustomSearchProvider.prototype.geocode = function (request, options) {
    var deferred = new ymaps.vow.defer(),
        geoObjects = new ymaps.GeoObjectCollection(),
        // Сколько результатов нужно пропустить.
        offset = options.skip || 0,
        // Количество возвращаемых результатов.
        limit = options.results || 20;

    var points = [];
    // Ищем в свойстве text каждого элемента массива.
    for (var i = 0, l = this.points.length; i < l; i++) {
        var point = this.points[i];
        if (point.text.toLowerCase().indexOf(request.toLowerCase()) != -1) {
            points.push(point);
        }
    }
    // При формировании ответа можно учитывать offset и limit.
    points = points.splice(offset, limit);
    // Добавляем точки в результирующую коллекцию.
    for (var i = 0, l = points.length; i < l; i++) {
        var point = points[i],
            coords = point.coords,
            text = point.text;

        geoObjects.add(new ymaps.Placemark(coords, {
            name: text + ' name',
            description: text + ' description',
            balloonContentBody: '<p>' + text + '</p>',
            boundedBy: [coords, coords]
        }));
    }

    deferred.resolve({
        // Геообъекты поисковой выдачи.
        geoObjects: geoObjects,
        // Метаинформация ответа.
        metaData: {
            geocoder: {
                // Строка обработанного запроса.
                request: request,
                // Количество найденных результатов.
                found: geoObjects.getLength(),
                // Количество возвращенных результатов.
                results: limit,
                // Количество пропущенных результатов.
                skip: offset
            }
        }
    });

    // Возвращаем объект-обещание.
    return deferred.promise();

}