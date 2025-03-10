import { z } from "zod";
import { create, list, decommission, update, selfDestruct, deleteService } from "../services/gadgetService.js";
import { gadgetSchema } from "../validations/gadgetValidation.js";
import { confirmationCodeSchema } from "../validations/confirmationCodeSchema.js";
import { setItemToLocalStorage, getItemFromLocalStorage, removeItemFromLocalStorage } from "../utils/localStorage.js";
import { ExpressError } from "../errors/ExpressError.js";
/**
 * Add Gadget Controller
 */
export const addGadget = async (req, res, next) => {
    try {
        const validatedGadget = gadgetSchema.parse(req.body);
        const newGadget = await create(validatedGadget);
        res.status(201).json(newGadget);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return next(new ExpressError('Validation Error', err.errors, 400));
        }
        next(err);
    }
};

/**
 * List Gadgets Controller
 */
export const getGadgets = async (req, res, next) => {
    try {
        const gadgets = await list(req.query);
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
            return next(new ExpressError('Validation Error', err.errors, 400));
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
        next(err);
    }; 
};
/**
 * Self-Destruct Gadget Controller
 */
export const selfDestructGadget = (req, res, next) => {
    try {
        const { message, expiresIn, code } = selfDestruct(req.params.id);
        const timeToLive = 3 * 60 * 1000; // 3 mins
        setItemToLocalStorage('code', code, timeToLive);
        res.status(200).json({ message, expiresIn, code });
    } catch (err) {
        next(new ExpressError('Internal Server Error', 'Failed to process self-destruct', 500));
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
        if (! isValidCode) throw new ExpressError('Bad Request', 'Incorrect Confirmation Code', 401);
        removeItemFromLocalStorage('code');
        await deleteService(req.params.id);
        return res.status(200).json({ message: 'Gadget Deleted Successfully' }); 
    } catch (err) {
        if (err instanceof z.ZodError) {
            return next(new ExpressError('Validation Error', err.errors, 400));
        }
        next(err);
    }; 
};

