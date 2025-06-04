function displayTemperature(response) {
    let temperatureElement = document.querySelector("#current-temperature");
    let temperature = Math.round(response.data.temperature.current);
    let cityElement = document.querySelector("#current-city");
    let descriptionElement = document.querySelector("#description");
    let humidityElement = document.querySelector("#humidity");
    let windspeedElement = document.querySelector("#wind-speed");
    let currentDateELement = document.querySelector("#current-date");
    let date = new Date(response.data.time * 1000);
    let description = response.data.condition.description; 
    let iconElement = document.querySelector("#icon");
    
    cityElement.innerHTML = response.data.city;
    descriptionElement.innerHTML = capitalizeEachWord(description)
    temperatureElement.innerHTML = temperature;
    humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
    windspeedElement.innerHTML = `${response.data.wind.speed} km/h`;
    currentDateELement.innerHTML = formatDate(date);
    iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;
    getForecast(response.data.city);
    
    setBackgroundImage(response.data.city); // <-- Aquí inyectamos la imagen de fondo dinámica


    console.log(response.data)
    }
  
  function capitalizeEachWord(sentence) {
    return sentence.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

  
  function formatDate(date) {
    let minutes = date.getMinutes();
    let hours = date.getHours();
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    
    let formattedDay = days[date.getDay()];
    
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
  
    if (hours < 10) {
      hours = `0${hours}`;
    }
  
    return `${formattedDay} ${hours}:${minutes},`;
  }
  
  
  function search(event) {
    event.preventDefault();
    let searchInputElement = document.querySelector("#search-input");
    let city = searchInputElement.value;
  
    let apiKey = "401t83c73f9a5ce923fbbco0d7594958"; 
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayTemperature);
  }

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let apiKey = "401t83c73f9a5ce923fbbco0d7594958";
        let apiUrl = `https://api.shecodes.io/weather/v1/current?lat=${lat}&lon=${lon}&key=${apiKey}&units=metric`;
        axios.get(apiUrl).then(displayTemperature);
      }, () => {
        alert("Oops! We couldn't get your current location 😅. Try again or search for your city 🔎");
      });
    } else {
      alert("Your browser doesn't allow Geolocation tracking 😮‍💨.");
    }
  }


function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${formatDay(day.time)}</div>

        <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>${Math.round(day.temperature.maximum)}º - </strong>
          </div>
          <div class="weather-forecast-temperature">${Math.round(
            day.temperature.minimum
          )}º</div>
        </div>
      </div>
    `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", search);

function setBackgroundImage(city) {
  let unsplashAccessKey = "nfe6sMVUi1cy6M6fD_3k-jcs6xPe0sNlCdmrHOvTKyQ";
  let UnSplashAPIurl = `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashAccessKey}&orientation=landscape&color=blue`;

  axios.get(UnSplashAPIurl)
    .then(response => {
      if (response.data.results.length > 0) {
        let imageUrl = response.data.results[2].urls.full;
        document.body.style.backgroundImage = `url(${imageUrl})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center center';
        document.body.style.backgroundRepeat = 'no-repeat';
      } else {
        document.body.style.backgroundImage = '';
      }
    })
    .catch(error => {
      console.error("Error loading image:", error);
      document.body.style.backgroundImage = '';
    });
}

getCurrentLocation();

