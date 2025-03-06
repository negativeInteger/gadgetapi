import { createGadget, getUserGadgets, getGadgetsInventory } from "../services/gadgetService.js";
import { gadgetSchema } from "../utils/validation.js";
/**
 * Add Gadget Controller
 */
export const addGadget = async (req, res, next) => {
    try {
        const validatedGadget = gadgetSchema.parse(req.body);
        const newGadget = await createGadget({...validatedGadget}, req.user.id);
        res.status(201).json(newGadget);
    } catch (err) {
        next(err);
    }
};
/**
 * List UserGadgets Controller
 */

export const listUserGadgets = async (req, res, next) => {
    try {
        const userGadgets = await getUserGadgets(req.query, req.user.id);
        res.status(200).json(userGadgets);
    } catch (err) {
        next(err);
    };  
};

/**
 * List UserGadgets Controller
 */

export const listGadgetsInventory = async (req, res, next) => {
    try {
        const gadgetsInventory = await getGadgetsInventory(req.query, req.user.id);
        res.status(200).json(gadgetsInventory);
    } catch (err) {
        next(err);
    };  
};
