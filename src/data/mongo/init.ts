import mongoose from "mongoose";

interface ConnectionOptions {
  mongoURL: string;
  mongoDbName: string;
}

export class MongoDatabase {
  static async connect(options: ConnectionOptions) {
    const { mongoURL, mongoDbName } = options;
    try {
      await mongoose.connect(mongoURL, {
        dbName: mongoDbName,
      });
      console.log("Connected to mongoDB");
    } catch (error) {
      console.log("Error connecting to mongoDB");
      throw(error);
    }
  }
}
