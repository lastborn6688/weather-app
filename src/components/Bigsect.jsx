// Bigsect.jsx
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
      setSubmitted(false); // Reset submitted state after search completes
    }
  };

  const generateNext7Days = () => {
    const today = new Date();
    const newDays = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayName = date.toLocaleDateString("en-GB", { weekday: "short" });
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      });

      newDays.push({
        id: i,
        day: dayName,
        date: formattedDate,
        temp: "20°", // placeholder
        condition: "Cloudy", // placeholder
      });
    }

    setDays(newDays);
  };

  useEffect(() => {
    if (city) {
      search(city);
      generateNext7Days();
    }
  }, [city]);

  const today = new Date().toLocaleDateString("en-GB");

  return (
    <div
      className={`transition-colors duration-500 ease-in-out ${
        theme === "dark"
          ? "bg-[#2a2a2a] text-white"
          : "bg-[rgb(197,196,196)] text-[rgb(105,105,105)] "
      } w-full md:w-[80%] lg:w-[60%] h-auto md:h-[90vh] rounded-none md:rounded-l-4xl flex flex-col px-4 py-6`}
    >
      <div className={`flex lg:flex-row sm:flex-col md:flex-col justify-between items-center text-black text-base md:text-lg font-semibold mb-6 px-2 md:px-10 ${theme === "dark" ? "text-white" : "text-black"}`}>
        <h3>{weatherData?.location || "Loading..."}</h3>
        <h3>{today}</h3>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true); // mark that the user submitted manually
          if (city.trim() !== "") {
            search(city);
          }
        }}
        className="flex px-2 w-auto"
      >
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={`${
            theme === "dark"
              ? "bg-[#2a2a2a] text-gray-300 shadow-gray-400"
              : "bg-transparent text-gray-600 shadow-black"
          } w-full   justify-center items-center  shadow-lg rounded-lg md:rounded-l-lg px-4 py-2 font-medium text-base`}
          placeholder="Enter your city"
        />
      </form>
      {weatherData ? (
        <div
          className={`${
            theme === "dark"
              ? " text-gray-300"
              : " text-gray-600"
          } bg-transparent flex flex-col md:flex-row justify-center items-center text-gray-600 mt-10 gap-10`}
        >
          <div>
            <h1
              className={`${
                theme === "dark"
                  ? " text-gray-300"
                  : " text-gray-600"
              } bg-transparent text-7xl md:text-[10rem] font-semibold text-shadow-lg text-shadow-black text-center`}
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
            } border w-24 h-32 rounded-xl shadow-lg  flex justify-evenly items-center flex-col`}
          >
            <h2
              className={`font-semibold text-black ${
                theme === "dark" ? "text-white" : "text-black"
              } `}
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
