import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchMeritData } from '../../services/api';
import { MeritData } from '../../types/api';

interface MeritDataState {
  data: MeritData | null;
  isLoading: boolean;
  error: string | null;
  /** Range from the last successful fetch (for export filenames). */
  lastRequestedRange: { startTime: string; endTime: string } | null;
}

const initialState: MeritDataState = {
  data: null,
  isLoading: false,
  error: null,
  lastRequestedRange: null,
};

export type FetchMeritParams = {
  startTime: string;
  endTime: string;
  /** When true, skip global loading state so charts update in place (e.g. minute polling). */
  silent?: boolean;
};

export const fetchMeritDataAsync = createAsyncThunk(
  'meritData/fetchMeritData',
  async ({ startTime, endTime }: FetchMeritParams) => {
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
      .addCase(fetchMeritDataAsync.pending, (state, action) => {
        if (!action.meta.arg.silent) {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchMeritDataAsync.fulfilled, (state, action: PayloadAction<MeritData>) => {
        state.isLoading = false;
        state.data = action.payload;
        const arg = (action as PayloadAction<MeritData> & { meta: { arg: FetchMeritParams } }).meta
          .arg;
        state.lastRequestedRange = {
          startTime: arg.startTime,
          endTime: arg.endTime,
        };
      })
      .addCase(fetchMeritDataAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load power data. Please try again later.';
      });
  },
});

export default meritDataSlice.reducer; 