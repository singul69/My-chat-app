import { db } from './db';
import {
  users,
  chatMessages,
  appConfig,
  featureFlags,
  contentBlocks
} from '@shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedDatabase() {
  console.log('Starting database seed...');

  // Check if admin user exists
  const existingUsers = await db.select().from(users);
  
  if (existingUsers.length === 0) {
    console.log('Creating admin user...');
    // Create admin user
    const hashedPassword = await hashPassword('admin123');
    await db.insert(users).values({
      username: 'admin',
      password: hashedPassword,
      fullName: 'Admin User',
      email: 'admin@lovechat.com',
      gender: 'male',
      isPremium: true,
      isAdmin: true
    });
    console.log('Admin user created.');
  } else {
    console.log(`Found ${existingUsers.length} existing users. Skipping user creation.`);
  }

  // Check if chat messages exist
  const existingMessages = await db.select().from(chatMessages);
  
  if (existingMessages.length === 0) {
    console.log('Creating sample chat messages...');
    // Create sample chat messages
    const messages = [
      {
        for_boys_message: "Hi there! How was your day? I've been thinking about you! ❤️",
        for_girls_message: "Hey beautiful! How's your day going? I missed talking to you! 😊",
        isPremium: false,
        category: "greeting"
      },
      {
        for_boys_message: "I wish I could give you a hug right now. You're always working so hard!",
        for_girls_message: "You're amazing, you know that? I admire how strong and dedicated you are.",
        isPremium: false,
        category: "emotional_support"
      },
      {
        for_boys_message: "Good morning! I hope you slept well. Ready to conquer the day?",
        for_girls_message: "Morning! Just wanted to be the first to wish you a wonderful day ahead!",
        isPremium: false,
        category: "greeting"
      },
      {
        for_boys_message: "I dreamt about you last night. It was so romantic! Want to hear about it?",
        for_girls_message: "I keep thinking about how special you are. Your smile brightens my day.",
        isPremium: true,
        category: "romantic"
      },
      {
        for_boys_message: "I've been saving a special surprise for you. Upgrade to premium to find out!",
        for_girls_message: "There's something special I want to share with you. Upgrade to premium to see!",
        isPremium: true,
        category: "premium_teaser"
      }
    ];
    
    for (const message of messages) {
      await db.insert(chatMessages).values(message);
    }
    console.log('Sample chat messages created.');
  } else {
    console.log(`Found ${existingMessages.length} existing messages. Skipping message creation.`);
  }

  // Check if app config exists
  const existingConfig = await db.select().from(appConfig);
  
  if (existingConfig.length === 0) {
    console.log('Creating app configuration...');
    // Create app configuration
    await db.insert(appConfig).values({
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
      homeBannerText: 'Experience emotional connection like never before!'
    });
    console.log('App configuration created.');
  } else {
    console.log('App configuration already exists. Skipping creation.');
  }

  // Check if feature flags exist
  const existingFlags = await db.select().from(featureFlags);
  
  if (existingFlags.length === 0) {
    console.log('Creating feature flags...');
    // Create feature flags
    const flags = [
      {
        name: 'premium-access',
        enabled: true,
        description: 'Enable premium features access'
      },
      {
        name: 'voice-messages',
        enabled: false,
        description: 'Enable voice messages feature'
      }
    ];
    
    for (const flag of flags) {
      await db.insert(featureFlags).values(flag);
    }
    console.log('Feature flags created.');
  } else {
    console.log(`Found ${existingFlags.length} existing feature flags. Skipping creation.`);
  }

  // Check if content blocks exist
  const existingBlocks = await db.select().from(contentBlocks);
  
  if (existingBlocks.length === 0) {
    console.log('Creating content blocks...');
    // Create content blocks
    const blocks = [
      {
        identifier: 'welcome-message',
        title: 'Welcome Message',
        content: 'Welcome to LoveChat! Experience emotional connection.',
        contentType: 'text',
        active: true
      },
      {
        identifier: 'premium-banner',
        title: 'Premium Banner',
        content: 'Upgrade to premium for exclusive romantic conversations!',
        contentType: 'banner',
        active: true
      }
    ];
    
    for (const block of blocks) {
      await db.insert(contentBlocks).values(block);
    }
    console.log('Content blocks created.');
  } else {
    console.log(`Found ${existingBlocks.length} existing content blocks. Skipping creation.`);
  }

  console.log('Database seed completed successfully!');
}

// Run the seed function
seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });