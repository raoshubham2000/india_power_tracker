import { useState, useEffect, useCallback } from 'react';

interface DateRangePickerProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

const DateRangePicker = ({ onDateRangeChange }: DateRangePickerProps) => {
  const [startDate, setStartDate] = useState('2025-02-28');
  const [endDate, setEndDate] = useState('2025-03-01');
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');
  const [useCurrentTime, setUseCurrentTime] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Calculate date range based on preset
  const applyPreset = useCallback((preset: string) => {
    setActivePreset(preset);
    const now = new Date();
    let startDateTime = new Date(now);
    
    // Calculate start date based on preset
    switch(preset) {
      case '1h':
        startDateTime.setHours(now.getHours() - 1);
        break;
      case '6h':
        startDateTime.setHours(now.getHours() - 6);
        break;
      case '12h':
        startDateTime.setHours(now.getHours() - 12);
        break;
      case '1d':
        startDateTime.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDateTime.setDate(now.getDate() - 7);
        break;
      case '14d':
        startDateTime.setDate(now.getDate() - 14);
        break;
      case '1m':
        startDateTime.setMonth(now.getMonth() - 1);
        break;
      case '6m':
        startDateTime.setMonth(now.getMonth() - 6);
        break;
      case '1y':
        startDateTime.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return;
    }
    
    // Format dates
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    // Format times
    const formatTime = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };
    
    // Set start date and time
    setStartDate(formatDate(startDateTime));
    setStartTime(formatTime(startDateTime));
    
    // Set end date and time to current
    setEndDate(formatDate(now));
    setEndTime(formatTime(now));
    
    // Enable current time checkbox
    setUseCurrentTime(true);
    
    // Submit the date range
    const formattedStartDate = `${formatDate(startDateTime)} ${formatTime(startDateTime)}:00`;
    const formattedEndDate = `${formatDate(now)} ${formatTime(now)}:00`;
    onDateRangeChange(formattedStartDate, formattedEndDate);
  }, [onDateRangeChange]);

  // Set up polling when using current time
  useEffect(() => {
    if (useCurrentTime) {
      // Initial update
      setCurrentDateTime();
      
      // Set up polling every 60 seconds
      const interval = setInterval(() => {
        setCurrentDateTime();
        
        // If we have an active preset, reapply it to maintain the relative time range
        if (activePreset) {
          applyPreset(activePreset);
        } else {
          // Otherwise just update the end time and submit
          const now = new Date();
          const formattedStartDate = `${startDate} ${startTime}:00`;
          const formattedEndDate = `${endDate} ${endTime}:00`;
          onDateRangeChange(formattedStartDate, formattedEndDate);
        }
      }, 60000); // 60 seconds
      
      return () => clearInterval(interval);
    }
  }, [useCurrentTime, activePreset, applyPreset, startDate, startTime, endDate, endTime, onDateRangeChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedStartDate = `${startDate} ${startTime}:00`;
    const formattedEndDate = `${endDate} ${endTime}:00`;
    onDateRangeChange(formattedStartDate, formattedEndDate);
  };

  const setCurrentDateTime = () => {
    const now = new Date();
    
    // Format date as YYYY-MM-DD
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    // Format time as HH:MM
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    
    setEndDate(formattedDate);
    setEndTime(formattedTime);
  };

  const handleUseCurrentTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseCurrentTime(e.target.checked);
    if (e.target.checked) {
      setCurrentDateTime();
    } else {
      // Clear active preset when disabling current time
      setActivePreset(null);
    }
  };

  return (
    <div className="retro-date-picker-container">
      <div className="retro-preset-buttons">
        <div className="retro-preset-group">
          <span className="retro-preset-label">QUICK SELECT:</span>
          <button 
            type="button" 
            className={`retro-preset-btn ${activePreset === '1h' ? 'retro-active' : ''}`}
            onClick={() => applyPreset('1h')}
          >
            1H
          </button>
          <button 
            type="button" 
            className={`retro-preset-btn ${activePreset === '6h' ? 'retro-active' : ''}`}
            onClick={() => applyPreset('6h')}
          >
            6H
          </button>
          <button 
            type="button" 
            className={`retro-preset-btn ${activePreset === '12h' ? 'retro-active' : ''}`}
            onClick={() => applyPreset('12h')}
          >
            12H
          </button>
          <button 
            type="button" 
            className={`retro-preset-btn ${activePreset === '1d' ? 'retro-active' : ''}`}
            onClick={() => applyPreset('1d')}
          >
            1D
          </button>
          <button 
            type="button" 
            className={`retro-preset-btn ${activePreset === '7d' ? 'retro-active' : ''}`}
            onClick={() => applyPreset('7d')}
          >
            7D
          </button>
          <button 
            type="button" 
            className={`retro-preset-btn ${activePreset === '14d' ? 'retro-active' : ''}`}
            onClick={() => applyPreset('14d')}
          >
            14D
          </button>
          <button 
            type="button" 
            className={`retro-preset-btn ${activePreset === '1m' ? 'retro-active' : ''}`}
            onClick={() => applyPreset('1m')}
          >
            1M
          </button>
          <button 
            type="button" 
            className={`retro-preset-btn ${activePreset === '6m' ? 'retro-active' : ''}`}
            onClick={() => applyPreset('6m')}
          >
            6M
          </button>
          <button 
            type="button" 
            className={`retro-preset-btn ${activePreset === '1y' ? 'retro-active' : ''}`}
            onClick={() => applyPreset('1y')}
          >
            1Y
          </button>
        </div>
      </div>
      
      <form className="retro-date-form" onSubmit={handleSubmit}>
        <div className="retro-form-group">
          <label htmlFor="start-date">
            <span className="retro-date-icon">[&gt;</span> START:
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setActivePreset(null);
            }}
            className="retro-date-input"
          />
          <input
            type="time"
            id="start-time"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              setActivePreset(null);
            }}
            className="retro-time-input"
          />
        </div>
        
        <div className="retro-form-group">
          <label htmlFor="end-date">
            <span className="retro-date-icon">[&gt;</span> END:
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setActivePreset(null);
            }}
            className="retro-date-input"
            disabled={useCurrentTime}
          />
          <input
            type="time"
            id="end-time"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
              setActivePreset(null);
            }}
            className="retro-time-input"
            disabled={useCurrentTime}
          />
          <div className="retro-checkbox-container">
            <input
              type="checkbox"
              id="use-current-time"
              checked={useCurrentTime}
              onChange={handleUseCurrentTimeChange}
              className="retro-checkbox"
            />
            <label htmlFor="use-current-time" className="retro-label">CURRENT TIME</label>
          </div>
        </div>
        
        <button type="submit" className="retro-submit-btn">
          <span className="retro-btn-icon">►</span> UPDATE
        </button>
      </form>
      
      {useCurrentTime && activePreset && (
        <div className="retro-update-notice">
          <span className="retro-update-icon">↻</span> AUTO-UPDATING EVERY MINUTE
        </div>
      )}
    </div>
  );
};

export default DateRangePicker; 