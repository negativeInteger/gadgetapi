import express from 'express';
import { addGadget, deleteGadget, getGadgets, updateGadget } from '../controllers/gadgetController.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { authenticateUser } from  '../middlewares/authenticateUser.js';

const router = express.Router();

/**
 * @route GET /gadgets
 * @desc List All Gadgets
 */
router.get('/', authenticateUser, getGadgets);
/**
 * @route POST /gadgets
 * @desc Add Gadget (Admin Only)
 */
router.post('/', authenticateUser, isAdmin, addGadget);
/**
 * @route PATCH /gadgets/id
 * @desc Update Gadget (Admin Only)
 */
router.patch('/:id', authenticateUser, isAdmin, updateGadget);
/**
 * @route DELETE /gadgets/id
 * @desc Delete Gadget (Admin Only)
 */
router.delete('/:id', authenticateUser, isAdmin, deleteGadget);

export { router as gadgetRouter };
