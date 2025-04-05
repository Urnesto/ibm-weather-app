# 🌦️ Weather Forecast App (Full Stack)

A full-stack weather forecasting app built with **React (TypeScript + Vite)** on the frontend and **Node.js + Express + MongoDB** on the backend. The backend acts as a proxy to the [meteo.lt](https://api.meteo.lt) API and also logs city view activity in a MongoDB database.

> 🔗 **Hosted on AWS**  
> 🖥️ Frontend: [http://3.78.187.71:3000/](http://3.78.187.71:3000/)  
> ⚙️ Backend: [http://3.78.187.71:8080/](http://3.78.187.71:8080/)

<img src="/IBM-APP-SCREENSHOT.png" alt="Screenshot" />

## 🌟 Features

- **Real-time Weather Data:** Access long-term weather forecasts by city.
- **City Search:** Find Lithuanian cities with a responsive search bar.
- **Top Viewed Cities:** Tracks and displays the most frequently searched cities.
- **User Logging:** Logs user activity (selected cities) to MongoDB.
- **Responsive UI:** Works seamlessly on mobile and desktop.
- **Proxy Backend:** Bypasses CORS issues when accessing external APIs.

---

## 🧭 Table of Contents

- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [License](#License)
- [Author](#Author)

---

## 🚀 Technologies Used

### 🔧 Backend

- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **dotenv** for environment config
- **Hosted on AWS**

### 🖥️ Frontend

- **React + TypeScript**
- **Vite** (build tool)
- **AXIOS** for data fetching and caching
- **SCSS** for styling
- **Hosted on AWS**

---

## 📁 Project Structure
# Frontend 

ibm-weather-app/
└── frontend/

    ├── src/
    │   ├── api/
    │   ├── assets/
    │   ├── components/
    │   │   ├── CitySelector/
    │   │   ├── TopCities/
    │   │   ├── WeatherDisplay/
    │   │   └── WeatherLayout/
    │   ├── hooks/
    │   └── types/

    ├── .env.development
    ├── .env.production
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Urnesto/ibm-weather-app.git
cd ibm-weather-app
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd frontend
npm install
```

## Usage

### Running the Application Locally

1. Start the backend server:

```bash
cd ..
cd backend
node server.js
```

2. In a separate terminal, start the frontend:

```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to: `http://localhost:5173`

## API Endpoints

The backend serves as a proxy to overcome CORS limitations with the external API and provides the following endpoints:

### `GET /api/places`

- **Description:** Fetches a list of places (cities) from the Meteo.lt API.
- **Response:**

```json
[
  {
    "code": "abromiskes",
    "name": "Abromiškės",
    "administrativeDivision": "Elektrėnų savivaldybė",
    "countryCode": "LT",
    "coordinates": {
      "latitude": 54.7825,
      "longitude": 24.71032
    }
  }
]
```

---

### `POST /api/forecast`

- **Description:** Fetches long-term weather forecast for a specific city.
- **Request Body:**

```json
{
  "cityName": "vilnius"
}
```

- **Response:** Forecast data from Meteo.lt

---

### `POST /api/log`

- **Description:** Logs the selected city into MongoDB with a timestamp.
- **Request Body:**

```json
{
  "cityName": "vilnius"
}
```

- **Response:**

```json
{
  "message": "Action logged successfully"
}
```

---

### `GET /api/logs`

- **Description:** Retrieves all logged city selections, sorted by newest first.
- **Response:**

```json
[
  {
    "_id": "123abc",
    "cityName": "vilnius",
    "timestamp": "2025-04-05T10:30:00.000Z"
  },
  ...
]
```

---

## Frontend Components

# WeatherDisplay

- Displays the weather forecast for a selected city.
- Shows temperature, weather conditions, and forecast for the next 5 days.

# TopCities

- Displays the top 3 cities that have been viewed by the user.
- Fetches data from local storage.
- if local storage is empty, it will display a 3 cities that are hardcoded.

# CitySelector

- A search bar that allows the user to search for a city.
- The cities are fetched from the backend.

### License

MIT License. Feel free to fork and build upon it!

### Author

Made by Ernest Rimkevicius

