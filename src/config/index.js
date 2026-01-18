require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  groq: {
    apiKey: process.env.GROQ_API_KEY,
  },
};

if (!config.groq.apiKey) {
  console.warn('WARNING: GROQ_API_KEY is not set in .env file.');
}

module.exports = config;
