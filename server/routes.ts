import { Router, type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertChatMessageSchema, insertPaymentSchema, insertUserMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { scrypt, timingSafeEqual, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// Function to hash a password
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Function to compare passwords
async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  // Stored password is in format: hash.salt
  const [hashedPassword, salt] = stored.split('.');
  if (!hashedPassword || !salt) return false;
  
  const hashedBuf = Buffer.from(hashedPassword, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session
  const MemStoreSession = MemoryStore(session);
  app.use(
    session({
      secret: 'lovechat-secret-key',
      resave: false,
      saveUninitialized: false,
      store: new MemStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      },
    })
  );

  // Configure passport
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: 'Incorrect username' });
        }
        
        // Compare the provided password with the stored hashed password
        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: 'Incorrect password' });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  const apiRouter = Router();

  // Authentication routes
  apiRouter.post('/register', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Hash the password before storing it
      const hashedPassword = await hashPassword(userData.password);
      const userDataWithHashedPassword = { 
        ...userData,
        password: hashedPassword
      };

      const user = await storage.createUser(userDataWithHashedPassword);
      const { password, ...userWithoutPassword } = user;
      
      // Auto-login after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Login failed after registration' });
        }
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: 'Server error while registering' });
    }
  });

  apiRouter.post('/login', (req: Request, res: Response, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  apiRouter.post('/logout', (req: Request, res: Response) => {
    req.logout(() => {
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  apiRouter.get('/me', (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const { password, ...userWithoutPassword } = req.user as any;
    return res.json(userWithoutPassword);
  });

  // Chat message routes
  apiRouter.get('/messages', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = req.user as any;
    const isPremium = user.isPremium;
    const messages = await storage.getChatMessages(isPremium);
    res.json(messages);
  });

  apiRouter.post('/messages', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to create messages' });
    }
    
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: 'Server error while creating message' });
    }
  });

  // User message history
  apiRouter.get('/user-messages', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = req.user as any;
    const messages = await storage.getUserMessages(user.id);
    res.json(messages);
  });

  apiRouter.post('/user-messages', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    try {
      const user = req.user as any;
      const messageData = insertUserMessageSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const message = await storage.createUserMessage(messageData);
      res.status(201).json(message);
      
      // If this is a user message, create a response from the virtual partner
      if (messageData.isUserMessage) {
        // Get random message based on user gender and premium status
        const chatMessages = await storage.getChatMessages(user.isPremium);
        if (chatMessages.length > 0) {
          const randomIndex = Math.floor(Math.random() * chatMessages.length);
          const randomMessage = chatMessages[randomIndex];
          
          // Get gender-specific message and image URL
          const responseMessage = user.gender === 'male' 
            ? randomMessage.for_boys_message 
            : randomMessage.for_girls_message;
          
          const responseImageUrl = user.gender === 'male'
            ? randomMessage.for_boys_image_url
            : randomMessage.for_girls_image_url;
          
          if (responseMessage) {
            const botResponse = await storage.createUserMessage({
              userId: user.id,
              message: responseMessage,
              imageUrl: responseImageUrl || null,
              isUserMessage: false
            });
            
            // In a real app, we'd use websockets to push this to the client
            // For now, the client will need to poll for new messages
          }
        }
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: 'Server error while sending message' });
    }
  });

  // Payment routes
  apiRouter.post('/payments', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    try {
      const user = req.user as any;
      const paymentData = insertPaymentSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: 'Server error while processing payment' });
    }
  });

  // Admin routes
  apiRouter.get('/users', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view users' });
    }
    
    const users = await storage.getAllUsers();
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(usersWithoutPasswords);
  });

  apiRouter.get('/payments', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view payments' });
    }
    
    const payments = await storage.getAllPayments();
    res.json(payments);
  });

  apiRouter.put('/payments/:id/verify', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to verify payments' });
    }
    
    const paymentId = parseInt(req.params.id);
    if (isNaN(paymentId)) {
      return res.status(400).json({ message: 'Invalid payment ID' });
    }
    
    const updatedPayment = await storage.updatePaymentVerification(paymentId, true);
    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(updatedPayment);
  });

  app.use('/api', apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
