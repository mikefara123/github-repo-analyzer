import React, { useEffect, useRef } from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { formatDate } from '../../utils/formatters';

/**
 * Component for displaying analysis progress and logs
 */
const AnalysisLog = () => {
  const { progress, isAnalyzing } = useAnalysis();
  const logRef = useRef(null);
  const logEntries = useRef([]);
  
  // Add a log entry when progress changes
  useEffect(() => {
    if (progress && progress.step) {
      const entry = {
        timestamp: new Date(),
        message: `Step: ${progress.step} - Progress: ${Math.round(progress.progress)}%`,
        type: 'info'
      };
      
      logEntries.current = [...logEntries.current, entry];
      
      // Scroll to the bottom of the log
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }
  }, [progress]);
  
  if (!isAnalyzing && logEntries.current.length === 0) {
    return null;
  }
  
  return (
    <div className="analysis-log-container">
      <h3 className="log-title">Analysis Log</h3>
      
      <div className="log-content" ref={logRef}>
        {logEntries.current.length === 0 ? (
          <div className="empty-log">No log entries yet</div>
        ) : (
          logEntries.current.map((entry, index) => (
            <div key={index} className={`log-entry ${entry.type}`}>
              <span className="timestamp">{formatDate(entry.timestamp)}</span>
              <span className="message">{entry.message}</span>
            </div>
          ))
        )}
      </div>
      
      <style jsx>{`
        .analysis-log-container {
          margin-top: 2rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          overflow: hidden;
        }
        
        .log-title {
          margin: 0;
          padding: 0.75rem 1rem;
          background-color: #f8f9fa;
          border-bottom: 1px solid #ddd;
          font-size: 1rem;
          font-weight: 600;
        }
        
        .log-content {
          max-height: 300px;
          overflow-y: auto;
          background-color: #f5f5f5;
          font-family: monospace;
          font-size: 0.85rem;
          padding: 0.5rem;
        }
        
        .empty-log {
          padding: 1rem;
          color: #6c757d;
          text-align: center;
          font-style: italic;
        }
        
        .log-entry {
          padding: 0.35rem 0.5rem;
          border-radius: 4px;
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
        }
        
        .log-entry.info {
          background-color: #e9f5ff;
        }
        
        .log-entry.error {
          background-color: #ffebee;
        }
        
        .log-entry.success {
          background-color: #e8f5e9;
        }
        
        .timestamp {
          color: #666;
          margin-right: 0.75rem;
          font-size: 0.8rem;
        }
        
        .message {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default AnalysisLog; 