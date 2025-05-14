import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Dashboard from './components/Dashboard';

const socket = io('http://localhost:3000');

interface SensorData {
  sensor_id: string;
  temperature: number;
  humidity: number;
  timestamp: number;
  formattedTimestamp?: string;
}

function App() {
  const [data, setData] = useState<SensorData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3000/sensors/test_sensor_init/data?start=-10');
      const rawData = await res.json();

      // timestamp'ı formatla
      const formattedData = rawData.map((d: SensorData) => ({
        ...d,
        formattedTimestamp: new Date(d.timestamp * 1000).toLocaleTimeString(),
      }));

      setData(formattedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    socket.on('sensor_data', (incoming: SensorData) => {
      const formatted = {
        ...incoming,
        formattedTimestamp: new Date(incoming.timestamp * 1000).toLocaleTimeString(),
      };

      setData((prev) => [...prev.slice(-29), formatted]);
    });

    return () => {
      socket.off('sensor_data');
    };
  }, []);

  return <Dashboard data={data} />;
}

export default App;
