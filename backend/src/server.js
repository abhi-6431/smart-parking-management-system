require('dotenv').config();

const app = require('./app');
const { validateEnvironment } = require('./config/env');
const { verifyDatabaseConnection } = require('./config/database');

const port = Number(process.env.PORT || 5000);

async function startServer() {
  validateEnvironment();
  await verifyDatabaseConnection();
  app.listen(port, () => console.log(`Smart Parking API running on port ${port}`));
}

startServer().catch((error) => {
  console.error('Unable to start API:', error.message);
  process.exit(1);
});
