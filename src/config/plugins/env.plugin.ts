import * as env from "env-var";
import { config } from "dotenv";
config(); // loads env variables from /.env file

// parse and export env variables
export const envs = {
  PORT: env.get("PORT").asPortNumber(),
  MAILER_EMAIL: env.get("MAILER_EMAIL").asEmailString(),
  MAILER_SECRET_KEY: env.get("MAILER_SECRET_KEY").asString(),
  PROD: env.get("PROD").asBool(),
};
