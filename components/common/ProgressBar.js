import React from 'react';

/**
 * Enhanced progress bar component with improved visuals
 * @param {number} progress - Current progress percentage (0-100)
 * @param {string} step - Current step label
 * @param {boolean} showLabel - Whether to show percentage label
 * @param {number} height - Height of the progress bar in pixels
 * @param {boolean} isAnimated - Whether to add animation effects
 * @param {boolean} showStepInfo - Whether to display step information
 */
const ProgressBar = ({ 
  progress, 
  step = '', 
  showLabel = true, 
  height = 12, 
  isAnimated = true,
  showStepInfo = true
}) => {
  // Ensure progress is within 0-100 range
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  // Determine color based on progress
  const getProgressColor = () => {
    if (normalizedProgress < 30) return 'var(--progress-start)';
    if (normalizedProgress < 70) return 'var(--progress-mid)';
    return 'var(--progress-end)';
  };

  return (
    <div className="progress-container">
      {showStepInfo && step && (
        <div className="step-info">
          <span className="step-label">{step}</span>
        </div>
      )}
      
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ height: `${height}px`, borderRadius: `${height/2}px` }}>
          <div 
            className={`progress-fill ${isAnimated ? 'animated' : ''}`}
            style={{ 
              width: `${normalizedProgress}%`,
              borderRadius: `${height/2}px`
            }}
          >
            {isAnimated && normalizedProgress > 5 && normalizedProgress < 95 && (
              <div className="shimmer-effect"></div>
            )}
          </div>
        </div>
        
        {showLabel && (
          <div className="progress-label">
            {Math.round(normalizedProgress)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar; 