import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { analyses, users, progressMetrics, achievements, userAchievements } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

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
        hydrationScore: results.hydrationLevel.toString(),
        textureScore: results.textureScore.toString(),
        brightnessScore: results.brightnessScore.toString(),
        overallHealth: ((results.hydrationLevel + results.textureScore + results.brightnessScore) / 3).toString(),
      };

      await db.insert(progressMetrics).values(metrics);

      // Check for achievements
      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, userId));

      // Award points for completion
      const pointsEarned = 10;
      const newTotalPoints = user.totalPoints + pointsEarned;
      const newLevel = Math.floor(newTotalPoints / 100) + 1;

      // Update user level and points
      await db.update(users)
        .set({
          totalPoints: newTotalPoints,
          level: newLevel,
        })
        .where(eq(users.id, userId));

      // Check for new achievements
      const potentialAchievements = await db.select()
        .from(achievements)
        .where(eq(achievements.type, 'overall'));

      for (const achievement of potentialAchievements) {
        const overallHealthNum = parseFloat(metrics.overallHealth);
        const requiredScoreNum = parseFloat(achievement.requiredScore.toString());

        if (overallHealthNum >= requiredScoreNum) {
          // Check if user already has this achievement
          const existingAchievements = await db.select()
            .from(userAchievements)
            .where(
              and(
                eq(userAchievements.userId, userId),
                eq(userAchievements.achievementId, achievement.id)
              )
            );

          if (existingAchievements.length === 0) {
            await db.insert(userAchievements)
              .values({
                userId,
                achievementId: achievement.id,
              });
          }
        }
      }

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

  // Get user achievements
  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      // Get user info
      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, userId));

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get user's achievements
      const userAchievementsData = await db
        .select({
          id: achievements.id,
          name: achievements.name,
          description: achievements.description,
          icon: achievements.icon,
          unlockedAt: userAchievements.unlockedAt,
        })
        .from(achievements)
        .innerJoin(
          userAchievements,
          eq(achievements.id, userAchievements.achievementId)
        )
        .where(eq(userAchievements.userId, userId));

      res.json({
        level: user.level,
        totalPoints: user.totalPoints,
        achievements: userAchievementsData,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}