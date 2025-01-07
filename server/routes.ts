import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { analyses, users, progressMetrics } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Get user analyses
  app.get("/api/analyses/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userAnalyses = await db.select()
        .from(analyses)
        .where(eq(analyses.userId, userId))
        .orderBy(analyses.createdAt);

      res.json(userAnalyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analyses" });
    }
  });

  // Create new analysis
  app.post("/api/analyses", async (req, res) => {
    try {
      const { userId, imageUrl, results, recommendations } = req.body;

      const [analysis] = await db.insert(analyses)
        .values({
          userId,
          imageUrl,
          results,
          recommendations,
        })
        .returning();

      // Calculate and store progress metrics
      const metrics = {
        analysisId: analysis.id,
        userId,
        hydrationScore: results.hydrationLevel || 0,
        textureScore: results.textureScore || 0,
        brightnessScore: results.brightnessScore || 0,
        overallHealth: (results.hydrationLevel + results.textureScore + results.brightnessScore) / 3,
      };

      await db.insert(progressMetrics).values(metrics);

      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to create analysis" });
    }
  });

  // Get user progress metrics
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const metrics = await db.select()
        .from(progressMetrics)
        .where(eq(progressMetrics.userId, userId))
        .orderBy(desc(progressMetrics.createdAt));

      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress metrics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}