import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchMeritData } from '../../services/api';
import { MeritData } from '../../types/api';

interface MeritDataState {
  data: MeritData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MeritDataState = {
  data: null,
  isLoading: false,
  error: null,
};

export const fetchMeritDataAsync = createAsyncThunk(
  'meritData/fetchMeritData',
  async ({ startTime, endTime }: { startTime: string; endTime: string }) => {
    const response = await fetchMeritData(startTime, endTime);
    return response;
  }
);

const meritDataSlice = createSlice({
  name: 'meritData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeritDataAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMeritDataAsync.fulfilled, (state, action: PayloadAction<MeritData>) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchMeritDataAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load power data. Please try again later.';
      });
  },
});

export default meritDataSlice.reducer; 