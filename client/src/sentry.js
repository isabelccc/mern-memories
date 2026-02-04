// eslint-disable-next-line import/no-unresolved
import * as Sentry from '@sentry/react';

const initSentry = () => {
  // Only initialize Sentry in production
  if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of transactions in production
      // Session Replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
      environment: process.env.NODE_ENV,

      // Filter sensitive data
      beforeSend(event) {
        // Remove sensitive data from requests
        if (event.request) {
          const sanitizedEvent = { ...event };
          if (sanitizedEvent.request) {
            const { cookies, ...requestWithoutCookies } = sanitizedEvent.request;
            sanitizedEvent.request = requestWithoutCookies;
            if (sanitizedEvent.request.headers) {
              const { Authorization, ...headersWithoutAuth } = sanitizedEvent.request.headers;
              sanitizedEvent.request.headers = headersWithoutAuth;
            }
          }
          return sanitizedEvent;
        }
        return event;
      },

      // Ignore common non-critical errors
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'Network Error',
      ],
    });

    console.log('Sentry initialized for error tracking');
  }
};

export default initSentry;
