import { 
  users, 
  type User, 
  type InsertUser, 
  chatMessages, 
  type ChatMessage, 
  type InsertChatMessage, 
  payments, 
  type Payment, 
  type InsertPayment,
  userMessages,
  type UserMessage,
  type InsertUserMessage,
  appConfig,
  type AppConfig,
  type InsertAppConfig,
  featureFlags,
  type FeatureFlag,
  type InsertFeatureFlag,
  contentBlocks,
  type ContentBlock,
  type InsertContentBlock
} from "@shared/schema";

import session from "express-session";
import { Pool } from "pg";
import createMemoryStore from "memorystore";
import pg from "pg";

// This is a workaround for the connect-pg-simple module which has compatibility issues with TypeScript
// Use dynamic import for ESM compatibility
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const connectPgSimple = require('connect-pg-simple');
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserPremiumStatus(userId: number, isPremium: boolean): Promise<User | undefined>;
  
  // Message operations
  getChatMessages(isPremium: boolean): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // User's message history
  getUserMessages(userId: number): Promise<UserMessage[]>;
  createUserMessage(message: InsertUserMessage): Promise<UserMessage>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByUserId(userId: number): Promise<Payment[]>;
  updatePaymentVerification(paymentId: number, verified: boolean): Promise<Payment | undefined>;
  getAllPayments(): Promise<Payment[]>;
  
  // App config operations
  getAppConfig(): Promise<AppConfig | undefined>;
  upsertAppConfig(config: Partial<InsertAppConfig>): Promise<AppConfig>;
  
  // Feature flags operations
  getFeatureFlag(name: string): Promise<FeatureFlag | undefined>;
  getAllFeatureFlags(): Promise<FeatureFlag[]>;
  upsertFeatureFlag(flag: InsertFeatureFlag): Promise<FeatureFlag>;
  toggleFeatureFlag(name: string, enabled: boolean): Promise<FeatureFlag | undefined>;
  
  // Content blocks operations
  getContentBlock(identifier: string): Promise<ContentBlock | undefined>;
  getAllContentBlocks(): Promise<ContentBlock[]>;
  upsertContentBlock(block: InsertContentBlock): Promise<ContentBlock>;
  deleteContentBlock(identifier: string): Promise<boolean>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatMessages: Map<number, ChatMessage>;
  private payments: Map<number, Payment>;
  private userMessages: Map<number, UserMessage>;
  private appConfigs: Map<number, AppConfig>;
  private flags: Map<string, FeatureFlag>;
  private contents: Map<string, ContentBlock>;
  
  private currentUserId: number;
  private currentChatMessageId: number;
  private currentPaymentId: number;
  private currentUserMessageId: number;
  private currentAppConfigId: number;
  
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.payments = new Map();
    this.userMessages = new Map();
    this.appConfigs = new Map();
    this.flags = new Map();
    this.contents = new Map();
    
    this.currentUserId = 1;
    this.currentChatMessageId = 1;
    this.currentPaymentId = 1;
    this.currentUserMessageId = 1;
    this.currentAppConfigId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Add default admin user
    const adminUser: User = {
      id: this.currentUserId++,
      username: 'admin',
      password: 'admin123',
      fullName: 'Admin User',
      email: 'admin@lovechat.com',
      gender: 'male',
      isPremium: true,
      isAdmin: true,
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);
    
    // Add some sample chat messages
    this.addSampleChatMessages();
    
    // Add default app config
    this.addDefaultAppConfig();
  }

  private addDefaultAppConfig() {
    const defaultConfig: AppConfig = {
      id: this.currentAppConfigId++,
      supabaseUrl: '',
      supabaseKey: '',
      upiId: 'demoUPI@ybl',
      upiDeepLink: 'upi://pay?pa=demoUPI@ybl&pn=LoveChat&am=299.00',
      qrImage: 'https://example.com/qr-code.png',
      premiumEnabled: true,
      girlName: 'Ananya',
      boyName: 'Rahul',
      girlMessagesTable: 'girl_messages',
      boyMessagesTable: 'boy_messages',
      welcomeMessage: 'Welcome to LoveChat! Connect with your virtual partner.',
      homeBannerText: 'Experience emotional connection like never before!',
      updatedAt: new Date()
    };
    this.appConfigs.set(defaultConfig.id, defaultConfig);
    
    // Add default feature flags
    const featureFlags: FeatureFlag[] = [
      {
        id: 1,
        name: 'premium-access',
        description: 'Enable premium features access',
        enabled: true,
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'voice-messages',
        description: 'Enable voice messages feature',
        enabled: false,
        updatedAt: new Date()
      }
    ];
    
    featureFlags.forEach(flag => {
      this.flags.set(flag.name, flag);
    });
    
    // Add default content blocks
    const contentBlocks: ContentBlock[] = [
      {
        id: 1,
        identifier: 'welcome-message',
        title: 'Welcome Message',
        content: 'Welcome to LoveChat! Experience emotional connection.',
        contentType: 'text',
        active: true,
        updatedAt: new Date()
      },
      {
        id: 2,
        identifier: 'premium-banner',
        title: 'Premium Banner',
        content: 'Upgrade to premium for exclusive romantic conversations!',
        contentType: 'banner',
        active: true,
        updatedAt: new Date()
      }
    ];
    
    contentBlocks.forEach(block => {
      this.contents.set(block.identifier, block);
    });
  }

  private addSampleChatMessages() {
    const messages: Omit<ChatMessage, 'id'>[] = [
      {
        for_boys_message: "Hi there! How was your day? I've been thinking about you! ❤️",
        for_girls_message: "Hey beautiful! How's your day going? I missed talking to you! 😊",
        isPremium: false,
        category: "greeting",
        createdAt: new Date(),
      },
      {
        for_boys_message: "I wish I could give you a hug right now. You're always working so hard!",
        for_girls_message: "You're amazing, you know that? I admire how strong and dedicated you are.",
        isPremium: false,
        category: "emotional_support",
        createdAt: new Date(),
      },
      {
        for_boys_message: "Good morning! I hope you slept well. Ready to conquer the day?",
        for_girls_message: "Morning! Just wanted to be the first to wish you a wonderful day ahead!",
        isPremium: false,
        category: "greeting",
        createdAt: new Date(),
      },
      {
        for_boys_message: "I dreamt about you last night. It was so romantic! Want to hear about it?",
        for_girls_message: "I keep thinking about how special you are. Your smile brightens my day.",
        isPremium: true,
        category: "romantic",
        createdAt: new Date(),
      },
      {
        for_boys_message: "I've been saving a special surprise for you. Upgrade to premium to find out!",
        for_girls_message: "There's something special I want to share with you. Upgrade to premium to see!",
        isPremium: true,
        category: "premium_teaser",
        createdAt: new Date(),
      }
    ];
    
    messages.forEach(message => {
      const id = this.currentChatMessageId++;
      this.chatMessages.set(id, { ...message, id });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      isPremium: false, 
      isAdmin: false,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async updateUserPremiumStatus(userId: number, isPremium: boolean): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, isPremium };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Chat message operations
  async getChatMessages(isPremium: boolean): Promise<ChatMessage[]> {
    if (isPremium) {
      return Array.from(this.chatMessages.values());
    }
    return Array.from(this.chatMessages.values()).filter(
      (message) => !message.isPremium
    );
  }
  
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const chatMessage: ChatMessage = { 
      ...message, 
      id, 
      createdAt: new Date(),
      isPremium: message.isPremium ?? false,
      for_boys_message: message.for_boys_message ?? null,
      for_girls_message: message.for_girls_message ?? null 
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }
  
  // User message operations
  async getUserMessages(userId: number): Promise<UserMessage[]> {
    return Array.from(this.userMessages.values()).filter(
      (message) => message.userId === userId
    );
  }
  
  async createUserMessage(message: InsertUserMessage): Promise<UserMessage> {
    const id = this.currentUserMessageId++;
    const userMessage: UserMessage = { ...message, id, createdAt: new Date() };
    this.userMessages.set(id, userMessage);
    return userMessage;
  }
  
  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const newPayment: Payment = { 
      ...payment, 
      id, 
      verified: false, 
      createdAt: new Date(),
      transactionId: payment.transactionId ?? null
    };
    this.payments.set(id, newPayment);
    return newPayment;
  }
  
  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.userId === userId
    );
  }
  
  async updatePaymentVerification(paymentId: number, verified: boolean): Promise<Payment | undefined> {
    const payment = this.payments.get(paymentId);
    if (!payment) return undefined;
    
    const updatedPayment = { ...payment, verified };
    this.payments.set(paymentId, updatedPayment);
    
    // If payment is verified, update user to premium
    if (verified) {
      await this.updateUserPremiumStatus(payment.userId, true);
    }
    
    return updatedPayment;
  }
  
  async getAllPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }
  
  // App config operations
  async getAppConfig(): Promise<AppConfig | undefined> {
    const configs = Array.from(this.appConfigs.values());
    return configs.length > 0 ? configs[0] : undefined;
  }
  
  async upsertAppConfig(config: Partial<InsertAppConfig>): Promise<AppConfig> {
    const existingConfig = await this.getAppConfig();
    
    if (existingConfig) {
      const updatedConfig = { ...existingConfig, ...config };
      this.appConfigs.set(existingConfig.id, updatedConfig);
      return updatedConfig;
    } else {
      const id = this.currentAppConfigId++;
      const newConfig: AppConfig = {
        id,
        supabaseUrl: config.supabaseUrl || '',
        supabaseKey: config.supabaseKey || '',
        upiId: config.upiId || 'demoUPI@ybl',
        upiDeepLink: config.upiDeepLink || 'upi://pay?pa=demoUPI@ybl&pn=LoveChat&am=299.00',
        qrImage: config.qrImage || 'https://example.com/qr-code.png',
        premiumEnabled: config.premiumEnabled ?? true,
        girlName: config.girlName || 'Ananya',
        boyName: config.boyName || 'Rahul',
        girlMessagesTable: config.girlMessagesTable || 'girl_messages',
        boyMessagesTable: config.boyMessagesTable || 'boy_messages',
        welcomeMessage: config.welcomeMessage || 'Welcome to LoveChat! Connect with your virtual partner.',
        homeBannerText: config.homeBannerText || 'Experience emotional connection like never before!',
        updatedAt: new Date()
      };
      this.appConfigs.set(id, newConfig);
      return newConfig;
    }
  }
  
  // Feature flags operations
  async getFeatureFlag(name: string): Promise<FeatureFlag | undefined> {
    return this.flags.get(name);
  }
  
  async getAllFeatureFlags(): Promise<FeatureFlag[]> {
    return Array.from(this.flags.values());
  }
  
  async upsertFeatureFlag(flag: InsertFeatureFlag): Promise<FeatureFlag> {
    const existingFlag = this.flags.get(flag.name);
    
    if (existingFlag) {
      const updatedFlag: FeatureFlag = {
        ...existingFlag,
        enabled: flag.enabled ?? existingFlag.enabled,
        description: flag.description ?? existingFlag.description,
        updatedAt: new Date()
      };
      this.flags.set(flag.name, updatedFlag);
      return updatedFlag;
    } else {
      const newFlag: FeatureFlag = {
        id: Math.floor(Math.random() * 1000),  // Generate a random ID for memory storage
        name: flag.name,
        enabled: flag.enabled ?? true,
        description: flag.description ?? null,
        updatedAt: new Date()
      };
      this.flags.set(flag.name, newFlag);
      return newFlag;
    }
  }
  
  async toggleFeatureFlag(name: string, enabled: boolean): Promise<FeatureFlag | undefined> {
    const flag = this.flags.get(name);
    if (!flag) return undefined;
    
    const updatedFlag: FeatureFlag = {
      ...flag,
      enabled,
      updatedAt: new Date()
    };
    this.flags.set(name, updatedFlag);
    return updatedFlag;
  }
  
  // Content blocks operations
  async getContentBlock(identifier: string): Promise<ContentBlock | undefined> {
    return this.contents.get(identifier);
  }
  
  async getAllContentBlocks(): Promise<ContentBlock[]> {
    return Array.from(this.contents.values());
  }
  
  async upsertContentBlock(block: InsertContentBlock): Promise<ContentBlock> {
    const existingBlock = this.contents.get(block.identifier);
    
    if (existingBlock) {
      const updatedBlock: ContentBlock = {
        ...existingBlock,
        title: block.title ?? existingBlock.title,
        content: block.content ?? existingBlock.content,
        contentType: block.contentType ?? existingBlock.contentType,
        active: block.active ?? existingBlock.active,
        updatedAt: new Date()
      };
      this.contents.set(block.identifier, updatedBlock);
      return updatedBlock;
    } else {
      const newBlock: ContentBlock = {
        id: Math.floor(Math.random() * 1000),
        identifier: block.identifier,
        title: block.title ?? 'Untitled',
        content: block.content ?? '',
        contentType: block.contentType ?? 'text',
        active: block.active ?? true,
        updatedAt: new Date()
      };
      this.contents.set(block.identifier, newBlock);
      return newBlock;
    }
  }
  
  async deleteContentBlock(identifier: string): Promise<boolean> {
    const deleted = this.contents.delete(identifier);
    return deleted;
  }
}

