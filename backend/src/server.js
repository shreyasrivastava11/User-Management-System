import app from './app.js';
import env from './config/env.js';
import { connectDB } from './config/db.js';

(async () => {
  try {
    await connectDB(env.mongoUri);
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
})();
