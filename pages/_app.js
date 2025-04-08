import '../styles/globals.css';
import '../styles/MetricsDisplay.css';
import '../styles/components/ProgressBar.css';
import '../styles/components/StatusIndicator.css';
import '../styles/components/MetricsRadarChart.css';
import Layout from '../components/layout/Layout';
import { AnalysisProvider } from '../context/AnalysisContext';

/**
 * Custom App component for Next.js
 */
function MyApp({ Component, pageProps }) {
  return (
    <AnalysisProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AnalysisProvider>
  );
}

export default MyApp; 