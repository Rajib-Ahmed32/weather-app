// OpenWeatherMap API key and base URL
const apiKey = "cf2ae75a5f529a7104e2e885c9bc90d6";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// Selecting necessary DOM elements
let btn = document.querySelector(".div-top button");
let inputElem = document.querySelector(".div-top input");
let condition = document.querySelector("#condition");
let input = document.querySelector(".city");

// Function to fetch and display weather data for a given city
async function checkweather(city) {
    // Fetch weather data from API
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    // If city is not found, display an error message
    if (response.status === 404) {
        document.querySelector(".btn-label-div label").style.display = "block";
    }
    else {
        // Hide error message if the city is found
        document.querySelector(".btn-label-div label").style.display = "none";
        let data = await response.json();

        // Update weather details in the UI
        document.querySelector(".city").value = data.name;
        document.querySelector(".text-container h2").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".temp-max span").innerHTML = data.main.temp_max + "°C";
        document.querySelector(".temp-min span").innerHTML = data.main.temp_min + "°C";
        document.querySelector(".humidity span").innerHTML = data.main.humidity + "%";
        document.querySelector(".windspeed span").innerHTML = data.wind.speed + " km/h";

        // Update weather condition image based on API response
        if (data.weather[0].main === "Clouds") {
            condition.src = "/img/clouds.png";
        }
        else if (data.weather[0].main === "Clear") {
            condition.src = "img/clear.png";
        }
        else if (data.weather[0].main === "Rain") {
            condition.src = "img/rain.png";
        }
        else if (data.weather[0].main === "Drizzle") {
            condition.src = "img/drizzle.png";
        }
        else if (data.weather[0].main === "Mist") {
            condition.src = "img/mist.png";
        }
    }
}

// Function to get the user's current location
function cityLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(currentPosition);
    } else {
        alert("You denied to show your location");
    }
}

// Function to get latitude and longitude from geolocation API
function currentPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    locationCoordinates(latitude, longitude);
}

// Function to fetch weather data based on coordinates
async function locationCoordinates(lati, longi) {
    const response = await fetch(`${apiUrl}&lat=${lati}&lon=${longi}&appid=${apiKey}`);
    const data = await response.json();
    const defaultCity = data.name;
    checkweather(defaultCity);
}

// Run city location detection when the page loads
window.onload = function () {
    cityLocation();
};

// Disable search button by default
btn.disabled = true;

// Enable search button when input is not empty
function searchBtn() {
    btn.disabled = inputElem.value.trim() === " ";
}
inputElem.addEventListener('input', searchBtn);

// Add event listener to search button for fetching weather data
btn.addEventListener("click", () => {
    checkweather(inputElem.value);
});
