import { JSX, useEffect, useState } from 'react';
import { Loading } from '@carbon/react';
import {
    Sun,
    Cloud,
    RainDrizzle,
    Rain,
    RainHeavy,
    ThunderstormScattered,
    ThunderstormSevere,
    Hail,
    SnowScatteredNight,
    Snow,
    SnowHeavy,
    Fog,
} from '@carbon/icons-react';

import { getCityForecast } from '../../api/weatherApi';
import './WeatherDisplay.scss';
import { WeatherDisplayProps, WeatherData, ForecastTimestamp, DailyForecast } from '../../types/interfaces';

const weatherIcons: Record<string, JSX.Element> = {
    'clear': <Sun size={24} />,
    'partly-cloudy': <Cloud size={24} />,
    'cloudy-with-sunny-intervals': <Cloud size={24} />,
    'cloudy': <Cloud size={24} />,
    'light-rain': <RainDrizzle size={24} />,
    'rain': <Rain size={24} />,
    'heavy-rain': <RainHeavy size={24} />,
    'thunder': <ThunderstormScattered size={24} />,
    'isolated-thunderstorms': <ThunderstormScattered size={24} />,
    'thunderstorms': <ThunderstormScattered size={24} />,
    'heavy-rain-with-thunderstorms': <ThunderstormSevere size={24} />,
    'light-sleet': <Rain size={24} />,
    'sleet': <Rain size={24} />,
    'freezing-rain': <RainDrizzle size={24} />,
    'hail': <Hail size={24} />,
    'light-snow': <SnowScatteredNight size={24} />,
    'snow': <Snow size={24} />,
    'heavy-snow': <SnowHeavy size={24} />,
    'fog': <Fog size={24} />,
};

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ city }) => {
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [chartSize, setChartSize] = useState({ width: 300, height: 120 });
    const [svgChartPoints, setSvgChartPoints] = useState('');

    const [weatherData, setWeatherData] = useState<WeatherData>({
        currentTemp: null,
        windSpeed: null,
        windGust: null,
        windDirection: null,
        totalPrecipitation: null,
        humidity: null,
        currentWeatherCode: null,
        forecasts: [],
        locationName: '',
    });

    useEffect(() => {
        if (!city) return;

        const loadWeather = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getCityForecast(city);
                const firstTimestamp = data.forecastTimestamps?.[0];
                const dailyForecasts = processForecastData(data.forecastTimestamps);

                setWeatherData({
                    currentTemp: firstTimestamp.airTemperature,
                    windSpeed: firstTimestamp.windSpeed,
                    humidity: firstTimestamp.relativeHumidity,
                    windGust: firstTimestamp.windGust,
                    windDirection: firstTimestamp.windDirection,
                    totalPrecipitation: firstTimestamp.totalPrecipitation,
                    currentWeatherCode: firstTimestamp.conditionCode,
                    forecasts: dailyForecasts,
                    locationName: data.place?.name || '',
                });

                generateSvgPoints(data.forecastTimestamps);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                setError('Failed to fetch weather data. Please try again later.');
                setWeatherData({
                    currentTemp: null,
                    windSpeed: null,
                    windGust: null,
                    windDirection: null,
                    totalPrecipitation: null,
                    humidity: null,
                    currentWeatherCode: null,
                    forecasts: [],
                    locationName: '',
                });
            } finally {
                setLoading(false);
                setInitialLoading(false);
            }
        };

        loadWeather();
    }, [city]);

    const getWeatherIcon = (conditionCode: string) => {
        return weatherIcons[conditionCode] ?? <Cloud size={24} />;
    };

    const processForecastData = (timestamps: ForecastTimestamp[]): DailyForecast[] => {
        const grouped: Record<
            string,
            { temps: number[]; codes: string[]; currentTemp: number; humidity: number }
        > = {};

        timestamps.forEach((stamp) => {
            const date = stamp.forecastTimeUtc.split(' ')[0];
            if (!grouped[date]) {
                grouped[date] = {
                    temps: [],
                    codes: [],
                    currentTemp: stamp.airTemperature,
                    humidity: stamp.relativeHumidity,
                };
            }
            grouped[date].temps.push(stamp.airTemperature);
            grouped[date].codes.push(stamp.conditionCode);
        });

        return Object.entries(grouped)
            .map(([date, info]) => {
                const maxTemp = Math.max(...info.temps);
                const minTemp = Math.min(...info.temps);

                return {
                    date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                    maxTemp,
                    minTemp,
                    conditionCode: getMostFrequentCode(info.codes),
                    humidity: info.humidity,
                    currentTemp: info.currentTemp,
                };
            })
            .slice(0, 5);
    };
    const getMostFrequentCode = (codes: string[]): string => {
        const freq: Record<string, number> = {};
        let maxCount = 0;
        let mostFrequent = codes[0];

        codes.forEach((code) => {
            freq[code] = (freq[code] || 0) + 1;
            if (freq[code] > maxCount) {
                maxCount = freq[code];
                mostFrequent = code;
            }
        });

        return mostFrequent;
    };

    const generateSvgPoints = (timestamps: ForecastTimestamp[]) => {
        const today = new Date().toISOString().split('T')[0];
        const todayForecasts = timestamps.filter((t) => t.forecastTimeUtc.split(' ')[0] === today);

        const forecastsToUse = todayForecasts.length ? todayForecasts : timestamps.slice(0, 5);
        const temps = forecastsToUse.map((t) => t.airTemperature);
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);

        const renderPoints = (width: number, height: number) => {
            const padding = height * 0.1;
            return forecastsToUse
                .map((item, i) => {
                    const x = (i / (forecastsToUse.length - 1)) * width;
                    const y =
                        height - ((item.airTemperature - minTemp) / (maxTemp - minTemp)) * (height - padding);
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                })
                .join(' ');
        };


        const defaultWidth = 300;
        const defaultHeight = 120;
        setSvgChartPoints(renderPoints(defaultWidth, defaultHeight));

        // Watch for resizes
        const handleResize = () => {
            const chartElement = document.querySelector('.weather-display__chart-svg') as SVGElement;
            if (chartElement) {
                const width = chartElement.clientWidth;
                const height = chartElement.clientHeight;
                if (width > 0 && height > 0) {
                    setChartSize({ width, height });
                    setSvgChartPoints(renderPoints(width, height));
                }
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            setTimeout(handleResize, 0);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    };

    if (initialLoading) {
        return (
            <div className="weather-display skeleton">
                <div className="weather-display__left skeleton">
                    <div className="weather-display__location skeleton-text" />
                    <div className="weather-display__temp-block skeleton-text" />
                    <div className="weather-display__stats skeleton-text" />
                </div>
                <div className="weather-display__right skeleton">
                    <div className="weather-display__chart skeleton-text" />
                    <div className="weather-display__forecast skeleton-text" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="weather-display error">
                <div className="weather-display__error-message">
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (weatherData.currentTemp === null || !weatherData.forecasts.length) {
        return <p>No weather data available.</p>;
    }

    const dateTime = new Date().toLocaleString();

    const forecastDays = weatherData.forecasts.slice(1, 5).map((f) => ({
        day: f.date,
        icon: getWeatherIcon(f.conditionCode),
        humidity: f.humidity,
        currentTemp: f.currentTemp,
    }));

    return (
        <div className="weather-display">
            <div className="weather-display__left">
                <div className="weather-display__location">
                    <h2 className="weather-display__location-name">{weatherData.locationName}</h2>
                    <p className="weather-display__datetime">{dateTime}</p>
                    <hr className="weather-display__separator" />
                </div>

                <div className="weather-display__temp-block">
                    <div className="weather-display__icon">
                        {weatherData.currentWeatherCode ? getWeatherIcon(weatherData.currentWeatherCode) : <Cloud size={24} />}
                    </div>
                    <div className="weather-display__temp-value">
                        {weatherData.currentTemp?.toFixed(1)}
                    </div>
                    <div className="weather-display__temp-unit">°C</div>
                </div>

                <div className="weather-display__stats">
                    <div className="weather-display__stat">
                        <label>Humidity</label>
                        {weatherData.humidity?.toFixed(1)}%
                    </div>
                    <div className="weather-display__stat">
                        <label>Wind Speed</label>
                        {weatherData.windSpeed?.toFixed(1)} m/s
                    </div>
                    <div className="weather-display__stat">
                        <label>Wind Gust</label>
                        {weatherData.windGust?.toFixed(1)} m/s
                    </div>
                    <div className="weather-display__stat">
                        <label>Wind Direction</label>
                        {weatherData.windDirection}°
                    </div>
                    <div className="weather-display__stat">
                        <label>Total Precipitation</label>
                        {weatherData.totalPrecipitation?.toFixed(1)} m/s
                    </div>
                </div>
            </div>

            <div className="weather-display__right">
                <div className="weather-display__title">Today's Temperature Forecast</div>

                {/* Chart */}
                <div className="weather-display__chart">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox={`0 0 ${chartSize.width} ${chartSize.height}`}
                        preserveAspectRatio="none"
                        className="weather-display__chart-svg"
                    >
                        <polyline
                            fill="none"
                            stroke="#0f62fe"
                            strokeWidth="2"
                            points={svgChartPoints}
                        />
                        <polygon
                            fill="#0f62fe33"
                            points={`${svgChartPoints} ${chartSize.width},${chartSize.height} 0,${chartSize.height}`}
                        />
                        {svgChartPoints.split(' ').map((pt, index) => {
                            const [x, y] = pt.split(',');
                            return (
                                <circle key={index} cx={x} cy={y} r="4" fill="#0f62fe" />
                            );
                        })}
                    </svg>
                    <div className="weather-display__chart-label">
                        {weatherData.currentTemp?.toFixed(1)} °C
                    </div>
                </div>

                {/* Upcoming Forecast */}
                <div className="weather-display__forecast">
                    {forecastDays.map((f) => (
                        <div key={f.day} className="weather-display__forecast-day">
                            <div className="weather-display__day-label">{f.day}</div>
                            <div className="weather-display__day-icon">{f.icon}</div>
                            <div className="weather-display__day-humidity">Humidity {f.humidity.toFixed(1)}%</div>
                            <div className="weather-display__day-temp">
                                Temp {f.currentTemp.toFixed(1)}°C
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="weather-display__loading-overlay">
                    <Loading description="Loading weather..." withOverlay={false} />
                </div>
            )}
        </div>
    );
};

export default WeatherDisplay;
