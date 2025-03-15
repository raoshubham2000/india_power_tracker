import { useEffect, useState } from 'react'
import './App.css'
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks'
import { fetchMeritDataAsync } from './store/slices/meritDataSlice'
import PowerGenerationChart from './components/PowerGenerationChart'
import CO2IntensityChart from './components/CO2IntensityChart'
import SummaryStats from './components/SummaryStats'
import DateRangePicker from './components/DateRangePicker'
import AboutDeveloper from './components/AboutDeveloper'

function App() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.meritData);
  const [showAboutDev, setShowAboutDev] = useState(false);

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
        <div className="retro-loading-overlay">
          <div className="retro-loading">LOADING DATA<span className="retro-loading-dots">...</span></div>
        </div>
      )}
      
      <nav className="app-nav">
        <div className="nav-title">POWER TRACKER</div>
        <div className="nav-btn-container">
          <button 
            className={`nav-btn ${!showAboutDev ? 'active' : ''}`} 
            onClick={() => setShowAboutDev(false)}
          >
            DASHBOARD
          </button>
          <button 
            className={`nav-btn ${showAboutDev ? 'active' : ''}`} 
            onClick={() => setShowAboutDev(true)}
          >
            ABOUT DEV
          </button>
        </div>
      </nav>

      <main className="app-content">
        {showAboutDev ? (
          <AboutDeveloper />
        ) : (
          <>
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
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Power Tracker by Shubham Rao © 2025</p>
        <p>Source: Underlying Data from MERIT India & The CSEP Electricity and Carbon Tracker.</p>
      </footer>
    </div>
  )
}

export default App
