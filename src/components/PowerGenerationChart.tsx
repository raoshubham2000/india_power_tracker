import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useAppSelector } from '../hooks/reduxHooks';
import { ensureDataParsed } from '../utils/dataUtils';
import { Layout, Data } from 'plotly.js';

const PowerGenerationChart = () => {
  const { data, isLoading } = useAppSelector(state => state.meritData);
  
  const parsedData = useMemo(() => ensureDataParsed(data), [data]);
  
  const plotData = useMemo(() => {
    if (!parsedData || !parsedData.timeseries_values) return [] as Data[];

    const timeseries = parsedData.timeseries_values;
    
    // Retro game color palette with icons
    return [
      {
        x: timeseries.timestamps || [],
        y: timeseries.thermal_generation || [],
        name: '🔥 THERMAL',
        type: 'scatter' as const,
        mode: 'lines' as const,
        stackgroup: 'one',
        fillcolor: '#FF5500', // Bright orange-red
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.gas_generation || [],
        name: '💨 GAS',
        type: 'scatter' as const,
        mode: 'lines' as const,
        stackgroup: 'one',
        fillcolor: '#00AAFF', // Bright blue
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.hydro_generation || [],
        name: '💧 HYDRO',
        type: 'scatter' as const,
        mode: 'lines' as const,
        stackgroup: 'one',
        fillcolor: '#0066FF', // Deep blue
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.nuclear_generation || [],
        name: '☢️ NUCLEAR',
        type: 'scatter' as const,
        mode: 'lines' as const,
        stackgroup: 'one',
        fillcolor: '#AA00FF', // Bright purple
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.renewable_generation || [],
        name: '♻️ RENEWABLE',
        type: 'scatter' as const,
        mode: 'lines' as const,
        stackgroup: 'one',
        fillcolor: '#00FF44', // Bright green
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.demand_met || [],
        name: '⚡ DEMAND',
        type: 'scatter' as const,
        mode: 'lines' as const,
        line: { color: '#FF0000', width: 3 },
      },
    ];
  }, [parsedData]);

  const layout = useMemo(() => {
    // Check if dark mode is enabled
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Retro game color palette
    const bgColor = prefersDarkMode ? '#111122' : '#CCFFFF';
    const gridColor = prefersDarkMode ? '#334455' : '#88AAAA';
    const textColor = prefersDarkMode ? '#00FFAA' : '#227722';
    const titleColor = prefersDarkMode ? '#00FF66' : '#005500';
    
    return {
      title: {
        text: 'POWER GENERATION TRACKER',
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
        title: 'POWER (MW)',
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
      margin: { l: 60, r: 30, b: 50, t: 80, pad: 4 },
      legend: { 
        orientation: 'h' as const,
        y: -0.15,
        bgcolor: prefersDarkMode ? 'rgba(16, 24, 48, 0.8)' : 'rgba(204, 255, 255, 0.8)',
        bordercolor: gridColor,
        borderwidth: 2,
        font: {
          family: '"Courier New", monospace',
          size: 12,
          color: textColor
        }
      },
      plot_bgcolor: bgColor,
      paper_bgcolor: bgColor,
      font: {
        family: '"Courier New", monospace',
        color: textColor
      }
    } as Partial<Layout>;
  }, []);

  if (isLoading) {
    return <div className="retro-loading">LOADING DATA<span className="retro-loading-dots">...</span></div>;
  }

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

export default PowerGenerationChart; 