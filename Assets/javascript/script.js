// variables
var APIkey = '&appid=47321296effd62eab8d0754b0a9e9a55'
var openWeatherAPI ='https://api.openweathermap.org/'
// var geoCodingAPI = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityname + '&limit=5&appid=47321296effd62eab8d0754b0a9e9a55';
// var currentWeatherAPI = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=47321296effd62eab8d0754b0a9e9a55';
// var fiveDayForecast = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=47321296effd62eab8d0754b0a9e9a55';

// DOM selection
var searchCitiesInputEl = document.querySelector('#search-cities');
var searchButtonEl = document.querySelector('#search-button');

// get search value
function getSearchValue(event) {
    event.preventDefault();
    var city = searchCitiesInputEl.value
    console.log(city);
    getGeoCode(city)
}

// get latitude and longitude based on city name
function getGeoCode(cityname) {
    var geoCodingURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityname + '&limit=5&appid=47321296effd62eab8d0754b0a9e9a55'
    fetch(geoCodingURL)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);
            var latitude = data[0].lat;
            console.log('latitude ' + latitude);
            var longitude = data[0].lon;
            console.log('longitude ' + longitude);

            // TODO: add search history

            getCurrentConditions(latitude,longitude);
            getFiveDayForecast(latitude,longitude);
        });
}

function getCurrentConditions(lat,lon) {
    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=47321296effd62eab8d0754b0a9e9a55&units=imperial'
    fetch(currentWeatherURL)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log('Current Conditions \n-----------')
            console.log(data);
            var temp = data.main.temp;
            console.log('temp is ' + temp);
            var wind = data.wind.speed;
            console.log('wind speed is ' + wind + ' mph');
            var humidity = data.main.humidity;
            console.log('humidity is ' + humidity + ' %');

            // TODO: populate html elements

        });
}

function getFiveDayForecast(lat,lon) {
    var fiveDayURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=47321296effd62eab8d0754b0a9e9a55&units=imperial'
    fetch(fiveDayURL)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log('Five Day Forecast \n---------')
            console.log(data);
            for (var i = 4; i < data.list.length; i = i + 8) {
                console.log(data.list[i]);
                var date = dayjs(data.list[i].dt_txt).format('M/D/YYYY');
                console.log(date);
                var temp = data.list[i].main.temp + ' &#8457';
                var wind = data.list[i].wind.speed + ' Mph';
                var humidity = data.list[i].main.humidity + ' %';
                createCard(date,temp,wind,humidity);
            }
        })
}

function createCard(date,temp,wind,humidity) {
    var divContainer = document.createElement('div');
    divContainer.setAttribute('class', 'card m-2');

    var divCardBody = document.createElement('div');
    divCardBody.setAttribute('class', 'card-body');

    var cardTitle = document.createElement('h5');
    cardTitle.setAttribute('class', 'card-title');
    cardTitle.textContent = date;

    var predictedConditions = document.createElement('div');
    
    var predictedTemp = document.createElement('p');
    predictedTemp.setAttribute('class', 'card-text');
    predictedTemp.textContent = temp;

    var predictedWind = document.createElement('p');
    predictedWind.setAttribute('class', 'card-text');
    predictedWind.textContent = wind;

    var predictedHumidity = document.createElement('p');
    predictedHumidity.setAttribute('class', 'card-text');
    predictedHumidity.textContent = humidity;

    predictedConditions.appendChild(predictedTemp);
    predictedConditions.appendChild(predictedWind);
    predictedConditions.appendChild(predictedHumidity);

    divCardBody.appendChild(cardTitle);
    divCardBody.appendChild(predictedConditions);

    divContainer.appendChild(divCardBody);

    // TODO: figure out why this selector does not work with custom attributes
    var fiveDayContainer = document.querySelector('.card-group');
    fiveDayContainer.appendChild(divContainer);
}

searchButtonEl.addEventListener('click', getSearchValue);