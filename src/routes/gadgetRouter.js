import express from 'express';
import { addGadget, listGadgets } from '../controllers/gadgetController.js';
import { verifyRefreshToken } from '../middlewares/refreshMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();
/**
 * @route POST /gadgets
 * @desc Add Gadget (Admin Only)
 */
router.post('/', verifyRefreshToken, isAdmin, addGadget);
/**
 * @route GET /gadgets
 * @desc List Gadgets
 */
router.get('/', verifyRefreshToken, listGadgets);

export { router as gadgetRouter };
