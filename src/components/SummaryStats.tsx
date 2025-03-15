import { useAppSelector } from '../hooks/reduxHooks';
import { useMemo } from 'react';
import { ensureDataParsed } from '../utils/dataUtils';

const SummaryStats = () => {
  const { data, isLoading } = useAppSelector(state => state.meritData);
  
  // Parse data if needed
  const parsedData = useMemo(() => ensureDataParsed(data), [data]);
  
  if (isLoading) {
    return <div className="retro-loading">LOADING STATS...</div>;
  }
  
  if (!parsedData) {
    return <div className="retro-error">NO STATS AVAILABLE</div>;
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
    <div className="retro-summary-stats">
      <div className="retro-stat-card">
        <div className="retro-stat-icon">⚡</div>
        <h3>PEAK DEMAND</h3>
        <div className="retro-stat-value-container">
          <p className="retro-stat-value">{maxDemand.toLocaleString()} MW</p>
          <p className="retro-stat-time">AT {peakTime}</p>
        </div>
      </div>
      
      <div className="retro-stat-card">
        <div className="retro-stat-icon">▼</div>
        <h3>LOWEST DEMAND</h3>
        <div className="retro-stat-value-container">
          <p className="retro-stat-value">{minDemand.toLocaleString()} MW</p>
          <p className="retro-stat-time">AT {troughTime}</p>
        </div>
      </div>
      
      <div className="retro-stat-card">
        <div className="retro-stat-icon">♨</div>
        <h3>MAX CO2 INTENSITY</h3>
        <div className="retro-stat-value-container">
          <p className="retro-stat-value">{maxCO2.toFixed(2)} g/kWh</p>
          <p className="retro-stat-time">AT {new Date(parsedData.max_co2_per_kwh_time).toLocaleString()}</p>
        </div>
      </div>
      
      <div className="retro-stat-card">
        <div className="retro-stat-icon">♻</div>
        <h3>MIN CO2 INTENSITY</h3>
        <div className="retro-stat-value-container">
          <p className="retro-stat-value">{parsedData.min_co2_per_kwh.toFixed(2)} g/kWh</p>
          <p className="retro-stat-time">AT {new Date(parsedData.min_co2_per_kwh_time).toLocaleString()}</p>
        </div>
      </div>
      
      <div className="retro-stat-card wide">
        <div className="retro-stat-icon">☢</div>
        <h3>TOTAL CO2 EMISSIONS</h3>
        <div className="retro-stat-value-container">
          <p className="retro-stat-value">{parsedData.total_tons_co2.toLocaleString()} TONS</p>
          <p className="retro-stat-time">DURING SELECTED PERIOD</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats; 