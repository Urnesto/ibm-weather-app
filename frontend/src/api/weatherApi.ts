import api from "./axios";

export async function getCities() {
  const response = await api.get("/places");
  return response.data;
}

export async function getCityForecast(cityName: string) {
  const response = await api.post("/forecast", {
    cityName,
  });
  return response.data;
}

export async function sendUserAction(cityName: string) {
  const response = await api.post("/log", { cityName });

  return response.data;
}
