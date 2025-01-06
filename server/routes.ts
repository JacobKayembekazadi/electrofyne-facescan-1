import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { analyses, users } from "@db/schema";
import { eq } from "drizzle-orm";

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
      
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to create analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
