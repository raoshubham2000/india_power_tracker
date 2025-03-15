import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useAppSelector } from '../hooks/reduxHooks';
import { ensureDataParsed } from '../utils/dataUtils';

const CO2IntensityChart = () => {
  const { data, isLoading } = useAppSelector(state => state.meritData);
  
  // Use the same parsing approach as PowerGenerationChart
  const parsedData = useMemo(() => ensureDataParsed(data), [data]);
  
  const plotData = useMemo(() => {
    if (!parsedData || !parsedData.timeseries_values) return [];

    const timeseries = parsedData.timeseries_values;
    
    // Check if dark mode is enabled
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use different colors based on theme
    const lineColor = prefersDarkMode ? '#E879F9' : '#6A0572'; // Bright pink for dark mode
    const fillColor = prefersDarkMode ? 'rgba(232, 121, 249, 0.2)' : 'rgba(106, 5, 114, 0.15)';
    
    return [
      {
        x: timeseries.timestamps || [],
        y: timeseries.g_co2_per_kwh || [],
        type: 'scatter',
        mode: 'lines',
        name: 'CO2 Intensity',
        line: { color: lineColor, width: 2.5 },
        fill: 'tozeroy',
        fillcolor: fillColor
      }
    ];
  }, [parsedData]);

  const layout = useMemo(() => {
    // Check if dark mode is enabled
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return {
      title: {
        text: 'CO2 Intensity Over Time',
        font: {
          size: 20,
          color: prefersDarkMode ? '#e2e8f0' : '#2d3748',
          family: 'Inter, system-ui, sans-serif'
        },
        y: 0.95
      },
      xaxis: { 
        title: 'Time',
        gridcolor: prefersDarkMode ? '#4a5568' : '#e2e8f0',
        linecolor: prefersDarkMode ? '#4a5568' : '#e2e8f0',
        color: prefersDarkMode ? '#a0aec0' : '#2d3748'
      },
      yaxis: { 
        title: 'CO2 Intensity (g/kWh)',
        gridcolor: prefersDarkMode ? '#4a5568' : '#e2e8f0',
        linecolor: prefersDarkMode ? '#4a5568' : '#e2e8f0',
        color: prefersDarkMode ? '#a0aec0' : '#2d3748'
      },
      autosize: true,
      height: 500,
      margin: { l: 60, r: 30, b: 40, t: 80, pad: 4 },
      plot_bgcolor: 'rgba(0, 0, 0, 0)',
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
      font: {
        family: 'Inter, system-ui, sans-serif',
        color: prefersDarkMode ? '#a0aec0' : '#2d3748'
      }
    };
  }, []);

  // Add loading state
  if (isLoading) {
    return <div className="loading">Loading data...</div>;
  }

  // Check if data needs to be parsed
  if (!parsedData || !parsedData.timeseries_values) {
    return <div className="error">No data available</div>;
  }

  return (
    <div className="chart-container">
      <Plot
        data={plotData}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ 
          responsive: true,
          displayModeBar: false 
        }}
      />
    </div>
  );
};

export default CO2IntensityChart; 