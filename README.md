# Weather Dashboard
A weather app designed to intake a city or location and display the current weather for that region, as well as a less detailed 5-day forecast.

## Features
* Displays location found from search at top of page.
* Displays date, weather icon, temperature, humidity, wind speed, and UV index for current date.
* Displays date, weather icon, temperature, and humidity for 5-day forecast data.
* Saves up to 12 unique searches including your current search to allow you to view multiple destinations.
* Will keep your data from your previous to prevent you from losing data from reloading the page.
* Sorts the list alphabetically to allow you to find the city you are looking for easier.

## Potential Future Upgrades
* Try to update function to only need one api call instead of two, this halves the number of theoretical calls allowed per month which is significant when it comes to multiple people potentially using this. A million calls per month is a lot, but the current design means that 500,000 searches per month would overload it and require a better subscription. This however, appears to be the minimum calls based on the one call api requiring latitude and longitude, which would be an additional calculation with a high complexity at this time.