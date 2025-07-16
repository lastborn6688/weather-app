// WeatherApp.jsx
import React, { useState } from "react";
import Smallsect from "./components/Smallsect";
import Bigsect from "./components/Bigsect";
import { FaMoon, FaSun } from "react-icons/fa";

const WeatherApp = () => {
  const [city, setCity] = useState("Enter your location"); // Default city
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div
      className={`transition-colors duration-500 ease-in-out mt-10 flex flex-col justify-center items-center lg:flex-row md:flex-row w-full h-full
        ${
          theme === "dark" ? "bg-[#121212] text-white" : "bg-white text-black"
        }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full cursor-pointer shadow-md mt10 bg-gray-300 dark:bg-gray-800 text-black dark:text-white transition"
      >
        {theme === "light" ? <FaMoon className="" /> : <FaSun />}
      </button>

      <Bigsect city={city} setCity={setCity} theme={theme} />
      <Smallsect city={city} theme={theme} />
    </div>
  );
};

export default WeatherApp;
