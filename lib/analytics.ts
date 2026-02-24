export type AnalyticsMetricType =
  | 'whatsapp_click'
  | 'call_click'
  | 'order_click'
  | 'calculator_use';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const trackMetric = (metricType: AnalyticsMetricType): void => {
  const url = `${API_BASE_URL}/analytics/track`;
  const payload = JSON.stringify({ metricType });

  try {
    // Prefer fetch with keepalive for better reliability
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
      keepalive: true,
    }).catch((error) => {
      // Log to console in development only
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Analytics] Track request failed:', metricType, error);
      }
      // Fail silently in production
    });
  } catch (error) {
    // Fail silently for analytics - should never block user interaction
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Analytics] Track error:', error);
    }
  }
};
