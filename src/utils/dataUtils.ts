import { MeritData } from '../types/api';

/**
 * Ensures data is properly parsed if it's a string
 * @param data The data to parse
 * @returns Parsed data object
 */
export const ensureDataParsed = (data: MeritData | string | null): MeritData | null => {
  if (!data) return null;
  
  try {
    // If data is a string, try to parse it
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    
    // If timeseries_values is a string, parse that too
    if (data.timeseries_values && typeof data.timeseries_values === 'string') {
      return {
        ...data,
        timeseries_values: JSON.parse(data.timeseries_values)
      };
    }
    
    // Data is already parsed
    return data;
  } catch (error) {
    console.error('Error parsing data:', error);
    return null;
  }
}; 