import express from 'express';
import { 
    addGadget, 
    deleteGadget, 
    getGadgets, 
    selfDestructGadget,
    selfDestructGadgetConfirm, 
    updateGadget 
} from '../controllers/gadgetController.js';
import { isAdmin } from '../middlewares/isAdmin.js';
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
 *         description: List all gadgets in the inventory
 *       401:
 *         description: User must be logged in to access this resource
 *       403:
 *         description: Access Denied Admins Only
 *       500:
 *         description: Failed to retrieve gadgets
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
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, DEPLOYED, DESTROYED, DECOMMISSIONED]
 *                 example: AVAILABLE
 *     responses:
 *       201:
 *         description: Gadget created successfully
 *       400:
 *         description: Validation Error
 *       401:
 *         description: User must be logged in to access this resource
 *       403:
 *         description: Access Denied - Admins Only
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
 *           type: string
 *           format: uuid
 *         description: Gadget ID
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
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, DEPLOYED, DESTROYED, DECOMMISSIONED]
 *                 example: "Updated Status"
 *     responses:
 *       200:
 *         description: Gadget updated successfully
 *       400:
 *         description: Validation Error
 *       401:
 *         description: User must be logged in to access this resource
 *       403:
 *         description: Access Denied - Admins Only
 *       404:
 *         description: Gadget not found
 *       500:
 *         description: Failed to update gadget
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
 *           type: string
 *           format: uuid
 *         description: Gadget ID
 *     responses:
 *       200:
 *         description: Gadget deleted successfully
 *       401:
 *         description: User must be logged in to access this resource
 *       403:
 *         description: Access Denied - Admins only
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
 *           type: string
 *           format: uuid
 *         description: Gadget ID
 *     responses:
 *       200:
 *         description: Self-destruct initiated. Confirmation code sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Confirmation code generated. Use this code to confirm self-destruct."
 *                 expiresIn:
 *                   type: string
 *                   example: 3 minutes
 *                 code:
 *                   type: string
 *                   example: "923783"
 *       401:
 *         description: User must be logged in to access this resource
 *       403:
 *         description: Access Denied - Admins only
 *       404:
 *         description: Gadget not found
 *       500:
 *         description: Failed to initiate self-destruct
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
 *           type: string
 *           format: uuid
 *         description: Gadget ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Gadget deleted successfully
 *       400:
 *         description: Validation Error / Incorrect Confirmation Code
 *       401:
 *         description: User must be logged in to access this resource  
 *       403:
 *         description: Access Denied - Admins Only
 *       404:
 *         description: Gadget not found
 *       500:
 *         description: Failed to delete gadget
 */
router.post('/:id/self-destruct/confirm', authenticateUser, isAdmin, selfDestructGadgetConfirm);

export { router as gadgetRouter };
