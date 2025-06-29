import { useState, useEffect } from 'react';
import { useVendorOrders } from '../../contexts/VendorOrderContext';

export default function PollingStatus() {
  const { 
    pollingEnabled, 
    pollingInterval, 
    lastUpdated, 
    togglePolling, 
    setPollingInterval
  } = useVendorOrders();
  
  const [showSettings, setShowSettings] = useState(false);
  const [tempInterval, setTempInterval] = useState(pollingInterval / 1000);

  const formatLastUpdated = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  const handleIntervalChange = () => {
    const newInterval = tempInterval * 1000;
    if (newInterval >= 5000 && newInterval <= 300000) { // 5s to 5m
      setPollingInterval(newInterval);
      setShowSettings(false);
    }
  };

  useEffect(() => {
    setTempInterval(pollingInterval / 1000);
  }, [pollingInterval]);

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body py-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            {/* Polling Status */}
            <div className="me-2">
              {pollingEnabled ? (
                <span className="text-success">
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Auto-refresh: ON
                </span>
              ) : (
                <span className="text-muted">
                  <i className="bi bi-pause-circle me-1"></i>
                  Auto-refresh: OFF
                </span>
              )}
            </div>
            <small className="text-muted">
              Last updated: {formatLastUpdated(lastUpdated)}
            </small>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className={`btn btn-sm ${pollingEnabled ? 'btn-outline-warning' : 'btn-outline-success'}`}
              onClick={togglePolling}
              title={pollingEnabled ? 'Disable auto-refresh' : 'Enable auto-refresh'}
            >
              {pollingEnabled ? (
                <i className="bi bi-pause-fill"></i>
              ) : (
                <i className="bi bi-play-fill"></i>
              )}
            </button>
            
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowSettings(!showSettings)}
              title="Polling settings"
            >
              <i className="bi bi-gear"></i>
            </button>
          </div>
        </div>
        
        {showSettings && (
          <div className="mt-2 pt-2 border-top">
            <div className="row align-items-center">
              <div className="col-sm-6">
                <label className="form-label small mb-1">
                  Refresh interval (seconds):
                </label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={tempInterval}
                  onChange={(e) => setTempInterval(parseInt(e.target.value) || 30)}
                  min="5"
                  max="300"
                  step="5"
                />
                <small className="text-muted">Between 5-300 seconds</small>
              </div>
              <div className="col-sm-6">
                <div className="d-flex gap-2 mt-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleIntervalChange}
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setTempInterval(pollingInterval / 1000);
                      setShowSettings(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
