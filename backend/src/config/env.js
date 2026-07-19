const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'JWT_SECRET'];

function validateEnvironment() {
  const missing = required.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  if (process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters long.');
}

module.exports = { validateEnvironment };
