// Dynamically create search label, input field and search button
var label = $("<label>");
label.text("Search for a City");
$("body").append(label);

var input = $("<input>");
input.attr("id", "input");
$("body").append(input);

var button = $("<button>");
button.attr("id", "search");
button.text("Search");
$("body").append(button);

// API key
var APIKey = "645a6f915fa06385ae3c8b3689dadec1";

// Event listener
button.on("click", function(event){
  event.preventDefault();

  // Store seach value into variable
  var cityName = $("#input").val().trim();    

  // Weather API url including search input value and API key
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&cnt={5}&appid=" + APIKey;  
  
  // AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    
    console.log(response);
    //Convert timestamp to readable format
    var m = moment.unix(response.dt).format("MM-DD-YYYY");
    $("#dt").text(m.toString()); 
          
    // Transfer content to HTML
    $(".city").html("<h1>" + response.name + " Weather Details</h1>");
    $(".wind").text("Wind Speed: " + response.wind.speed);
    $(".humidity").text("Humidity: " + response.main.humidity); 

     // Convert the temp to fahrenheit
     var tempF = (response.main.temp - 273.15) * 1.80 + 32;

     // add temp content to html
     $(".temp").text("Temperature (K) " + response.main.temp);
     $(".tempF").text("Temperature (F) " + tempF.toFixed(2));
    
    // Convert longitude and latitude values into strings and store in variables
    var longitude = JSON.stringify(response.coord.lon);
    var latitude = JSON.stringify(response.coord.lat);

    // Weather API url for UV Index including API key and longitude/latitude coordinates
    var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;

    // AJAX call to the OpenWeatherMap API for UV Index
    $.ajax({
    url: uvURL,
    method: "GET"
    }).then(function(response) {
                    
      // Transfer content to HTML    
      $(".uvIndex").text("UV Index: " + response.value);      
    
    })  

    // Weather API url for 5 day forecast including API key and longitude/latitude coordinates
    var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude={minutely}&appid=" + APIKey;    
    
    //AJAX call to the OpenWeatherMap API for 5 day forecast
    $.ajax({
      url: forecastURL,
      method: "GET"
      }).then(function(response){
         
         for(var i = 0; i < 5; i++){
          var m = moment.unix(response.daily[i].dt).format("MM-DD-YYYY");  
          console.log(m.toString());
          var newDiv = $("<div>").attr("class", "day" + [i]);
          newDiv.text("Day " + [i] + ":" + m.toString());
          $("body").append(newDiv);     
          
          //Weather Icon
          var iconCode = response.daily[i].weather[0].icon;
          var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
          var weatherIcon = $("<img>").attr("id", "wicon" + [i]).attr("src", iconURL).attr("alt", "Weather Icon");
          $(".day" + [i]).append(weatherIcon);
          
          // Convert the temp to fahrenheit
          var tempFDay = (response.daily[i].temp.max - 273.15) * 1.80 + 32;
          console.log(tempFDay);
          var newDivTemp = $("<div>").attr("class", "Temp: " + [i]);
          newDivTemp.text("Temperature: " + tempFDay.toFixed(2));
          $(".day" + [i]).append(newDivTemp);
          

          var hum = response.daily[i].humidity;
          console.log(hum);
          var newDivHumidity = $("<div>").attr("class", "Humidity" + [i]);
          newDivHumidity.text(response.daily[i].humidity);
          $(".day" + [i]).append(newDivHumidity);
          // $(".hum1").text(response.daily[i].humidity);

         }

        


       
        

      })
  });
  
})





