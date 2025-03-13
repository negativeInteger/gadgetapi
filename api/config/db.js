import { PrismaClient } from "@prisma/client";
import logger from "./logger.js";
/**
 * Prisma Client instance for database interaction.
 */
export const prisma = new PrismaClient();
/**
 * Establishes a connection to the PostgreSQL database.
 * If the connection fails, the application will exit with an error code.
 */
(async () => {
    try {
        await prisma.$connect();
        if (process.env.NODE_ENV !== "production") {
            logger.info("Database Connected");
        }
    } catch (err) {
        logger.error("Database Connection Failed:", err);
        process.exit(1); // Stop the app if DB is not connected
    }
})();