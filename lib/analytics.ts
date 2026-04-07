export type AnalyticsMetricType =
  | 'whatsapp_click'
  | 'call_click'
  | 'order_click'
  | 'calculator_use';

import { API } from './api/client';

export const trackMetric = (metricType: AnalyticsMetricType): void => {
  try {
    API.post('/analytics/track', { metricType }).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Analytics] Track request failed:', metricType, error);
      }
    });
  } catch (error) {
    // Fail silently for analytics - should never block user interaction
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Analytics] Track error:', error);
    }
  }
};
