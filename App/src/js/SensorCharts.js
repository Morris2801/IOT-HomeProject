import React, { useState, useEffect } from 'react';
import thingSpeakData from './data'; // Import the ThingSpeakData instance

const SensorData = () => {
    const [sensorData, setSensorData] = useState({
        temperature: 0,
        humidity: 0,
        airQuality: 0,
        peopleCount: 0,
    });
    const [historicalData, setHistoricalData] = useState({
        labels: [],
        temperature: [],
        humidity: [],
        airQuality: [],
        peopleCount: [],
    });

    useEffect(() => {
        // Subscribe to updates when the component mounts
        thingSpeakData.subscribe((data, historicalData) => {
            setSensorData(data);
            setHistoricalData(historicalData);
        });

        // Start updates when the component mounts
        thingSpeakData.startUpdates();

        // Cleanup when the component unmounts
        return () => {
            // Unsubscribe if needed (if you're implementing unsubscribe functionality)
        };
    }, []);

    return (
        <div>
            <h1>Sensor Data</h1>
            <p>Temperature: {sensorData.temperature}°C</p>
            <p>Humidity: {sensorData.humidity}%</p>
            <p>Air Quality: {sensorData.airQuality}%</p>
            <p>People Count: {sensorData.peopleCount}</p>

            {/* Add your chart rendering logic here */}
        </div>
    );
};

export default SensorData;
