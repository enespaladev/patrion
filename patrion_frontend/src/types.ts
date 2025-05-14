export interface SensorData {
  sensor_id: string;
  temperature?: number;
  humidity?: number;
  timestamp: number;
  formattedTimestamp?: string;
}
