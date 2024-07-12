const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursin12hrformat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursin12hrformat < 10? '0' + hoursin12hrformat:hoursin12hrformat) + ':' + (minutes < 10? '0'+minutes: minutes) + ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ' , ' + date + ' ' + months[month]
}, 1000);

const API_KEY = '32997b742364c01565759cbd6ac9562f'

getWeatherData()
function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success) => {
        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data =>{

        console.log(data)
        showMeWeather(data);
        })

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data2 =>{

        console.log(data2)
        futureWeatherData(data2);
        })
    })
}

function showMeWeather(data){
    let {humidity, pressure} = data.main;
    let {sunrise, sunset} = data.sys;
    let {speed} = data.wind;

    timezone.innerHTML = data.name + '/' + data.sys.country;
    countryEl.innerHTML = data.coord.lat + 'N ' + data.coord.lon + 'E';

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-items">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-items">
        <div>pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-items">
        <div>Wind speed</div>
        <div>${speed}</div>
    </div>
    <div class="weather-items">
        <div>Sunrise</div>
        <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-items">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>` 
}

function futureWeatherData(data){
    let otherDayForecast = ''
    data.list.forEach((day,idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather-icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Day - ${day.main.temp_max}&#176; C</div>
                <div class="temp">Night - ${day.main.temp_min}&#176; C</div>
            </div>`
        }else if(idx % 8 == 0){
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
                <div class="temp">Day - ${day.main.temp_max}&#176; C</div>
                <div class="temp">Night - ${day.main.temp_min}&#176; C</div>
            </div>`
        }
    })

    weatherForecastEl.innerHTML = otherDayForecast;
}