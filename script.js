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
        console.log(response)
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
  //  console.log(error)
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
  //Timestamp
  const m = moment.unix(forecast.daily[0].dt).format("MM-DD-YYYY"); 
  $("#title1").text(m.toString());
  const m1 = moment.unix(forecast.daily[1].dt).format("MM-DD-YYYY"); 
  $("#title2").text(m1.toString());
  const m2 = moment.unix(forecast.daily[2].dt).format("MM-DD-YYYY"); 
  $("#title3").text(m2.toString());
  const m3 = moment.unix(forecast.daily[3].dt).format("MM-DD-YYYY"); 
  $("#title4").text(m3.toString());
  const m4 = moment.unix(forecast.daily[4].dt).format("MM-DD-YYYY"); 
  $("#title5").text(m4.toString());

  //Weather Icon  
  const iconCode = forecast.daily[0].weather[0].icon;
  const iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
  $("#image1").attr("src", iconURL).attr("alt", "Weather Icon");
  const iconCode1 = forecast.daily[1].weather[0].icon;
  const iconURL1 = "http://openweathermap.org/img/w/" + iconCode1 + ".png";
  $("#image2").attr("src", iconURL1).attr("alt", "Weather Icon");
  const iconCode2 = forecast.daily[2].weather[0].icon;
  const iconURL2 = "http://openweathermap.org/img/w/" + iconCode2 + ".png";
  $("#image3").attr("src", iconURL2).attr("alt", "Weather Icon");
  const iconCode3 = forecast.daily[3].weather[0].icon;
  const iconURL3 = "http://openweathermap.org/img/w/" + iconCode3 + ".png";
  $("#image4").attr("src", iconURL3).attr("alt", "Weather Icon");
  const iconCode4 = forecast.daily[4].weather[0].icon;
  const iconURL4 = "http://openweathermap.org/img/w/" + iconCode4 + ".png";
  $("#image5").attr("src", iconURL4).attr("alt", "Weather Icon");

  //Temperature / Convert the temp to fahrenheit
  const tempDay1 = (forecast.daily[0].temp.max - 273.15) * 1.80 + 32;
  $("#tempDay1").text("Temp: " + tempDay1.toFixed());
  const tempDay2 = (forecast.daily[1].temp.max - 273.15) * 1.80 + 32;
  $("#tempDay2").text("Temp: " + tempDay2.toFixed());
  const tempDay3 = (forecast.daily[2].temp.max - 273.15) * 1.80 + 32;
  $("#tempDay3").text("Temp: " + tempDay3.toFixed());
  const tempDay4 = (forecast.daily[3].temp.max - 273.15) * 1.80 + 32;
  $("#tempDay4").text("Temp: " + tempDay4.toFixed());
  const tempDay5 = (forecast.daily[4].temp.max - 273.15) * 1.80 + 32;
  $("#tempDay5").text("Temp: " + tempDay5.toFixed());

  //Humidity
  const hum1 = forecast.daily[0].humidity;
  $("#humDay1").text("Humidity: " + hum1);
  const hum2 = forecast.daily[1].humidity;
  $("#humDay2").text("Humidity: " + hum2);
  const hum3 = forecast.daily[2].humidity;
  $("#humDay3").text("Humidity: " + hum3);
  const hum4 = forecast.daily[3].humidity;
  $("#humDay4").text("Humidity: " + hum4);
  const hum5 = forecast.daily[4].humidity;
  $("#humDay5").text("Humidity: " + hum5);
}

//Function to render history of searches to page
const renderHistory = () => {  
  $("#input1").text(cityArray[0]);
  $("#input2").text(cityArray[1]);
  $("#input3").text(cityArray[2]);
  $("#input4").text(cityArray[3]);
  $("#input5").text(cityArray[4]);
  $("#input6").text(cityArray[5]);
  $("#input7").text(cityArray[6]);
  $("#input8").text(cityArray[7]);
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
// jQuery event delegation on main search button and all history buttons
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







 

  
  
  
  
  
  
      
  

  






        
   






