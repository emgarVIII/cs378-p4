import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('Austin');
  const [data, setData] = useState([]);
  const [cities, setCities] = useState([
    { name: 'Austin', latitude: 30.2672, longitude: -97.7431 },
    { name: 'Dallas', latitude: 32.7767, longitude: -96.7970 },
    { name: 'Houston', latitude: 29.7604, longitude: -95.3698 }
  ]);
  const [newCoordinates, setNewCoordinates] = useState('');

  useEffect(() => {
    const currentCity = cities.find(c => c.name === city);
    if (currentCity) {
      fetchData(currentCity.latitude, currentCity.longitude);
    }
  }, [city, cities]);

  const fetchData = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=America/Chicago`);
      const result = await response.json();
      const hourlyData = result.hourly.temperature_2m.slice(0, 12).map((temp, index) => ({
        time: `${index + 1}:00PM`,
        temp: `${(temp * 9 / 5 + 32).toFixed(1)} F`
      }));
      setData(hourlyData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCityChange = (newCity) => {
    setCity(newCity);
  };

  const handleAddCity = () => {
    const [latitude, longitude] = newCoordinates.split(',').map(coord => parseFloat(coord.trim()));
    if (!isNaN(latitude) && !isNaN(longitude)) {
      const newCityName = `Lat: ${latitude}, Lon: ${longitude}`;
      setCities([...cities, { name: newCityName, latitude, longitude }]);
      setCity(newCityName); //update the city to fetch data immediately
      setNewCoordinates('');
    } else {
      alert('Invalid coordinates. Please enter in the format: latitude,longitude');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCity();
    }
  };

  return (
    <div className="App">
      <div className="button-group">
        {cities.map((cityObj, index) => (
          <button key={index} onClick={() => handleCityChange(cityObj.name)}>
            {cityObj.name}
          </button>
        ))}
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter coordinates (lat,lon)"
          value={newCoordinates}
          onChange={(e) => setNewCoordinates(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleAddCity}>+</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Temperature</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.time}</td>
              <td>{entry.temp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;