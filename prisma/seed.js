import { prisma } from "../api/config/prisma.js"; // Update path if needed
import { v4 as uuidv4 } from 'uuid';
import { generateCodename } from "../api/utils/codename.js";

const STATUSES = ["AVAILABLE", "DECOMMISSIONED", "DEPLOYED", "DESTROYED"];
const getRandomStatus = () => STATUSES[Math.floor(Math.random() * STATUSES.length)];

const gadgets = Array.from({ length: 50 }).map(() => ({
  id: uuidv4(),
  name: `Gadget ${Math.floor(Math.random() * 1000)}`,
  codename: generateCodename(),
  description: Math.random() > 0.5 ? "Test gadget description" : "No description provided",
  status: getRandomStatus(),
  createdAt: new Date(Date.now()).toISOString(),
  updatedAt: new Date(Date.now()).toISOString(),
  decommissionedAt: Math.random() > 0.5 ? new Date(Date.now()).toISOString() : null, // Some might be decommissioned
}));

const insertDummyData = async () => {
    try {
      await prisma.gadget.createMany({ data: gadgets });
      if (process.env.NODE_ENV !== "production") {
        console.log("✅ 50 Dummy Gadgets Inserted!");
      }
    } catch (err) {
      console.error("❌ Error inserting data:", err);
    } finally {
      await prisma.$disconnect();
    }
};

insertDummyData();
