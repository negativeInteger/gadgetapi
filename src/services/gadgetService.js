import { prisma } from "../config/db.js";
import { generateCodename } from "../utils/codename.js";
import { calculateMissionSuccessProbability } from "../utils/successProbability.js";

/**
 * Create Gadget Service
 */
export const createGadget = async ({ name, description, status }) => {
    const codename = generateCodename();
    return await prisma.gadget.create({
        data: { name, codename, description, status }
    });
};


/**
 * List Gadgets Service with Pagination + Filtering
 */
export const getGadgets = async ({ page = 1, limit = 10, status }) => {
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

// /**
//  * Soft Delete Gadget
//  */

// export const deleteGadget = async (id) => {
//     return await prisma.gadget.update({
//         where: { id },
//         data: { deletedAt: Date.now() }
//     });
// };