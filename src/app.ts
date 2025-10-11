import { envs } from "./config/plugins/env.plugin";
import { MongoDatabase } from "./data/mongo";
import { Server } from "./presentation/server";

(async () => {
  main();
})();

async function main() {
  // connect to mongo
  await MongoDatabase.connect({
    mongoDbName: envs.MONGO_DB_NAME ?? "",
    mongoURL: envs.MONGODB_URL ?? "",
  });

  Server.start();
}
