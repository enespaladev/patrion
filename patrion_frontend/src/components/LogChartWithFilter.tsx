import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const LogChartWithFilter = () => {
  const [logData, setLogData] = useState<{ date: string; count: string }[]>([]);
  const [action, setAction] = useState('viewed_logs');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDk1OWZhYy03NjQzLTRiYzItOGFmMS00Yjc0OGYzOWEyMTAiLCJyb2xlIjoic3lzdGVtX2FkbWluIiwiaWF0IjoxNzQ3MjUzNDExLCJleHAiOjE3NDczMzk4MTF9.UB2wFTO7mLThLuaij1xJkpfr0yoD18VK-KyRdi7efvw';
        const res = await axios.get(
          `http://localhost:3000/logs/summary/daily/${action}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLogData(res.data);
      } catch (err) {
        console.error('Veri alınamadı:', err);
      }
    };

    fetchData();
  }, [action]);

  const chartData = {
    labels: logData.map((item) =>
      new Date(item.date).toLocaleDateString('tr-TR')
    ),
    datasets: [
      {
        label: `${action} log sayısı`,
        data: logData.map((item) => parseInt(item.count)),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h2>🔍 Aksiyona Göre Log Analizi</h2>

      <select value={action} onChange={(e) => setAction(e.target.value)}>
        <option value="viewed_logs">viewed_logs</option>
        <option value="created_sensor">created_sensor</option>
        <option value="deleted_sensor">deleted_sensor</option>
        {/* ihtiyacına göre diğer aksiyonları da ekle */}
      </select>

      <Bar data={chartData} />
    </div>
  );
};

export default LogChartWithFilter;
