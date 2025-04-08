import '../styles/globals.css';
import '../styles/MetricsDisplay.css';
import '../styles/components/ProgressBar.css';
import '../styles/components/StatusIndicator.css';
import '../styles/components/MetricsRadarChart.css';
import '../styles/components/ErrorBoundary.css';
import Layout from '../components/layout/Layout';
import { AnalysisProvider } from '../context/AnalysisContext';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { useEffect } from 'react';

/**
 * Custom App component for Next.js
 */
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Add global error handler for uncaught errors
    const errorHandler = (event) => {
      console.error('Unhandled error:', event.error || event.message);
      // You could send this to an error tracking service
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, []);

  return (
    <ErrorBoundary>
      <AnalysisProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AnalysisProvider>
    </ErrorBoundary>
  );
}

export default MyApp; 