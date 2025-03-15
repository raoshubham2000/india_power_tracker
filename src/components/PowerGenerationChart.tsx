import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useAppSelector } from '../hooks/reduxHooks';
import { ensureDataParsed } from '../utils/dataUtils';

const PowerGenerationChart = () => {
  const { data, isLoading } = useAppSelector(state => state.meritData);
  
  const parsedData = useMemo(() => ensureDataParsed(data), [data]);
  
  const plotData = useMemo(() => {
    if (!parsedData || !parsedData.timeseries_values) return [];

    const timeseries = parsedData.timeseries_values;
    
    return [
      {
        x: timeseries.timestamps || [],
        y: timeseries.thermal_generation || [],
        name: 'Thermal',
        type: 'scatter',
        mode: 'lines',
        stackgroup: 'one',
        fillcolor: '#FF8C00',
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.gas_generation || [],
        name: 'Gas',
        type: 'scatter',
        mode: 'lines',
        stackgroup: 'one',
        fillcolor: '#4682B4',
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.hydro_generation || [],
        name: 'Hydro',
        type: 'scatter',
        mode: 'lines',
        stackgroup: 'one',
        fillcolor: '#1E90FF',
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.nuclear_generation || [],
        name: 'Nuclear',
        type: 'scatter',
        mode: 'lines',
        stackgroup: 'one',
        fillcolor: '#9370DB',
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.renewable_generation || [],
        name: 'Renewable',
        type: 'scatter',
        mode: 'lines',
        stackgroup: 'one',
        fillcolor: '#32CD32',
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.demand_met || [],
        name: 'Demand',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#FF0000', width: 2 },
      },
    ];
  }, [parsedData]);

  const layout = {
    title: {
      text: 'Power Generation and Demand',
      font: {
        size: 20,
        color: '#2d3748',
        family: 'Inter, system-ui, sans-serif'
      },
      y: 0.95
    },
    xaxis: { 
      title: 'Time',
      gridcolor: '#e2e8f0',
      linecolor: '#e2e8f0',
    },
    yaxis: { 
      title: 'Power (MW)',
      gridcolor: '#e2e8f0',
      linecolor: '#e2e8f0',
    },
    autosize: true,
    height: 500,
    margin: { l: 60, r: 30, b: 50, t: 80, pad: 4 },
    legend: { 
      orientation: 'h', 
      y: -0.15,
      bgcolor: 'rgba(255, 255, 255, 0.8)',
      bordercolor: '#e2e8f0',
      borderwidth: 1,
      borderradius: 4
    },
    plot_bgcolor: 'rgba(255, 255, 255, 0)',
    paper_bgcolor: 'rgba(255, 255, 255, 0)',
    font: {
      family: 'Inter, system-ui, sans-serif'
    }
  };

  if (isLoading) {
    return <div className="loading">Loading data...</div>;
  }

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

export default PowerGenerationChart; 