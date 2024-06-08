const apiKey = 'b7806c84d1d3d136fad167665de26042'
const cityInput = document.querySelector('#search-input')
const searchButton = document.querySelector('#search-btn')
const leftView = document.querySelector('#left-view')
const currForecast = document.querySelector('#top-section')
const fiveForecast = document.querySelector('#bottom-section')
// global variable so it can be called
const searchStorage = JSON.parse(localStorage.getItem('history')) || []
// grabs localStorage
function getStorage () {
    const searchStorage = JSON.parse(localStorage.getItem('history')) || [];
    return searchStorage;
}
// saves localStorage
function saveStorage () {
    localStorage.setItem('history', JSON.stringify(searchStorage));
}

function getLocation(location) {
    const inputs = cityInput;
    let searched = '';

    if(!location) {
        searched = inputs.value;
    } else {
        searched = location;
    }

    // helps find the lon / lat of the search
    const geographicApi = `https://api.openweathermap.org/geo/1.0/direct?q=${searched}&limit=1&appid=${apiKey}`;


    // fetching that API URL
    fetch(geographicApi)
    .then(function(response) {
       // using json() on response so we can use the information.
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        recieveCurrWeather(data)
    })
}

function buttonInitial (data) {
    getStorage();
    const lastItem = searchStorage[searchStorage.length - 1];
    const createNewButton = document.createElement('button');
    createNewButton.textContent = lastItem;
    leftView.appendChild(createNewButton);
}

function buttons (data) {
    getStorage();
    for (let i = 0; i < searchStorage.length; i++) {
        const createNewButton = document.createElement('button');
        createNewButton.setAttribute('class', 'city-target');
        createNewButton.textContent = searchStorage[i];
        leftView.appendChild(createNewButton);
    }
}

// This function helps get the current weather.
function recieveCurrWeather(data) {
    // calling the localStorage
    getStorage();

    // This API URL helps target the recent data, (data[0]) and selecting the .lat information within that data.
    const apiWeatherCall = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}&units=imperial`

    // standard fetch.
    fetch(apiWeatherCall)
    .then(function (response) {
        // using json() on response so we can use the information.
        return response.json();
    })
    .then(function (current) {
        showCurrWeather(current);
        // adding weather.name into the searchStorage if its not included.
        if (!searchStorage.includes(current.name)) {
            searchStorage.push(current.name);
        }
        // saves data
        saveStorage(searchStorage);
        buttonInitial();
    })
}

function getWeatherInfo (data) {
    const forecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}&units=imperial`

    fetch(forecast)
    .then(function (response) {
        return response.json();
    })
    .then (function (data) {
        // make forecast visible
    })
}

function showCurrWeather (current) { 
  /* Calling a new variable to the top section global variable */
  const currWeather = currForecast;
  
  /* Needed or else it will keep creating current content with new searches */
  currWeather.textContent = '';

  /*Creating elements */
  const addCurrWeather = document.createElement('div');
  const name = document.createElement('div');
  const currCity = document.createElement('p');
  const icon = document.createElement('img');
  const currStats = document.createElement('div');
  const tempRead = document.createElement('p');
  const windRead = document.createElement('p');
  const humidityRead = document.createElement('p');

  addCurrWeather.setAttribute('class', 'currWeatherDiv')
  name.setAttribute('class', 'name-div')
  currCity.setAttribute('class', 'city-name')
  icon.setAttribute('class', 'current-weather-icon')

  /* Grabs the name within the json response */
  currCity.textContent = `${current.name} (${dayjs().format('M/D/YYYY')})`;
  /* setting attribute into a source. Uses current data, gathers the weather then the icon listed inside */
  icon.setAttribute('src', `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`);
  /* the rest goes through the data. It's targeting different places within the data. */
  tempRead.textContent = `Temp: ${current.main.temp}`
  windRead.textContent = `Wind: ${current.wind.speed} (MPH) Miles Per Hour`
  humidityRead.textContent = `Humidity: ${current.main.humidity}%`;
  /* Appending the created elements */
  addCurrWeather.appendChild(name);
  name.appendChild(currCity);
  name.appendChild(icon);
  addCurrWeather.appendChild(currStats);
  currStats.appendChild(tempRead);
  currStats.appendChild(windRead);
  currStats.appendChild(humidityRead);
  currWeather.appendChild(addCurrWeather)
}

getStorage();
buttons();

/*
currForecast.addEventListener('click', function(event) {
    if (event.target.classList.contains('city-target')) {
        const redoSearch = event.target.textContent;
        getLocation(redoSearch);
    }
})

*/


searchButton.addEventListener('click', function (event) {
    getStorage();
    getLocation();
})