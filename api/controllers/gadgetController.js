import { 
     create,
     list, 
     decommission, 
     update, 
     selfDestruct, 
     deleteService 
} from "../services/gadgetService.js";
import { gadgetSchema } from "../validations/gadgetValidation.js";
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
 * - Returns created gadget data.
 */
export const addGadget = async (req, res, next) => {
    try {
        // Validate incoming request body
        const validatedGadget = gadgetSchema.parse(req.body);
        // Store gadget in the database
        const newGadget = await create(validatedGadget);
        res.status(201).json(newGadget);
    } catch (err) {
        // Handle validation, database and authentication errors
        handleAppError(err, next);
    }
};

/**
 * Retrieve all gadgets from the database.
 * - Calls `list` service with/without query parameter `status`.
 * - Returns an array of gadgets.
 */
export const getGadgets = async (req, res, next) => {
    try {
        // Fetch all gadgets from the database
        const { allGadgets, total } = await list(req.query);
        if (req.user.role === 'admin') return res.status(200).json({ allGadgets, total });
        res.status(200).json(allGadgets);
    } catch (err) {
        next(err);
    };  
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
        const validatedData = gadgetSchema.parse(req.body);
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
export const deleteGadget = async (req, res, next) => {
    try {
        // Mark gadget as decommissioned (soft delete)
        const deletedGadget = await decommission(req.params.id);
        res.status(200).json(deletedGadget);
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
 * - Deletes the gadget permanently if the code is valid.
 */
export const selfDestructGadgetConfirm = async (req, res, next) => {
    try {
        // Validate the confirmation code in request body
        const validatedData = confirmationCodeSchema.parse(req.body);
        const { code: inputCode } = validatedData;
        // Retrieve the stored confirmation code
        const validCode = getItemFromLocalStorage('code');
        // Check if the provided code matches
        const isValidCode = inputCode === validCode;
        if (! isValidCode) throw new ExpressError('Bad Request', 'Incorrect Confirmation Code', 401);
        // Remove the confirmation code from local storage
        removeItemFromLocalStorage('code');
        // Permanently delete the gadget
        await deleteService(req.params.id);
        return res.status(200).json({ message: 'Gadget Deleted Successfully' }); 
    } catch (err) {
        // Handle validation, database and authentication errors
        handleAppError(err, next);
    }; 
};

