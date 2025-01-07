import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { analyses, users, progressMetrics, achievements, userAchievements, leaderboard, challengeTemplates, userChallenges } from "@db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { differenceInDays, startOfWeek, getWeek, getYear, addDays } from "date-fns";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

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

  // Get available and active challenges for a user
  app.get("/api/users/:userId/challenges", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      // Get user's active challenges
      const activeChallenges = await db
        .select()
        .from(userChallenges)
        .where(eq(userChallenges.userId, userId))
        .innerJoin(
          challengeTemplates,
          eq(userChallenges.templateId, challengeTemplates.id)
        );

      // Get available challenge templates (not currently active for the user)
      const availableTemplates = await db
        .select()
        .from(challengeTemplates)
        .where(
          sql`NOT EXISTS (
            SELECT 1 FROM user_challenges
            WHERE user_challenges.template_id = challenge_templates.id
            AND user_challenges.user_id = ${userId}
            AND user_challenges.status = 'active'
          )`
        );

      // Format challenges for response
      const formattedChallenges = [
        ...activeChallenges.map(challenge => ({
          id: challenge.challengeTemplates.id,
          title: challenge.challengeTemplates.title,
          description: challenge.challengeTemplates.description,
          duration: challenge.challengeTemplates.duration,
          pointsReward: challenge.challengeTemplates.pointsReward,
          difficulty: challenge.challengeTemplates.difficulty,
          status: challenge.userChallenges.status,
          progress: challenge.userChallenges.progress,
          startDate: challenge.userChallenges.startDate,
          endDate: challenge.userChallenges.endDate,
        })),
        ...availableTemplates.map(template => ({
          id: template.id,
          title: template.title,
          description: template.description,
          duration: template.duration,
          pointsReward: template.pointsReward,
          difficulty: template.difficulty,
          status: 'available',
          progress: { current: 0, total: 0 },
          startDate: null,
          endDate: null,
        })),
      ];

      res.json(formattedChallenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  // Accept a challenge
  app.post("/api/challenges/accept", async (req, res) => {
    try {
      const { userId, templateId } = req.body;

      // Get the challenge template
      const [template] = await db
        .select()
        .from(challengeTemplates)
        .where(eq(challengeTemplates.id, templateId));

      if (!template) {
        return res.status(404).json({ message: "Challenge template not found" });
      }

      // Create user challenge
      const startDate = new Date();
      const endDate = addDays(startDate, template.duration);

      const [userChallenge] = await db
        .insert(userChallenges)
        .values({
          userId,
          templateId,
          startDate,
          endDate,
          status: 'active',
          progress: { current: 0, total: template.requirements.steps.length },
        })
        .returning();

      res.json(userChallenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to accept challenge" });
    }
  });

  // Updated route for generating skincare routines using DeepSeek
  app.post("/api/generate-routine", async (req, res) => {
    try {
      const { skinAnalysis, currentRoutine } = req.body;

      const prompt = `As an expert skincare routine optimizer, generate a personalized skincare routine based on this analysis:
        Skin Type: ${skinAnalysis.skinTone}
        Hydration Score: ${skinAnalysis.scores.hydration.value}
        Texture Score: ${skinAnalysis.scores.texture.value}
        Elasticity Score: ${skinAnalysis.scores.elasticity.value}
        Pigmentation Score: ${skinAnalysis.scores.pigmentation.value}
        Pore Health Score: ${skinAnalysis.scores.poreHealth.value}
        ${currentRoutine ? `Current Products: ${currentRoutine.join(", ")}` : ""}
        Primary Concerns: ${skinAnalysis.primaryConcerns.join(", ")}

        Focus on:
        1. Addressing the primary skin concerns
        2. Incorporating appropriate product types and active ingredients
        3. Proper ordering of products
        4. Frequency of use
        5. Consider any current routine products provided

        Return only a JSON object with the following structure:
        {
          "morningSteps": [{ "product": string, "purpose": string, "instructions": string, "alternativeProducts": string[] }],
          "eveningSteps": [{ "product": string, "purpose": string, "instructions": string, "alternativeProducts": string[] }],
          "weeklyTreatments": [{ "product": string, "purpose": string, "instructions": string, "alternativeProducts": string[] }],
          "estimatedDuration": { "morning": number, "evening": number },
          "skinConcerns": string[],
          "routineNotes": string[]
        }`;

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "You are a skincare expert AI assistant." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`DeepSeek API error: ${error}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No response content from DeepSeek");
      }

      const routineData = JSON.parse(content);

      // Process and validate the routine data
      const processedRoutine = {
        morningSteps: routineData.morningSteps.map((step: any, index: number) => ({
          ...step,
          order: index + 1,
          time: "morning"
        })),
        eveningSteps: routineData.eveningSteps.map((step: any, index: number) => ({
          ...step,
          order: index + 1,
          time: "evening"
        })),
        weeklyTreatments: routineData.weeklyTreatments.map((step: any, index: number) => ({
          ...step,
          order: index + 1,
          frequency: "weekly"
        })),
        estimatedDuration: routineData.estimatedDuration,
        skinConcerns: routineData.skinConcerns,
        routineNotes: routineData.routineNotes
      };

      res.json(processedRoutine);
    } catch (error: any) {
      console.error("Error generating routine:", error);
      res.status(500).json({ message: "Failed to generate skincare routine. Please try again." });
    }
  });

  // Chat endpoint for skin concerns
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      // Add system message to guide the AI's responses
      const chatMessages = [
        {
          role: "system",
          content: `You are a knowledgeable skincare expert assistant. Your role is to:
            1. Help users understand their skin concerns
            2. Provide evidence-based advice and recommendations
            3. Be empathetic and supportive
            4. Keep responses concise but informative
            5. Focus on gathering relevant information about skin conditions
            6. Suggest appropriate skincare routines and products
            7. Encourage users to seek professional medical advice for serious concerns

            Always maintain a professional yet friendly tone. If users describe potentially serious skin conditions, remind them that this is not medical advice and encourage them to consult a dermatologist.`
        },
        ...messages
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0].message;

      res.json({ message: response.content });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({
        message: "Failed to get response from the AI. Please try again.",
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}