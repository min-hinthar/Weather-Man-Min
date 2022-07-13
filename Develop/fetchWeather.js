// GIVEN a weather dashboard with form inputs
const apiKey1 = 'bacceb898dcbb759df2ad02cf251a1a7'
const weatherAPIurl = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&units=imperial&exclude=hourly&appid=${apiKey1}`
const getCoordinatesAPIurl = `https://api.openweathermap.org/geo/1.0/direct?q={cityName}&appid=${apiKey1}`


// WHEN I search for a city
let submitBtn = document.querySelector('#searchBtn');
let citySearchInputEl = document.querySelector('#citySearch-input');
let currentCityDisplay = document.querySelector('#display-CurrentCity-div');
let currentCityForecastDisplay = document.querySelector('#current-Forecast');
let fiveDaysForecast = document.querySelector('#fiveDays-Forecast-div');
let pastCitiesHistory = document.querySelector('#past-cities-History');
let cities = [];

$(document).ready(function() {
    $(submitBtn).click(function (event) {
        event.preventDefault();
       let city = citySearchInputEl.value.trim();
        if (city) {
            // fetch user search input city current + 5 days weather forecast
            fetchCoordinates(city);
        } else {
            alert("Please enter a valid city name on Earth!")
        }
        // save search city history
        saveCityHistory(city);
        // append search city history to past-cities-history div
        if (!cities.includes(city)) {
            cities.push(city);
            let searchedCity = $(
                `<div><button type="button" class="btn btn-primary history-btn">${city}</button></div>`
            );
            searchedCity.on('click', function() {
                let newCity = $(this).text();
                fetchCoordinates(newCity)
            })
            $(pastCitiesHistory).append(searchedCity)
        };

        // reset type input value
        citySearchInputEl.value="";
    });
    
    // save searched cities to local storage as 'cities' key
    function saveCityHistory(city) {
        let localCities = localStorage.getItem("cities");
        if (localCities) {
            localCities = JSON.parse(localCities);
            localCities.push(city);
        } else {
            localCities = [city];
        }
        localStorage.setItem("cities", JSON.stringify(localCities));
        console.log(localCities);
    };

    let fetchCurrentCity = function(lat, lon, city){
     fetch(weatherAPIurl.replace("{lat}", lat).replace("{lon}", lon))
     .then(function (response){
        response.json()
        .then(function(data){
            console.log(data);
            // displayCurrentCity(data);
            displayCurrentCity(data, city);
            displayFiveDayForecast(data, city);
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
            fetchCurrentCity(lat, lon, data[0].name);
        })
        })
    }

});

// THEN I am presented with current and future conditions for that city and that city is added to the search history
let displayCurrentCity = function (data, city){
    // reset previous searched content
    //currentCityDisplay.textContent= city;
    currentCityForecastDisplay.innerHTML= '';
    currentCityDisplay.innerHTML='';

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

    // create date to display next to current city 
    const date = new Date(data.current.dt * 1000);
    // using luxon and so needed to convert Unix to datetime [https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript]
    currentCityDisplay.textContent= `${city} (${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()})`;

    // create icon representation element as img to display current city forecast
    let currentCityIcon = document.createElement("img");
    currentCityIcon.setAttribute("src", `http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`);
    currentCityDisplay.appendChild(currentCityIcon);
    
    // create temperature element as div to display temperature data
    let currentTemperature = document.createElement("div");
    currentTemperature.textContent =  " Temp: " + `${data.current.temp}` + " °F " ;
    currentCityForecastDisplay.appendChild(currentTemperature);

    // create wind element as div to display wind data
    let currentWind = document.createElement("div");
    currentWind.textContent = " Wind: "  + `${data.current.wind_speed}` + " MPH";
    currentCityForecastDisplay.appendChild(currentWind);

    // create humidity element as div to display humidity data
    let currentHumidity = document.createElement("div");
    currentHumidity.textContent = " Humidity: " + `${data.current.humidity}` + " %";
    currentCityForecastDisplay.appendChild(currentHumidity);

// WHEN I view the UV index
    // create uvIndex var to store uvi data from response.data.current.uvi
    let currentUVIndex = $("<div>");
    let uvIndex = `${data.current.uvi}`;
    currentUVIndex.text(" UV Index: " + uvIndex);
    
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
    if (uvIndex >= 0 && uvIndex <= 2){
        // success-green for favorable 0 - 2 values
        currentUVIndex.css('background-color', '#28a745').css('color', 'white');
    } 
        else if (uvIndex >= 3  && uvIndex <= 5) {
        // warning-yellow for moderate 3 - 5 values
        currentUVIndex.css('background-color', '#ffc107').css('color', 'white');
    }
        else {
        // danger-red for severe 6+ values
        currentUVIndex.css('background-color', '#dc3545').css('color', 'white');
    };
    
    currentCityForecastDisplay.appendChild(currentUVIndex.get(0));
};

// WHEN I view future weather conditions for that city
let currentfiveDaysForecast = function (data, city) {
    let forecast = [];
    for (let i = 1; i < 6; i++) {
        let currentforecast = { 
            date: data.daily[i].dt,
            icon: data.daily[i].weather[0].icon,
            temp: data.daily[i].temp.day,
            wind: data.daily[i].wind_speed,
            humidity: data.daily[i].humidity,
        } 
        forecast.push(currentforecast)
    };
    return forecast;
}
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
let displayFiveDayForecast = function (data, city) {
    const forecast = currentfiveDaysForecast (data)
    fiveDaysForecast.innerHTML= '';
    forecast.forEach((current) => {
        // dynamically generate cards
        const date = new Date(current.date * 1000);
        const dateEl = $('<h5>').text(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
        const iconEl = $('<img>').attr("src", `http://openweathermap.org/img/wn/${current.icon}.png`);
        const tempEl = $('<p>').text(`Temp: ${current.temp}`);
        const windEl = $('<p>').text(`Wind: ${current.wind}`);
        const humidEl = $('<p>').text(`Humidity: ${current.humidity}`);
        const cardBodyEl = $('<div>').addClass('card-body');

        cardBodyEl.append(dateEl);
        cardBodyEl.append(iconEl);
        cardBodyEl.append(tempEl);
        cardBodyEl.append(windEl);
        cardBodyEl.append(humidEl);
        const cardEl = $('<div>').addClass('card');
        cardEl.append(cardBodyEl);

        fiveDaysForecast.appendChild(cardEl.get(0));
    })

}

// WHEN I click on a city in the search history
$(document).on('click', '.history-btn', function () {
    let cityList = $(this).text();
    // THEN I am again presented with current and future conditions for that city
    displayCurrentCity(cityList);
});
