import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL || "";

// Initialize Neon Client
const sql = neon(connectionString || "postgres://dummy:dummy@localhost:5432/dummy");
export const db = drizzle(sql, { schema });
