import React, { useEffect, useRef } from 'react';
import { 
  Chart, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend,
  RadarController
} from 'chart.js';
import { METRIC_DESCRIPTIONS } from '../../constants/metrics';

// Register required Chart.js components
Chart.register(
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend,
  RadarController
);

/**
 * Radar chart component for visualizing metrics
 */
export default function MetricsRadarChart({ metrics }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    if (!metrics || metrics.length === 0) return;
    
    // Using a setTimeout to ensure the canvas is properly mounted in the DOM
    const timer = setTimeout(() => {
      // Get the canvas context - this is more reliable than using the element directly
      const canvas = chartRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Could not get canvas context');
        return;
      }
      
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // Format data for the radar chart
      const labels = metrics.map(([key]) => {
        // Format the metric key for display
        const metricKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        return METRIC_DESCRIPTIONS[key]?.title || metricKey;
      });
      
      const values = metrics.map(([, value]) => value);
      
      try {
        // Create the chart
        chartInstance.current = new Chart(ctx, {
          type: 'radar',
          data: {
            labels,
            datasets: [
              {
                label: 'Metrics',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)'
              }
            ]
          },
          options: {
            scales: {
              r: {
                angleLines: {
                  display: true
                },
                suggestedMin: 0,
                suggestedMax: 10,
                ticks: {
                  stepSize: 2
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Score: ${context.raw.toFixed(1)}/10`;
                  }
                }
              }
            },
            elements: {
              line: {
                tension: 0.2
              }
            },
            responsive: true,
            maintainAspectRatio: false
          }
        });
      } catch (error) {
        console.error('Error creating chart:', error);
      }
    }, 100); // Small delay to ensure DOM is ready
    
    // Cleanup
    return () => {
      clearTimeout(timer);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [metrics]);
  
  return (
    <div className="chart-container">
      <canvas ref={chartRef} />
    </div>
  );
} 