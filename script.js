// API key
var APIKey = "645a6f915fa06385ae3c8b3689dadec1";

renderWeather();

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
    }) 

    // Weather API url for 5 day forecast including API key and longitude/latitude coordinates
    var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude={minutely}&appid=" + APIKey;    
          
    //AJAX call to the OpenWeatherMap API for 5 day forecast
    $.ajax({
    url: forecastURL,
    method: "GET"
    }).then(function(response){        
      localStorage.setItem("forecast", JSON.stringify(response));  
      renderWeather();       
    })
  })   
})  

function renderWeather(){
  var city = JSON.parse(localStorage.getItem("weather"));
  console.log(city);

  //Convert timestamp to readable format
  var m = moment.unix(city.dt).format("MM-DD-YYYY");      
  $("#dt").text(m.toString(2)); 
    
  // Transfer content to HTML
  $(".city").text(city.name);

  //Weather Icon
  var iconCode = city.weather[0].icon;
  var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
  $("#wicon").attr("src", iconURL);
  // var weatherIcon = $("<img>").attr("id", "wicon").attr("src", iconURL).attr("alt", "Weather Icon");
  // $(".weatherIcon").append(weatherIcon);
}



// $(".wind").text("Wind Speed: " + response.wind.speed);
// $(".humidity").text("Humidity: " + response.main.humidity); 

// Convert the temp to fahrenheit
// var tempF = (response.main.temp - 273.15) * 1.80 + 32;

// add temp content to html
// $(".temp").text("Temperature (K) " + response.main.temp);
// $(".tempF").text("Temperature (F) " + tempF.toFixed(2));


        
// Transfer content to HTML    
// $(".uvIndex").text("UV Index: " + response.value);   

// for(var i = 0; i < 5; i++){
// var m = moment.unix(response.daily[i].dt).format("MM-DD-YYYY");  

// var newDiv = $("<div>").attr("class", "day" + [i]);
// newDiv.text(m.toString());
// $("#forecast").append(newDiv);     

//Weather Icon
// var iconCode = response.daily[i].weather[0].icon;
// var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
// var weatherIcon = $("<img>").attr("id", "wicon" + [i]).attr("src", iconURL).attr("alt", "Weather Icon");
// $(".day" + [i]).append(weatherIcon);

// Convert the temp to fahrenheit
// var tempFDay = (response.daily[i].temp.max - 273.15) * 1.80 + 32;
// console.log(tempFDay);
// var newDivTemp = $("<div>").attr("class", "Temp: " + [i]);
// newDivTemp.text(tempFDay.toFixed(2));
// $(".day" + [i]).append(newDivTemp);


// var hum = response.daily[i].humidity;
// console.log(hum);
// var newDivHumidity = $("<div>").attr("class", "Humidity" + [i]);
// newDivHumidity.text(response.daily[i].humidity);
// $(".day" + [i]).append(newDivHumidity);

// }



