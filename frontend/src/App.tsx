import { useState } from 'react';
import { Theme } from '@carbon/react';
import CitySelector from './components/CitySelector/CitySelector';
import TopCities from './components/TopCities/TopCities';
import WeatherDisplay from './components/WeatherDisplay/WeatherDisplay';

import './components/WeatherLayout/WeatherLayout.scss';

const App = () => {
  const [selectedCity, setSelectedCity] = useState<string>('Vilnius');
  const handleCitySelect = (cityKey: string) => {
    setSelectedCity(cityKey);
  };

  return (
    <Theme theme="g90">
      <div className="app-container">
        <div className="selector-container">
          <h1 className="selector-title">Weather Forecast</h1>
          <CitySelector onCitySelect={handleCitySelect} />
          <div className="top-cities-container">
            <TopCities onCitySelect={handleCitySelect} />
          </div>
        </div>
        <WeatherDisplay
          city={selectedCity}
        />
      </div>
    </Theme>
  );
};

export default App;
