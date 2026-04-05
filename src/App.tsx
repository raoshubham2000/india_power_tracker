import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import './App.css'
import { useTheme } from './context/ThemeContext'
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks'
import { fetchMeritDataAsync } from './store/slices/meritDataSlice'
import PowerGenerationChart from './components/PowerGenerationChart'
import CO2IntensityChart from './components/CO2IntensityChart'
import SummaryStats from './components/SummaryStats'
import DateRangePicker from './components/DateRangePicker'
import ExportDownloadMenu from './components/ExportDownloadMenu'
import AboutDeveloper from './components/AboutDeveloper'

function App() {
  const dispatch = useAppDispatch();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { error } = useAppSelector(state => state.meritData);
  const [showAboutDev, setShowAboutDev] = useState(false);

  useEffect(() => {
    // Load initial data for Feb 28, 2025
    dispatch(fetchMeritDataAsync({ 
      startTime: '2025-02-28 00:00:00', 
      endTime: '2025-03-01 00:00:00' 
    }));
  }, [dispatch]);

  const handleDateRangeChange = (
    startDate: string,
    endDate: string,
    options?: { silent?: boolean }
  ) => {
    dispatch(
      fetchMeritDataAsync({
        startTime: startDate,
        endTime: endDate,
        silent: options?.silent,
      })
    );
  };

  return (
    <div className={`app${showAboutDev ? '' : ' app--dashboard'}`}>
      <header className="app-navbar">
        <div className="app-navbar-shell">
          <div className="app-navbar-inner">
            <span className="nav-brand">
              <span className="nav-brand-copy">
                <span className="nav-brand-title">Power Tracker</span>
                <span className="nav-brand-tagline">India grid · MERIT &amp; CO₂</span>
              </span>
            </span>
            <nav className="nav-actions" aria-label="Primary">
              <div className="nav-btn-container">
                <button
                  type="button"
                  className={`nav-btn ${!showAboutDev ? 'active' : ''}`}
                  onClick={() => setShowAboutDev(false)}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  className={`nav-btn ${showAboutDev ? 'active' : ''}`}
                  onClick={() => setShowAboutDev(true)}
                >
                  About
                </button>
              </div>
              {!showAboutDev && <ExportDownloadMenu />}
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="theme-toggle-icon" aria-hidden size={20} strokeWidth={2} />
                ) : (
                  <Moon className="theme-toggle-icon" aria-hidden size={20} strokeWidth={2} />
                )}
              </button>
            </nav>
          </div>
          {!showAboutDev && (
            <div className="app-navbar-dates" aria-label="Date range">
              <DateRangePicker onDateRangeChange={handleDateRangeChange} />
            </div>
          )}
        </div>
      </header>

      <div className={`app-body${showAboutDev ? '' : ' app-body--dashboard'}`}>
        <main className="app-content">
          {showAboutDev ? (
            <AboutDeveloper />
          ) : (
            <>
              {error && <div className="error-message">{error}</div>}

              <div className="dashboard-layout">
                <div className="dashboard-charts">
                  <section className="charts-section">
                    <div className="chart-wrapper">
                      <PowerGenerationChart />
                    </div>

                    <div className="chart-wrapper">
                      <CO2IntensityChart />
                    </div>
                  </section>
                </div>

                <aside className="dashboard-summary" aria-label="Period summary">
                  <div className="dashboard-summary-inner">
                    <section className="stats-section">
                      <SummaryStats />
                    </section>
                  </div>
                </aside>
              </div>
            </>
          )}
        </main>

        <footer className="app-footer">
          <p>Power Tracker by Shubham Rao © 2025</p>
          <p>Source: Underlying Data from MERIT India & The CSEP Electricity and Carbon Tracker.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
