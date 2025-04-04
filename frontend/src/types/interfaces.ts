export interface CitiesData {
  code: string;
  name: string;
  administrativeDivision: string;
  country?: string;
  countryCode: string;
  coordinates: Coordinates;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CitySelectorProps {
  onCitySelect: (cityName: string) => void;
}

export interface WeatherDisplayProps {
  city: string;
}

export interface ForecastTimestamp {
  forecastTimeUtc: string;
  airTemperature: number;
  relativeHumidity: number;
  conditionCode: string;
  windSpeed: number;
  windGust: number;
  windDirection: number;
  totalPrecipitation: number;
}

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  humidity: number;
  currentTemp: number;
  conditionCode: string;
}

export interface WeatherData {
  currentTemp: number | null;
  windSpeed: number | null;
  windGust: number | null;
  windDirection: number | null;
  totalPrecipitation: number | null;
  humidity: number | null;
  currentWeatherCode: string | null;
  forecasts: DailyForecast[];
  locationName: string;
}

export interface TopCitiesProps {
  onCitySelect: (cityKey: string) => void;
}
