// API key
const APIKey = "645a6f915fa06385ae3c8b3689dadec1";

// Declare variables cityArray, cityName, weather, uvIndex, forecast
let cityArray = ["Chicago", "Dallas", "Green Bay", "Tampa", "Los Angeles", "Seattle", "Las Vegas"];
// Cleveland is the default value until updated
let cityName = "Cleveland";
let weather;
let uvIndex;
let forecast;

const callWeather = () => {
  //Weather API url including search input value and API key
  const weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&cnt={5}&appid=" + APIKey;  
      
  //AJAX call to the OpenWeatherMap API for CURRENT WEATHER
  $.get(weatherURL, (response) => {    
    // Update global weather variable with API response
    weather = response;
    // Stringify and set weather variable into local storage key 'weather'
    localStorage.setItem("weather", JSON.stringify(weather));

    if(!cityArray.includes(response.name)){
      updateArray(response.name);      
    }
        
    //Convert longitude and latitude values into strings and store in variables
    const longitude = JSON.stringify(response.coord.lon);
    const latitude = JSON.stringify(response.coord.lat);

    //Weather API url for UV Index including API key and longitude/latitude coordinates
    const uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;

    // AJAX call to the OpenWeatherMap API for CURRENT UV Index 
    $.get(uvURL, (response) => {
      // Update global variable uvIndex with response 
      uvIndex = response; 
      // Stringify and set uvIndex variable into local storage key 'uvIndex'
      localStorage.setItem("uvIndex", JSON.stringify(uvIndex));
          
      // Weather API url for 5 day forecast including API key and longitude/latitude coordinates
      const forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude={minutely}&appid=" + APIKey;    
           
      //AJAX call to the OpenWeatherMap API for 5 day forecast    
      $.get(forecastURL, (response) => {        
        // update global variable forecast with response
        forecast = response;
        // Stringify and set forecast variable into local storage key 'forecast'
        localStorage.setItem("forecast", JSON.stringify(forecast));
        // Call renderWeather and renderForecast functions  
        renderWeather(); 
        renderForecast();                        
      })    
    })     
  })      
  .catch(error => {
    alert(`City ${error.statusText}`);
  })
}

// Initialize application with data stored in local storage
const init = () => {
  weatherInit = localStorage.getItem("weather");
  uvIndexInit = localStorage.getItem("uvIndex");
  forecastInit = localStorage.getItem("forecast");
  cityArrayInit = localStorage.getItem("cityArray");
  
  // If there is data in local storage, update global variables with the parsed data
  if(weatherInit && uvIndexInit && forecastInit && cityArrayInit){
    weather = JSON.parse(weatherInit);
    uvIndex = JSON.parse(uvIndexInit);
    forecast = JSON.parse(forecastInit);
    cityArray = JSON.parse(cityArrayInit);
    // Call 3 functions and render local storage data to application
    renderWeather();
    renderForecast();
    renderHistory();
  }
  // Or else, use cityName "Cleveland" to update dashboard and local storage
  else{
    callWeather();
    renderHistory();
    updateArray(cityName);    
  }         
}

//Function to render current weather
const renderWeather = () => {    
  // Convert the temp to fahrenheit
  const tempF = (weather.main.temp - 273.15) * 1.80 + 32;
    
  //Convert timestamp to readable format
  const m = moment.unix(weather.dt).format("M-DD-YYYY");      
  $(".date").text("(" + m.toString(2) + ")"); 
    
  // Transfer content to HTML
  $(".city").text(weather.name);
  $(".tempF").text("Temperature: " + tempF.toFixed());
  $(".humidity").text("Humidity: " + weather.main.humidity);
  $(".wind").text("Wind Speed: " + weather.wind.speed); 
  $(".uvIndex").text(uvIndex.value); 

  // call function uvColors to set background color of uv index
  uvColors();  

  //Weather Icon
  const iconCode = weather.weather[0].icon;
  const iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
  $("#wicon").attr("src", iconURL); 

  // call renderHistory function to add searched name to history button
  renderHistory();
}

//Function to render 5 day forecast 
const renderForecast = () => {   
  for(let i = 0; i < 5; i++) {
    //Timestamp
    let m = moment.unix(forecast.daily[i].dt).format("MM-DD-YYYY"); 
    $(`#title${i}`).text(m.toString());

    //Weather Icon
    let iconCode = forecast.daily[i].weather[0].icon;
    let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
    $(`#image${i}`).attr("src", iconURL).attr("alt", "Weather Icon");

    //Temperature / Convert the temp to fahrenheit
    let tempDay = (forecast.daily[i].temp.max - 273.15) * 1.80 + 32;
    $(`#tempDay${i}`).text("Temp: " + tempDay.toFixed());

    //Humidity
    let hum = forecast.daily[i].humidity;
    $(`#humDay${i}`).text("Humidity: " + hum);
  }
}

//Function to render history of searches to page
const renderHistory = () => {  
  for(let i = 0; i < cityArray.length; i++) {
    $(`#input${i}`).text(cityArray[i]);
  }
}

//Function to change color for uv index conditions
const uvColors = () => {
  const uvVal = uvIndex.value;
  // change background colors using CSS
  if(uvVal < 3){
    $(".uvIndex").attr("id", "favorable");
  }
  else if(uvVal >= 3 && uvVal <= 7){
    $(".uvIndex").attr("id", "moderate")
  }  
  else {
    $(".uvIndex").attr("id", "high");
  }    
}

//Function to push and shift items into cityArray
const updateArray = (city) => {
  const len = cityArray.length;
  // take city name and add to city array
  cityArray.push(city); 
  // if cityArray length is >= 8, remove first item from array
  if(len >= 8){
    cityArray.shift();    
  }
  // Update local storage with updated cityArray
  localStorage.setItem("cityArray", JSON.stringify(cityArray));
}

// Call init function
init();

// Event listener for main search button
$(".buttons").on("click", function(event) {
  event.preventDefault(); 

  // Update global variable cityName with search value
  cityName = $("#input").val().trim();
  callWeather();  
}) 

//Event listener for history searches
$(".history").on("click", function() {  
  //Event delegation, update global cityName variable to the history button text
  cityName = $(this).text();
  
  // When a history button is clicked, call callWeather function to display weather
  callWeather();
})







 

  
  
  
  
  
  
      
  

  






        
   






