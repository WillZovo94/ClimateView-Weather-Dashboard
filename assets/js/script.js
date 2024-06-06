const apiKey = 'b7806c84d1d3d136fad167665de26042'
const cityName = '';
const cityInput = document.querySelector('#search-input')
const searchButton = document.querySelector('#search-btn')

const leftView = document.querySelector('#left-view')

let tempStorageName = JSON.parse(localStorage.getItem('history')) || {
    city: []
}

// Connecting to the ApiUrl //
function test () {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
    fetch(apiUrl)
    .then(function (response) {
        if (!response) {
            console.log("oh no");
        } else {
            return response.json();
        }
    })
    .then(function (data) {
        console.log(data);
    }) 
}


// Making a form submit that goes into localStorage.
function inputSubmit (event) {
    event.preventDefault();

    const cityData = cityInput.value;

    tempStorageName.city.push(cityData);

    localStorage.setItem('history', JSON.stringify(tempStorageName));

    const createNewButton = document.createElement('button');

    createNewButton.textContent = cityData;

    leftView.appendChild(createNewButton);
}

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

recentButtons(tempStorageName);

test();

searchButton.addEventListener('click', inputSubmit)