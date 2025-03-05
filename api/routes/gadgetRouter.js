import express from 'express';
import { addGadget, listGadgets } from '../controllers/gadgetController.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { authenticateUser } from  '../middlewares/authenticateUser.js';

const router = express.Router();
/**
 * @route POST /gadgets
 * @desc Add Gadget (Admin Only)
 */
router.post('/', authenticateUser, isAdmin, addGadget);
/**
 * @route GET /gadgets
 * @desc List Gadgets
 */
router.get('/', authenticateUser, listGadgets);

export { router as gadgetRouter };
