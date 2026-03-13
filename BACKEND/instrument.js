const Sentry = require("@sentry/node");

// Initialize Sentry as early as possible
Sentry.init({
  dsn: process.env.SENTRY_DSN || "https://a3eff84a2d72de120181dcc1cdccc941@o4510204639707136.ingest.us.sentry.io/4510204648554496",
  sendDefaultPii: true,
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.0),
});

module.exports = { Sentry };


