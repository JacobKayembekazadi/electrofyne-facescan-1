import { pgTable, text, serial, timestamp, integer, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = typeof analyses.$inferInsert;
export type ProgressMetric = typeof progressMetrics.$inferSelect;
export type InsertProgressMetric = typeof progressMetrics.$inferInsert;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertAnalysisSchema = createInsertSchema(analyses);
export const selectAnalysisSchema = createSelectSchema(analyses);
export const insertProgressMetricSchema = createInsertSchema(progressMetrics);
export const selectProgressMetricSchema = createSelectSchema(progressMetrics);