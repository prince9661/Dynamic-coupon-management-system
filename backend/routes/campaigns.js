import express from 'express';
import {
    createCampaign,
    getCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign
} from '../controllers/campaignController.js';
import { protect, limitTo } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * Route: GET /api/campaigns
 * Description: List all campaigns
 * Access: Private
 */
router.get('/', getCampaigns);

/**
 * Route: GET /api/campaigns/:id
 * Description: Get a specific campaign
 * Access: Private
 */
router.get('/:id', getCampaignById);

// Admin Routes

/**
 * Route: POST /api/campaigns
 * Description: Create a new campaign
 * Access: Private (Admin only)
 */
router.post('/', limitTo('admin'), createCampaign);

/**
 * Route: PUT /api/campaigns/:id
 * Description: Update a campaign
 * Access: Private (Admin only)
 */
router.put('/:id', limitTo('admin'), updateCampaign);

/**
 * Route: DELETE /api/campaigns/:id
 * Description: Delete a campaign (and its coupons)
 * Access: Private (Admin only)
 */
router.delete('/:id', limitTo('admin'), deleteCampaign);

export default router;
