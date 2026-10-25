import * as nodeCrypto from 'crypto';

// Polyfill for environments where `globalThis.crypto` is not defined (e.g. Node.js < 19).
// Some dependencies (e.g. @nestjs/schedule) rely on `crypto.randomUUID()`.
if (!(globalThis as any).crypto) {
  const webcrypto = (nodeCrypto as any).webcrypto;
  if (webcrypto) {
    (globalThis as any).crypto = webcrypto;
  }
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import * as express from 'express';
import { enforceAudiraAuthenticity } from './common/audira-signature';

async function bootstrap() {
  // Verifikasi Tanda Tangan Kriptografis Resmi Agus Dwi Rianto (AUDIRA)
  enforceAudiraAuthenticity();

  const app = await NestFactory.create(AppModule);

  // Enable cookie parser for httpOnly cookies
  app.use(cookieParser());

  // Limit payload size to prevent DOS attacks with huge payloads
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  const allowedOrigins = new Set(
    [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      process.env.CUSTOMER_PORTAL_URL || 'http://localhost:3219',
      process.env.AUDIRANET_WEB_URL || 'http://localhost:3010',
      'http://localhost:3217', // Admin panel port
      'http://localhost:3218', // Backend port
      'http://localhost:3219', // Customer portal port
      'http://localhost:3001', // Legacy customer portal port
      'http://localhost:1992', // Legacy admin port
      'http://localhost:1993', // Legacy backend port
    ].filter(Boolean),
  );

  app.enableCors({
    origin: (origin, callback) => {
      // Non-browser clients (mobile apps, curl, server-to-server) won't send Origin.
      if (!origin) return callback(null, true);

      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 3600, // Cache preflight for 1 hour
    preflightContinue: false, // Handle OPTIONS automatically
    optionsSuccessStatus: 204, // Return 204 for successful OPTIONS
  });

  // Global exception filter for better error handling
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false, // Changed to false to not reject extra fields
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap().catch((error) => {
  console.error('❌ Failed to start backend:', error);
  process.exit(1);
});
