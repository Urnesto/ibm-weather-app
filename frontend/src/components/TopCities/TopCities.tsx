import React, { useEffect, useState } from 'react';
import { Tag } from '@carbon/react';
import { getCityForecast } from '../../api/weatherApi';
import { sendUserAction } from '../../api/weatherApi';
import './TopCities.scss';
import { TopCitiesProps } from '../../types/interfaces';

const TopCities: React.FC<TopCitiesProps> = ({ onCitySelect }) => {
    const [topCities, setTopCities] = useState<string[]>([]);
    const [cityNames, setCityNames] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadTopCities = () => {
            const countsRaw = localStorage.getItem('cityCount');

            if (countsRaw) {
                const counts = JSON.parse(countsRaw);
                const sorted = Object.entries(counts)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 3)
                    .map(([cityKey]) => cityKey);

                if (sorted.length) {
                    setTopCities(sorted);
                    return;
                }
            }

            // Default top Lithuanian cities if localStorage is empty or invalid
            const defaultLithuanianCities = [
                'Vilnius',
                'Kaunas',
                'Klaipeda',
            ];
            setTopCities(defaultLithuanianCities);
        };

        loadTopCities();
    }, []);


    useEffect(() => {
        const fetchCityNames = async () => {
            const names: Record<string, string> = {};

            await Promise.all(
                topCities.map(async (cityKey) => {
                    try {
                        const place = await getCityForecast(cityKey);
                        names[cityKey] = place.location.name;
                    } catch (err) {
                        names[cityKey] = cityKey;
                    }
                })
            );

            setCityNames(names);
        };

        if (topCities.length) {
            fetchCityNames();
        }
    }, [topCities]);

    const handleClick = (cityKey: string) => {
        const cityCode = cityKey.split(',')[0].trim().toLowerCase();
        onCitySelect(cityCode);
        sendUserAction(cityKey)
    };

    if (!topCities.length) {
        return null;
    }

    return (
        <div className="top-cities">
            <h4 className="top-cities__title">Your Top Viewed Cities:</h4>
            <div className="top-cities__tags">
                {topCities.map((cityKey) => (
                    <Tag
                        key={cityKey}
                        type="blue"
                        className="top-cities__tag"
                        onClick={() => handleClick(cityKey)}
                    >
                        {cityNames[cityKey] || 'Loading...'}
                    </Tag>
                ))}
            </div>
        </div>
    );
};

export default TopCities;
