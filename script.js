// API key
var APIKey = "645a6f915fa06385ae3c8b3689dadec1";

// Declare variables cityArray, cityName, weather, uvIndex, forecast
var cityArray = ["Chicago", "Dallas", "Green Bay", "Tampa", "Los Angeles", "Seattle", "Las Vegas"];
// Cleveland is the default value until updated
var cityName = "Cleveland";
var weather;
var uvIndex;
var forecast;

// Call init function
init();

// Event listener for main search button

// jQuery event delegation on main search button and all history buttons
$(".buttons").on("click", function(event){
  event.preventDefault(); 
  console.log(this);

  // Update global variable cityName with search value
  cityName = $("#input").val().trim();

  // If global variable cityArray contains the city name that is searched, call callWeather function
  if(cityArray.includes(cityName.toLowerCase())){
    callWeather();
    return;
  }
  
  // This probably should be an else statement. If city searched is not in history, call 3 functions: callWeather, renderHistory, and updatedArray. Stringify cityArray and set to local storage key 'cityArray'
  callWeather();
  renderHistory();
  updateArray();
  localStorage.setItem("cityArray", JSON.stringify(cityArray));   
}) 

//Event listener for history searches
$(".history").on("click", function(){
  //Event delegation, update global cityName variable to the history button text
  cityName = $(this).text();
  // console.log(cityName);
  // When a history button is clicked, call callWeather function to display weather
  callWeather();
})

