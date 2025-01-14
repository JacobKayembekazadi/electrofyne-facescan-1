import express from "express";
import cors from "cors";
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { registerRoutes } from "./routes";
import session from "express-session";
import MemoryStore from "memorystore";

// Initialize express app
const app = express();

// Create HTTP server
const server = createServer(app);

// Session store setup
const SessionStore = MemoryStore(session);

// Basic middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session({
  secret: 'electrofyne-secret',
  resave: false,
  saveUninitialized: false,
  store: new SessionStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
});

// API health check route
app.get("/api/health", (_req, res) => {
  res.json({ status: "healthy" });
});

// Register API routes
registerRoutes(app);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({
    message: "Internal server error",
  });
});

// Start server
(async () => {
  try {
    // Setup Vite or static files based on environment
    if (process.env.NODE_ENV !== "production") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
    server.listen(PORT, "0.0.0.0", () => {
      log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();