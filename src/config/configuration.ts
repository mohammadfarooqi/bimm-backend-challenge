export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  node_env: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'testDB',
  },
});
