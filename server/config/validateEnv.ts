/**
 * Environment variable validation
 * Validates all required environment variables at startup
 */

interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID?: string;
  CLIENT_URL?: string;
  CORS_ORIGIN?: string;
}

const requiredEnvVars = [
  'NODE_ENV',
  'DATABASE_URL',
  'JWT_SECRET',
] as const;

const optionalEnvVars = [
  'GOOGLE_CLIENT_ID',
  'CLIENT_URL',
  'CORS_ORIGIN',
  'PORT',
] as const;

export const validateEnv = (): EnvConfig => {
  const missing: string[] = [];
  const invalid: string[] = [];

  // Check required variables
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      invalid.push('JWT_SECRET must be at least 32 characters long');
    }
    if (process.env.JWT_SECRET === 'test' || process.env.JWT_SECRET === 'your_super_secret_jwt_key_min_32_characters_change_this_in_production') {
      invalid.push('JWT_SECRET must be changed from default value');
    }
  }

  // Validate NODE_ENV
  if (process.env.NODE_ENV && !['development', 'production', 'test'].includes(process.env.NODE_ENV)) {
    invalid.push('NODE_ENV must be one of: development, production, test');
  }

  // Validate DATABASE_URL format
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql://')) {
    invalid.push('DATABASE_URL must be a valid PostgreSQL connection string');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file.'
    );
  }

  if (invalid.length > 0) {
    throw new Error(
      `Invalid environment variables:\n${invalid.join('\n')}\n` +
      'Please fix your .env file.'
    );
  }

  return {
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    PORT: parseInt(process.env.PORT || '5001', 10),
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_URL: process.env.CLIENT_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
  };
};

// Validate on import
let envConfig: EnvConfig;
try {
  envConfig = validateEnv();
} catch (error) {
  console.error('❌ Environment validation failed:');
  console.error(error);
  process.exit(1);
}

export default envConfig;
