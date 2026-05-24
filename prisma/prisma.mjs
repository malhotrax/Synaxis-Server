import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "../src/config/config.mjs";

const adapter = new PrismaPg({ connectionString: config.DATABASE_URL });
const globalForPrisma = globalThis;
export const prisma = new PrismaClient({ adapter });
if (config.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const withTranscation = (callback) => prisma.$transaction(callback);
