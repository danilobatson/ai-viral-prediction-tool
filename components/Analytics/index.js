import React, { createContext, useContext, useEffect } from 'react';

// Simple analytics context for tracking user interactions
const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  useEffect(() => {
    // Initialize analytics tracking
    console.log('Analytics initialized');
  }, []);

  const trackEvent = (eventName, properties = {}) => {
    // Track user events (in real app, this would send to analytics service)
    console.log('Analytics Event:', eventName, properties);
  };

  const trackPageView = (pageName) => {
    // Track page views
    console.log('Analytics Page View:', pageName);
  };

  const value = {
    trackEvent,
    trackPageView,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export default AnalyticsProvider;
