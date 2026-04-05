import { useMemo } from 'react';
import { useAppSelector } from '../hooks/reduxHooks';
import { ensureDataParsed } from '../utils/dataUtils';
import type { MeritTimeseries } from '../types/api';

function formatDisplayTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function firstPair(values?: number[], timestamps?: string[]): { value: number; time: string } | null {
  if (!values?.length || !timestamps?.length) return null;
  return { value: values[0], time: formatDisplayTime(timestamps[0]) };
}

function extremumInSeries(
  series: number[] | undefined,
  times: string[] | undefined,
  mode: 'max' | 'min'
): { value: number; time: string } | null {
  if (!series?.length || !times?.length || series.length !== times.length) return null;
  let ix = 0;
  for (let i = 1; i < series.length; i++) {
    if (mode === 'max' ? series[i] > series[ix] : series[i] < series[ix]) ix = i;
  }
  return { value: series[ix], time: formatDisplayTime(times[ix]) };
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

  if (isLoading) {
    return (
      <div className="summary-table-card">
        <p className="summary-table-title">Period summary</p>
        <p className="loading" style={{ padding: '1.5rem 1.25rem', margin: 0 }}>
          Loading summary…
        </p>
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div className="summary-table-card">
        <p className="summary-table-title">Period summary</p>
        <p className="error" style={{ margin: '1rem 1.25rem' }}>
          No summary available for this range.
        </p>
      </div>
    );
  }

  const peak = firstPair(parsedData.peak_values, parsedData.peak_timestamps);
  const trough = firstPair(parsedData.trough_values, parsedData.trough_timestamps);
  const morning = firstPair(parsedData.morning_peak_values, parsedData.morning_peak_timestamps);
  const evening = firstPair(parsedData.evening_peak_values, parsedData.evening_peak_timestamps);

  const rows: { metric: string; value: string; time: string }[] = [];

  if (peak) {
    rows.push({
      metric: 'Peak demand (net)',
      value: `${peak.value.toLocaleString()} MW`,
      time: peak.time,
    });
  }
  if (trough) {
    rows.push({
      metric: 'Trough demand (net)',
      value: `${trough.value.toLocaleString()} MW`,
      time: trough.time,
    });
  }
  rows.push({
    metric: 'Morning peak',
    value: morning ? `${morning.value.toLocaleString()} MW` : '—',
    time: morning?.time ?? '—',
  });
  rows.push({
    metric: 'Evening peak',
    value: evening ? `${evening.value.toLocaleString()} MW` : '—',
    time: evening?.time ?? '—',
  });
  rows.push({
    metric: 'Max CO₂ (g/kWh)',
    value: parsedData.max_co2_per_kwh.toFixed(2),
    time: formatDisplayTime(parsedData.max_co2_per_kwh_time),
  });
  rows.push({
    metric: 'Min CO₂ (g/kWh)',
    value: parsedData.min_co2_per_kwh.toFixed(2),
    time: formatDisplayTime(parsedData.min_co2_per_kwh_time),
  });
  rows.push({
    metric: 'Max CO₂ (t/MWh)',
    value: parsedData.max_co2_per_mwh.toFixed(4),
    time: formatDisplayTime(parsedData.max_co2_per_mwh_time),
  });
  rows.push({
    metric: 'Min CO₂ (t/MWh)',
    value: parsedData.min_co2_per_mwh.toFixed(4),
    time: formatDisplayTime(parsedData.min_co2_per_mwh_time),
  });
  rows.push({
    metric: 'Total CO₂ (period)',
    value: `${parsedData.total_tons_co2.toLocaleString(undefined, { maximumFractionDigits: 0 })} t`,
    time: '—',
  });

  if (tsExtras?.maxGen) {
    rows.push({
      metric: 'Peak total generation',
      value: `${tsExtras.maxGen.value.toLocaleString()} MW`,
      time: tsExtras.maxGen.time,
    });
  }
  if (tsExtras?.minGen) {
    rows.push({
      metric: 'Minimum total generation',
      value: `${tsExtras.minGen.value.toLocaleString()} MW`,
      time: tsExtras.minGen.time,
    });
  }

  return (
    <div className="summary-table-card">
      <h2 className="summary-table-title">Period summary</h2>
      <table className="summary-table">
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col" className="col-value summary-th-numeric">
              Value
            </th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.metric}-${index}`}>
              <td className="col-metric">{row.metric}</td>
              <td className="col-value">{row.value}</td>
              <td className="col-time">{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryStats;
