document.addEventListener("DOMContentLoaded", async function () {
    async function getWeather(cityInput) {
      const apiKey = "71a474e4ceefd7ee577984c14fde1876";
      const weatherInfoDiv = document.getElementById("weatherInfo");
      const icon = document.getElementById("icon");
      const label = document.getElementById("label");
      const date = new Date;
      let day = date.getDay() + 7;
      let mon = date.getMonth() + 1;
      let yea = date.getFullYear();
      if (mon < 10) {
        mon = "0" + mon;
      }
      if (day < 10) {
        day = "0" + day;
      }
      const divider = "."
      const full_date = `${day}${divider}${mon}${divider}${yea}`;

      document.getElementById("date").innerHTML = full_date;
  
      const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}`;

      icon.addEventListener("mouseenter", function() {
        label.style.left = "5%";
      })
      icon.addEventListener("mouseleave", function() {
        label.style.left = "-25%";
      })

      try {
        const response = await fetch(url);
        const data = await response.json();
  
        if (data.cod !== "404") {
          return data.main.temp;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherInfoDiv.innerHTML = "<p>An error occurred. Please try again.</p>";
        return null;
      }
    }
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  
    let currentCity = "";
  
    function showPosition(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
  
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          currentCity = data.address.city || data.address.town || data.address.village || data.address.hamlet;
          document.getElementById("city").innerHTML = currentCity;
          getWeather(currentCity).then(temp => {
            const element = document.getElementById("temp");
            temp = temp - 273.15;
  
            if (temp !== null) {
              element.innerHTML = `${temp.toFixed(1)}°C`;
            } else {
              element.innerHTML = "Temperature not available";
            }
          });
        })
        .catch(error => {
          console.error("Error fetching city information:", error);
        });
    }
  });  