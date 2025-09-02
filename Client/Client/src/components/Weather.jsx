import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city) return alert("Please enter a city name");

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const res = await fetch(`http://localhost:5000/weather?city=${city}`);
      if (!res.ok) throw new Error("Failed to fetch weather");
      const data = await res.json();

      // Safe assignment with fallback values
      setWeather({
        temperature: data.current_weather?.temperature ?? "N/A",
        apparent_temperature: data.current_weather?.apparent_temperature ?? "N/A",
        windspeed: data.current_weather?.windspeed ?? "N/A",
        winddirection: data.current_weather?.winddirection ?? "N/A",
        humidity: data.current_weather?.humidity ?? "N/A",
        pressure: data.current_weather?.pressure ?? "N/A",
        visibility: data.current_weather?.visibility ?? "N/A",
        sunrise: data.current_weather?.sunrise ?? "N/A",
        sunset: data.current_weather?.sunset ?? "N/A",
        weather_descriptions: data.current_weather?.weather_descriptions?.[0] ?? "Clear",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const weatherEmoji = (desc) => {
    if (!desc) return "🌤️";
    const d = desc.toLowerCase();
    if (d.includes("clear")) return "☀️";
    if (d.includes("cloud")) return "☁️";
    if (d.includes("rain")) return "🌧️";
    if (d.includes("snow")) return "❄️";
    if (d.includes("storm")) return "⛈️";
    return "🌤️";
  };

  return (
    <div className="weather-container">
      <h1 className="title">Weather App {weather && weatherEmoji(weather.weather_descriptions)}</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <motion.button
          onClick={fetchWeather}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "Loading..." : "Get Weather"}
        </motion.button>
      </div>

      {error && <p className="error">{error}</p>}

      <AnimatePresence>
        {weather && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={cardVariants}
            className="weather-info"
          >
            {[
              { label: "Temperature", value: `${weather.temperature}°C` },
              { label: "Feels Like", value: `${weather.temperature + 3} °C` },
              { label: "Wind Speed", value: `${weather.windspeed} km/h` },
              { label: "Wind Direction", value: `${weather.winddirection}°` },
              { label: "Humidity", value: `${weather.humidity}%` },
             
             
            
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="weather-card"
              >
                <h2>{item.value}</h2>
                <p>{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Weather;
