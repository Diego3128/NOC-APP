import { LogModel } from "./log.model";
import { MongoDatabase } from "../init";
import { envs } from "../../../config/plugins/env.plugin";
import mongoose from "mongoose";
describe("src/mongo/models/log.model.ts", () => {
  // quiet console.log
  let consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  beforeAll(async () => {
    await MongoDatabase.connect({
      mongoURL: envs.MONGODB_URL ?? "",
      mongoDbName: envs.MONGO_DB_NAME ?? "",
    });
  });
  //
  afterAll(async () => {
    consoleSpy.mockRestore();
    // restore original implementation
    await mongoose.connection.close();
  });
  //
  test("should create a LogModel", async () => {
    const testLog = {
      message: "test log",
      origin: __filename,
      level: "high",
    };
    //
    const newLog = await new LogModel(testLog).save();
    expect(newLog).toEqual(
      expect.objectContaining({
        ...testLog,
        id: expect.any(String),
        date: expect.any(Date),
      })
    );
    // delete created log
    await LogModel.findByIdAndDelete(newLog.id);
  });
  //
  test("should throw if 'level' is not in enum", async () => {
    const log = new LogModel({
      message: "Invalid level test",
      origin: "test.js",
      level: "critical",
    });

    const error = log.validateSync();
    expect(error?.errors["level"].message).toContain(
      "`critical` is not a valid enum value"
    );
  });
  //
  test("should set date automatically", async () => {
    const log = new LogModel({
      message: "Date default test",
      origin: "test.js",
    });

    expect(log.date).toBeInstanceOf(Date);
  });
  //
  test("should require 'message' and 'origin'", async () => {
    const log = new LogModel({}); // Missing required fields

    const error = log.validateSync();

    expect(error?.errors["message"].message).toContain(
      "Path `message` is required"
    );
    expect(error?.errors["origin"].message).toContain(
      "Path `origin` is required"
    );
  });
  //
  test("should default 'level' to 'low'", async () => {
    const log = new LogModel({
      message: "Test log",
      origin: "test.js",
    });

    expect(log.level).toBe("low");
  });
});
