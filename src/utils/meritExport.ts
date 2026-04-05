import type { MeritData, MeritTimeseries } from '../types/api';
import { ensureDataParsed } from './dataUtils';

const SERIES: { key: keyof MeritTimeseries; label: string }[] = [
  { key: 'thermal_generation', label: 'Thermal_MW' },
  { key: 'gas_generation', label: 'Gas_MW' },
  { key: 'hydro_generation', label: 'Hydro_MW' },
  { key: 'nuclear_generation', label: 'Nuclear_MW' },
  { key: 'renewable_generation', label: 'Renewable_MW' },
  { key: 'demand_met', label: 'Demand_met_MW' },
  { key: 'net_demand', label: 'Net_demand_MW' },
  { key: 'g_co2_per_kwh', label: 'CO2_g_per_kWh' },
  { key: 'total_generation', label: 'Total_generation_MW' },
  { key: 'tons_co2', label: 'Tons_CO2' },
  { key: 'tons_co2_per_mwh', label: 'Tons_CO2_per_MWh' },
];

function getTimeseries(data: MeritData): MeritTimeseries | null {
  const parsed = ensureDataParsed(data);
  return parsed?.timeseries_values ?? null;
}

export function buildTimeseriesRecords(data: MeritData): Record<string, string | number>[] {
  const ts = getTimeseries(data);
  if (!ts?.timestamps?.length) return [];

  const n = ts.timestamps.length;
  const rows: Record<string, string | number>[] = [];

  for (let i = 0; i < n; i++) {
    const row: Record<string, string | number> = { Timestamp: ts.timestamps[i] };
    for (const { key, label } of SERIES) {
      const arr = ts[key];
      if (Array.isArray(arr) && i < arr.length) {
        const v = arr[i];
        row[label] = typeof v === 'number' && Number.isFinite(v) ? v : '';
      }
    }
    rows.push(row);
  }
  return rows;
}

function buildSummaryRecords(data: MeritData): { Metric: string; Value: string | number }[] {
  const d = ensureDataParsed(data);
  if (!d) return [];

  const rows: { Metric: string; Value: string | number }[] = [
    { Metric: 'Max CO2 (g/kWh)', Value: d.max_co2_per_kwh },
    { Metric: 'Max CO2 (g/kWh) time', Value: d.max_co2_per_kwh_time },
    { Metric: 'Min CO2 (g/kWh)', Value: d.min_co2_per_kwh },
    { Metric: 'Min CO2 (g/kWh) time', Value: d.min_co2_per_kwh_time },
    { Metric: 'Max CO2 (t/MWh)', Value: d.max_co2_per_mwh },
    { Metric: 'Max CO2 (t/MWh) time', Value: d.max_co2_per_mwh_time },
    { Metric: 'Min CO2 (t/MWh)', Value: d.min_co2_per_mwh },
    { Metric: 'Min CO2 (t/MWh) time', Value: d.min_co2_per_mwh_time },
    { Metric: 'Total CO2 (period, t)', Value: d.total_tons_co2 },
  ];

  const addPairs = (label: string, times: string[] | undefined, values: number[] | undefined) => {
    if (!times?.length || !values?.length) return;
    const len = Math.min(times.length, values.length);
    for (let i = 0; i < len; i++) {
      rows.push({ Metric: `${label} ${i + 1}`, Value: values[i] });
      rows.push({ Metric: `${label} ${i + 1} time`, Value: times[i] });
    }
  };

  addPairs('Peak demand (net)', d.peak_timestamps, d.peak_values);
  addPairs('Trough demand (net)', d.trough_timestamps, d.trough_values);
  addPairs('Morning peak', d.morning_peak_timestamps, d.morning_peak_values);
  addPairs('Evening peak', d.evening_peak_timestamps, d.evening_peak_values);

  return rows;
}

function escapeCsvCell(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function fileBaseName(range: { startTime: string; endTime: string } | null): string {
  const sanitize = (s: string) =>
    s.replace(/[:\s]+/g, '-').replace(/[/\\]+/g, '_').replace(/[^a-zA-Z0-9._-]+/g, '');
  if (range) {
    return `power-tracker_${sanitize(range.startTime)}_to_${sanitize(range.endTime)}`;
  }
  return `power-tracker_export_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;
}

export function downloadMeritCsv(
  data: MeritData,
  range: { startTime: string; endTime: string } | null
): void {
  const records = buildTimeseriesRecords(data);
  if (records.length === 0) return;

  const headers = Object.keys(records[0]);
  const lines = [
    headers.map(escapeCsvCell).join(','),
    ...records.map((row) => headers.map((h) => escapeCsvCell(row[h])).join(',')),
    '',
    '--- Summary ---',
    'Metric,Value',
    ...buildSummaryRecords(data).map((r) => `${escapeCsvCell(r.Metric)},${escapeCsvCell(r.Value)}`),
  ];

  const bom = '\uFEFF';
  const blob = new Blob([bom + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileBaseName(range)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadMeritExcel(
  data: MeritData,
  range: { startTime: string; endTime: string } | null
): Promise<void> {
  const tsRows = buildTimeseriesRecords(data);
  if (tsRows.length === 0) return;

  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(tsRows);
  XLSX.utils.book_append_sheet(wb, ws1, 'Timeseries');

  const summary = buildSummaryRecords(data);
  const ws2 = XLSX.utils.json_to_sheet(summary);
  XLSX.utils.book_append_sheet(wb, ws2, 'Summary');

  XLSX.writeFile(wb, `${fileBaseName(range)}.xlsx`);
}

export function downloadMeritJson(
  data: MeritData,
  range: { startTime: string; endTime: string } | null
): void {
  const parsed = ensureDataParsed(data);
  if (!parsed?.timeseries_values?.timestamps?.length) return;

  const json = JSON.stringify(parsed, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileBaseName(range)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
