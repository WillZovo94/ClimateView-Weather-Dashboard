const apiKey = 'b7806c84d1d3d136fad167665de26042'
const cityInput = document.querySelector('#search-input')
const searchButton = document.querySelector('#search-btn')
const leftView = document.querySelector('#left-view')
const currForecast = document.querySelector('#top-section')
const fiveForecast = document.querySelector('#bottom-section')
const buttonList = document.querySelector('#previous-buttons')
const history = JSON.parse(localStorage.getItem('history')) || []

// grabs localStorage
function getStorage () {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    return history;
}
// saves localStorage
function saveStorage () {
    localStorage.setItem('history', JSON.stringify(history));
}

// may not need this actually if i can figure out how to delete some data when I press the button to add a city so it doesn't loop through the array.
function buttonInitial () {
    getStorage();
    const lastItem = searchStorage[searchStorage.length - 1];
    const createNewButton = document.createElement('button');
    createNewButton.textContent = lastItem;
    leftView.appendChild(createNewButton);
}

function buttons () {
    /* making variable for storage of the child elements */
    let buttonStorage = document.querySelector('#previous-buttons');
    /* resetting the storage so it updates and doesn't cause duplications */
    buttonStorage.innerHTML = '';
    /* call storage */
    getStorage();
    /* Using for loop to iterate through history.length */
    /* Essentially making new buttons through each iteration */
    for (let i = 0; i < history.length; i++) {
        const createNewButton = document.createElement('button');
        /* Making a city-target class so it can be targeted and used to access previous searches */
        createNewButton.setAttribute('class', 'city-target');
        createNewButton.textContent = history[i];
        buttonStorage.appendChild(createNewButton);
    }
}

function getLocation(location) {
    /* Grabbing input location */
    const inputs = document.querySelector('#search-input');
    let searched;

    /* Assigning if there is no parameter */
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
        /* Calling curr weather data and resetting the input values */
        console.log(data);
        recieveCurrWeather(data);
        inputs.value = '';
    })
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
        if (!history.includes(current.name)) {
            history.push(current.name);
        }
        // saves data
        saveStorage(history);
        // display saved city buttons
        buttons();
    })
}

// working on this currently //
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

  /* setting attributes with classnames so we can customize / edit with css */
  addCurrWeather.setAttribute('class', 'currWeatherDiv')
  name.setAttribute('class', 'name-div')
  currCity.setAttribute('class', 'city-name')
  icon.setAttribute('class', 'current-weather-icon')
  currStats.setAttribute('class', 'stats-div')

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

/*Calling these 2 on either page load / refresh */
getStorage();
buttons();


/* This button makes it so we can select previous searched content using event.target */
buttonList.addEventListener('click', function (event) {
    if (event.target.classList.contains('city-target')) {
        const redoSearch = event.target.textContent;
        getLocation(redoSearch);
    }
})

/* The city search button */
searchButton.addEventListener('click', function (event) {
    getStorage();
    event.preventDefault();
    getLocation();
})