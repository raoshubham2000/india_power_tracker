import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useAppSelector } from '../hooks/reduxHooks';
import { useTheme } from '../context/ThemeContext';
import { usePlotContainerSize } from '../hooks/usePlotContainerSize';
import { ensureDataParsed } from '../utils/dataUtils';
import { Layout, Data } from 'plotly.js';

const CHART_FONT = '"Inter", "Segoe UI", system-ui, sans-serif';

const PowerGenerationChart = () => {
  const { resolvedTheme } = useTheme();
  const { data, isLoading } = useAppSelector((state) => state.meritData);
  const { ref: plotRef, width: cw, height: ch } = usePlotContainerSize();

  const parsedData = useMemo(() => ensureDataParsed(data), [data]);

  const plotData = useMemo(() => {
    if (!parsedData?.timeseries_values) return [] as Data[];

    const timeseries = parsedData.timeseries_values;

    return [
      {
        x: timeseries.timestamps || [],
        y: timeseries.thermal_generation || [],
        name: 'Thermal',
        type: 'scatter' as const,
        mode: 'lines' as const,
        stackgroup: 'one',
        fillcolor: 'rgba(234, 88, 12, 0.85)',
        line: { width: 0 },
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.gas_generation || [],
        name: 'Gas',
        type: 'scatter' as const,
        mode: 'lines' as const,
        stackgroup: 'one',
        fillcolor: 'rgba(3, 105, 161, 0.85)',
        line: { width: 0 },
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.hydro_generation || [],
        name: 'Hydro',
        type: 'scatter' as const,
        mode: 'lines' as const,
        stackgroup: 'one',
        fillcolor: 'rgba(13, 148, 136, 0.85)',
        line: { width: 0 },
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.nuclear_generation || [],
        name: 'Nuclear',
        type: 'scatter' as const,
        mode: 'lines' as const,
        stackgroup: 'one',
        fillcolor: 'rgba(124, 58, 237, 0.85)',
        line: { width: 0 },
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.renewable_generation || [],
        name: 'Renewable',
        type: 'scatter' as const,
        mode: 'lines' as const,
        stackgroup: 'one',
        fillcolor: 'rgba(22, 163, 74, 0.85)',
        line: { width: 0 },
      },
      {
        x: timeseries.timestamps || [],
        y: timeseries.demand_met || [],
        name: 'Demand met',
        type: 'scatter' as const,
        mode: 'lines' as const,
        line: { color: '#dc2626', width: 2.5 },
      },
    ];
  }, [parsedData]);

  const layout = useMemo(() => {
    const prefersDarkMode = resolvedTheme === 'dark';

    const paperBg = prefersDarkMode ? '#0f172a' : '#ffffff';
    const plotBg = prefersDarkMode ? '#1e293b' : '#f8fafc';
    const gridColor = prefersDarkMode ? '#334155' : '#e2e8f0';
    const textColor = prefersDarkMode ? '#cbd5e1' : '#475569';
    const titleColor = prefersDarkMode ? '#f1f5f9' : '#1e293b';

    const hasSize = cw > 0 && ch > 0;

    return {
      title: {
        text: 'Power generation',
        font: {
          size: 18,
          color: titleColor,
          family: CHART_FONT,
        },
        y: 0.98,
        x: 0,
        xanchor: 'left' as const,
      },
      xaxis: {
        title: { text: 'Time', font: { family: CHART_FONT, size: 12, color: textColor } },
        gridcolor: gridColor,
        linecolor: gridColor,
        zerolinecolor: gridColor,
        color: textColor,
        tickfont: { family: CHART_FONT, size: 11, color: textColor },
      },
      yaxis: {
        title: { text: 'Power (MW)', font: { family: CHART_FONT, size: 12, color: textColor } },
        gridcolor: gridColor,
        linecolor: gridColor,
        zerolinecolor: gridColor,
        color: textColor,
        tickfont: { family: CHART_FONT, size: 11, color: textColor },
      },
      autosize: true,
      ...(hasSize ? { width: cw, height: ch } : {}),
      margin: { l: 56, r: 108, b: 44, t: 48, pad: 2 },
      legend: {
        orientation: 'v' as const,
        x: 1.01,
        xanchor: 'left' as const,
        y: 1,
        yanchor: 'top' as const,
        bgcolor: prefersDarkMode ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)',
        bordercolor: gridColor,
        borderwidth: 1,
        font: { family: CHART_FONT, size: 10, color: textColor },
      },
      plot_bgcolor: plotBg,
      paper_bgcolor: paperBg,
      font: { family: CHART_FONT, color: textColor },
    } as Partial<Layout>;
  }, [cw, ch, resolvedTheme]);

  return (
    <div className="chart-container" ref={plotRef}>
      {isLoading ? (
        <p className="loading">Loading chart…</p>
      ) : !parsedData?.timeseries_values ? (
        <p className="error">No data available for this range.</p>
      ) : cw > 0 && ch > 0 ? (
        <Plot
          data={plotData}
          layout={layout}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          config={{
            responsive: true,
            displayModeBar: false,
          }}
        />
      ) : null}
    </div>
  );
};

export default PowerGenerationChart;
