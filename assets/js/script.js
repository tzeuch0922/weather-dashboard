// Load search history to webpage, if it exists.
function loadSearchHistory()
{
    var loadedHistory = localStorage.getItem("searches");

    if(!loadedHistory)
    {
        updateSearchHistory(true);
        return;
    }
    recentSearch = JSON.parse(loadedHistory);
    updateSearchHistory(false);
    updateWeatherData(recentSearch[recentSearch.length - 1]);
}

// Update buttons and eventlisteners for buttons used for search history.
function updateSearchHistory(initial)
{
    // Sort searchList to make an alphabetical list of locations.
    var temp = JSON.parse(JSON.stringify(recentSearch));
    var sortedSearches = temp.sort();

    searchHistoryEl.innerHTML = "";

    sortedSearches.forEach(function(item)
    {
        if(item !== recentSearch[recentSearch.length - 1] || initial)
        {
            var listItemEl = document.createElement("li");
            var newButtonEl = document.createElement("button");
            newButtonEl.className = "bg-light w-100 text-left pl-3 py-2 border-1";
            newButtonEl.textContent = item;
            newButtonEl.value = item;
            newButtonEl.addEventListener("click", function()
            {
                updateWeatherData(newButtonEl.value);
            });
            listItemEl.appendChild(newButtonEl);
            searchHistoryEl.appendChild(listItemEl);
        }
    });
}

// Update weather on webpage
function updateWeatherData(city)
{
    // Get current date and format it.
    var today = new Date();
    var formattedDate = "(" + (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear() + ")";

    // Instantiate latitude and longitude for storage for one call
    var latitude = 0;
    var longitude  = 0;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`).then(function(response)
    {
        if(response.ok)
        {
            response.json().then(function(data)
            {
                cityNameEl.textContent = data.name;
                append(data.name);
                latitude = data.coord.lat;
                longitude = data.coord.lon;
                updateSearchHistory(false);
                localStorage.setItem("searches", JSON.stringify(recentSearch));
            })
            .then(function(response)
            {
                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`).then(function(response)
                {
                    if(response.ok)
                    {
                        response.json().then(function(data)
                        {
                            console.log("5-day Weather:");
                            console.log(data);
                            dateEl.textContent = formattedDate;
                            weatherIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
                            temperatureEl.textContent = kelvinToFahrenheit(data.current.temp);
                            humidityEl.textContent = data.current.humidity;
                            windSpeedEl.textContent = mpsToMPH(data.current.wind_speed);
                            uvIndexEl.textContent = data.current.uvi;
                            if(data.current.uvi <= 2)
                            {
                                uvIndexEl.className = "bg-success text-light px-1 pb-1";
                            }
                            else if(data.current.uvi <= 5)
                            {
                                uvIndexEl.className = "bg-warning text-light px-1 pb-1";
                            }
                            else if(data.current.uvi <= 8)
                            {
                                uvIndexEl.className = "bg-caution text-light px-1 pb-1";
                            }
                            else if(data.current.uvi <= 11)
                            {
                                uvIndexEl.className = "bg-danger text-light px-1 pb-1";
                            }
                            else
                            {
                                uvIndexEl.className = "bg-highdanger text-light px-1 pb-1";
                            }
                            for(var i = 0; i < 5; i++)
                            {
                                // Query for individual elements to replace values
                                var dayEl = dateList[i].querySelector(".date");
                                var iconEl = dateList[i].querySelector(".icon");
                                var tempEl = dateList[i].querySelector(".temperature");
                                var humidEl = dateList[i].querySelector(".humidity");

                                // Setup to find average temperature for the day.
                                var tempList = [];
                                tempList.push(data.daily[i].temp.morn);
                                tempList.push(data.daily[i].temp.day);
                                tempList.push(data.daily[i].temp.eve);
                                tempList.push(data.daily[i].temp.night);

                                // Set data for individual days.
                                dayEl.textContent = (today.getMonth() + 1) + "/" + (today.getDate() + i) + "/" + today.getFullYear();
                                iconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
                                tempEl.textContent = kelvinToFahrenheit(average(tempList));
                                humidEl.textContent = data.daily[i].humidity;
                            }
                            if(forecastEl.classList.contains("hidden"))
                            {
                                forecastEl.classList.remove("hidden");
                            }
                        });
                    }
                    else
                    {
                        return;
                    }
                });
            });
        }
        else
        {
            window.alert("City not found.");
        }
    });
}

// Convert Kelvin to Fahrenheit
function kelvinToFahrenheit(temperature)
{
    return Math.round((temperature-273.15) * 1.8 + 32);
}

// Convert mps to MPH
function mpsToMPH(speed)
{
    return Math.round(2.23694*speed);
}

// Average all values in an array.
function average(nums)
{
    var sum = 0;
    for(var i = 0; i < nums.length; i++)
    {
        sum += nums[i];
    }
    return sum/nums.length;
}

// Append object to recentSearch array. Will remove searches older than last 12 searches.
function append(item)
{
    if(recentSearch.includes(item))
    {
        for(var i = 0; i < recentSearch.length; i++)
        {
            if(recentSearch[i] === item)
            {
                recentSearch.splice(i, 1);
                break;
            }
        }
        recentSearch.push(item);
    }
    else if(recentSearch.length === 12)
    {
        recentSearch.splice(0, 1);
        recentSearch.push(item);
    }
    else
    {
        recentSearch.push(item);
    }
}

// Set api-key
var apiKey = "d423db8c340a5369b71dde7b447e8bce";

// Instantiate variables to keep track of most recent searches.
var recentSearch = ["Austin", "Chicago", "New York", "Orlando", "San Francisco", "Seattle", "Denver", "Atlanta"];
var searchHistoryEl = document.querySelector("#search-history-list");

// Query all elements that need to be updated in current weather
var dateEl = document.querySelector("#date");
var cityNameEl = document.querySelector("#city-name");
var weatherIconEl = document.querySelector("#weather-icon");
var temperatureEl = document.querySelector("#temperature");
var humidityEl = document.querySelector("#humidity");
var windSpeedEl = document.querySelector("#wind-speed");
var uvIndexEl = document.querySelector("#uv-index");
var forecastEl = document.querySelector("#forecast");

// Query all elements for the 5-day forecast section and place them in an array.
var dateList = [];
for(var i = 0; i < 5; i++)
{
    dateList.push(document.querySelector(`#forecast-day-${i}`));
}

// Query elements for search functionality.
var searchButtonEl = document.querySelector("#search-button");
var searchBarEl = document.querySelector("#input-search");

loadSearchHistory();

// Add event listeners
searchButtonEl.addEventListener("click", function()
{
    if(searchBarEl.value)
    {
        updateWeatherData(searchBarEl.value);
        searchBarEl.value = "";
    }
    else
    {
        window.alert("Enter city you want to check.");
    }
});