function callWeather(){
 //Weather API url including search input value and API key
 var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&cnt={5}&appid=" + APIKey;  
    
 //AJAX call to the OpenWeatherMap API for CURRENT WEATHER
 $.ajax({
 url: weatherURL,
 method: "GET"}).then(function(response) {
  //  console.log(response);
  // Update global weather variable with API response
 weather = response;
 // Stringify and set weather variable into local storage key 'weather'
 localStorage.setItem("weather", JSON.stringify(weather));
    
 //Convert longitude and latitude values into strings and store in variables
 var longitude = JSON.stringify(response.coord.lon);
 var latitude = JSON.stringify(response.coord.lat);

 //Weather API url for UV Index including API key and longitude/latitude coordinates
   var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;

 // AJAX call to the OpenWeatherMap API for CURRENT UV Index
   $.ajax({
   url: uvURL,
   method: "GET"}).then(function(response) {
     // Update global variable uvIndex with response 
   uvIndex = response; 
   // Stringify and set uvIndex variable into local storage key 'uvIndex'
   localStorage.setItem("uvIndex", JSON.stringify(uvIndex));
      
     // Weather API url for 5 day forecast including API key and longitude/latitude coordinates
       var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude={minutely}&appid=" + APIKey;    
             
       //AJAX call to the OpenWeatherMap API for 5 day forecast
       $.ajax({
       url: forecastURL,
       method: "GET"
       }).then(function(response){
                 ;
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

}

// Initialize application with data stored in local storage
function init(){
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
    updateArray();
    localStorage.setItem("cityArray", JSON.stringify(cityArray));
  }         
}

 //Function to render current weather
function renderWeather(){    
  // Convert the temp to fahrenheit
  var tempF = (weather.main.temp - 273.15) * 1.80 + 32;
  
  //Convert timestamp to readable format
  var m = moment.unix(weather.dt).format("M-DD-YYYY");      
  $(".date").text("(" + m.toString(2) + ")"); 
    
  // Transfer content to HTML
  $(".city").text(weather.name);
  $(".tempF").text("Temperature: " + tempF.toFixed(2));
  $(".humidity").text("Humidity: " + weather.main.humidity);
  $(".wind").text("Wind Speed: " + weather.wind.speed); 
  $(".uvIndex").text(uvIndex.value); 

  // call function uvColors to set background color of uv index
  uvColors();  

  //Weather Icon
  var iconCode = weather.weather[0].icon;
  var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
  $("#wicon").attr("src", iconURL); 

  // call renderHistory function to add searched name to history button
  renderHistory();
}

//Function to render 5 day forecast 
function renderForecast(){  
  //Timestamp
  var m = moment.unix(forecast.daily[0].dt).format("MM-DD-YYYY"); 
  $("#title1").text(m.toString());
  var m1 = moment.unix(forecast.daily[1].dt).format("MM-DD-YYYY"); 
  $("#title2").text(m1.toString());
  var m2 = moment.unix(forecast.daily[2].dt).format("MM-DD-YYYY"); 
  $("#title3").text(m2.toString());
  var m3 = moment.unix(forecast.daily[3].dt).format("MM-DD-YYYY"); 
  $("#title4").text(m3.toString());
  var m4 = moment.unix(forecast.daily[4].dt).format("MM-DD-YYYY"); 
  $("#title5").text(m4.toString());

  //Weather Icon  
  var iconCode = forecast.daily[0].weather[0].icon;
  var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
  $("#image1").attr("src", iconURL).attr("alt", "Weather Icon");
  var iconCode1 = forecast.daily[1].weather[0].icon;
  var iconURL1 = "http://openweathermap.org/img/w/" + iconCode1 + ".png";
  $("#image2").attr("src", iconURL1).attr("alt", "Weather Icon");
  var iconCode2 = forecast.daily[2].weather[0].icon;
  var iconURL2 = "http://openweathermap.org/img/w/" + iconCode2 + ".png";
  $("#image3").attr("src", iconURL2).attr("alt", "Weather Icon");
  var iconCode3 = forecast.daily[3].weather[0].icon;
  var iconURL3 = "http://openweathermap.org/img/w/" + iconCode3 + ".png";
  $("#image4").attr("src", iconURL3).attr("alt", "Weather Icon");
  var iconCode4 = forecast.daily[4].weather[0].icon;
  var iconURL4 = "http://openweathermap.org/img/w/" + iconCode4 + ".png";
  $("#image5").attr("src", iconURL4).attr("alt", "Weather Icon");

  //Temperature / Convert the temp to fahrenheit
  var tempDay1 = (forecast.daily[0].temp.max - 273.15) * 1.80 + 32;
  $("#tempDay1").text("Temp: " + tempDay1.toFixed(2));
  var tempDay2 = (forecast.daily[1].temp.max - 273.15) * 1.80 + 32;
  $("#tempDay2").text("Temp: " + tempDay2.toFixed(2));
  var tempDay3 = (forecast.daily[2].temp.max - 273.15) * 1.80 + 32;
  $("#tempDay3").text("Temp: " + tempDay3.toFixed(2));
  var tempDay4 = (forecast.daily[3].temp.max - 273.15) * 1.80 + 32;
  $("#tempDay4").text("Temp: " + tempDay4.toFixed(2));
  var tempDay5 = (forecast.daily[4].temp.max - 273.15) * 1.80 + 32;
  $("#tempDay5").text("Temp: " + tempDay5.toFixed(2));

  //Humidity
  var hum1 = forecast.daily[0].humidity;
  $("#humDay1").text("Humidity: " + hum1);
  var hum2 = forecast.daily[1].humidity;
  $("#humDay2").text("Humidity: " + hum2);
  var hum3 = forecast.daily[2].humidity;
  $("#humDay3").text("Humidity: " + hum3);
  var hum4 = forecast.daily[3].humidity;
  $("#humDay4").text("Humidity: " + hum4);
  var hum5 = forecast.daily[4].humidity;
  $("#humDay5").text("Humidity: " + hum5);
}

//Function to render history of searches to page
function renderHistory(){  
  console.log(cityArray);
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
function uvColors(){
  var uvVal = uvIndex.value;

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
function updateArray(){
  var len = cityArray.length;
  // take city name and add to city array
  cityArray.push(cityName); 
  // if cityArray length is >= 8, remove first item from array
  if(len >= 8){
    cityArray.shift();    
  }
}







 

  
  
  
  
  
  
      
  

  






        
   






