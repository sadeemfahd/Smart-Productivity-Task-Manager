const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    service: "Task Service",
    status: "ok"
  });
});

app.use("/api/tasks", taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Task Service is running on port ${PORT}`);
});

function shutdown(signal) {
  console.log(`[task-service] Received ${signal}. Starting graceful shutdown...`);
  server.close((error) => {
    if (error) {
      console.error("[task-service] Graceful shutdown failed", error);
      process.exit(1);
    }
    console.log("[task-service] HTTP server closed successfully.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
