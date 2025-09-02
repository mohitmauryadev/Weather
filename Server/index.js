const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city || "Lucknow";


    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    const geoResponse = await axios.get(geoUrl);

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    const { latitude, longitude } = geoResponse.data.results[0];

    // 2. Get current weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await axios.get(weatherUrl);

    res.json(weatherResponse.data);
  } catch (error) {
    console.error("Error fetching weather:", error.message);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));

