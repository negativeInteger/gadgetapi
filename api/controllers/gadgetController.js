import { any, z } from "zod";
import { create, list, decommission, update, selfDestruct, deleteService } from "../services/gadgetService.js";
import { confirmationCodeSchema, gadgetSchema } from "../utils/validation.js";
import { setItemToLocalStorage, getItemFromLocalStorage, removeItemFromLocalStorage } from "../utils/localStorage.js";
/**
 * Add Gadget Controller
 */
export const addGadget = async (req, res, next) => {
    try {
        const validatedGadget = gadgetSchema.parse(req.body);
        const newGadget = await create({...validatedGadget}, req.user.id);
        res.status(201).json(newGadget);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation Error", errors: err.errors });
        }
        next(err);
    }
};

/**
 * List Gadgets Controller
 */
export const getGadgets = async (req, res, next) => {
    try {
        const gadgets = await list(req.query, req.user.id);
        res.status(200).json(gadgets);
    } catch (err) {
        next(err);
    };  
};

/**
 * Update Gadget Controller
 */
export const updateGadget = async (req, res, next) => {
    try {
        const validatedData = gadgetSchema.parse(req.body);
        const updatedGadget = await update(validatedData, req.params.id);
        res.status(200).json(updatedGadget);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation Error", errors: err.errors });
        }
        next(err);
    }; 
};

/**
 * Delete Gadget Controller
 */
export const deleteGadget = async (req, res, next) => {
    try {
        const deletedGadget = await decommission(req.params.id);
        res.status(200).json(deletedGadget);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation Error", errors: err.errors });
        }
        next(err);
    }; 
};
/**
 * Self-Destruct Gadget Controller
 */
export const selfDestructGadget = async (req, res, next) => {
    try {
        const { message, expiresIn, code } = await selfDestruct();
        const timeToLive = 3 * 60 * 1000; // 3 mins
        setItemToLocalStorage('code', code, timeToLive);
        res.status(200).json({ message, expiresIn, code });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation Error", errors: err.errors });
        }
        next(err);
    }; 
};
/**
 * Self-Destruct Gadget Confirm Controller
 */
export const selfDestructGadgetConfirm = async (req, res, next) => {
    try {
        const validatedData = confirmationCodeSchema.parse(req.body);
        const { code: inputCode } = validatedData;
        const validCode = getItemFromLocalStorage('code');
        const isValidCode = inputCode === validCode;
        if (! isValidCode) return res.status(403).json({ message: 'Incorrect Confirmation Code' });
        removeItemFromLocalStorage('code');
        const deletedGadget = await deleteService(req.params.id);
        return res.status(200).json({ message: 'Gadget Deleted Successfully' }); 
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation Error", errors: err.errors });
        }
        next(err);
    }; 
};

