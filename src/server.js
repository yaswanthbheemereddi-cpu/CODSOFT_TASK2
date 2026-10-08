require('dotenv').config();
const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Contact Management API is running!`);
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`🌐 Live Interactive Tester: http://localhost:${PORT}`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log('====================================================');
});
