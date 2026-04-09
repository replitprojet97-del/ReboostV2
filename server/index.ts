import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import helmet from "helmet";
import cors from "cors";
import { registerRoutes } from "./routes";
import { storage } from "./storage";
import ConnectPgSimple from "connect-pg-simple";

// Fonction de nettoyage des fichiers KYC expirés
async function cleanupExpiredKycDocuments() {
  try {
    const expiredDocs = await storage.getExpiredKycDocuments();
    if (expiredDocs.length > 0) {
      console.log(`[Cleanup] Found ${expiredDocs.length} expired KYC documents to remove.`);
      for (const doc of expiredDocs) {
        await storage.deleteKycDocument(doc.id);
        console.log(`[Cleanup] Deleted expired document: ${doc.fileName} (ID: ${doc.id})`);
      }
    }
  } catch (error) {
    console.error('[Cleanup] Error during KYC document cleanup:', error);
  }
}

// Lancer le nettoyage toutes les heures
setInterval(cleanupExpiredKycDocuments, 60 * 60 * 1000);
// Lancer un premier nettoyage au démarrage après un court délai
setTimeout(cleanupExpiredKycDocuments, 30000);

import pkg from "pg";
const { Pool } = pkg;
import * as Sentry from "@sentry/node";

function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// Initialize Sentry for production logging
if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: process.env.SENTRY_RELEASE || '1.0.0',
    tracesSampleRate: 1.0,
  });
  console.log('[SENTRY] ✅ Sentry initialized for centralized logging');
} else if (process.env.NODE_ENV === 'production') {
  console.warn('[SENTRY] ⚠️ SENTRY_DSN not set in production. Centralized logging disabled.');
}

const app = express();

// Servir les fichiers statiques du dossier 'public' AVANT toute autre route
app.use(express.static("public"));

app.set("trust proxy", 1);

declare module 'express-session' {
  interface SessionData {
    userId: string;
    userRole?: string;
    csrfToken?: string;
  }
}

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

if (process.env.NODE_ENV === 'production' && (!process.env.SESSION_SECRET || !process.env.DATABASE_URL)) {
  console.error('FATAL: Missing required environment variables (SESSION_SECRET or DATABASE_URL)');
  process.exit(1);
}

if (!process.env.SESSION_SECRET) {
  console.warn('WARNING: Using default SESSION_SECRET. Set SESSION_SECRET environment variable for production.');
}

// Cookie domain configuration
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Detect Replit environment (uses HTTPS and requires Secure cookies)
const IS_REPLIT = !IS_PRODUCTION && (
  process.env.REPL_ID !== undefined || 
  process.env.REPLIT_DEPLOYMENT !== undefined ||
  process.env.REPL_SLUG !== undefined
);

// In production: use '.kreditpass.org' to share cookies between frontend and api subdomains
// In development: undefined (same domain only)
const COOKIE_DOMAIN = IS_PRODUCTION ? '.kreditpass.org' : undefined;

// In production: allow the dashboard subdomain and current vercel domain
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://kreditpass.org',
      'https://www.kreditpass.org',
      'https://dashboard.kreditpass.org',
      'https://www.kreditpass.org',
      'https://kreditpass.org',
      'https://api.kreditpass.org',
      'https://kreditpass.org/dashboard', // Add specific dashboard path just in case
    ]
  : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'];

// In production: use 'none' for cross-domain cookies (frontend on kreditpass.org, api on api.kreditpass.org)
// In Replit development: use 'none' with secure:true (Replit uses HTTPS proxy)
// In local development: use 'lax' (frontend and backend on same localhost)
const SAME_SITE_POLICY = IS_PRODUCTION ? 'none' : (IS_REPLIT ? 'none' : 'lax');

// Cookies must be Secure when SameSite=none, and Replit uses HTTPS
const COOKIE_SECURE = IS_PRODUCTION || IS_REPLIT;

