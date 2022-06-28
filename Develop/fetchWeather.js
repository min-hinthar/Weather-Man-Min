// GIVEN a weather dashboard with form inputs
const apiKey1 = 'bacceb898dcbb759df2ad02cf251a1a7'
const weatherAPIurl = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&units=imperial&exclude=hourly&appid=${apiKey1}`
const getCoordinatesAPIurl = `https://api.openweathermap.org/geo/1.0/direct?q={cityName}&appid=${apiKey1}`


// WHEN I search for a city
let submitBtn = document.querySelector('#searchBtn');
let citySearchInputEl = document.querySelector('#citySearch-input');
let currentCityDisplay = document.querySelector('#display-CurrentCity-div');
let currentCityForecastDisplay = document.querySelector('#currentCity-Forecast-div');
let fiveDaysForecast = document.querySelector('#fiveDays-Forecast');
let pastCitiesHistory = document.querySelector('#past-cities-History');
let cities = [];

$(document).ready(function() {
    $(submitBtn).click(function (event) {
        event.preventDefault();
       let city = citySearchInputEl.value.trim();
        if (city) {
            // fetch user search input city current + 5 days weather forecast
            fetchCoordinates(city);
            // reset type input value
            citySearchInputEl.value="";
        } else {
            alert("Please enter a valid city name on Earth!")
        }
        saveCityHistory();
    });
    
    // save searched cities to local storage as 'cities' key
    let saveCityHistory = function () {
        localStorage.setItem("cities", JSON.stringify(cities));
        // console.log(saveCityHistory);
    };

    let fetchCurrentCity = function(lat, lon){
     fetch(weatherAPIurl.replace("{lat}", lat).replace("{lon}", lon))
     .then(function (response){
        response.json()
        .then(function(data){
            console.log(data);
            displayCurrentCity(data, city);
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
let displayCurrentCity = function (data, city){
    // reset previous searched content
    currentCityDisplay.textContent="";
    currentCityDisplay.textContent= $(city);

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

    // create date element as h4 to display next to current city h3
    let currentDate = document.createElement("h4");
    currentDate.textContent= luxon(data.current.dt.value).format("MM/DD/YYYY");
    currentCityDisplay.appendChild(currentDate);

    // create icon representation element as img to display in div of current city forecast
    let currentCityIcon = document.createElement("img");
    currentCityIcon.setAttribute(current.weather[0].icon);
    currentCityDisplay.appendChild(currentCityIcon);
    
    // create temperature element as h4 to display temperature data
    let currentTemperature = document.createElement("h4");
    currentTemperature.textContent = " Temp: " + current.temp + " °F";
    currentCityForecastDisplay.appendChild(currentTemperature);

    // create wind element as h4 to display wind data
    let currentWind = document.createElement("h4");
    currentWind.textContent = " Wind: " + current.wind + " MPH";
    currentCityForecastDisplay.appendChild(currentWind);

    // create humidity element as h4 to display humidity data
    let currentHumidity = document.createElement("h4");
    currentHumidity.textContent = " Humidity: " + current.humidity + " %";
    currentCityForecastDisplay.appendChild(currentHumidity);

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

    let currentUVIndex = document.createElement("h4");
    currentUVIndex.textContent = " UV Index:" + current.uvi;
    currentCityForecastDisplay.appendChild(currentUVIndex); 
}



// WHEN I view future weather conditions for that city


// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity


// WHEN I click on a city in the search history


// THEN I am again presented with current and future conditions for that city