import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useAppSelector } from '../hooks/reduxHooks';
import { useTheme } from '../context/ThemeContext';
import { usePlotContainerSize } from '../hooks/usePlotContainerSize';
import { ensureDataParsed } from '../utils/dataUtils';
import { ScatterData } from 'plotly.js';

const CHART_FONT = '"Inter", "Segoe UI", system-ui, sans-serif';

const CO2IntensityChart = () => {
  const { resolvedTheme } = useTheme();
  const { data, isLoading } = useAppSelector((state) => state.meritData);
  const { ref: plotRef, width: cw, height: ch } = usePlotContainerSize();

  const parsedData = useMemo(() => ensureDataParsed(data), [data]);

  const plotData = useMemo(() => {
    if (!parsedData?.timeseries_values) return [];

    const timeseries = parsedData.timeseries_values;
    const prefersDarkMode = resolvedTheme === 'dark';

    const lineColor = prefersDarkMode ? '#34d399' : '#059669';
    const fillColor = prefersDarkMode ? 'rgba(52, 211, 153, 0.2)' : 'rgba(5, 150, 105, 0.12)';

    return [
      {
        x: timeseries.timestamps || [],
        y: timeseries.g_co2_per_kwh || [],
        type: 'scatter' as const,
        mode: 'lines',
        name: 'CO₂ intensity',
        line: { color: lineColor, width: 2 },
        fill: 'tozeroy',
        fillcolor: fillColor,
      },
    ] as ScatterData[];
  }, [parsedData, resolvedTheme]);

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
        text: 'CO₂ intensity',
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
        title: { text: 'CO₂ (g/kWh)', font: { family: CHART_FONT, size: 12, color: textColor } },
        gridcolor: gridColor,
        linecolor: gridColor,
        zerolinecolor: gridColor,
        color: textColor,
        tickfont: { family: CHART_FONT, size: 11, color: textColor },
      },
      autosize: true,
      ...(hasSize ? { width: cw, height: ch } : {}),
      margin: { l: 56, r: 20, b: 44, t: 48, pad: 2 },
      plot_bgcolor: plotBg,
      paper_bgcolor: paperBg,
      font: { family: CHART_FONT, color: textColor },
      showlegend: false,
    };
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

export default CO2IntensityChart;
