/**
 * Gadget Management Routes
 * - Provides endpoints for managing gadgets, including creation, updates, deletion, 
 *   and a self-destruct mechanism. Uses authentication and authorization middleware 
 *   to enforce access control.
 * - API documentation is generated using Swagger.
 */
import express from 'express';
import { 
    getGadgets, 
    addGadget, 
    updateGadget,
    decommissionGadget,
    selfDestructGadget,
    destroyGadget 
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
 *     description: Retrieve a list of gadgets, optionally filtered by status, with pagination.
 *     tags: [Gadgets]
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, DEPLOYED, DECOMMISSIONED, DESTROYED]
 *         required: false
 *         description: Filter gadgets by their status.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Page number for pagination (default is 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Number of gadgets per page (default is 10).
 *     responses:
 *       200:
 *         description: List of gadgets (filtered by status if provided), paginated.
 *       400:
 *         description: Invalid query parameters.
 *       401:
 *         description: User must be logged in to access this resource.
 *       500:
 *         description: Failed to retrieve gadgets.
 */
router.get('/', authenticateUser, getGadgets);
/**
 * @swagger
 * /api/gadgets:
 *   post:
 *     summary: Add a new gadget (Admin Only)
 *     tags: [Gadgets]
 *     security:
 *       - CookieAuth: []
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
 *                 default: "No description provided"
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
 *       - CookieAuth: []
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
 *                 example: "DEPLOYED"
 *             minProperties: 1 
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
 *       - CookieAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: "Spy Camera"
 *                 codename:
 *                   type: string
 *                   example: "IMF-ABKS6HBGFS"
 *                 description:
 *                   type: string
 *                   example: "A hidden surveillance device"
 *                 status:
 *                   type: string
 *                   enum: [DECOMMISSIONED]
 *                   example: "DECOMMISSIONED"
 *                 decommissionedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-13T12:00:00Z"
 *       401:
 *         description: User must be logged in to access this resource
 *       403:
 *         description: Access Denied - Admins only
 *       404:
 *         description: Gadget not found
 */
router.delete('/:id', authenticateUser, isAdmin, decommissionGadget);
/**
 * @swagger
 * /api/gadgets/{id}/self-destruct:
 *   post:
 *     summary: Initialize self-destruction of a gadget (Admin Only)
 *     tags: [Gadgets]
 *     security:
 *       - CookieAuth: []
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
 *       - CookieAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: "Spy Camera"
 *                 codename:
 *                   type: string
 *                   example: "IMF-ABKS6HBGFS"
 *                 description:
 *                   type: string
 *                   example: "A hidden surveillance device"
 *                 status:
 *                   type: string
 *                   enum: [DESTROYED]
 *                   example: "DESTROYED"
 *                 decommissionedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-13T12:00:00Z"
 *       400:
 *         description: Validation Error / Incorrect Confirmation Code
 *       401:
 *         description: User must be logged in to access this resource  
 *       403:
 *         description: Access Denied - Admins Only
 *       404:
 *         description: Gadget not found
 *       500:
 *         description: Failed to destroy gadget
 */
router.post('/:id/self-destruct/confirm', authenticateUser, isAdmin, destroyGadget);

export { router as gadgetRouter };
