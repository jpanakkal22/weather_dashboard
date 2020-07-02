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

// This is our API key
var APIKey = "645a6f915fa06385ae3c8b3689dadec1";
console.log(APIKey);



button.on("click", function(event){
  event.preventDefault();
  var cityName = $("#input").val().trim();
    

  // Here we are building the URL we need to query the database
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

    



  // Here we run our AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL,
    method: "GET"
  })
  // We store all of the retrieved data inside of an object called "response"
  .then(function(response) {

      
    // Transfer content to HTML
    $(".city").html("<h1>" + response.name + " Weather Details</h1>");
    $(".wind").text("Wind Speed: " + response.wind.speed);
    $(".humidity").text("Humidity: " + response.main.humidity);    
    $(".longitude").text(response.coord.lon);
    console.log($(".longitude").text());
    $(".latitude").text(response.coord.lat);
  
    // Convert the temp to fahrenheit
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;

    // add temp content to html
    $(".temp").text("Temperature (K) " + response.main.temp);
    $(".tempF").text("Temperature (F) " + tempF.toFixed(2));
  
  });




  var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=33.75&lon=-84.39";

  $.ajax({
  url: uvURL,
  method: "GET"
  })
  // We store all of the retrieved data inside of an object called "response"
  .then(function(response) {
      
    // Transfer content to HTML    
    $(".uvIndex").text("UV Index: " + response.value);
    
  
  })
})




