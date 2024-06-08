const apiKey = 'b7806c84d1d3d136fad167665de26042'
const cityInput = document.querySelector('#search-input')
const searchButton = document.querySelector('#search-btn')
const leftView = document.querySelector('#left-view')

// const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`

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

function buttons (data) {
    getStorage();
    for (let i = 0; i < searchStorage.length; i++) {
        const createNewButton = document.createElement('button');
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
    .then(function (weather) {
        console.log(weather);
        // adding weather.name into the searchStorage if its not included.
        if (!searchStorage.includes(weather.name)) {
            searchStorage.push(weather.name);
        }
        // saves data
        saveStorage(searchStorage);
    })
}

searchButton.addEventListener('click', function (event) {
    saveStorage();
    getLocation();
    buttons(searchStorage);
})

getStorage();
buttons(searchStorage);

// Connecting to the ApiUrl //


// Making a form submit that goes into localStorage.
// finsihed?
 
/* function inputSubmit (event) {
    const cityData = cityInput.value;

    tempStorageName.city.push(cityData);

    localStorage.setItem('history', JSON.stringify(tempStorageName));

    const createNewButton = document.createElement('button');

    createNewButton.textContent = cityData;

    leftView.appendChild(createNewButton);
}

// finished?
function recentButtons () {
    const storedData = JSON.parse(localStorage.getItem('tempStorageName'));

    if (storedData) {
        tempStorageObject = storedData;
    }

    for (let i = 0; i < tempStorageName.city.length; i++) {
        const createNewButton = document.createElement('button');
        createNewButton.textContent = tempStorageName.city[i];
        leftView.appendChild(createNewButton);
    }

    return;
}

*/

// recentButtons(tempStorageName);