// README: analytics-service is part of the cloud-native Smart Productivity Task Manager
// microservices architecture and provides read-only task analytics from Firestore.
const express = require("express");
const analyticsRoutes = require("./routes/analyticsRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "analytics-service"
  });
});

app.use("/api/analytics", analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info("analytics-service started", { port: PORT });
});

function shutdown(signal) {
  logger.info("graceful shutdown started", { service: "analytics-service", signal });
  server.close((error) => {
    if (error) {
      logger.error("graceful shutdown failed", {
        service: "analytics-service",
        error: error.message
      });
      process.exit(1);
    }

    logger.info("http server closed", { service: "analytics-service" });
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
