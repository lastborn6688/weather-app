import React, { useEffect, useState } from "react";
import { BsDroplet } from "react-icons/bs";
import { LuWind } from "react-icons/lu";

const Smallsect = ({ city, theme }) => {
  const [weather, setWeather] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
            import.meta.env.VITE_APP_ID
          }`
        );
        const data = await res.json();
        setWeather({
          temp: Math.round(data.main.temp),
          wind: data.wind.speed,
          humidity: data.main.humidity,
        });
      } catch (err) {
        console.error("Error fetching weather:", err);
      }
    };

    const fetchHourly = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${
            import.meta.env.VITE_APP_ID
          }`
        );
        const data = await response.json();
        const sliced = data.list.slice(0, 6).map((item) => ({
          hour: new Date(item.dt * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temp: `${Math.round(item.main.temp)}°`,
          condition: item.weather[0].main,
        }));
        setHourlyData(sliced);
      } catch (error) {
        console.error("Error fetching hourly forecast:", error);
      }
    };

    if (city) {
      fetchWeather();
      fetchHourly();
    }
  }, [city]);

  return (
    <div
      className={`transition-colors duration-500 ease-in-out w-full md:w-[25%]  sm:rounded-r-none h-auto md:h-[90vh] lg:rounded-r-4xl flex flex-col 
      ${
        theme === "dark"
          ? "bg-[#1c1c1c] text-white"
          : "bg-[rgb(212,212,212)] text-black"
      }`}
    >
      <h1 className="text-3xl font-medium p-6 ml-10 drop-shadow-md">
        {getGreeting()}
      </h1>
      <h3 className="flex justify-center font-semibold text-4xl">
        {currentTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </h3>

      <div className="flex justify-center items-center text-[rgb(105,105,105)] mt-10 gap-2">
        <div>
          <h1 className="text-[3rem] font-semibold text-shadow-lg text-shadow-black text-center">
            {weather ? `${weather.temp}°` : "--"}
          </h1>
        </div>
        <div className="flex font-bold flex-col text-[10px] gap-2">
          <span className="flex gap-3">
            <LuWind size={15} />
            <h4>{weather ? `${weather.wind} mph` : "--"}</h4>
          </span>
          <span className="flex gap-3">
            <BsDroplet size={15} />
            <h4>{weather ? `${weather.humidity} %` : "--"}</h4>
          </span>
        </div>
      </div>

      <h4 className="flex justify-center font-semibold text-[12px] text-[rgb(105,105,105)]">
        Feels like 90°
      </h4>
      <h3 className="text-xl font-semibold mt-2 flex justify-center text-[rgb(105,105,105)]">
        Cloudy
      </h3>

      <h2 className="flex justify-center text-xl font-semibold mt-5">
        Hourly Forecast
      </h2>

      <div
        className={`${
          theme === "dark"
            ? "bg-[#2a2a2a] text-gray-300 shadow-gray-400"
            : "bg-transparent text-gray-600 shadow-black"
        } grid grid-cols-3 gap-3 mx-10 items-center justify-evenly mt-10 rounded-lg shadow-lg shadow-black`}
      >
        {hourlyData.map((hour, index) => (
          <div
            key={index}
            className={`w-20 h-28 rounded-xl shadow-lg flex flex-col justify-around items-center mx-2
            ${
              theme === "dark"
                ? "bg-[#2a2a2a] text-gray-300 shadow-gray-600"
                : "bg-transparent text-gray-600 shadow-black"
            }`}
          >
            <h2
              className={`${
                theme === "dark"
                  ? "bg-[#2a2a2a] text-gray-300 shadow-gray-600"
                  : "bg-transparent text-gray-600 shadow-black"
              }font-semibold`}
            >
              {hour.hour}
            </h2>
            <h2 className="text-[1.5rem] font-medium">{hour.temp}</h2>
            <h2 className="font-semibold">{hour.condition}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Smallsect;
