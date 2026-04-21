import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { seedDatabaseIfEmpty } from "./services/dataRepository.js";

async function bootstrap() {
  await connectDatabase(env.mongoUri);
  await seedDatabaseIfEmpty();
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`API server running on http://localhost:${env.port}`);
  });
}

bootstrap();
