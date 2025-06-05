import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import "./Weather.css";
import search_icon from "../Assets/img/search.png";
import clear_icon from "../Assets/img/clear.png";
import clear_night from "../Assets/img/clear-night.png";
import cloud_icon from "../Assets/img/cloud.png";
import cloud_night from "../Assets/img/cloud-night.png";
import drizzle_icon from "../Assets/img/drizzle.png";
import drizzle_night from "../Assets/img/drizzle-night.png";
import humidity_icon from "../Assets/img/humidity.png";
import rain_icon from "../Assets/img/rain.png";
import rain_night from "../Assets/img/rain-night.png";
import snow_icon from "../Assets/img/snow.png";
import snow_night from "../Assets/img/snow-night.png";
import wind_icon from "../Assets/img/wind.png";

export default function Weather() {
  const inputRef = useRef();

  const [weatherData, setWeatherData] = useState(false);

  const [searchCity, setSearchCity] = useState("");

  const allIcons = useMemo(
    () => ({
      "01d": clear_icon,
      "01n": clear_night,
      "02d": cloud_icon,
      "02n": cloud_night,
      "03d": cloud_icon,
      "03n": cloud_icon,
      "04d": drizzle_icon,
      "04n": drizzle_night,
      "09d": rain_icon,
      "09n": rain_night,
      "10d": rain_icon,
      "10n": rain_night,
      "13d": snow_icon,
      "13n": snow_night,
    }),
    []
  );

  const search = useCallback(
    async (city) => {
      if (!city) {
        alert("Please enter a city name");
        return;
      }
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_ID}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
          alert(data.message);
          return;
        }
        const icon = allIcons[data.weather[0].icon] || clear_icon;
        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: data.name,
          icon: icon,
        });
      } catch (error) {
        setWeatherData(false);
        console.error("Error fetching weather data");
      }
    },
    [allIcons]
  );

  function handleSearch(e) {
    e.preventDefault();
    search(inputRef.current.value);
    setSearchCity("");
  }

  useEffect(() => {
    search("London");
  }, [search]);

  return (
    <div className="weather">
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a city..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />

        <img src={search_icon} alt="" onClick={handleSearch} />
      </form>

      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="" className="weather-icon" />

          <p className="temperature">{weatherData.temperature}°c </p>

          <p className="location">{weatherData.location}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />

              <div>
                <p>{weatherData.humidity}%</p>

                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} alt="" />

              <div>
                <p>{weatherData.windSpeed} Km/h</p>

                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
