/**
 * Gadget Service
 * - Handles all gadget-related operations, including creation, retrieval, updates, 
 *   deletion, decommissioning, and self-destruction.
 */
import { prisma } from "../config/db.js";
import { generateCodename } from "../utils/codename.js";
import { ExpressError } from "../errors/ExpressError.js";
import { generateConfirmationCode } from "../utils/confirmationCode.js";
import { generateMissionSuccessProbability } from "../utils/missionSuccessProbability.js";

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
export const create = async ({ name, description }) => {
    const codename = generateCodename();
    const newGadget = await prisma.gadget.create({
        data: {
            name,
            codename,
            description,
            status: 'AVAILABLE'
        }
    });
    if (!newGadget) throw new ExpressError('Internal Server Error', 'Gadget Creation Failed', 500);
    return newGadget; 
};
/**
 * Retrieve a paginated list of gadgets based on the user's role and optional status filter.
 * - Admins can filter by any status or retrieve all gadgets.
 * - Users can only see "AVAILABLE" and "DEPLOYED" gadgets.
 * - If invalid status parameter is provided it is ignored.
 * - Supports pagination with `page` and `limit` parameters.
 * - Orders results by `createdAt` in descending order.
 * - Adds a `missionSuccessProbability` field to each gadget.
 * @param {Object} options - Query parameters for pagination and filtering.
 * @param {number} [options.page=1] - Page number for pagination.
 * @param {number} [options.limit=10] - Number of items per page.
 * @param {string} [options.status] - Optional status filter.
 * @param {string} role - Role of the requesting user (either "ADMIN" or "USER").
 * @returns {Promise<{ allGadgets: Object[], total: number }>} An object containing the list of gadgets and total count.
 * @throws {ExpressError} In case of Database Errors
 */
export const list = async ({ page = 1, limit = 10, status }, role) => {
    // Avoid zero or negative values
    page = Math.max(parseInt(page, 10), 1);
    limit = Math.max(parseInt(limit, 10), 1);
    // Check if limit is greater than total gadgets
    const totalRecords = await prisma.gadget.count();
    const skip = (page - 1) * limit;
    let where = {};
    if (role === 'USER') {
        // Users can only see AVAILABLE and DEPLOYED
        const allowedStatuses = ['AVAILABLE', 'DEPLOYED'];
        // If a valid status is provided, filter by it, otherwise show both
        where.status = status && allowedStatuses.includes(status) 
            ? status 
            : { in: allowedStatuses };
    } else {
        // Admins can see everything and filter by any valid status
        const validStatuses = ['AVAILABLE', 'DEPLOYED', 'DECOMMISSIONED', 'DESTROYED'];
        if (status && !validStatuses.includes(status)) {
            status = undefined; // Ignore invalid status and return all gadgets
        }
        where = status ? { status } : {};
    }
    // Fetch gadgets
    const gadgets = await prisma.gadget.findMany({
        where,
        skip: skip >= totalRecords ? 0 : skip,
        take: skip >= totalRecords ? totalRecords : limit,
        orderBy: { createdAt: 'desc' }
    });
    if (!gadgets) throw new ExpressError('Internal Server Error', 'Failed to retrieve gadgets', 500);
    const total = role === 'ADMIN' ? await prisma.gadget.count({ where }) : undefined;
    // Add mission success probability to each gadget
    const gadgetsWithSuccessProbability = gadgets.map(gadget => ({
        ...gadget,
        missionSuccessProbability: generateMissionSuccessProbability(gadget.status)
    }));
    return { allGadgets: gadgetsWithSuccessProbability, total };
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
export const update = async (data, id) => {
    try {
        const updatedGadget = await prisma.gadget.update({
            where: { id },
            data
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
 * @returns {Promise<Object>} A response containing a message with expiry time and confirmation code.
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
/**
 * Destroy Gadget Service (Confirm Self-Destruct Gadget)
 * - Finalizes the self-destruction process by marking the gadget as 'DESTROYED'.
 * @param {string} id - Gadget ID.
 * @returns {Promise<Object>} The destroyed gadget.
 * @throws {ExpressError} If gadget is not found or update fails.
 */
export const destroy = async (id) => {
    try {
        const destroyedGadget = await prisma.gadget.update({
            where: { id },
            data: { status: 'DESTROYED' }
        });
        return destroyedGadget;
    } catch (err) {
        if (err.code === "P2025") {  // Prisma error code if gadget-id not found
            throw new ExpressError("Not Found", "Gadget not found", 404);
        }
        throw new ExpressError("Internal Server Error", "Failed to destroy gadget", 500);
    }
}