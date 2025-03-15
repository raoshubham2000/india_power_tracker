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
    
    // Retro game color palette
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 8-bit inspired retro colors
    const lineColor = prefersDarkMode ? '#00FF66' : '#00CC44'; // Bright retro green
    const fillColor = prefersDarkMode ? 'rgba(0, 255, 102, 0.2)' : 'rgba(0, 204, 68, 0.15)';
    
    return [
      {
        x: timeseries.timestamps || [],
        y: timeseries.g_co2_per_kwh || [],
        type: 'scatter',
        mode: 'lines',
        name: 'CO2 Intensity',
        line: { color: lineColor, width: 3}, // Stepped line for pixelated look
        fill: 'tozeroy',
        fillcolor: fillColor
      }
    ];
  }, [parsedData]);

  const layout = useMemo(() => {
    // Check if dark mode is enabled
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Retro game color palette
    const bgColor = prefersDarkMode ? '#111122' : '#CCFFCC';
    const gridColor = prefersDarkMode ? '#334455' : '#88AA88';
    const textColor = prefersDarkMode ? '#00FFAA' : '#227722';
    const titleColor = prefersDarkMode ? '#00FF66' : '#005500';
    
    return {
      title: {
        text: 'CO2 INTENSITY TRACKER',
        font: {
          size: 24,
          color: titleColor,
          family: '"Press Start 2P", "Courier New", monospace'
        },
        y: 0.95
      },
      xaxis: { 
        title: 'TIME',
        gridcolor: gridColor,
        linecolor: gridColor,
        color: textColor,
        tickfont: {
          family: '"Courier New", monospace',
          size: 12
        }
      },
      yaxis: { 
        title: 'CO2 (g/kWh)',
        gridcolor: gridColor,
        linecolor: gridColor,
        color: textColor,
        tickfont: {
          family: '"Courier New", monospace',
          size: 12
        }
      },
      autosize: true,
      height: 500,
      margin: { l: 60, r: 30, b: 40, t: 80, pad: 4 },
      plot_bgcolor: bgColor,
      paper_bgcolor: bgColor,
      font: {
        family: '"Courier New", monospace',
        color: textColor
      }
    };
  }, []);

  // Add loading state with retro style
  if (isLoading) {
    return <div className="retro-loading">LOADING DATA...</div>;
  }

  // Check if data needs to be parsed with retro style
  if (!parsedData || !parsedData.timeseries_values) {
    return <div className="retro-error">NO DATA AVAILABLE</div>;
  }

  return (
    <div className="retro-chart-container">
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