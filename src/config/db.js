import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

(async () => {
    try {
        await prisma.$connect();
        console.log("Database Connected");
    } catch (err) {
        console.error("Database Connection Failed:", err);
        process.exit(1); // Stop the app if DB is not connected
    }
})();
      