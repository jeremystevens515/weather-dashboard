// variables
var APIkey = '&appid=47321296effd62eab8d0754b0a9e9a55'
var openWeatherAPI ='https://api.openweathermap.org/'
var previousSearches = [];

// DOM selection
var cityNameEl = document.querySelector('#city-name');
var lastUpdated = document.querySelector('#last-updated');
var searchCitiesInputEl = document.querySelector('#search-cities');
var searchButtonEl = document.querySelector('#search-button');
var searchHistoryEl = document.querySelector('#search-history')
var currentCityOverview = document.querySelector('#current-city-overview'); // selector not working with id
var currentTemp = document.querySelector('#current-temp');
var currentWind = document.querySelector('#current-wind');
var currentHumidity = document.querySelector('#current-humidity');

// var fiveDayContainer = document.querySelector('#five-days');

// get search value
function getSearchValue(event) {
    event.preventDefault();
    var city = searchCitiesInputEl.value
    console.log(city);
    cityNameEl.textContent = city;
    lastUpdated.textContent = dayjs().format('hh:mm a');

    clearCards();
    addToHistory(city);
    getGeoCode(city)
}

function clearCards() {
    var fiveDayContainer = document.querySelector('#five-days');
    var child = fiveDayContainer.lastElementChild
    while (child) {
        fiveDayContainer.removeChild(child);
        child = fiveDayContainer.lastElementChild
    }
}

function addToHistory(textInput) {
    previousSearches.push(textInput);
    localStorage.setItem('previousSearches', JSON.stringify(previousSearches));
    console.log(previousSearches);

    var historyBtn = document.createElement('button');
    historyBtn.setAttribute('class', 'btn text-secondary text-start');
    historyBtn.textContent = textInput;
    searchHistoryEl.appendChild(historyBtn);

}

function displayHistory() {
    var getHistory = JSON.parse(localStorage.getItem('previousSearches'));
    console.log(getHistory);
    
        for (var i = 0; i < getHistory.length; i++) {
            var historyBtn = document.createElement('button');
            historyBtn.setAttribute('class', 'btn text-secondary text-start');
            console.log(getHistory[i])
            historyBtn.textContent = getHistory[i];
            searchHistoryEl.appendChild(historyBtn);
        }
}

function searchFromHistory(event) {
    console.log(event.target.innerHTML);
    var city = event.target.innerHTML;
    cityNameEl.textContent = city;
    clearCards();
    getGeoCode(city);
}

// get latitude and longitude based on city name
function getGeoCode(cityName) {
    var geoCodingURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=47321296effd62eab8d0754b0a9e9a55'
    fetch(geoCodingURL)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);
            var latitude = data[0].lat;
            console.log('latitude ' + latitude);
            var longitude = data[0].lon;
            console.log('longitude ' + longitude);

            getCurrentConditions(cityName, latitude,longitude);
            getFiveDayForecast(latitude,longitude);
        });
}

function getCurrentConditions(city,lat,lon) {
    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=47321296effd62eab8d0754b0a9e9a55&units=imperial'
    fetch(currentWeatherURL)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log('Current Conditions \n-----------')
            console.log(data);
            var description = data.weather[0].main;
            var temp = data.main.temp + '℉';
            var wind = data.wind.speed + ' mph';
            var humidity = data.main.humidity + '%';

            // TODO: populate html elements
            currentCityOverview.textContent = 'Currently, ' + description + ' in ' + city;
            currentTemp.textContent = 'Temp: ' + temp; 
            currentWind.textContent = 'Wind: ' + wind;
            currentHumidity.textContent = 'Humidity: ' + humidity;

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
                var temp = data.list[i].main.temp + '℉';
                var wind = data.list[i].wind.speed + ' mph';
                var humidity = data.list[i].main.humidity + '%';
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
    predictedTemp.textContent = 'Temp: ' + temp;

    var predictedWind = document.createElement('p');
    predictedWind.setAttribute('class', 'card-text');
    predictedWind.textContent = 'Wind: ' + wind;

    var predictedHumidity = document.createElement('p');
    predictedHumidity.setAttribute('class', 'card-text');
    predictedHumidity.textContent = 'Humidity: ' + humidity;

    predictedConditions.appendChild(predictedTemp);
    predictedConditions.appendChild(predictedWind);
    predictedConditions.appendChild(predictedHumidity);

    divCardBody.appendChild(cardTitle);
    divCardBody.appendChild(predictedConditions);

    divContainer.appendChild(divCardBody);

    // TODO: figure out why this selector does not work with custom attributes
    var fiveDayContainer = document.querySelector('#five-days');
    fiveDayContainer.appendChild(divContainer);
}


searchButtonEl.addEventListener('click', getSearchValue);
searchHistoryEl.addEventListener('click', searchFromHistory);
displayHistory();