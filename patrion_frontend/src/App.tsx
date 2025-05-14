import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import SensorCard from './components/SensorCard';
import Dashboard from './components/Dashboard';
import { SensorData } from './types';

const socket = io('http://localhost:3000');

function App() {
  const [data, setData] = useState<SensorData[]>([]);

  // Veriyi başlangıçta çekme
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3000/sensors/test_sensor_init/data?start=-10');
      const data2 = await res.json();

      // Veriyi işleyip sıcaklık ve nemi birlikte sakla
      const formattedData = data2.reduce((acc: any[], item: any) => {
        const existing = acc.find((data) => data.timestamp === item._time);

        if (existing) {
          // Eğer veri zaten mevcutsa, ona ilgili _field'ı ekle
          if (item._field === 'temperature') {
            existing.temperature = item._value;
          } else if (item._field === 'humidity') {
            existing.humidity = item._value;
          }
        } else {
          // İlk kez geldiğinde yeni bir kayıt oluştur
          acc.push({
            timestamp: item._time,
            temperature: item._field === 'temperature' ? item._value : null,
            humidity: item._field === 'humidity' ? item._value : null,
          });
        }

        return acc;
      }, []);

      // Timestamp'i formatla
      const finalData = formattedData.map((item: any) => ({
        ...item,
        formattedTimestamp: new Date(item.timestamp).toLocaleTimeString(),
      }));

      setData(finalData);
      console.log("Formatted Sensor Data:", finalData);
    };

    fetchData();
  }, []);

  // WebSocket ile gelen verileri dinleyip güncelleme
  useEffect(() => {
    socket.on('sensor_data', (incoming: SensorData) => {
      const formatted = {
        ...incoming,
        formattedTimestamp: new Date(Number(incoming.timestamp) * 1000).toLocaleTimeString(),
      };

      setData((prev) => [
        ...prev.slice(-29), 
        formatted,
      ]);
    });

    return () => {
      socket.off('sensor_data');
    };
  }, []);

  return (
    <Dashboard data={data} />
  );
}

export default App;
