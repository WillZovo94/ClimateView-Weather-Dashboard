const apiKey = 'b7806c84d1d3d136fad167665de26042'
const cityName = '';
const cityInput = document.querySelector('#search-input')

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

test();

function storeLocalStorage() {
    localStorage.setItem('')
}