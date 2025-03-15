export interface MeritData {
  timeseries_values: {
    timestamps: string[];
    thermal_generation: number[];
    gas_generation: number[];
    hydro_generation: number[];
    nuclear_generation: number[];
    renewable_generation: number[];
    g_co2_per_kwh: number[];
    demand_met: number[];
    net_demand: number[];
  };
  max_co2_per_kwh: number;
  max_co2_per_kwh_time: string;
  min_co2_per_kwh: number;
  min_co2_per_kwh_time: string;
  max_co2_per_mwh: number;
  max_co2_per_mwh_time: string;
  min_co2_per_mwh: number;
  min_co2_per_mwh_time: string;
  total_tons_co2: number;
  peak_timestamps: string[];
  peak_values: number[];
  trough_timestamps: string[];
  trough_values: number[];
  morning_peak_timestamps: string[];
  morning_peak_values: number[];
  evening_peak_timestamps: string[];
  evening_peak_values: number[];
} 