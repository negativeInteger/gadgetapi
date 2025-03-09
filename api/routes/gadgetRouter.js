import express from 'express';
import { 
    addGadget, 
    deleteGadget, 
    getGadgets, 
    selfDestructGadget,
    selfDestructGadgetConfirm, 
    updateGadget 
} from '../controllers/gadgetController.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { authenticateUser } from  '../middlewares/authenticateUser.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Gadgets
 *   description: Gadget management API
 */

/**
 * @swagger
 * /api/gadgets:
 *   get:
 *     summary: Get all gadgets
 *     tags: [Gadgets]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of gadgets
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateUser, getGadgets);
/**
 * @swagger
 * /api/gadgets:
 *   post:
 *     summary: Add a new gadget (Admin Only)
 *     tags: [Gadgets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Smartwatch"
 *               description:
 *                 type: string
 *                 example: "A high-tech wearable gadget"
 *     responses:
 *       201:
 *         description: Gadget created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post('/', authenticateUser, isAdmin, addGadget);

/**
 * @swagger
 * /api/gadgets/{id}:
 *   patch:
 *     summary: Update a gadget (Admin Only)
 *     tags: [Gadgets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The gadget ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Smartphone X"
 *               description:
 *                 type: string
 *                 example: "An updated description"
 *     responses:
 *       200:
 *         description: Gadget updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Gadget not found
 */
router.patch('/:id', authenticateUser, isAdmin, updateGadget);
/**
 * @swagger
 * /api/gadgets/{id}:
 *   delete:
 *     summary: Decommission a gadget (Admin Only)
 *     tags: [Gadgets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The gadget ID
 *     responses:
 *       200:
 *         description: Gadget deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Gadget not found
 */
router.delete('/:id', authenticateUser, isAdmin, deleteGadget);
/**
 * @swagger
 * /api/gadgets/{id}/self-destruct:
 *   post:
 *     summary: Initialize self-destruction of a gadget (Admin Only)
 *     tags: [Gadgets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The gadget ID
 *     responses:
 *       200:
 *         description: Self-destruct initiated. Confirmation code sent.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Gadget not found
 */
router.post('/:id/self-destruct', authenticateUser, isAdmin, selfDestructGadget);
/**
 * @swagger
 * /api/gadgets/{id}/self-destruct/confirm:
 *   post:
 *     summary: Confirm gadget self-destruction (Admin Only)
 *     tags: [Gadgets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The gadget ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirmationCode:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Gadget permanently deleted
 *       400:
 *         description: Invalid confirmation code
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Gadget not found
 */
router.post('/:id/self-destruct/confirm', authenticateUser, isAdmin, selfDestructGadgetConfirm);
export { router as gadgetRouter };
