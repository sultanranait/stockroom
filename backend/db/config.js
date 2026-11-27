try {
  process.loadEnvFile();
} catch {
  // .env is optional, variables can also come from the environment
}

const config = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  dialectOptions: { ssl: process.env.DB_SSL === 'true' },
  seederStorage: 'sequelize',
};

module.exports = {
  development: config,
  test: config,
  production: config,
};
