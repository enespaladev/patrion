import React from 'react';

type Props = {
  label: string;
  value: number;
  unit: string;
  color: string;
};

const SensorCard = ({ label, value, unit, color }: Props) => {
  return (
    <div style={{
      border: `2px solid ${color}`,
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center',
      width: '180px',
      backgroundColor: `${color}10`,
      color,
    }}>
      <h4>{label}</h4>
      <p style={{ fontSize: 32, margin: 0 }}>
        {value} <small>{unit}</small>
      </p>
    </div>
  );
};

export default SensorCard;
