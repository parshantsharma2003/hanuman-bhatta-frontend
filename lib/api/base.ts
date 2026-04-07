const LOCAL_API_BASE_URL = 'http://localhost:5000/api/v1';
const PRODUCTION_API_BASE_URL = 'https://hanuman-bhatta-backend.onrender.com/api/v1';

export function getApiBaseUrl(rawUrl?: string | null): string {
  const candidate = (rawUrl || '').trim() || (process.env.NODE_ENV === 'production' ? PRODUCTION_API_BASE_URL : LOCAL_API_BASE_URL);

  try {
    const url = new URL(candidate);

    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/api/v1';
    } else if (!url.pathname.includes('/api/v1')) {
      url.pathname = `${url.pathname.replace(/\/$/, '')}/api/v1`;
    }

    return url.toString().replace(/\/$/, '');
  } catch {
    const normalized = candidate.replace(/\/$/, '');
    return normalized.includes('/api/v1') ? normalized : `${normalized}/api/v1`;
  }
}