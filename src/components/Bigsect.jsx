import React, { useEffect, useState } from "react";
import { LuWind } from "react-icons/lu";
import { BsDroplet } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";

const Bigsect = ({ city, setCity, theme }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [days, setDays] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const search = async (cityName) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: data.name,
          condition: data.weather[0].main,
        });
      } else {
        if (submitted) {
          alert("City not found. Try another.");
        }
        setWeatherData(null);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setSubmitted(false);
    }
  };

  const fetchDailyForecast = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${
          import.meta.env.VITE_APP_ID
        }`
      );
      const data = await response.json();

      const grouped = {};
      data.list.forEach((item) => {
        const rawDate = item.dt_txt.split(" ")[0]; // format: "2025-07-18"
        if (!grouped[rawDate]) grouped[rawDate] = [];
        grouped[rawDate].push(item);
      });

      const daily = Object.entries(grouped)
        .slice(0, 7)
        .map(([rawDate, items], i) => {
          const temps = items.map((i) => i.main.temp);
          const avgTemp = Math.round(
            temps.reduce((acc, val) => acc + val, 0) / temps.length
          );

          const jsDate = new Date(rawDate); // Safe to parse

          return {
            id: i,
            date: rawDate,
            day: jsDate.toLocaleDateString("en-GB", { weekday: "short" }),
            temp: `${avgTemp}°`,
            condition: items[0].weather[0].main,
          };
        });

      setDays(daily);
    } catch (error) {
      console.error("Error fetching daily forecast:", error);
    }
  };

  useEffect(() => {
    if (city) {
      search(city);
      fetchDailyForecast();
    }
  }, [city]);

  const today = new Date().toLocaleDateString("en-GB");

  return (
    <div
      className={`transition-colors duration-500 ease-in-out ${
        theme === "dark"
          ? "bg-[#2a2a2a] text-white"
          : "bg-[rgb(197,196,196)] text-[rgb(105,105,105)]"
      } w-full md:w-[80%] lg:w-[60%] h-auto md:h-[90vh] rounded-none md:rounded-l-4xl flex flex-col px-4 py-6`}
    >
      <h1 className="font-semibold text-[15px]">This is a site where you can input your location to check what the weather looks like in next six hours and next five days</h1>
      <div
        className={`flex lg:flex-row sm:flex-col md:flex-col justify-between items-center text-black text-base md:text-lg font-semibold mb-6 px-2 md:px-10 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        <h3>{weatherData?.location || "Loading..."}</h3>
        <h3>{today}</h3>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
          if (city.trim() !== "") {
            search(city);
            fetchDailyForecast();
          }
        }}
        className="flex px-2 w-full"
      >
        <div className="relative w-full">
          <FaSearch
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city"
            aria-label="City name"
            autoComplete="off"
            className={`${
              theme === "dark"
                ? "bg-[#2a2a2a] text-gray-300 placeholder-gray-500 shadow-gray-400"
                : "bg-transparent text-gray-600 placeholder-gray-400 shadow-black"
            } w-full pl-10 shadow-lg rounded-lg md:rounded-l-lg px-4 py-2 font-medium text-base focus:outline-none focus:ring-2 focus:ring-gray-800`}
          />
        </div>
      </form>

      {weatherData ? (
        <div
          className={`${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          } bg-transparent flex flex-col md:flex-row justify-center items-center mt-10 gap-10`}
        >
          <div>
            <h1
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              } bg-transparent text-7xl md:text-[10rem] font-semibold text-center text-shadow-black text-shadow-lg`}
            >
              {weatherData.temperature}°
            </h1>
            <h3 className="text-2xl md:text-4xl font-bold text-center">
              {weatherData.condition}
            </h3>
          </div>
          <div className="flex mt-5 md:mt-16 md:-ml-5 font-medium flex-col text-sm md:text-base gap-2">
            <span className="flex gap-3 items-center">
              <LuWind size={25} />
              <h4>{weatherData.windSpeed} mph</h4>
            </span>
            <span className="flex gap-3 items-center">
              <BsDroplet size={25} />
              <h4>{weatherData.humidity} %</h4>
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-5 text-xl font-medium">
          Loading weather data...
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
        {days.map((day) => (
          <div
            key={day.id}
            className={`${
              theme === "dark"
                ? "bg-[#2a2a2a] text-gray-300 shadow-gray-400"
                : "bg-transparent text-gray-600 shadow-black"
            } border w-24 h-32 rounded-xl shadow-lg flex justify-evenly items-center flex-col`}
          >
            <h2
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              {day.day}
            </h2>
            <h2 className="text-xl font-medium">{day.temp}</h2>
            <h2 className="font-semibold">{day.condition}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bigsect;
