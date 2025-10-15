// used during testing // loads environment variables from .env.test
import { config } from "dotenv";

config({
    path: ".env.test",
    quiet: true
})