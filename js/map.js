// document.querySelector('.map').classList.remove('map--faded');
var titles = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостевой домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колена в воде'
]
var types = ['palace', 'flat', 'house', 'bungalo']
var checks = ['12:00', '13:00', '14:00']
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
var photos = [
    "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
]
var COUNT_USERS = 8;
var MIN_ROOMS = 2;
var MAX_ROOMS = 5;
var MIN_GUESTS = 3;
var MAX_GUESTS = 13;
var element = document.querySelector("div.map__pins");
titles.sort(compareRandom);
//Кординаты маркера на карте
var minAxisX = 100;
var maxAxisX = element.offsetWidth - 80;
var minAxisY = 130;
var maxAxisY = 630;
var minPrice = 1000;
var maxPrice = 1000000;
var parent = document.querySelector('.map__pins');

// массив всех данных
var dataList = insertValues();

var picturePin = function(){
    for(var i =0; i<dataList.length; i++){
        var pin = document.createDocumentFragment();
        pin = createPins(dataList[i]);
        parent.appendChild(pin);
    }
}
var templateParent = document.querySelector('template').content.querySelector('.map__card');

//Отрисовка объявления (большой белый прямоугольник)
function createDOMElement(arr){
    var clone  = templateParent.cloneNode(true);
    clone.querySelector('h3').innerHTML = arr.offer.title;
    clone.querySelector('small').innerHTML = arr.offer.addres;
    clone.querySelector('.popup__price').innerHTML = arr.offer.price + '₽/ночь';
    clone.querySelector('h4').innerHTML = getTypeFlat(arr.offer.type);
    clone.getElementsByTagName('p')[2].innerHTML = arr.offer.rooms + ' комнаты для '+ arr.offer.guests + ' гостей';
    clone.getElementsByTagName('p')[3].innerHTML = 'Заезд после ' + arr.offer.checkin + ', выезд до ' + arr.offer.checkout;
    var featuresParent = clone.querySelector('.popup__features');
    featuresParent.innerHTML = '';
    for(var j = 0; j < arr.offer.features.length; j++){
        var li = document.createElement('li');
        var classStr = 'feature--' + arr.offer.features[j];
        li.classList.add('feature');
        li.classList.add(classStr);
        featuresParent.appendChild(li);
    }
    clone.getElementsByTagName('p')[4].innerHTML = arr.offer.description;
    var photoParent = clone.querySelector('.popup__pictures');
    for(var j = 0; j < arr.offer.photos.length; j++){
        var li = document.createElement('li');
        var img = document.createElement('img');
        img.src = arr.offer.photos[j];
        img.setAttribute('width', '40px');
        img.setAttribute('height', '40px');
        img.setAttribute('style', 'margin-left:5px');
        li.appendChild(img);
        photoParent.appendChild(li);
    }
    var avatar = clone.querySelector('.popup__avatar');
    avatar.src = arr.author.avatar;

    var elemForInsert = document.querySelector('.map__filters-container');
    var insertParent = document.querySelector('.map');

    clone.querySelector('.popup__close').addEventListener('click', function(){
            clone.remove();
    })
    console.log(templateParent);
    insertParent.insertBefore(clone, elemForInsert);
}

// вспомогательная функция для создания елемента pin
function createPins(obj){
    var pin = document.createElement('button');
    var img = document.createElement('img');
    pin.classList.add('map__pin');
    pin.style.cssText = 'left: ' + obj.location.x + 'px; top: ' + obj.location.y + 'px;';
    img.src = obj.author.avatar;
    img.alt = obj.offer.title;
    img.width = 40;
    img.height = 40;
    pin.appendChild(img);
    pin.setAttribute("disabled", "disabled");
    return pin;
}

// основная функция для заполнения массива данных list
function insertValues() {
    var list = [];
    for (var i = 0; i < COUNT_USERS; i++) {
        var locationX = randomInteger(minAxisX, maxAxisX);
        var locationY = randomInteger(minAxisY, maxAxisY);
        list.push({
            'author': {
                'avatar': createAvatar(i)
            },
            'offer': {
                'title': titles.pop(),
                'addres': (locationX + ', ' + locationY),
                'price': randomInteger(minPrice, maxPrice),
                'type': getRandomElement(types),
                'rooms': randomInteger(MIN_ROOMS,MAX_ROOMS),
                'guests': randomInteger(MIN_GUESTS,MAX_GUESTS),
                'checkin': getRandomElement(checks),
                'checkout': getRandomElement(checks),
                'features': getArrRandomSize(features),
                'description': '',
                'photos': getArrRandomSize(photos)
            },
            'location': {
                'x': locationX,
                'y': locationY
            }
        })
    }
    return list;
}

//вспомогательая функция для перевода типа квартиры на русский
function getTypeFlat(str){
    switch(str) {
        case 'flat':
        return 'Квартира';
        break;

        case 'bungalo':
        return 'Бунгало';
        break;

        case 'house':
        return 'Дом';
        break;

        case 'palace':
        return 'Дворец';
        break;

        default:
        return '';
        break;
    }
}

// вспомогательная функция для перетасовки массива.
function compareRandom(a, b){
    return Math.random() - 0.5;
}

// вспомогательная функция для случайного числа между перменными min и max
function randomInteger(min, max){
    var round = Math.random() * (max - min) + min ;
    round = Math.floor(round);
    return round;
}

// вспомогательная функция для создания строки avatar
function createAvatar(i){
    return 'img/avatars/user0' + (i + 1) +'.png';
}

// вспомогательная функция для возврата случайного элемента массива
function getRandomElement(arr){
    var num = 0;
    if(arr.length > 0){
        num = (randomInteger(0, arr.length));
    }
    return arr[num];
}

//вспомогательная функция для перетасовки и случайного размера массива
function getArrRandomSize(arr){
    var clone = arr.slice();
    clone.sort(compareRandom);
    clone.length = randomInteger(1, clone.length+1);
    return clone;
}

function getCoords(elem) { // кроме IE8-
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };

}

// событие клика на карту
document.querySelector('.map').addEventListener('click', function(e){
    var elem = e.target;
    for (var i = 0; i < dataList.length; i++) {
        if(elem.alt == dataList[i].offer.title)
        createDOMElement(dataList[i]);
    }
});

// событие
document.querySelector('.map__pin--main').addEventListener('mouseup', function(){
    document.querySelector('.map').classList.remove('map--faded');
    document.querySelector('.notice__form').classList.remove('notice__form--disabled');
        var temp = getCoords(document.querySelector('.map__pin'));
    document.querySelector('.notice__form').querySelector('#address').value = Math.floor(temp.top) + ' ' + Math.floor(temp.left);
    picturePin();
});
