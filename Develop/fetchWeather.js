// GIVEN a weather dashboard with form inputs
const apiKey1 = 'bacceb898dcbb759df2ad02cf251a1a7'
const weatherAPIurl = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&units=imperial&exclude=hourly&appid=${apiKey1}`
const getCoordinatesAPIurl = `https://api.openweathermap.org/geo/1.0/direct?q={cityName}&appid=${apiKey1}`


// WHEN I search for a city
let submitBtn = document.getElementById('searchBtn')
let citySearchInputEl = document.getElementById('citySearch-input')
let currentCityDisplay = document.getElementById('display-CurrentCity-div')
let fiveDaysForecast = document.getElementById('fiveDays-Forecast')
let pastCitiesHistory = document.getElementById('past-cities-History')
let cities = []

$(document).ready(function() {
    $(submitBtn).click(function (event) {
        event.preventDefault();
       let city = citySearchInputEl.value.trim();
        if (city) {
            // fetch city current weather forecast
            fetchCoordinates(city);
            // fetch current city 5 days forecast
            // fetch5DaysCity(city);
            // reset type input value
            citySearchInputEl.value="";
        } else {
            alert("Please enter a valid city name on Earth!")
        }
        // save to local storage
        // saveSearch();
    });
        // let saveSearch = function (){
        //     localStorage.setItem('city'.json.stringify(cities));
        // };

    let fetchCurrentCity = function(lat, lon){
     fetch(weatherAPIurl.replace("{lat}", lat).replace("{lon}", lon))
     .then(function (response){
        response.json()
        .then(function(data){
            console.log(data);
        })
    });
    }
    let fetchCoordinates = function(city) {
        fetch(getCoordinatesAPIurl.replace("{cityName}", city))
        .then(function (response){
            response.json()
            .then(function(data){
             var lat = data[0].lat;
             var lon = data[0].lon;
            fetchCurrentCity(lat, lon);
            })
        })
    }

});

// THEN I am presented with current and future conditions for that city and that city is added to the search history

// WHEN I view current weather conditions for that city


// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index


// WHEN I view the UV index


// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe


// WHEN I view future weather conditions for that city


// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity


// WHEN I click on a city in the search history


// THEN I am again presented with current and future conditions for that city