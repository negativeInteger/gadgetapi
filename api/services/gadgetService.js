import { prisma } from "../config/db.js";
import { generateCodename } from "../utils/codename.js";
import { ExpressError } from "../errors/ExpressError.js";
import { generateConfirmationCode } from "../utils/generateConfirmationCode.js";
import { calculateMissionSuccessProbability } from "../utils/successProbability.js";

/**
 * Create Gadget Service
 */
export const create = async ({ name, description, status }) => {
    const codename = generateCodename();

    const newGadget = await prisma.gadget.create({
        data: {
            name,
            codename,
            description,
            status
        }
    });

    if (!newGadget) throw new ExpressError('Internal Server Error', 'Gadget Creation Failed', 500);
    
    return newGadget; 
};
/**
 * List Gadgets Service
 * (List all gadgets in the inventory with Pagination + Filtering)
 */
export const list = async ({ page = 1, limit = 10, status }) => {
    const where = status ? { status } : {};
    
    const gadgets = await prisma.gadget.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
    });
    if (!gadgets) throw new ExpressError('Internal Server Error', 'Failed to retrieve gadgets', 500);
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
    const updatedGadget = await prisma.gadget.update({
        where: { id },
        data: { name, description, status }
    });
    if (!updatedGadget) throw new ExpressError('Internal Server Error', 'Failed to update gadget', 500);
    return updatedGadget;
};
/**
 * Delete Gadget Service (Permanent Deletion)
 */
export const deleteService = async (id) => {
    return await prisma.gadget.delete({
        where: { id },
    });
};
/**
 * Soft Delete Gadget (Marking as DECOMMISSIONED)
 */
export const decommission = async (id) => {
    const decommissionedGadget = await prisma.gadget.update({
        where: { id },
        data: { 
            status: 'DECOMMISSIONED',
            decommissionedAt: new Date(Date.now()).toISOString()
         }
    });
    if (!decommissionedGadget) throw new ExpressError('Internal Server Error', 'Failed to update gadget', 500);
    return decommissionedGadget;
};
/**
 * Self-Destruct Gadget 
 */
export const selfDestruct = () => {
    const confirmationCode = generateConfirmationCode();
    const response = {
        message: "Confirmation code generated. Use this code to confirm self-destruct.",
        expiresIn: "3 minutes",
        code: confirmationCode
    }
    return response;
};


