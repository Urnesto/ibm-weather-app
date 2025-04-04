const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const LogSchema = new mongoose.Schema({
  cityName: String,
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model("Log", LogSchema);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/api/places", async (req, res) => {
  try {
    const response = await axios.get("https://api.meteo.lt/v1/places");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

app.post("/api/forecast", async (req, res) => {
  const cityName = req.body.cityName;

  if (!cityName) {
    return res.status(400).json({ error: "cityName is required" });
  }

  try {
    const response = await axios.get(
      `https://api.meteo.lt/v1/places/${cityName}/forecasts/long-term`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forecast" });
  }
});

app.post("/api/log", async (req, res) => {
  const cityName = req.body.cityName;

  if (!cityName) {
    return res.status(400).json({ error: "cityName is required" });
  }

  try {
    // Create new log entry in MongoDB
    const log = new Log({ cityName });
    await log.save();

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] City selected: ${cityName}`);

    res.json({ message: "Action logged successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save log" });
  }
});

// endpoint to get all logs from DB
app.get("/api/logs", async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }); // Get all logs, sorted by timestamp (newest first)
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Weather api healthy", process.env.PORT || 8080);
});
