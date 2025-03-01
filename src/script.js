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
    console.log(date)
    console.log(response.data)
    console.log(iconElement)
  }
  
  function capitalizeEachWord(sentence) {
    return sentence
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
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

  function handleSearch(event) {
    event.preventDefault();
    let searchInputElement = document.querySelector("#search-input");
    search(searchInputElement.value);
}
  
  let searchFormElement = document.querySelector("#search-form");
  searchFormElement.addEventListener("submit", search);

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

getCurrentLocation();

