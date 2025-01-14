import express from "express";
import compression from 'compression';
import { log } from "./vite";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(compression());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, "0.0.0.0", () => {
  log(`Server started on port ${PORT}`);
});