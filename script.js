var cityInput = document.getElementById("city-input");
var searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", function () {
    var city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    getWeather(city);
});

cityInput.addEventListener("keydown",function(event) {
    if(event.key === "Enter"){
        searchBtn.click();
    }
});

function getWeather(city) {
    var geoUrl =
        "https://geocoding-api.open-meteo.com/v1/search?name=" +
        encodeURIComponent(city) +
        "&count=1&language=en&format=json";

    document.getElementById("weather-condition").textContent = "Loading weather....";
    document.getElementById("weather-icon").textContent = "⏳";
    document.getElementById("city-name").textContent = city;

    fetch(geoUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Unable to search city");
            }

            return response.json();
        })
        .then(function (data) {
            if (!data.results || data.results.length === 0) {
                alert("City not found. Please try another city.");
                return;
            }

            var location = data.results[0];

            getWeatherDetails(
                location.latitude,
                location.longitude,
                location.name
            );
        })
        .catch(function (error) {
            console.log(error);
            document.getElementById("weather-condition").textContent = "Unable to find weather. Please try again.";
            document.getElementById("weather-icon").textContent = "⚠️";
        });
}

function getWeatherDetails(latitude, longitude, locationName) {
    var weatherUrl =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        latitude +
        "&longitude=" +
        longitude +
        "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";

    fetch(weatherUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Unable to fetch weather data");
            }

            return response.json();
        })
        .then(function (data) {
            var currentWeather = data.current;

            var weatherCode = currentWeather.weather_code;
            var condition = "";
            var icon = "";

            document.getElementById("temperature").textContent =
                currentWeather.temperature_2m + " °C";

            document.getElementById("humidity").textContent =
                currentWeather.relative_humidity_2m + " %";

            document.getElementById("wind-speed").textContent =
                currentWeather.wind_speed_10m + " km/h";

            
            if(weatherCode === 0){
                condition = "Clear Sky";
                icon = "☀️";
            }else if (weatherCode === 1 || weatherCode === 2) {
                condition = "Mainly Clear / Partly Cloudy";
                icon = "🌤️";
            } else if (weatherCode === 3) {
                condition = "Overcast";
                icon = "☁️";
            } else if ([45, 48].includes(weatherCode)) {
                condition = "Foggy";
                icon = "🌫️";
            } else if ([51, 53, 55, 56, 57].includes(weatherCode)) {
                condition = "Drizzle";
                icon = "🌦️";
            } else if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
                condition = "Rainy";
                icon = "🌧️";
            } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
                condition = "Snowy";
                icon = "❄️";
            } else if ([95, 96, 99].includes(weatherCode)) {
                condition = "Thunderstorm";
                icon = "⛈️";
            } else {
                condition = "Unknown Weather";
                icon = "🌡️";
            }

            document.getElementById("city-name").textContent = locationName;
            document.getElementById("weather-condition").textContent = condition;
            document.getElementById("weather-icon").textContent = icon;
        })
        .catch(function (error) {
            console.log(error);
            document.getElementById("weather-condition").textContent = "Unable to find weather. Please try again.";
            document.getElementById("weather-icon").textContent = "⚠️";
        });
}