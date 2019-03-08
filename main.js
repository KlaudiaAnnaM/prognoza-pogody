let appId = `ae76d0efed32d9f29c4d54a5738b80ca`;

var calculateTemp = function (temp) {
    return Math.ceil(temp - 273.15);
};

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert('Nie można pobrać geolokalizacji');
    }
}

function showPosition(position) {
    if (position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${appId}`)
            .then(res => res.json())
            .then((data) => {
                init(data);
            });

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${appId}`)
            .then(res => res.json())
            .then((data) => {
                initForecast(data);
            });
    }
}

window.onload = getLocation();

function searchWeather(searchCity) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${appId}`)
        .then(res => res.json())
        .then((data) => {
            init(data);
        });
}

function forecastGetData(searchCity) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${appId}`)
        .then(res => res.json())
        .then((data) => {
            initForecast(data);
        });
}

function init(resultFromServer) {
    switch (resultFromServer.weather[0].main) {
        case 'Clear':
            document.body.style.backgroundImage = "url('default.jpg')";
            break;

        case 'Clouds':
            document.body.style.backgroundImage = "url('clouds.jpg')";
            break;

        case 'Rain':
        case 'Drizzle':
        case 'Mist':
            document.body.style.backgroundImage = "url('rain.jpg')";
            break;

        case 'Thunderstorm':
            document.body.style.backgroundImage = "url('storm.jpg')";
            break;

        case 'Snow':
            document.body.style.backgroundImage = "url('snow.jpg')";
            break;

        default:
            break;
    }

    let temperature = document.getElementById('temperature');
    let humidity = document.getElementById('humidity');
    let windSpeed = document.getElementById('windSpeed');
    let pressure = document.getElementById('pressure');
    let cityHeader = document.getElementById('cityHeader');
    let weatherIcon = document.getElementById('documentIconImg');

    weatherIcon.src = `http://openweathermap.org/img/w/` + resultFromServer.weather[0].icon + '.png';
    temperature.innerText = calculateTemp(resultFromServer.main.temp).toFixed(0) + String.fromCharCode(176) + ' C';
    windSpeed.innerText = 'Wiatr: ' + resultFromServer.wind.speed.toFixed(0) + ' m/s';
    humidity.innerText = 'Wilgotność: ' + resultFromServer.main.humidity.toFixed(0) + ' %';
    pressure.innerText = 'Ciśnienie: ' + resultFromServer.main.pressure.toFixed(0) + ' hPa';
    cityHeader.innerText = resultFromServer.name;

    showWeatherInfo();
}

function initForecast(forecastResult) {
    let size = 5;

    forecastResult.list.slice(0, size).forEach(element => {

        var forecastHoursCell = document.getElementById('forecastHoursCell');
        var x = forecastHoursCell.insertCell(-1);
        x.innerHTML = element.dt_txt;

        var forecastImageCell = document.getElementById('forecastImageCell');
        var z = forecastImageCell.insertCell(-1);
        var imgUrl = `http://openweathermap.org/img/w/` + element.weather[0].icon + '.png';
        z.innerHTML = `<img src="${imgUrl}"/>`;

        var forecastTempCell = document.getElementById('forecastTempCell');
        var z = forecastTempCell.insertCell(-1);
        z.innerHTML = calculateTemp(element.main.temp).toFixed(0) + String.fromCharCode(176) + ' C';

    });
    showForecastInfo();
}

document.getElementById('searchBtn').addEventListener('click', () => {
    let searchCity = document.getElementById('searchInput').value.trim();

    if (searchCity) {
        searchWeather(searchCity);
        forecastGetData(searchCity);
        document.getElementById('searchInput').value = "";
    } else {
        return alert('Wpisz miasto');
    }
});

document.getElementById('searchInput').addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        let searchCity = document.getElementById('searchInput').value.trim();

        if (searchCity) {
            searchWeather(searchCity);
            forecastGetData(searchCity);
            document.getElementById('searchInput').value = "";
        }
    }
});

function showWeatherInfo() {
    document.getElementById('weatherContainer').style.visibility = "visible";
}

function showForecastInfo() {
    document.getElementById('forecast').style.visibility = "visible";
}