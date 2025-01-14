import express from "express";
import { log, setupVite } from "./vite";
import { createServer } from "http";
import { registerRoutes } from "./routes";

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// Basic middleware
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Create HTTP server
const server = createServer(app);

// Setup routes
registerRoutes(app);

// Setup Vite only in development
if (process.env.NODE_ENV !== "production") {
  setupVite(app, server).catch((err) => {
    console.error("Failed to setup Vite:", err);
    process.exit(1);
  });
}

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
server.listen(PORT, "0.0.0.0", () => {
  log(`Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle server errors
server.on('error', (error: Error) => {
  console.error('Server error:', error);
  process.exit(1);
});