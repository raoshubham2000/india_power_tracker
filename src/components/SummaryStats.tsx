import { useAppSelector } from '../hooks/reduxHooks';

const SummaryStats = () => {
  const { data } = useAppSelector(state => state.meritData);
  
  // Parse data if needed
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
  
  if (!parsedData) {
    return null;
  }

  // Ensure arrays exist before trying to use them
  const peakValues = Array.isArray(parsedData.peak_values) ? parsedData.peak_values : [];
  const troughValues = Array.isArray(parsedData.trough_values) ? parsedData.trough_values : [];
  const peakTimestamps = Array.isArray(parsedData.peak_timestamps) ? parsedData.peak_timestamps : [];
  const troughTimestamps = Array.isArray(parsedData.trough_timestamps) ? parsedData.trough_timestamps : [];

  // Get max and min values safely
  const maxDemand = peakValues.length > 0 ? Math.max(...peakValues) : 0;
  const minDemand = troughValues.length > 0 ? Math.min(...troughValues) : 0;
  
  // Get timestamps safely
  const peakTime = peakTimestamps.length > 0 ? new Date(peakTimestamps[0]).toLocaleString() : 'N/A';
  const troughTime = troughTimestamps.length > 0 ? new Date(troughTimestamps[0]).toLocaleString() : 'N/A';
  
  // CO2 intensity values with fallbacks
  const maxCO2 = parsedData.max_co2_per_kwh || 0;

  return (
    <div className="summary-stats">
      <div className="stat-card">
        <div className="stat-icon">⚡</div>
        <h3>Peak Demand</h3>
        <div className="stat-value-container">
          <p className="stat-value">{maxDemand.toLocaleString()} MW</p>
          <p className="stat-time">at {peakTime}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">📉</div>
        <h3>Lowest Demand</h3>
        <div className="stat-value-container">
          <p className="stat-value">{minDemand.toLocaleString()} MW</p>
          <p className="stat-time">at {troughTime}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">🔥</div>
        <h3>Max CO2 Intensity</h3>
        <div className="stat-value-container">
          <p className="stat-value">{maxCO2.toFixed(2)} g/kWh</p>
          <p className="stat-time">at {new Date(parsedData.max_co2_per_kwh_time).toLocaleString()}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">🌱</div>
        <h3>Min CO2 Intensity</h3>
        <div className="stat-value-container">
          <p className="stat-value">{parsedData.min_co2_per_kwh.toFixed(2)} g/kWh</p>
          <p className="stat-time">at {new Date(parsedData.min_co2_per_kwh_time).toLocaleString()}</p>
        </div>
      </div>
      
      <div className="stat-card wide">
        <div className="stat-icon total-icon">🌍</div>
        <h3>Total CO2 Emissions</h3>
        <div className="stat-value-container">
          <p className="stat-value">{parsedData.total_tons_co2.toLocaleString()} tons</p>
          <p className="stat-time">during selected period</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats; 