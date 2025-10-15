import mongoose from "mongoose";
import { MongoDatabase } from "./init";
describe("src/data/mongo/init.ts", () => {
  // mock to quiet console.log
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  afterEach(async () => {
    await mongoose.connection.close();
  });
  //
  afterAll(() => {
    // resets and restores original implementation
    consoleSpy.mockRestore();
  });
  //
  test("should throw an error with invalid credentials", async () => {
    await expect(
      MongoDatabase.connect({
        mongoDbName: "mongodb://invaliduser:nopassword@localhost:27018/",
        mongoURL: "",
      })
    ).rejects.toThrow("Error connecting to mongoDB");
  });
  //
  test("should connect to mongodb", async () => {
    const result = await MongoDatabase.connect({
      mongoDbName: process.env.MONGO_DB_NAME ?? "",
      mongoURL: process.env.MONGODB_URL ?? "",
    });
    expect(result).toBe(true);
  });
});
