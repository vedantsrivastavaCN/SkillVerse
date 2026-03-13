<<<<<<< HEAD
const { Sentry } = require("./instrument"); // Initialize Sentry before anything else and access handlers
=======
>>>>>>> 987e8450bb5840f6bbcc9ac5d1d9b9ffb342e029
const express = require("express");

const app = express();

const userRoutes = require("./routes/User");
const paymentRoutes = require("./routes/Payments");
const profileRoutes = require("./routes/Profile");
const CourseRoutes = require("./routes/Course");

const database = require("./config/database");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const fileUpload = require("express-fileupload");
const { cloudnairyconnect } = require("./config/cloudinary");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;
database.connect();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: JSON.parse(process.env.CORS_ORIGIN),
    credentials: true,
    maxAge: 14400,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

cloudnairyconnect();

app.use("/api/v1/auth", userRoutes);

app.use("/api/v1/payment", paymentRoutes);

app.use("/api/v1/profile", profileRoutes);

app.use("/api/v1/course", CourseRoutes);

app.use("/api/v1/contact", require("./routes/ContactUs"));

<<<<<<< HEAD
// Webhooks
app.use("/webhook", require("./routes/Webhook"));

=======
>>>>>>> 987e8450bb5840f6bbcc9ac5d1d9b9ffb342e029
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

<<<<<<< HEAD
// ------------------------------------------------------------
// Sentry Test
// Simple test route to create a Sentry issue without crashing the app
app.get("/test-sentry", (req, res) => {
  Sentry.captureException(new Error("Manual Sentry test issue"));
  res.status(200).json({ sentry: true });
});

// Fallback error middleware to ensure consistent error responses
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
// ------------------------------------------------------------
// Sentry Test End

=======
>>>>>>> 987e8450bb5840f6bbcc9ac5d1d9b9ffb342e029
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
