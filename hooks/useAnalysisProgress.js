import { useState, useCallback } from 'react';
import { ANALYSIS_STEPS } from '../utils/analysisSteps';

/**
 * Custom hook for managing analysis progress
 * @returns {Object} - Progress management functions and state
 */
export function useAnalysisProgress() {
  const [currentStep, setCurrentStep] = useState('init');
  const [percentComplete, setPercentComplete] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  
  /**
   * Start the analysis progress tracking
   */
  const startProgress = useCallback(() => {
    setCurrentStep('init');
    setPercentComplete(0);
    setStartTime(Date.now());
    setEndTime(null);
  }, []);
  
  /**
   * Update the progress with step and percentage
   * @param {Object} progressData - Progress data with step and progress percentage
   */
  const updateProgress = useCallback(({ step, progress }) => {
    setCurrentStep(step);
    setPercentComplete(progress);
    
    if (step === 'complete') {
      setEndTime(Date.now());
    }
  }, []);
  
  /**
   * Get the current step information
   * @returns {Object} - Current step information
   */
  const getCurrentStepInfo = useCallback(() => {
    const stepInfo = ANALYSIS_STEPS.find(s => s.id === currentStep) || ANALYSIS_STEPS[0];
    return {
      id: stepInfo.id,
      label: stepInfo.label,
      progress: percentComplete
    };
  }, [currentStep, percentComplete]);
  
  /**
   * Get the analysis duration in seconds
   * @returns {number} - Duration in seconds
   */
  const getAnalysisDuration = useCallback(() => {
    if (!startTime) return 0;
    const end = endTime || Date.now();
    return Math.round((end - startTime) / 1000);
  }, [startTime, endTime]);
  
  return {
    currentStep,
    percentComplete,
    startProgress,
    updateProgress,
    getCurrentStepInfo,
    getAnalysisDuration,
    isComplete: currentStep === 'complete'
  };
} 