import { createGadget, getGadgets } from "../services/gadgetService.js";
/**
 * Add Gadget Controller
 */
export const addGadget = async (req, res, next) => {
    try {
        const { id } = req.user;
        const gadget = await createGadget(req.body);
        gadget.assignedToId = id;
        res.status(201).json(gadget);
    } catch (err) {
        next(err);
    }
};
/**
 * List Gadgets Controller
 */

export const listGadgets = async (req, res, next) => {
    try {
        const gadgets = await getGadgets(req.query);
        res.status(200).json(gadgets);
    } catch (err) {
        next(err);
    };  
};