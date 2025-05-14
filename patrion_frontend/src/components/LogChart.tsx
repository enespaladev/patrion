import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Otomatik chart tiplerini tanır

const LogChart = () => {
  const [logData, setLogData] = useState<{ date: string; count: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDk1OWZhYy03NjQzLTRiYzItOGFmMS00Yjc0OGYzOWEyMTAiLCJyb2xlIjoic3lzdGVtX2FkbWluIiwiaWF0IjoxNzQ3MjUzNDExLCJleHAiOjE3NDczMzk4MTF9.UB2wFTO7mLThLuaij1xJkpfr0yoD18VK-KyRdi7efvw';
        const res = await axios.get('http://localhost:3000/logs/summary/daily', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLogData(res.data);
      } catch (err) {
        console.error('Veri alınamadı:', err);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: logData.map((item) =>
      new Date(item.date).toLocaleDateString('tr-TR')
    ),
    datasets: [
      {
        label: 'Günlük Log Sayısı',
        data: logData.map((item) => parseInt(item.count)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h2>📊 Log Takibi</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default LogChart;
