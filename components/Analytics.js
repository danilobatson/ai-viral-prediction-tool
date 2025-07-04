/**
 * Simple Analytics Component
 * Phase 3.2: Frontend Interface Development
 */

import { useEffect } from 'react';

export function trackEvent(eventName, properties = {}) {
  // Simple console logging for now - can be replaced with Google Analytics, Mixpanel, etc.
  console.log('Analytics Event:', eventName, properties);
  
  // Store in localStorage for basic tracking
  try {
    const events = JSON.parse(localStorage.getItem('viral-prediction-events') || '[]');
    events.push({
      event: eventName,
      properties,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('viral-prediction-events', JSON.stringify(events.slice(-100))); // Keep last 100 events
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

export function AnalyticsProvider({ children }) {
  useEffect(() => {
    // Track page load
    trackEvent('page_load', {
      page: 'viral-prediction-tool',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }, []);

  return children;
}
