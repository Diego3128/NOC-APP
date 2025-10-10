import { envs } from "./config/plugins/env.plugin";
import { MongoDatabase } from "./data/mongo";
import { LogModel } from "./data/mongo/models/log.model";
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

  // create document
  // const newLog = new LogModel({
  //   message: "custom message",
  //   origin: __filename,
  //   level: "medium",
  // });
  // const result = await newLog.save();
  // console.log(result);

  // find document
  //   const logs = await LogModel.find();
  // console.log(logs);

  // console.log(envs);
  Server.start();
}
