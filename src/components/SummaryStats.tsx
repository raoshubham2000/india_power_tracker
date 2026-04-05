import { useMemo } from 'react';
import { useAppSelector } from '../hooks/reduxHooks';
import { ensureDataParsed } from '../utils/dataUtils';
import type { MeritTimeseries } from '../types/api';

type SummaryRow = {
  metric: string;
  value: string;
  /** ISO-like timestamp from API, or null for “—” */
  timeIso: string | null;
};

function TimeCell({ iso }: { iso: string }) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return <span className="col-time-fallback">{iso}</span>;
  }
  return (
    <span className="col-time-stack">
      <span className="col-time-date">{d.toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
      <span className="col-time-clock">{d.toLocaleTimeString(undefined, { timeStyle: 'short' })}</span>
    </span>
  );
}

function firstPair(values?: number[], timestamps?: string[]): { value: number; timeIso: string } | null {
  if (!values?.length || !timestamps?.length) return null;
  return { value: values[0], timeIso: timestamps[0] };
}

function extremumInSeries(
  series: number[] | undefined,
  times: string[] | undefined,
  mode: 'max' | 'min'
): { value: number; timeIso: string } | null {
  if (!series?.length || !times?.length || series.length !== times.length) return null;
  let ix = 0;
  for (let i = 1; i < series.length; i++) {
    if (mode === 'max' ? series[i] > series[ix] : series[i] < series[ix]) ix = i;
  }
  return { value: series[ix], timeIso: times[ix] };
}

const SummaryStats = () => {
  const { data, isLoading } = useAppSelector((state) => state.meritData);

  const parsedData = useMemo(() => ensureDataParsed(data), [data]);

  const tsExtras = useMemo(() => {
    if (!parsedData?.timeseries_values) return null;
    const t = parsedData.timeseries_values as MeritTimeseries;
    return {
      maxGen: extremumInSeries(t.total_generation, t.timestamps, 'max'),
      minGen: extremumInSeries(t.total_generation, t.timestamps, 'min'),
    };
  }, [parsedData]);

  const subtitle = isLoading
    ? 'Fetching figures for this range…'
    : !parsedData
      ? 'Try a different date range or reload.'
      : 'Key figures for the selected period.';

  if (isLoading) {
    return (
      <div className="summary-table-card">
        <header className="summary-panel-head">
          <h2 className="summary-table-title">Period summary</h2>
          <p className="summary-panel-subtitle">{subtitle}</p>
        </header>
        <p className="loading summary-panel-placeholder">Loading summary…</p>
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div className="summary-table-card">
        <header className="summary-panel-head">
          <h2 className="summary-table-title">Period summary</h2>
          <p className="summary-panel-subtitle">{subtitle}</p>
        </header>
        <p className="error summary-panel-placeholder">No summary available for this range.</p>
      </div>
    );
  }

  const peak = firstPair(parsedData.peak_values, parsedData.peak_timestamps);
  const trough = firstPair(parsedData.trough_values, parsedData.trough_timestamps);
  const morning = firstPair(parsedData.morning_peak_values, parsedData.morning_peak_timestamps);
  const evening = firstPair(parsedData.evening_peak_values, parsedData.evening_peak_timestamps);

  const rows: SummaryRow[] = [];

  if (peak) {
    rows.push({
      metric: 'Peak demand (net)',
      value: `${peak.value.toLocaleString()} MW`,
      timeIso: peak.timeIso,
    });
  }
  if (trough) {
    rows.push({
      metric: 'Trough demand (net)',
      value: `${trough.value.toLocaleString()} MW`,
      timeIso: trough.timeIso,
    });
  }
  rows.push({
    metric: 'Morning peak',
    value: morning ? `${morning.value.toLocaleString()} MW` : '—',
    timeIso: morning?.timeIso ?? null,
  });
  rows.push({
    metric: 'Evening peak',
    value: evening ? `${evening.value.toLocaleString()} MW` : '—',
    timeIso: evening?.timeIso ?? null,
  });
  rows.push({
    metric: 'Max CO₂ (g/kWh)',
    value: parsedData.max_co2_per_kwh.toFixed(2),
    timeIso: parsedData.max_co2_per_kwh_time,
  });
  rows.push({
    metric: 'Min CO₂ (g/kWh)',
    value: parsedData.min_co2_per_kwh.toFixed(2),
    timeIso: parsedData.min_co2_per_kwh_time,
  });
  rows.push({
    metric: 'Max CO₂ (t/MWh)',
    value: parsedData.max_co2_per_mwh.toFixed(4),
    timeIso: parsedData.max_co2_per_mwh_time,
  });
  rows.push({
    metric: 'Min CO₂ (t/MWh)',
    value: parsedData.min_co2_per_mwh.toFixed(4),
    timeIso: parsedData.min_co2_per_mwh_time,
  });
  rows.push({
    metric: 'Total CO₂ (period)',
    value: `${parsedData.total_tons_co2.toLocaleString(undefined, { maximumFractionDigits: 0 })} t`,
    timeIso: null,
  });

  if (tsExtras?.maxGen) {
    rows.push({
      metric: 'Peak total generation',
      value: `${tsExtras.maxGen.value.toLocaleString()} MW`,
      timeIso: tsExtras.maxGen.timeIso,
    });
  }
  if (tsExtras?.minGen) {
    rows.push({
      metric: 'Minimum total generation',
      value: `${tsExtras.minGen.value.toLocaleString()} MW`,
      timeIso: tsExtras.minGen.timeIso,
    });
  }

  return (
    <div className="summary-table-card">
      <header className="summary-panel-head">
        <h2 className="summary-table-title">Period summary</h2>
        <p className="summary-panel-subtitle">{subtitle}</p>
      </header>
      <div className="summary-table-scroll">
        <table className="summary-table">
        <thead>
          <tr>
            <th scope="col" className="col-metric">
              Metric
            </th>
            <th scope="col" className="col-value summary-th-numeric">
              Value
            </th>
            <th scope="col" className="col-time">
              Time
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.metric}-${index}`}>
              <td className="col-metric">{row.metric}</td>
              <td className="col-value">{row.value}</td>
              <td className="col-time">
                {row.timeIso ? <TimeCell iso={row.timeIso} /> : <span className="col-time-dash">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default SummaryStats;
