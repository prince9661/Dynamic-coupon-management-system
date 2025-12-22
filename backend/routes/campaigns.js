/**
 * ============================================
 * UNIT II - Express: Campaign Routes
 * ============================================
 * 
 * Campaign API:
 * - CRUD operations for campaigns
 * - Demonstrates: GET, POST, PUT, DELETE methods
 * - MongoDB operations (UNIT IV)
 */

import express from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { validateCampaign, validateObjectId } from '../middleware/validation.js';
import * as campaignController from '../controllers/campaignController.js';

const router = express.Router();

/**
 * GET /api/campaigns
 * Get all campaigns
 * Demonstrates: GET method, MongoDB query
 */
router.get('/', campaignController.getCampaigns);

/**
 * GET /api/campaigns/:id
 * Get single campaign by ID
 * Demonstrates: GET with parameter, MongoDB findById
 */
router.get('/:id', validateObjectId, campaignController.getCampaignById);

/**
 * POST /api/campaigns
 * Create new campaign
 * Demonstrates: POST method, MongoDB create, Admin only
 */
router.post('/', requireAdmin, validateCampaign, campaignController.createCampaign);

/**
 * PUT /api/campaigns/:id
 * Update campaign
 * Demonstrates: PUT method, MongoDB update
 */
router.put('/:id', requireAdmin, validateObjectId, campaignController.updateCampaign);

/**
 * DELETE /api/campaigns/:id
 * Delete campaign
 * Demonstrates: DELETE method, MongoDB delete
 */
router.delete('/:id', requireAdmin, validateObjectId, campaignController.deleteCampaign);

export default router;



