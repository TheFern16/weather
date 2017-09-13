// these variables grab dom elements on the page
const container = document.querySelector('#container');
const city = document.querySelector('#city');
const temp = document.querySelector('.temp');
const icon = document.querySelector('img');
const description = document.querySelector('.description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const minTemp = document.querySelector('.minTemp');
const maxTemp = document.querySelector('.maxTemp');
const dewPoint = document.querySelector('.dewPoint');

// these helper functions set the HTML on the above DOM elements
const kelvinToFahrenheit = temp => Math.round((temp * 9/5) - 459.67);
const setLocation = loc => city.innerHTML = `${loc}`;
const setTemp = t => temp.innerHTML = `${kelvinToFahrenheit(t)}&deg;F`;
const setDP = t => dewPoint.innerHTML = `Dew Point: ${t}&deg;F`;
const setDescription = d => description.innerHTML = `${d}`;
const setIcon = i => icon.src = `http://openweathermap.org/img/w/${i}.png`;
const setMinTemp = t => minTemp.innerHTML = `Min: ${kelvinToFahrenheit(t)}&deg;F`;
const setMaxTemp = t => maxTemp.innerHTML = `Max: ${kelvinToFahrenheit(t)}&deg;F`;

// this function sets the wind direction, and speed for the wind
const setWindSpeed = (speed, direction) => {
  wind.innerHTML = `Wind: ${direction} ${speed}mph`;
};

// this function creates the HTML for the 'feels like feature'
const feelsLike = (temp, hum) => {
  const cTemp = kelvinToFahrenheit(temp);
  const hi = heatIndex(cTemp, hum);
  humidity.innerHTML = `Feels like: ${Math.floor(hi)}&deg;F`;
};

// this is a heatIndex function that I translated from the national weather service
const heatIndex = (temp, dewPoint) => {
  return -42.379 + 2.04901523 * temp + 10.14333127 * dewPoint - .22475541 * temp * dewPoint - .00683783 * temp * temp - .05481717 * dewPoint * dewPoint + .00122874 * temp * temp * dewPoint + .00085282 * temp * dewPoint * dewPoint - .00000199 * temp * temp * dewPoint * dewPoint;
}

// this function takes a windSpeed, and degree.  Depending on the degree on the degree that is passed it, it will call 'setWindSpeed'; passing in the wind speed, and a recognizable wind direction
const setWindDirection = (windSpeed, deg) => {
  if (deg === 0) {
    setWindSpeed(windSpeed, 'N');
  } else if (deg <= 45) {
    setWindSpeed(windSpeed, 'N NW');
  } else if (deg === 90) {
    setWindSpeed(windSpeed, 'E');
  } else if (deg <= 135) {
    setWindSpeed(windSpeed, 'S SE');
  } else if (deg === 180) {
    setWindSpeed(windSpeed, 'S');
  } else if (deg <= 225) {
    setWindSpeed(windSpeed, 'S SW');
  } else if (deg === 270) {
    setWindSpeed(windSpeed, 'W');
  } else {
    setWindSpeed(windSpeed, 'N NW');
  }
}

// based on how hot or cold it is outside, the background image will change
const setBackgroundImage = (temp) => {
  const fahrenheit = kelvinToFahrenheit(temp);
  if (fahrenheit <= 32) {
    container.style.backgroundImage = 'url(./assets/Cable_Car.jpg';
  } else if (fahrenheit <= 50) {
    container.style.backgroundImage = 'url(./assets/Rainy_Street.jpg';
  } else if (fahrenheit <= 65) {
    container.style.backgroundImage = 'url(./assets/Sunset-Lapse.jpg';
  } else if (fahrenheit <= 85) {
    container.style.backgroundImage = 'url(./assets/Heaven.jpg';
  } else {
    container.style.backgroundImage = 'url(assets/Desert-Mode.jpg';
  }
}

// I query the ip endpoint which returns a JSON object containing the users current location in both 'string', and longitude/latitude coordinates.  I set the location with a callback function, and pass the coordinates onto the getWeather function.
const getLocation = () => {
  fetch('https://weathersync.herokuapp.com/ip')
    .then((response) => {
      return response.json();
    })
    .then((currentLoc) => {
      setLocation(currentLoc.city);
      getWeather(currentLoc.location.latitude, currentLoc.location.longitude);
    });
}

// lat, long are passed in from the getLocation function.  The weather api responds back with a JSON object containing several different items.  I use several callback functions here that set HTML elements on the page with current values.
const getWeather = (lat, long) => {
  fetch(`https://weathersync.herokuapp.com/weather/${lat},${long}`)
    .then((response) => {
      return response.json();
    })
    .then((currentWeather) => {
      setTemp(currentWeather.main.temp);
      setDescription(currentWeather.weather[0].main);
      setIcon(currentWeather.weather[0].icon);
      feelsLike(currentWeather.main.temp, currentWeather.main.humidity);
      setDP(currentWeather.main.humidity);
      setMinTemp(currentWeather.main.temp_min);
      setMaxTemp(currentWeather.main.temp_max);
      setBackgroundImage(currentWeather.main.temp);
      setWindDirection(currentWeather.wind.speed, currentWeather.wind.deg);
    });
}

getLocation();
