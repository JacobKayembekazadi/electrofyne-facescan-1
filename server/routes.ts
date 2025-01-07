import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { analyses, users, progressMetrics, achievements, userAchievements, leaderboard } from "@db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { differenceInDays, startOfWeek, getWeek, getYear } from "date-fns";

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

      // Update user's streak
      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, userId));

      const now = new Date();
      let newStreak = user.currentStreak;
      let newLongestStreak = user.longestStreak;

      if (user.lastActivityDate) {
        const daysSinceLastActivity = differenceInDays(now, new Date(user.lastActivityDate));
        if (daysSinceLastActivity <= 1) {
          // Maintain or increase streak
          newStreak += 1;
          if (newStreak > newLongestStreak) {
            newLongestStreak = newStreak;
          }
        } else {
          // Break streak
          newStreak = 1;
        }
      } else {
        // First activity
        newStreak = 1;
        newLongestStreak = 1;
      }

      // Update user streak and points
      const pointsEarned = 10 + (newStreak * 2); // Bonus points for streak
      const newTotalPoints = user.totalPoints + pointsEarned;
      const newLevel = Math.floor(newTotalPoints / 100) + 1;

      await db.update(users)
        .set({
          totalPoints: newTotalPoints,
          level: newLevel,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastActivityDate: now,
        })
        .where(eq(users.id, userId));

      // Update leaderboard
      const weekNumber = getWeek(now);
      const year = getYear(now);

      await db.insert(leaderboard)
        .values({
          userId,
          score: newTotalPoints,
          rank: 0, // Will be updated by the ranking query
          weekNumber,
          year,
        })
        .onConflictDoUpdate({
          target: [leaderboard.userId, leaderboard.weekNumber, leaderboard.year],
          set: {
            score: newTotalPoints,
          },
        });

      // Update rankings for all users
      await db.execute(sql`
        WITH RankedUsers AS (
          SELECT id, ROW_NUMBER() OVER (ORDER BY score DESC) as new_rank
          FROM leaderboard
          WHERE week_number = ${weekNumber} AND year = ${year}
        )
        UPDATE leaderboard l
        SET rank = ru.new_rank
        FROM RankedUsers ru
        WHERE l.id = ru.id
        AND l.week_number = ${weekNumber}
        AND l.year = ${year}
      `);

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

  // Get leaderboard data
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const now = new Date();
      const weekNumber = getWeek(now);
      const year = getYear(now);

      const leaderboardData = await db
        .select({
          userId: users.id,
          username: users.username,
          score: leaderboard.score,
          rank: leaderboard.rank,
          currentStreak: users.currentStreak,
        })
        .from(leaderboard)
        .innerJoin(users, eq(leaderboard.userId, users.id))
        .where(
          and(
            eq(leaderboard.weekNumber, weekNumber),
            eq(leaderboard.year, year)
          )
        )
        .orderBy(leaderboard.rank);

      res.json(leaderboardData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}