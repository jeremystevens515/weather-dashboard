// variables
var APIkey = '&appid=47321296effd62eab8d0754b0a9e9a55'
var openWeatherAPI ='https://api.openweathermap.org/'
// var geoCodingAPI = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityname + '&limit=5&appid=47321296effd62eab8d0754b0a9e9a55';
var currentWeatherAPI = openWeatherAPI + 'data/2.5/weather?lat={lat}&lon={lon}' + APIkey;
var fiveDayForecast = openWeatherAPI + 'data/2.5/forecast?lat={lat}&lon={lon}' + APIkey;

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
        });
    
    getCurrentConditions(latitude, longitude)
}

function getCurrentConditions(lat, lon) {

}

searchButtonEl.addEventListener('click', getSearchValue);