// Import required modules for database operations
import { db, pool } from './db';
import { eq, and, not, desc, asc } from 'drizzle-orm';

// PostgreSQL-based implementation of IStorage
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    const PostgresSessionStore = connectPgSimple(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'user_sessions'
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserPremiumStatus(userId: number, isPremium: boolean): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ isPremium })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  // Chat message operations
  async getChatMessages(isPremium: boolean): Promise<ChatMessage[]> {
    if (isPremium) {
      return await db.select().from(chatMessages).orderBy(desc(chatMessages.createdAt));
    }
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.isPremium, false))
      .orderBy(desc(chatMessages.createdAt));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db.insert(chatMessages).values(message).returning();
    return chatMessage;
  }

  // User message operations
  async getUserMessages(userId: number): Promise<UserMessage[]> {
    return await db
      .select()
      .from(userMessages)
      .where(eq(userMessages.userId, userId))
      .orderBy(asc(userMessages.createdAt));
  }

  async createUserMessage(message: InsertUserMessage): Promise<UserMessage> {
    const [userMessage] = await db.insert(userMessages).values(message).returning();
    return userMessage;
  }

  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }

  async updatePaymentVerification(paymentId: number, verified: boolean): Promise<Payment | undefined> {
    const [updatedPayment] = await db
      .update(payments)
      .set({ verified })
      .where(eq(payments.id, paymentId))
      .returning();

    if (updatedPayment && verified) {
      await this.updateUserPremiumStatus(updatedPayment.userId, true);
    }

    return updatedPayment;
  }

  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  // App config operations
  async getAppConfig(): Promise<AppConfig | undefined> {
    const [config] = await db.select().from(appConfig);
    return config;
  }

  async upsertAppConfig(config: Partial<InsertAppConfig>): Promise<AppConfig> {
    // Check if config exists
    const existingConfig = await this.getAppConfig();
    
    if (existingConfig) {
      // Update existing config
      const [updated] = await db
        .update(appConfig)
        .set(config)
        .where(eq(appConfig.id, existingConfig.id))
        .returning();
      return updated;
    } else {
      // Create initial config with defaults for missing values
      const defaultValues = {
        supabaseUrl: config.supabaseUrl || '',
        supabaseKey: config.supabaseKey || '',
        upiId: config.upiId || 'demoUPI@ybl',
        upiDeepLink: config.upiDeepLink || 'upi://pay?pa=demoUPI@ybl&pn=LoveChat&am=299.00',
        qrImage: config.qrImage || 'https://example.com/qr-code.png',
        premiumEnabled: config.premiumEnabled ?? true,
        girlName: config.girlName || 'Ananya',
        boyName: config.boyName || 'Rahul',
        girlMessagesTable: config.girlMessagesTable || 'girl_messages',
        boyMessagesTable: config.boyMessagesTable || 'boy_messages',
        welcomeMessage: config.welcomeMessage || 'Welcome to LoveChat! Connect with your virtual partner.',
        homeBannerText: config.homeBannerText || 'Experience emotional connection like never before!'
      };
      
      const [created] = await db.insert(appConfig).values(defaultValues).returning();
      return created;
    }
  }

  // Feature flags operations
  async getFeatureFlag(name: string): Promise<FeatureFlag | undefined> {
    const [flag] = await db
      .select()
      .from(featureFlags)
      .where(eq(featureFlags.name, name));
    return flag;
  }

  async getAllFeatureFlags(): Promise<FeatureFlag[]> {
    return await db.select().from(featureFlags);
  }

  async upsertFeatureFlag(flag: InsertFeatureFlag): Promise<FeatureFlag> {
    const existingFlag = await this.getFeatureFlag(flag.name);
    
    if (existingFlag) {
      const [updated] = await db
        .update(featureFlags)
        .set({ 
          enabled: flag.enabled, 
          description: flag.description,
          updatedAt: new Date()
        })
        .where(eq(featureFlags.name, flag.name))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(featureFlags).values(flag).returning();
      return created;
    }
  }

  async toggleFeatureFlag(name: string, enabled: boolean): Promise<FeatureFlag | undefined> {
    const [updated] = await db
      .update(featureFlags)
      .set({ enabled, updatedAt: new Date() })
      .where(eq(featureFlags.name, name))
      .returning();
    return updated;
  }

  // Content blocks operations
  async getContentBlock(identifier: string): Promise<ContentBlock | undefined> {
    const [block] = await db
      .select()
      .from(contentBlocks)
      .where(eq(contentBlocks.identifier, identifier));
    return block;
  }

  async getAllContentBlocks(): Promise<ContentBlock[]> {
    return await db.select().from(contentBlocks);
  }

  async upsertContentBlock(block: InsertContentBlock): Promise<ContentBlock> {
    const existingBlock = await this.getContentBlock(block.identifier);
    
    if (existingBlock) {
      const [updated] = await db
        .update(contentBlocks)
        .set({
          title: block.title,
          content: block.content,
          contentType: block.contentType,
          active: block.active,
          updatedAt: new Date()
        })
        .where(eq(contentBlocks.identifier, block.identifier))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(contentBlocks).values(block).returning();
      return created;
    }
  }

  async deleteContentBlock(identifier: string): Promise<boolean> {
    const result = await db
      .delete(contentBlocks)
      .where(eq(contentBlocks.identifier, identifier));
    return true;
  }
}

// Export an instance of DatabaseStorage for use in the application
export const storage = new DatabaseStorage();