import mongoose from "mongoose";

interface ConnectionOptions {
  mongoURL: string;
  mongoDbName: string;
}

export class MongoDatabase {
  static async connect(options: ConnectionOptions) {
    const { mongoURL, mongoDbName } = options;
    try {
      const result = await mongoose.connect(mongoURL, {
        dbName: mongoDbName,
      });
      console.log("Connected to mongoDB");
      return true;
    } catch (error) {
      console.log(error);
      throw new Error("Error connecting to mongoDB");
    }
  }
}
