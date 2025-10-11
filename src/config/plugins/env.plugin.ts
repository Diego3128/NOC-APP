import * as env from "env-var";
import { config } from "dotenv";
config(); // loads env variables from /.env file

// parse and export env variables
export const envs = {
  PORT: env.get("PORT").asPortNumber(),
  MAILER_EMAIL: env.get("MAILER_EMAIL").asEmailString(),
  SEND_GRID_API_KEY: env.get("SEND_GRID_API_KEY").asString(),
  EMAIL_RECEIVER: env.get("EMAIL_RECEIVER").asEmailString(),
  PROD: env.get("PROD").asBool(),
  MONGO_DB_NAME: env.get("MONGO_DB_NAME").asString(),
  MONGODB_URL: env.get("MONGODB_URL").asUrlString(),
};