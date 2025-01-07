import { pgTable, text, serial, timestamp, integer, jsonb, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  totalPoints: integer("total_points").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastActivityDate: timestamp("last_activity_date"),
});

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  imageUrl: text("image_url").notNull(),
  results: jsonb("results").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const progressMetrics = pgTable("progress_metrics", {
  id: serial("id").primaryKey(),
  analysisId: integer("analysis_id").references(() => analyses.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  hydrationScore: decimal("hydration_score").notNull(),
  textureScore: decimal("texture_score").notNull(),
  brightnessScore: decimal("brightness_score").notNull(),
  overallHealth: decimal("overall_health").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requiredScore: decimal("required_score").notNull(),
  type: text("type").notNull(), // 'hydration', 'texture', 'brightness', 'overall'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  score: integer("score").notNull(),
  rank: integer("rank").notNull(),
  weekNumber: integer("week_number").notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const challengeTemplates = pgTable("challenge_templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // in days
  pointsReward: integer("points_reward").notNull(),
  requirements: jsonb("requirements").notNull(),
  difficulty: text("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  templateId: integer("template_id").references(() => challengeTemplates.id).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  status: text("status").notNull(), // 'active', 'completed', 'failed'
  progress: jsonb("progress").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const skinHealthScores = pgTable("skin_health_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  analysisId: integer("analysis_id").references(() => analyses.id).notNull(),
  // Core metrics (0-100 scale)
  hydrationScore: decimal("hydration_score").notNull(),
  textureScore: decimal("texture_score").notNull(),
  elasticityScore: decimal("elasticity_score").notNull(),
  pigmentationScore: decimal("pigmentation_score").notNull(),
  poreHealthScore: decimal("pore_health_score").notNull(),
  // Composite scores
  overallHealth: decimal("overall_health").notNull(),
  // Additional metadata
  skinTone: text("skin_tone").notNull(), // Fitzpatrick scale (I-VI)
  primaryConcerns: jsonb("primary_concerns").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const errorLogs = pgTable("error_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  error: text("error").notNull(),
  stack: text("stack"),
  metadata: jsonb("metadata"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = typeof analyses.$inferInsert;
export type ProgressMetric = typeof progressMetrics.$inferSelect;
export type InsertProgressMetric = typeof progressMetrics.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;
export type Leaderboard = typeof leaderboard.$inferSelect;
export type InsertLeaderboard = typeof leaderboard.$inferInsert;
export type ChallengeTemplate = typeof challengeTemplates.$inferSelect;
export type InsertChallengeTemplate = typeof challengeTemplates.$inferInsert;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type InsertUserChallenge = typeof userChallenges.$inferInsert;
export type SkinHealthScore = typeof skinHealthScores.$inferSelect;
export type InsertSkinHealthScore = typeof skinHealthScores.$inferInsert;
export type ErrorLog = typeof errorLogs.$inferSelect;
export type InsertErrorLog = typeof errorLogs.$inferInsert;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertAnalysisSchema = createInsertSchema(analyses);
export const selectAnalysisSchema = createSelectSchema(analyses);
export const insertProgressMetricSchema = createInsertSchema(progressMetrics);
export const selectProgressMetricSchema = createSelectSchema(progressMetrics);
export const insertAchievementSchema = createInsertSchema(achievements);
export const selectAchievementSchema = createSelectSchema(achievements);
export const insertUserAchievementSchema = createInsertSchema(userAchievements);
export const selectUserAchievementSchema = createSelectSchema(userAchievements);
export const insertLeaderboardSchema = createInsertSchema(leaderboard);
export const selectLeaderboardSchema = createSelectSchema(leaderboard);
export const insertChallengeTemplateSchema = createInsertSchema(challengeTemplates);
export const selectChallengeTemplateSchema = createSelectSchema(challengeTemplates);
export const insertUserChallengeSchema = createInsertSchema(userChallenges);
export const selectUserChallengeSchema = createSelectSchema(userChallenges);
export const insertSkinHealthScoreSchema = createInsertSchema(skinHealthScores);
export const selectSkinHealthScoreSchema = createSelectSchema(skinHealthScores);
export const insertErrorLogSchema = createInsertSchema(errorLogs);
export const selectErrorLogSchema = createSelectSchema(errorLogs);