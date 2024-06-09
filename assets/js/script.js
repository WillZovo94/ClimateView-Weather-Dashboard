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
        getWeatherInfo(data);
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
        showWeather(data);
    })
}

function showWeather (weather) {

       /* resetting global variable to zero */
       fiveForecast.innerHTML = '';
        fiveForecast.setAttribute('style', 'display: flex; flex-direction: column; text-align: center')

       /* adding elements to store the information */
       const weatherTitle = document.createElement('h2');
        weatherTitle.textContent = "5-Day Forecast"
       const weatherDiv = document.createElement('div');
        weatherDiv.setAttribute('class', 'weather-div-container');
        weatherDiv.setAttribute('style', 'display: flex;')

       fiveForecast.appendChild(weatherTitle);
       fiveForecast.appendChild(weatherDiv);
   
       let emptyVariable = '';
       for (let i = 0; i < 5; i++) {
           /* We're multiplying I by 8 because in the data, on the 8th data gathered is a new day because it goes by hourly of 3 */
           let everyNewDay = i * 8 + emptyVariable;

            /* Creating elements and setting attributes for each */
            const weatherCard = document.createElement('div');
              weatherCard.setAttribute('class', 'weather-card')
              weatherCard.setAttribute('style', 'display: flex; flex-direction: column')

            const dateTitle = document.createElement('h2');
              dateTitle.textContent = dayjs(weather.list[everyNewDay].dt_txt).format('MM/DD/YYYY');

            const icon = document.createElement('img');
              icon.setAttribute('src', `https://openweathermap.org/img/wn/${weather.list[everyNewDay].weather[0].icon}@2x.png`)
              icon.setAttribute('alt', `${weather.list[everyNewDay].weather[0].description} weather icon`)

            const temperature = document.createElement('p');   
              temperature.textContent = `Temp: ${weather.list[everyNewDay].main.temp}\u00B0F`;

            const wind = document.createElement('p');  
              wind.textContent = `Wind: ${weather.list[everyNewDay].wind.speed} (MPH) Miles Per Hour`;

            const humidity = document.createElement('p');
              humidity.textContent = `Humidity: ${weather.list[everyNewDay].main.humidity}%`;
           
            /* Appending elements */
            weatherCard.appendChild(dateTitle);
            weatherCard.appendChild(icon);
            weatherCard.appendChild(temperature);
            weatherCard.appendChild(wind);
            weatherCard.appendChild(humidity);
            weatherDiv.appendChild(weatherCard);
       }
   
       /* testing consoles */
       console.log(weather.list)

}

function showCurrWeather (current) { 
  /* Calling a new variable to the top section global variable */
  const currWeather = currForecast;
  
  /* Needed or else it will keep creating current content with new searches */
  currWeather.textContent = '';

  /*Creating elements and setting attributes for each so we can customize / edit with css */
  const addCurrWeather = document.createElement('div');
    addCurrWeather.setAttribute('class', 'currWeatherDiv')
    addCurrWeather.setAttribute('class', 'currWeatherDiv')


  const name = document.createElement('div');
    name.setAttribute('class', 'name-div')


  const currCity = document.createElement('p');
    currCity.setAttribute('class', 'city-name')

  const icon = document.createElement('img');
    icon.setAttribute('class', 'current-weather-icon')

  const currStats = document.createElement('div');
    currStats.setAttribute('class', 'stats-div')

  const tempRead = document.createElement('p');
  const windRead = document.createElement('p');
  const humidityRead = document.createElement('p');

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


















