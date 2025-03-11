/**
 * Gadget Service
 * - Handles all gadget-related operations, including creation, retrieval, updates, 
 *   deletion, decommissioning, and self-destruction.
 */
import { prisma } from "../config/db.js";
import { generateCodename } from "../utils/codename.js";
import { ExpressError } from "../errors/ExpressError.js";
import { generateConfirmationCode } from "../utils/generateConfirmationCode.js";
import { calculateMissionSuccessProbability } from "../utils/successProbability.js";

/**
 * Create Gadget Service
 * - Generates a new gadget with a unique codename.
 * @param {Object} data - Gadget details.
 * @param {string} data.name - Name of the gadget.
 * @param {string} data.description - Description of the gadget.
 * @param {string} data.status - Status of the gadget.
 * @returns {Promise<Object>} The newly created gadget.
 * @throws {ExpressError} If gadget creation fails.
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
 * - Retrieves a paginated list of gadgets with optional filtering by status.
 * @param {Object} options - Query parameters for pagination and filtering.
 * @param {number} [options.page=1] - Page number.
 * @param {number} [options.limit=10] - Number of items per page.
 * @param {string} [options.status] - Filter gadgets by status.
 * @returns {Promise<Object>} An object containing gadgets and total count.
 * @throws {ExpressError} If retrieval fails.
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
 * Update Gadget Service
 * - Updates an existing gadget's details.
 * @param {Object} data - Updated gadget details.
 * @param {string} data.name - Updated name of the gadget.
 * @param {string} data.description - Updated description of the gadget.
 * @param {string} data.status - Updated status of the gadget.
 * @param {string} id - Gadget ID.
 * @returns {Promise<Object>} The updated gadget.
 * @throws {ExpressError} If gadget is not found or update fails.
 */
export const update = async ({ name, description, status }, id) => {
    try {
        const updatedGadget = await prisma.gadget.update({
            where: { id },
            data: { name, description, status }
        });
        return updatedGadget;
    } catch (err) {
        if (err.code === "P2025") {  // Prisma error code if gadget-id not found
            throw new ExpressError("Not Found", "Gadget not found", 404);
        }
        throw new ExpressError("Internal Server Error", "Failed to update gadget", 500);
    };    
};
/**
 * Delete Gadget Service (Permanent Deletion)
 * - Removes a gadget from the database permanently.
 * @param {string} id - Gadget ID.
 * @throws {ExpressError} If gadget is not found or deletion fails.
 */
export const deleteService = async (id) => {
    try {
        await prisma.gadget.delete({
            where: { id }   
        });
    } catch (err) {
        if (err.code === "P2025") {  // Prisma error code if gadget-id not found
            throw new ExpressError("Not Found", "Gadget not found", 404);
        }
        throw new ExpressError("Internal Server Error", "Failed to delete gadget", 500);
    };
};
/**
 * Decommission Gadget Service
 * - Marks a gadget as 'DECOMMISSIONED' for soft deleting a gadget.
 * @param {string} id - Gadget ID.
 * @returns {Promise<Object>} The decommissioned gadget.
 * @throws {ExpressError} If gadget is not found or update fails.
 */
export const decommission = async (id) => {
    try {
        const decommissionedGadget = await prisma.gadget.update({
            where: { id },
            data: { 
                status: 'DECOMMISSIONED',
                decommissionedAt: new Date(Date.now()).toISOString()
             }
        });
        return decommissionedGadget;
    } catch (err) {
        if (err.code === "P2025") {  // Prisma error code if gadget-id not found
            throw new ExpressError("Not Found", "Gadget not found", 404);
        }
        throw new ExpressError("Internal Server Error", "Failed to delete gadget", 500);
    }
};
/**
 * Self-Destruct Gadget Service
 * - Initiates self-destruction by generating a confirmation code.
 * @param {string} id - Gadget ID.
 * @returns {Promise<Object>} A response containing a message with confirmation code and expiry time.
 * @throws {ExpressError} If gadget is not found or initiation fails.
 */
export const selfDestruct = async (id) => {
    try {
        const gadget = await prisma.gadget.findUniqueOrThrow({
            where: { id }
        });
        const confirmationCode = generateConfirmationCode();
        const response = {
            message: "Confirmation code generated. Use this code to confirm self-destruct.",
            expiresIn: "3 minutes",
            code: confirmationCode
        }
        return response;
    } catch (err) {
        if (err.code === "P2025") {  // Prisma error code if gadget-id not found
            throw new ExpressError("Not Found", "Gadget not found", 404);
        }
        throw new ExpressError("Internal Server Error", "Failed to initiate self-destruct", 500);
    }
};
