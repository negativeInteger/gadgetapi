import { z } from "zod";
import { create, list, decommission, update } from "../services/gadgetService.js";
import { gadgetSchema } from "../utils/validation.js";
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
        const updatedGadget = await update(validatedData, req.user.id);
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
        const deletedGadget = await decommission(req.user.id);
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
        const deletedGadget = await decommission(req.user.id);
        res.status(200).json(deletedGadget);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation Error", errors: err.errors });
        }
        next(err);
    }; 
};
