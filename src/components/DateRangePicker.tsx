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
    <div className="date-range-picker-container">
      <div className="preset-buttons">
        <div className="preset-group">
          <span className="preset-label">Quick select:</span>
          <button 
            type="button" 
            className={`preset-btn ${activePreset === '1h' ? 'active' : ''}`}
            onClick={() => applyPreset('1h')}
          >
            1h
          </button>
          <button 
            type="button" 
            className={`preset-btn ${activePreset === '6h' ? 'active' : ''}`}
            onClick={() => applyPreset('6h')}
          >
            6h
          </button>
          <button 
            type="button" 
            className={`preset-btn ${activePreset === '12h' ? 'active' : ''}`}
            onClick={() => applyPreset('12h')}
          >
            12h
          </button>
          <button 
            type="button" 
            className={`preset-btn ${activePreset === '1d' ? 'active' : ''}`}
            onClick={() => applyPreset('1d')}
          >
            1d
          </button>
          <button 
            type="button" 
            className={`preset-btn ${activePreset === '7d' ? 'active' : ''}`}
            onClick={() => applyPreset('7d')}
          >
            7d
          </button>
          <button 
            type="button" 
            className={`preset-btn ${activePreset === '14d' ? 'active' : ''}`}
            onClick={() => applyPreset('14d')}
          >
            14d
          </button>
          <button 
            type="button" 
            className={`preset-btn ${activePreset === '1m' ? 'active' : ''}`}
            onClick={() => applyPreset('1m')}
          >
            1m
          </button>
          <button 
            type="button" 
            className={`preset-btn ${activePreset === '6m' ? 'active' : ''}`}
            onClick={() => applyPreset('6m')}
          >
            6m
          </button>
          <button 
            type="button" 
            className={`preset-btn ${activePreset === '1y' ? 'active' : ''}`}
            onClick={() => applyPreset('1y')}
          >
            1y
          </button>
        </div>
      </div>
      
      <form className="date-range-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="start-date">
            <span className="date-icon">📅</span> Start Date:
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setActivePreset(null);
            }}
            className="date-input"
          />
          <input
            type="time"
            id="start-time"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              setActivePreset(null);
            }}
            className="time-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="end-date">
            <span className="date-icon">📅</span> End Date:
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setActivePreset(null);
            }}
            className="date-input"
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
            className="time-input"
            disabled={useCurrentTime}
          />
          <div className="now-checkbox-container">
            <input
              type="checkbox"
              id="use-current-time"
              checked={useCurrentTime}
              onChange={handleUseCurrentTimeChange}
              className="now-checkbox"
            />
            <label htmlFor="use-current-time" className="now-label">Use current time</label>
          </div>
        </div>
        
        <button type="submit" className="submit-btn">
          <span className="btn-icon">↻</span> Update Data
        </button>
      </form>
      
      {useCurrentTime && activePreset && (
        <div className="auto-update-notice">
          <span className="update-icon">🔄</span> Auto-updating every minute
        </div>
      )}
    </div>
  );
};

export default DateRangePicker; 