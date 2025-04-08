import React from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Main layout component for the application
 */
export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      
      <main className="app-main">
        {children}
      </main>
      
      <Footer />
    </div>
  );
} 