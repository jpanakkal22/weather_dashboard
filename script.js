// API key
var APIKey = "645a6f915fa06385ae3c8b3689dadec1";

renderWeather();
renderForecast();

// Event listener
$("button").on("click", function(event){
  event.preventDefault();

  // Store search value into variable
  var cityName = $("#input").val().trim();    

  // Weather API url including search input value and API key
  var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&cnt={5}&appid=" + APIKey;  
    
  // AJAX call to the OpenWeatherMap API for CURRENT WEATHER
  $.ajax({
  url: weatherURL,
  method: "GET"}).then(function(response) {
    localStorage.setItem("weather", JSON.stringify(response));
    renderWeather();
    renderForecast();
    
    // Convert longitude and latitude values into strings and store in variables
    var longitude = JSON.stringify(response.coord.lon);
    var latitude = JSON.stringify(response.coord.lat);

    // Weather API url for UV Index including API key and longitude/latitude coordinates
    var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;

    // AJAX call to the OpenWeatherMap API for CURRENT UV Index
    $.ajax({
    url: uvURL,
    method: "GET"}).then(function(response) {
    localStorage.setItem("uvIndex", JSON.stringify(response)); 
    renderWeather();     
    renderForecast(); 
    }) 

    // Weather API url for 5 day forecast including API key and longitude/latitude coordinates
    var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude={minutely}&appid=" + APIKey;    
          
    //AJAX call to the OpenWeatherMap API for 5 day forecast
    $.ajax({
    url: forecastURL,
    method: "GET"
    }).then(function(response){
      console.log(response)        ;
      localStorage.setItem("forecast", JSON.stringify(response));  
      renderWeather(); 
      renderForecast();       
    })
  })   
})  

function renderWeather(){
  var city = JSON.parse(localStorage.getItem("weather"));
  var uvIndex = JSON.parse(localStorage.getItem("uvIndex"));
  var forecast = JSON.parse(localStorage.getItem("forecast"));
  
  // Convert the temp to fahrenheit
  var tempF = (city.main.temp - 273.15) * 1.80 + 32;
  
  //Convert timestamp to readable format
  var m = moment.unix(city.dt).format("M-DD-YYYY");      
  $(".date").text("(" + m.toString(2) + ")"); 
    
  // Transfer content to HTML
  $(".city").text(city.name);
  $(".tempF").text("Temperature: " + tempF.toFixed(2));
  $(".humidity").text("Humidity: " + city.main.humidity);
  $(".wind").text("Wind Speed: " + city.wind.speed); 
  $(".uvIndex").text(uvIndex.value);   

  //Weather Icon
  var iconCode = city.weather[0].icon;
  var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
  $("#wicon").attr("src", iconURL); 
}

function renderForecast(){
  var city = JSON.parse(localStorage.getItem("weather"));
  var uvIndex = JSON.parse(localStorage.getItem("uvIndex"));
  var forecast = JSON.parse(localStorage.getItem("forecast"));

  //5 day forecast Day 1
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
  
  
  
  
  
  
      
  

  






        
   






