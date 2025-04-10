import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  gender: text("gender").notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  payments: many(payments),
  userMessages: many(userMessages)
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  gender: true,
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  for_boys_message: text("for_boys_message"),
  for_girls_message: text("for_girls_message"),
  for_boys_image_url: text("for_boys_image_url"),
  for_girls_image_url: text("for_girls_image_url"),
  isPremium: boolean("is_premium").default(false).notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  for_boys_message: true,
  for_girls_message: true,
  for_boys_image_url: true,
  for_girls_image_url: true,
  isPremium: true,
  category: true,
});

// Payment table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  verified: boolean("verified").default(false).notNull(),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id]
  }),
}));

export const insertPaymentSchema = createInsertSchema(payments).pick({
  userId: true,
  amount: true,
  transactionId: true,
});

// User messages table
export const userMessages = pgTable("user_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  imageUrl: text("image_url"),
  isUserMessage: boolean("is_user_message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userMessagesRelations = relations(userMessages, ({ one }) => ({
  user: one(users, {
    fields: [userMessages.userId],
    references: [users.id]
  }),
}));

export const insertUserMessageSchema = createInsertSchema(userMessages).pick({
  userId: true,
  message: true,
  imageUrl: true,
  isUserMessage: true,
});

// App configuration table - stores dynamic app settings
export const appConfig = pgTable("app_config", {
  id: serial("id").primaryKey(),
  supabaseUrl: text("supabase_url").notNull(),
  supabaseKey: text("supabase_key").notNull(),
  upiId: text("upi_id").notNull(),
  upiDeepLink: text("upi_deep_link").notNull(),
  qrImage: text("qr_image").notNull(),
  premiumEnabled: boolean("premium_enabled").default(true).notNull(),
  girlName: text("girl_name").default('Ananya').notNull(),
  boyName: text("boy_name").default('Rahul').notNull(),
  girlMessagesTable: text("girl_messages_table").default('girl_messages').notNull(),
  boyMessagesTable: text("boy_messages_table").default('boy_messages').notNull(),
  welcomeMessage: text("welcome_message").notNull(),
  homeBannerText: text("home_banner_text").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAppConfigSchema = createInsertSchema(appConfig).pick({
  supabaseUrl: true,
  supabaseKey: true,
  upiId: true,
  upiDeepLink: true,
  qrImage: true,
  premiumEnabled: true,
  girlName: true,
  boyName: true,
  girlMessagesTable: true,
  boyMessagesTable: true,
  welcomeMessage: true,
  homeBannerText: true,
});

// Feature flags table - controls which features are enabled
export const featureFlags = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  enabled: boolean("enabled").default(true).notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFeatureFlagsSchema = createInsertSchema(featureFlags).pick({
  name: true,
  enabled: true,
  description: true,
});

// Content management table - for dynamic content like homepage sections
export const contentBlocks = pgTable("content_blocks", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  contentType: text("content_type").default('text').notNull(), // text, html, json
  active: boolean("active").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertContentBlocksSchema = createInsertSchema(contentBlocks).pick({
  identifier: true,
  title: true,
  content: true,
  contentType: true,
  active: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type UserMessage = typeof userMessages.$inferSelect;
export type InsertUserMessage = z.infer<typeof insertUserMessageSchema>;

export type AppConfig = typeof appConfig.$inferSelect;
export type InsertAppConfig = z.infer<typeof insertAppConfigSchema>;

export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagsSchema>;

export type ContentBlock = typeof contentBlocks.$inferSelect;
export type InsertContentBlock = z.infer<typeof insertContentBlocksSchema>;
