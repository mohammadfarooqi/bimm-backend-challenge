export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  node_env: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'testDB',
    ssl: process.env.DB_SSL === 'true' ?? true,
  },
  endpoints: {
    all_makes:
      process.env.ALL_MAKES_ENDPOINT ||
      'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML',
    all_vehicle_types:
      process.env.ALL_VEHICLE_TYPES_ENDPOINT ||
      'https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/440?format=XML',
  },
});
