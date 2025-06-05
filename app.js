const startBtn = document.querySelector(".start");
const search = document.querySelector("#inputfield");
const searchIcon = document.querySelector("#searchIcon");
const desc = document.querySelector("#desc");
const temp = document.querySelector("#temp");
const cityName = document.querySelector("#city");
const wind = document.querySelector("#windSpeed");
const humidity = document.querySelector("#humidityper");
const goHome = document.querySelector(".homeBtn");
const icon = document.querySelector("#icon");
const mainBox1 = document.querySelector(".mainBox1");
const mainBox2 = document.querySelector(".mainBox2");
const mainBox3 = document.querySelector(".mainBox3");

startBtn.addEventListener("click", () => {
    mainBox1.classList.add("inactive");
    mainBox2.classList.remove("inactive");
});

function changeIcon(weatherMain) {
    let icons = {
       Clouds: "image/clouds.png",
        Rain: "image/rain.png",
        Mist: "image/mist.png",
        Haze: "image/haze.png",
        Snow: "image/snow.png",  // Ensure this file exists correctly
        Clear: "image/clear.png"
    };
    icon.src = icons[weatherMain] || "image/clear.png";
}

const url = "https://api.openweathermap.org/data/2.5/weather?";
const apiKey = "60c87147d8f6193adef70e580032a403";

async function getWeatherData(city) {
    let finalUrl = `${url}q=${city}&appid=${apiKey}`;
    let weatherData = await fetch(finalUrl).then(res => res.json());
    console.log(weatherData);

    if (weatherData.cod == 404) {
        mainBox2.classList.add("inactive");
        mainBox3.classList.remove("inactive");
        desc.innerHTML = "City not found";
        temp.innerHTML = "0°C";
        cityName.innerHTML = "Unknown";
        wind.innerHTML = "0 km/h";
        humidity.innerHTML = "0%";
        search.value = "";
        icon.src = "image/clear.png";
        return;
    }

    if (weatherData.weather && weatherData.weather.length > 0) {
        desc.innerHTML = weatherData.weather[0].description;
        changeIcon(weatherData.weather[0].main);
    }

    if (weatherData.main) {
        temp.innerHTML = Math.round(weatherData.main.temp - 273.15) + "°C";
        wind.innerHTML = weatherData.wind.speed + " km/h";
        humidity.innerHTML = weatherData.main.humidity + "%";
    }

    cityName.innerHTML = weatherData.name;
    
    // 🔄 Save city search to backend
    fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
    }).catch((err) => console.error("Failed to save search:", err));

}

searchIcon.addEventListener("click", () => {
    if (search.value.trim() !== "") {
        getWeatherData(search.value);
    }
});

search.addEventListener("keypress", (e) => {
    if (e.key == "Enter" && search.value.trim() !== "") {
        getWeatherData(search.value);
    }
});

goHome.addEventListener("click", () => {
    mainBox3.classList.add("inactive");
    mainBox1.classList.remove("inactive");
});
