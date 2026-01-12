const apiKey = "e2bd0a1b12304d037189b1b0e9634264";

let favorites = JSON.parse(localStorage.getItem("favourites")) || [];

let currentCity = "";

function SearchWeather(cityFromFav){
    let city = cityFromFav || document.getElementById("cityInput").value;
    if(!city)
        return;
   fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(res => res.json())
      .then(data => {
        currentCity = data.name;
        displayWeather(data);
      });
  }

  function displayWeather(data) {
    document.getElementById("weatherBox").innerHTML = `
      <h3>${data.name}</h3>
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
      <p>Condition: ${data.weather[0].description}</p>`
    ;
  }

  function addToFavorites() {
    if (currentCity && !favorites.includes(currentCity)) {
      favorites.push(currentCity);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderFavorites();
      renderSelects();
    }
  }

  function renderFavorites() {
    const list = document.getElementById("favList");
    list.innerHTML = "";

    favorites.forEach(city => {
      const li = document.createElement("li");
     li.innerHTML = `
      <span onclick="searchWeather('${city}')">${city}</span>
      <button onclick="removeFavorite('${city}')">X</button>
    `;
      list.appendChild(li);
    });
  }

  function removeFavorite(city) {
    favorites = favorites.filter(c => c !== city);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
    renderSelects();
  }

  function renderSelects() {
    const city1 = document.getElementById("city1");
    const city2 = document.getElementById("city2");

    city1.innerHTML = "";
    city2.innerHTML = "";

    favorites.forEach(city => {
      city1.innerHTML += `<option value="${city}">${city}</option>`;
      city2.innerHTML += `<option value="${city}">${city}</option>`;
    });
  }

  function compareWeather() {
    const c1 = document.getElementById("city1").value;
    const c2 = document.getElementById("city2").value;

    Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${c1}&appid=${apiKey}&units=metric`).then(res => res.json()),
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${c2}&appid=${apiKey}&units=metric`).then(res => res.json())
    ]).then(results => {
      document.getElementById("compareResult").innerHTML = 
        `${createCompareBox(results[0])}
        ${createCompareBox(results[1])}`
      ;
    });
  }

  function createCompareBox(data) {
    return document.innerHTML = `
      <div class="weather-box">
        <h4>${data.name}</h4>
        <p>${data.main.temp} °C</p>
        <p>${data.main.humidity}%</p>
        <p>${data.wind.speed} m/s</p>
        <p>${data.weather[0].description}</p>
      </div>`
    ;
  }

  renderFavorites();
  renderSelects();
