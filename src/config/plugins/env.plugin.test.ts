import { envs } from "./env.plugin";
describe("src/config/plugins/env.plugin.ts", () => {
  //
  test("should return env options", () => {
    const envVariables = envs;
    expect(envVariables).toMatchObject({
      PORT: 3000,
      MAILER_EMAIL: expect.any(String),
      SEND_GRID_API_KEY: expect.any(String),
      EMAIL_RECEIVER: expect.any(String),
      PROD: false,
      MONGO_DB_NAME: "NOC-TEST",
      MONGODB_URL: "mongodb://user-test:12345@localhost:27018/",
    });
  });
});
