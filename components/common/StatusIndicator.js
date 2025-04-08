import React from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { ANALYSIS_STEPS } from '../../utils/analysisSteps';

/**
 * Enhanced status indicator component for displaying current analysis status
 */
const StatusIndicator = () => {
  const { progress, isAnalyzing, error } = useAnalysis();
  
  // Find the current step label
  const currentStep = ANALYSIS_STEPS.find(step => step.id === progress.step) || ANALYSIS_STEPS[0];
  
  // Determine status color
  const getStatusColor = () => {
    if (error) return 'var(--status-error)'; 
    if (progress.step === 'complete') return 'var(--status-success)';
    if (isAnalyzing) return 'var(--status-analyzing)';
    return 'var(--status-idle)';
  };
  
  // Determine status message
  const getStatusMessage = () => {
    if (error) return `Error: ${error}`;
    if (progress.step === 'complete') return 'Analysis completed successfully';
    if (isAnalyzing) return `${currentStep.label} (${Math.round(progress.progress)}%)`;
    return 'Ready to analyze';
  };

  // Get status icon
  const getStatusIcon = () => {
    if (error) return '❌';
    if (progress.step === 'complete') return '✅';
    if (isAnalyzing) return '⏳';
    return '⚙️';
  };

  if (!isAnalyzing && !error && progress.step !== 'complete') {
    return null;
  }

  return (
    <div className="status-container">
      <div className="status-card" style={{ borderColor: getStatusColor() }}>
        <div className="status-header">
          <div className="status-icon">{getStatusIcon()}</div>
          <div className="status-title">
            {error ? 'Analysis Error' : 
             progress.step === 'complete' ? 'Analysis Complete' : 
             'Analysis In Progress'}
          </div>
        </div>
        
        <div className="status-message">
          {getStatusMessage()}
        </div>
        
        {isAnalyzing && progress.step !== 'init' && (
          <div className="current-task">
            <span className="task-label">Current Task:</span> {currentStep.label}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusIndicator; 