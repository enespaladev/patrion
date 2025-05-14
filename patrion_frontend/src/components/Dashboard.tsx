import SensorCard from './SensorCard';
import { SensorData } from '../types';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function Dashboard({ data }: { data: SensorData[] }) {
  const last = data[data.length - 1];


    console.log('data', data);
    console.log('last', last);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📊 Gerçek Zamanlı Sensör Dashboard</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <SensorCard label="Sıcaklık" value={last?.temperature ?? 0} unit="°C" color="#f7a521" />
        <SensorCard label="Nem" value={last?.humidity ?? 0} unit="%" color="#8884d8" />
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="formattedTimestamp" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="temperature" stroke="#f7a521" name="Sıcaklık (°C)" />
          <Line type="monotone" dataKey="humidity" stroke="#8884d8" name="Nem (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