// Helper to check if it's a browser request to provide better CORS support
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token, Authorization');
  }
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    if (process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else if (!origin) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`[CORS ERROR] ❌ Origin rejected: ${origin}`);
      console.error(`[CORS ERROR] Allowed origins: ${JSON.stringify(allowedOrigins)}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
}));

// Sentry request handler must come early in middleware chain
// if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
//   app.use(Sentry.Handlers.requestHandler());
// }

// Skip Helmet CSP for chat file serving route (allows iframe embedding)
app.use('/api/chat/file', (req, res, next) => {
  // Set permissive CSP for chat files to allow iframe embedding
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors https://kreditpass.org https://www.kreditpass.org https://dashboard.kreditpass.org"
  );
  res.setHeader("Access-Control-Allow-Origin", "https://kreditpass.org");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  // Skip helmet for this route by marking it
  (req as any).skipHelmet = true;
  next();
});

app.use((req, res, next) => {
  // Skip helmet for marked requests
  if ((req as any).skipHelmet) {
    return next();
  }
  
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: process.env.NODE_ENV === 'production' 
          ? ["'self'"]
          : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: process.env.NODE_ENV === 'production'
          ? ["'self'", "https://fonts.googleapis.com"]
          : ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: process.env.NODE_ENV === 'production'
          ? ["'self'", "https://api.kreditpass.org", ...allowedOrigins.filter((origin): origin is string => origin !== undefined)]
          : ["'self'", "https://*.replit.dev"],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
    noSniff: true,
    xssFilter: true,
  })(req, res, next);
});

const PgSession = ConnectPgSimple(session);
const sessionStore = process.env.DATABASE_URL 
  ? new PgSession({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }),
      tableName: 'user_sessions',
      createTableIfMissing: true,
    })
  : undefined;

if (!sessionStore && process.env.NODE_ENV === 'production') {
  console.error('FATAL: DATABASE_URL must be set for session storage in production');
  process.exit(1);
}

const sessionMiddleware = session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'kreditpass-secret-key-dev-only',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: COOKIE_SECURE,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: SAME_SITE_POLICY,
    domain: COOKIE_DOMAIN,
    signed: true,
  },
  name: 'sessionId',
});

app.use(sessionMiddleware);

app.use((req, res, next) => {
  // 🔒 Enhanced debug logs for cross-domain session issues (dev only)
  // 🚫 Filtered in production to prevent exposure of sensitive data
  if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_SESSIONS === 'true') {
    const isApiRequest = req.path.startsWith('/api');
    const hasSession = !!req.session?.id;
    const isAuthenticated = !!req.session?.userId;
    
    if (isApiRequest && (!hasSession || !isAuthenticated)) {
      console.log('=== [SESSION DEBUG] (DEV ONLY) ===');
      console.log(`[SESSION] ${req.method} ${req.path}`);
      console.log(`[SESSION] Origin: ${req.headers.origin || 'NO ORIGIN'}`);
      console.log(`[SESSION] Referer: ${req.headers.referer || 'NO REFERER'}`);
      console.log(`[SESSION] Cookie Header: ${req.headers.cookie ? 'PRESENT' : 'MISSING'}`);
      if (req.headers.cookie) {
        const hasSessionCookie = req.headers.cookie.includes('sessionId');
        console.log(`[SESSION] sessionId Cookie: ${hasSessionCookie ? 'PRESENT' : 'MISSING'}`);
      }
      console.log(`[SESSION] Session Exists: ${hasSession ? 'YES' : 'NO'}`);
      console.log(`[SESSION] Authenticated: ${isAuthenticated ? 'YES' : 'NO'}`);
      console.log(`[SESSION] CSRF Token Header: ${req.headers['x-csrf-token'] ? 'PRESENT' : 'MISSING'}`);
      console.log('=====================================');
    }
  }
  next();
});

app.use(express.json({
  limit: '50mb',
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse && process.env.NODE_ENV !== 'production') {
        const safeResponse = { ...capturedJsonResponse };
        delete safeResponse.password;
        delete safeResponse.verificationToken;
        delete safeResponse.sessionId;
        logLine += ` :: ${JSON.stringify(safeResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Health check endpoint for Render (placed BEFORE all routes)
app.get('/healthz', (req, res) => {
  res.status(200).send("OK");
});

(async () => {
  const server = await registerRoutes(app, sessionMiddleware);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`[ERROR] ${req.method} ${req.path} - Status: ${status}`);
    console.error(`[ERROR] Message: ${message}`);
    console.error(`[ERROR] Origin: ${req.headers.origin || 'NO ORIGIN'}`);
    if (err.stack && process.env.NODE_ENV === 'production') {
      console.error(`[ERROR] Stack: ${err.stack.split('\n').slice(0, 3).join('\n')}`);
    }

    res.status(status).json({ message });
    throw err;
  });

  app.get("/health", (req, res) => {
    const checks = {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: sessionStore ? 'connected' : 'not_configured',
      session: {
        configured: !!sessionStore,
        cookieDomain: COOKIE_DOMAIN || 'none',
        secure: COOKIE_SECURE,
        sameSite: SAME_SITE_POLICY,
        isReplit: IS_REPLIT,
      },
      cors: {
        allowedOrigins: allowedOrigins.length > 0 ? allowedOrigins : ['development-mode'],
        frontendUrl: process.env.FRONTEND_URL || 'not_set',
      }
    };

    res.status(200).json(checks);
  });


  // Only setup Vite in development (local dev server)
  // In production, backend serves API only. Frontend is deployed separately on Vercel.
  if (process.env.NODE_ENV === "development") {
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  }

  const port = process.env.PORT ? Number(process.env.PORT) : 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`✅ Backend API server listening on port ${port}`);
    log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    log(`🗄️ Database: ${process.env.DATABASE_URL ? 'Connected' : 'No DATABASE_URL set'}`);
    
    if (process.env.NODE_ENV === 'production') {
      console.log(`[CONFIG] FRONTEND_URL: ${process.env.FRONTEND_URL || 'NOT SET'}`);
      console.log(`[CONFIG] Allowed Origins: ${JSON.stringify(allowedOrigins)}`);
      console.log(`[CONFIG] Session Cookie Domain: ${COOKIE_DOMAIN || 'none (same-domain only)'}`);
      console.log(`[CONFIG] Session Cookie Secure: ${IS_PRODUCTION}`);
      console.log(`[CONFIG] Session Cookie SameSite: ${SAME_SITE_POLICY}`);
    }
    
    const startOTPCleanup = async () => {
      const { cleanupExpiredOTPs } = await import("./services/otp");
      setInterval(async () => {
        try {
          await cleanupExpiredOTPs();
        } catch (error) {
          console.error('[OTP CLEANUP] Error:', error);
        }
      }, 60 * 60 * 1000);
      
      setTimeout(() => cleanupExpiredOTPs().catch(console.error), 5000);
    };
    
    startOTPCleanup();
  });
})();
