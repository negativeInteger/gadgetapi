import { prisma } from "../config/db.js";
import { generateCodename } from "../utils/codename.js";
import { calculateMissionSuccessProbability } from "../utils/successProbability.js";

/**
 * Create Gadget Service
 */
export const createGadget = async ({ name, description, status }, id) => {
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

    // Optional if you want to return the User with gadgets
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            gadget: true
        }
    });

    return newGadget; // or return user if you want full user with gadgets
};


/**
 * List Gadgets Service with Pagination + Filtering
 */
export const getUserGadgets = async ({ page = 1, limit = 10, status }, id) => {
    const assignedToId = id;
    const where = status ? { status, assignedToId } : { assignedToId };

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
 * List all gadgets in the inventory with Pagination + Filtering
 */
export const getGadgetsInventory = async ({ page = 1, limit = 10, status }, id) => {
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