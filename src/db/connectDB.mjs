import { prisma } from "../../prisma/prisma.mjs";

export const connectDB = async () => {
    try {
        prisma.$connect();
        console.log("Database connected");
    } catch (error) {
        console.error(`Failed to, connect to database: ${error}`);
        prisma.$disconnect();
        process.exit(1);
    }
};
