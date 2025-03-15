import { useEffect } from 'react'
import './App.css'
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks'
import { fetchMeritDataAsync } from './store/slices/meritDataSlice'
import PowerGenerationChart from './components/PowerGenerationChart'
import CO2IntensityChart from './components/CO2IntensityChart'
import SummaryStats from './components/SummaryStats'
import DateRangePicker from './components/DateRangePicker'

function App() {
  const dispatch = useAppDispatch();
  const { data: meritData, isLoading, error } = useAppSelector(state => state.meritData);

  useEffect(() => {
    // Load initial data for Feb 28, 2025
    dispatch(fetchMeritDataAsync({ 
      startTime: '2025-02-28 00:00:00', 
      endTime: '2025-03-01 00:00:00' 
    }));
  }, [dispatch]);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    dispatch(fetchMeritDataAsync({ startTime: startDate, endTime: endDate }));
  }

  return (
    <div className="app redux-container">
      {isLoading && (
        <div className="redux-loading-overlay">
          <div className="redux-loading-spinner"></div>
        </div>
      )}
      
      <header className="app-header">
        <h1>Power Tracker</h1>
        <p>Monitor power generation, demand, and CO2 intensity</p>
      </header>

      <main className="app-content">
        <section className="controls-section">
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
        </section>

        {error && <div className="error-message">{error}</div>}

        <section className="stats-section">
          <SummaryStats />
        </section>

        <section className="charts-section">
          <div className="chart-wrapper">
            <PowerGenerationChart />
          </div>
          
          <div className="chart-wrapper">
            <CO2IntensityChart />
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Power Tracker by Shubham Rao © 2025</p>
        <p>Source: Underlying Data from MERIT India & The CSEP Electricity and Carbon Tracker.</p>
      </footer>
    </div>
  )
}

export default App
