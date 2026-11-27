try {
  process.loadEnvFile();
} catch {
  // .env is optional, variables can also come from the environment
}

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const config = {
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  db: {
    url: required('DATABASE_URL'),
    ssl: process.env.DB_SSL === 'true',
  },
  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: Number(process.env.JWT_EXPIRES_IN) || 86400,
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  ports: {
    auth: Number(process.env.AUTH_PORT) || 4001,
    product: Number(process.env.PRODUCT_PORT) || 4002,
  },
};

export default config;
