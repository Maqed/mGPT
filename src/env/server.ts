import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    NEXT_PUBLIC_BASE_URL: z.url().default("http://localhost:3000"),

    GROQ_API_KEY: z.string(),

    REDIS_URL: z.string(),
  },
  runtimeEnv: process.env,
});
