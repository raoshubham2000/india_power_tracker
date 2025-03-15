import { MeritData } from '../types/api';

const API_URL = 'https://32u36xakx6.execute-api.us-east-2.amazonaws.com/v4/get-merit-data';

export async function fetchMeritData(startTime: string, endTime: string): Promise<MeritData> {
  const url = `${API_URL}?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}&corrected_values=true`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching merit data:', error);
    throw error;
  }
} 