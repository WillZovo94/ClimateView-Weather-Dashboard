const apiKey = 'b7806c84d1d3d136fad167665de26042'
const cityInput = document.querySelector('#search-input')
const searchButton = document.querySelector('#search-btn')
const leftView = document.querySelector('#left-view')

// const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`

let tempStorageName = JSON.parse(localStorage.getItem('history')) || []

function getStorage () {
    let tempStorageName = JSON.parse(localStorage.getItem('history')) || [];
    return tempStorageName;
}

function saveStorage () {
    localStorage.setItem('storage', JSON.stringify(tempStorageName));
}

function getLocation(location) {
    const inputs = cityInput;
    let searched = '';

    if(!location) {
        searched = inputs.value;
    } else {
        searched = location;
    }

    const geographicApi = `https://api.openweathermap.org/geo/1.0/direct?q=${searched}&limit=1&appid=${apiKey}`;

    fetch(geographicApi)
    .then(function(response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    })
}

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

searchButton.addEventListener('click', function (event) {
    //inputSubmit();
    getLocation();
})