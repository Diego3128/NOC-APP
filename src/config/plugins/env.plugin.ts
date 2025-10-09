import * as env from "env-var";
import { config } from "dotenv";
config(); // loads env variables from /.env file

// parse and export env variables
export const envs = {
  PORT: env.get("PORT").asPortNumber(),
  MAILER_SERVICE: env.get("MAILER_SERVICE").asString(),
  MAILER_EMAIL: env.get("MAILER_EMAIL").asEmailString(),
  MAILER_SECRET_KEY: env.get("MAILER_SECRET_KEY").asString(),
  SEND_GRID_API_KEY: env.get("SEND_GRID_API_KEY").asString(),
  EMAIL_RECEIVER: env.get("EMAIL_RECEIVER").asEmailString(),
  PROD: env.get("PROD").asBool(),
};