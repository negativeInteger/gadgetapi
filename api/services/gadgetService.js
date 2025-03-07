import { prisma } from "../config/db.js";
import { generateCodename } from "../utils/codename.js";
import { generateCode } from "../utils/generateCode.js";
import { calculateMissionSuccessProbability } from "../utils/successProbability.js";

/**
 * Create Gadget Service
 */
export const create = async ({ name, description, status }, id) => {
    const codename = generateCodename();

    const newGadget = await prisma.gadget.create({
        data: {
            name,
            codename,
            description,
            status,
            assigned_to: { // This will automatically push gadget to both User and Gadget tables
                connect: { id }
            }
        }
    });

    return newGadget; 
};
/**
 * List Gadgets Service
 * (List all gadgets in the inventory with Pagination + Filtering)
 */
export const list = async ({ page = 1, limit = 10, status }, id) => {
    const where = status ? { status } : {};

    const gadgets = await prisma.gadget.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.gadget.count({ where });
    const gadgetsWithSuccessProbability = gadgets.map(gadget =>({
        ...gadget,
        missionSuccessProbability: calculateMissionSuccessProbability(gadget)
    }));
    return { gadgetsWithSuccessProbability, total };
};
/**
 * Update Gadget
 */
export const update = async ({ name, description, status }, id) => {
    return await prisma.gadget.update({
        where: { id },
        data: { name, description, status }
    });
};
/**
 * Soft Delete Gadget (Marking as DECOMMISSIONED)
 */
export const decommission = async (id) => {
    return await prisma.gadget.update({
        where: { id },
        data: { status: 'DECOMMISSIONED' }
    });
};
/**
 * Self-Destruct Gadget 
 */
export const selfDestruct = async (id) => {
    const confirmationCode = generateCode();
    const response = {
        message: "Confirmation code generated. Use this code to confirm self-destruct.",
        code: "123456"
    }
    return response;
};


