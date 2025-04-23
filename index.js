// API key
const apiKey = '2039ddb9d6f03229b9f07346f76ab114';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const localTime = document.getElementById('local-time');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherDesc = document.getElementById('weather-desc');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const weatherDisplay = document.getElementById('weather-display');
const errorDisplay = document.getElementById('error-display');
const loader = document.getElementById('loader');

// Default city on load
document.addEventListener('DOMContentLoaded', () => {
    getWeatherData('New York');
});

// Event listeners
searchBtn.addEventListener('click', () => {
    if (searchInput.value.trim() !== '') {
        getWeatherData(searchInput.value);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim() !== '') {
        getWeatherData(searchInput.value);
    }
});

// Function to get weather data from API
async function getWeatherData(city) {
    try {
        // Show loader, hide previous data and errors
        loader.style.display = 'block';
        weatherDisplay.classList.remove('active');
        errorDisplay.style.display = 'none';

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        
        if (!response.ok) {
            throw new Error(`City not found or API error: ${response.status}`);
        }

        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError(error.message);
    } finally {
        loader.style.display = 'none';
    }
}

// Function to update UI with weather data
function updateWeatherUI(data) {
    // Update main weather information
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    // Get and format local time
    const timezone = data.timezone;
    const localDateTime = new Date(Date.now() + timezone * 1000);
    localTime.textContent = `Local time: ${formatTime(localDateTime)}`;
    
    // Update temperature and description
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDesc.textContent = data.weather[0].description;
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    // Update details
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    pressure.textContent = `${data.main.pressure} hPa`;

    // Change background based on weather and time of day
    changeBackground(data.weather[0].main, iconCode.includes('n'));
    
    // Show the weather display with animation
    setTimeout(() => {
        weatherDisplay.classList.add('active');
    }, 300);
}

// Function to format time
function formatTime(date) {
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${formattedMinutes} ${ampm}`;
}

// Function to change background based on weather
function changeBackground(weatherMain, isNight) {
    document.body.className = ''; // Reset classes
    
    if (isNight) {
        document.body.classList.add('night');
        return;
    }
    
    // Add class based on weather condition
    const weatherClass = weatherMain.toLowerCase();
    document.body.classList.add(weatherClass);
}

// Function to show error message
function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
    weatherDisplay.classList.remove('active');
}
