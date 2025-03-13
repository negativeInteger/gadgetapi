import { 
     create,
     list, 
     update, 
     decommission, 
     selfDestruct,  
     destroy
} from "../services/gadgetService.js";
import { createGadgetSchema, updateGadgetSchema } from "../validations/gadgetValidation.js";
import { confirmationCodeSchema } from "../validations/confirmationCodeSchema.js";
import { 
    setItemToLocalStorage, 
    getItemFromLocalStorage, 
    removeItemFromLocalStorage 
} from "../utils/localStorage.js";
import { ExpressError } from "../errors/ExpressError.js";
import { handleAppError } from "../utils/appError.js";

/**
 * Add a new gadget.
 * - Validates request body.
 * - Calls `create` service to store gadget.
 * - Status is set to 'AVAILABLE' by default
 * - Returns created gadget data.
 */
export const addGadget = async (req, res, next) => {
    try {
        // Validate incoming request body
        const validatedGadget = createGadgetSchema.parse(req.body);
        // Store gadget in the database
        const newGadget = await create(validatedGadget);
        res.status(201).json(newGadget);
    } catch (err) {
        // Handle validation, database and authentication errors
        handleAppError(err, next);
    }
};

/**
 * Fetch gadgets based on the user's role and query parameters.
 * - Calls the `list` service with query parameters.
 * - Admins can filter by any status and receive the total count.
 * - Users can only see "AVAILABLE" and "DEPLOYED" gadgets.
 * - Returns an array of gadgets.
 */
export const getGadgets = async (req, res, next) => {
    try {
        const role = req.user.role;
        // Fetch gadgets based on the role and query parameters
        const { allGadgets, total } = await list(req.query, role);
        // Admins get the total count, users don't
        res.status(200).json(role === 'ADMIN' ? { allGadgets, total } : { allGadgets });
    } catch (err) {
        next(err);
    }
};


/**
 * Update an existing gadget.
 * - Validates request body using `gadgetSchema`.
 * - Calls `update` service with gadget ID and new data.
 * - Returns the updated gadget details.
 */
export const updateGadget = async (req, res, next) => {
    try {
        // Validate request body
        const validatedData = updateGadgetSchema.parse(req.body);
        // Update gadget with new data
        const updatedGadget = await update(validatedData, req.params.id);
        res.status(200).json(updatedGadget);
    } catch (err) {
        // Handle validation, database and authentication errors
        handleAppError(err, next);
    }; 
};

/**
 * Soft delete (decommission) a gadget.
 * - Calls `decommission` service to mark the gadget's status as DECOMMISSIONED.
 * - Returns the updated gadget.
 */
export const decommissionGadget = async (req, res, next) => {
    try {
        // Mark gadget as decommissioned (soft delete)
        const decommissionedGadget = await decommission(req.params.id);
        res.status(200).json(decommissionedGadget);
    } catch (err) {
        next(err);
    }; 
};

/**
 * Initiate the self-destruct sequence for a gadget.
 * - Calls `selfDestruct` service to generate a confirmation code.
 * - Stores the confirmation code temporarily in node localStorage.
 * - Returns a response with confirmation details.
 */
export const selfDestructGadget = async (req, res, next) => {
    try {
        // Trigger self-destruct and get confirmation details
        const { message, expiresIn, code } = await selfDestruct(req.params.id);
        // Store confirmation code in node localStorage (expires in 3 minutes)
        const timeToLive = 3 * 60 * 1000; // 3 mins
        setItemToLocalStorage('code', code, timeToLive);
        res.status(200).json({ message, expiresIn, code });
    } catch (err) {
        next(err);
    }; 
};

/**
 * Confirm and execute self-destruct.
 * - Validates confirmation code from request body.
 * - Checks if the stored confirmation code matches.
 * - Marks the gadget's status as DESTROYED
 */
export const destroyGadget = async (req, res, next) => {
    try {
        // Validate the confirmation code in request body
        const validatedData = confirmationCodeSchema.parse(req.body);
        const { code: inputCode } = validatedData;
        // Retrieve the stored confirmation code
        const validCode = getItemFromLocalStorage('code');
        // Check if the provided code matches
        const isValidCode = inputCode === validCode;
        if (!isValidCode) throw new ExpressError('Bad Request', 'Incorrect Confirmation Code', 401);
        // Remove the confirmation code from local storage
        removeItemFromLocalStorage('code');
        // Mark the gadget as DESTROYED
        const destroyedGadget = await destroy(req.params.id);
        return res.status(200).json(destroyedGadget); 
    } catch (err) {
        // Handle validation, database and authentication errors
        handleAppError(err, next);
    }; 
};

