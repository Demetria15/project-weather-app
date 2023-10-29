// Storing the API key
const apiKey = "3dea19745267a4667e46cbbfc1f3d654";

// Declare variables
const backgroundColor = document.getElementById("backgroundColor");
const date = document.getElementById("date");
const temperature = document.getElementById("temperature");
const cityElement = document.getElementById("location");
const weatherDescription = document.getElementById("weatherDescription");
const weatherImage = document.getElementById("weatherImage");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

// Get current time and date
const currentDate = new Date().toLocaleDateString();
const currentTime = new Date().toLocaleTimeString("sv-SE", {
  hour: "2-digit",
  minute: "2-digit",
});

date.innerHTML = `${currentDate} ${currentTime}`;

// Function to display the 5-day forecast
function displayFiveDayForecast(forecastData) {
  const forecast = document.getElementById("fivedayForecast");
  forecast.innerHTML = "";

  // Filter and display the forecast for the next 5 days starting from tomorrow
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the beginning of the day
  today.setDate(today.getDate() + 1); // Start from tomorrow

  const next5Days = [];
  const addedDates = new Set();

  forecastData.list.forEach((forecastItem) => {
    const forecastDate = new Date(forecastItem.dt_txt);
    forecastDate.setHours(0, 0, 0, 0); // Set to the beginning of the day

    if (forecastDate >= today && !addedDates.has(forecastDate.getTime())) {
      next5Days.push(forecastItem);
      addedDates.add(forecastDate.getTime());
    }
  });

  next5Days.forEach((forecastItem) => {
    const weekDay = new Date(forecastItem.dt_txt).toLocaleDateString("en-SE", {
      weekday: "long",
    });
    const maxTemp = forecastItem.main.temp_max.toFixed();
    const minTemp = forecastItem.main.temp_min.toFixed();
    const icon = forecastItem.weather[0].icon;

    forecast.innerHTML += `
      <div class="day-container">
        <p id="weekday">${weekDay}</p>
        <img  id= "forecastImage" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="forecast image" />
        <div class="min-max-temp">
          <p id="maxTemp">${maxTemp}</p>
          <p>&deg;</p>
          <p id="minTemp">/ ${minTemp}</p>
          <p>&deg;C</p>
        </div>
      </div>
    `;
  });
}

// Get today's weather for the default city
fetchWeatherData("Stockholm");

// Search for cities
const form = document.querySelector("form");
const searchButton = document.querySelector(".search-button");

// Add a click event listener to the search-button
searchButton.addEventListener("click", function () {
  const searchInput = document.querySelector("input[type='text']");
  const selectedCity = searchInput.value.trim();

  if (selectedCity) {
    fetchWeatherData(selectedCity);
  } else {
    alert("Please enter a city name.");
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchInput = document.querySelector("input[type='text']");
  const selectedCity = searchInput.value.trim();

  if (selectedCity) {
    fetchWeatherData(selectedCity);
  } else {
    alert("Please enter a city name.");
  }
});

function fetchWeatherData(city) {
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},Sweden&units=metric&APPID=${apiKey}`;
  const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},Sweden&units=metric&APPID=${apiKey}`;

  fetch(weatherApiUrl)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      temperature.innerHTML = json.main.temp.toFixed(1);
      cityElement.innerHTML = json.name;
      const description = json.weather[0].description;
      weatherDescription.innerHTML =
        description.charAt(0).toUpperCase() + description.slice(1);
      const weatherIcon = json.weather[0].icon;
      weatherImage.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      const sunriseValue = new Date(json.sys.sunrise * 1000).toLocaleTimeString("en-SE", {
        hour: "2-digit",
        minute: "2-digit",
      });
      sunrise.innerHTML = "Sunrise " + sunriseValue;
      const sunsetValue = new Date(json.sys.sunset * 1000).toLocaleTimeString("en-SE", {
        hour: "2-digit",
        minute: "2-digit",
      });
      sunset.innerHTML = "Sunset " + sunsetValue;
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });

  fetch(forecastApiUrl)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      displayFiveDayForecast(json);
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
    });
}

// Greeting
const currentDayTime = new Date();
const currentHour = currentDayTime.getHours();

const morningStartHour = 6;
const morningEndHour = 9;

const bedtimeHour = 23;

if (currentHour >= bedtimeHour) {
  document.getElementById("message").innerHTML = "Good night, sleep tight!";
} else if (currentHour >= morningStartHour && currentHour < morningEndHour) {
  document.getElementById("message").innerHTML = "Good morning! Time for coffee.";
} else {
  document.getElementById("message").innerHTML = "";
}
