import { useEffect, useState } from 'react';
import { ComboBox, ComboBoxProps } from '@carbon/react';
import { getCities } from '../../api/weatherApi';
import { useDebounce } from '../../hooks/useDebounce';
import { CitiesData, CitySelectorProps } from '../../types/interfaces';
import { sendUserAction } from '../../api/weatherApi';


const CitySelector: React.FC<CitySelectorProps> = ({ onCitySelect }) => {
    const [cities, setCities] = useState<Array<{ id: string; label: string }>>([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedItem, setSelectedItem] =
        useState<{ id: string; label: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const debouncedInput = useDebounce(inputValue, 300);

    useEffect(() => {
        const fetchAllCities = async () => {
            setLoading(true);
            try {
                const data: CitiesData[] = await getCities();
                const mapped = data.map((city) => ({
                    id: city.code,
                    label: city.name,
                }));
                setCities(mapped);
            } catch (error) {
                console.error('Error fetching cities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllCities();
    }, []);

    const filteredCities = cities
        .filter((c) =>
            c.label.toLowerCase().includes(debouncedInput.toLowerCase())
        )
        .slice(0, 10);

    const handleChange: ComboBoxProps<{ id: string; label: string }>['onChange'] =
        ({ selectedItem }) => {
            if (selectedItem) {
                setSelectedItem(selectedItem);
                const cityName = selectedItem.label;

                const countsRaw = localStorage.getItem('cityCount');
                const counts = countsRaw ? JSON.parse(countsRaw) : {};
                counts[cityName] = (counts[cityName] || 0) + 1;
                localStorage.setItem('cityCount', JSON.stringify(counts));

                onCitySelect(cityName);
                //send user action to backend
                sendUserAction(cityName);
            } else {
                setSelectedItem(null);
            }
        };

    const handleInputChange = (newInput: string) => {
        setInputValue(newInput);
        if (selectedItem && newInput !== selectedItem.label) {
            setSelectedItem(null);
        }
    };

    return (
        <ComboBox
            id="city-selector"
            titleText="Search city"
            placeholder={loading ? 'Loading cities...' : 'Type a city name...'}
            items={filteredCities}
            itemToString={(item) => (item ? item.label : '')}
            selectedItem={selectedItem}
            onChange={handleChange}
            onInputChange={handleInputChange}
            value={inputValue}
        />
    );
};

export default CitySelector;
